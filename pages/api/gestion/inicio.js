import { getServerSession } from 'next-auth/next'
import authOptions from '@/pages/api/auth/[...nextauth]'
import prisma from '@/lib/prisma'
import { getHoyArgentina, addDias, argDateToUTC, toFechaArgentina, fmtFecha } from '@/lib/dates'

function buildApartMap(apartDetalles) {
  const map = {}
  for (const ad of apartDetalles) {
    const apart = ad.Alojamientos_ApartDetalles_AlojamientoApartIdToAlojamientos
    const hab1  = ad.Alojamientos_ApartDetalles_AlojamientoHab1IdToAlojamientos
    const hab2  = ad.Alojamientos_ApartDetalles_AlojamientoHab2IdToAlojamientos
    if (apart && hab1 && hab2) {
      const n1 = hab1.Nombre.match(/\d+/)?.[0] ?? hab1.Nombre
      const n2 = hab2.Nombre.match(/\d+/)?.[0] ?? hab2.Nombre
      map[apart.Id] = `${apart.Nombre} (Hab. ${n1} / ${n2})`
    }
  }
  return map
}

function alojNombre(aloj, apartMap) {
  return (aloj.Tipo === 2 && apartMap[aloj.Id]) ? apartMap[aloj.Id] : aloj.Nombre
}

function toNum(d) { return d != null ? Number(d) : 0 }

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'No autorizado' })

  // Fecha de hoy en Argentina; manana y pasadoManana para acotar la query
  const hoy         = getHoyArgentina()
  const manana      = addDias(hoy, 1)
  const pasadoManana = addDias(hoy, 2)

  // Versiones UTC midnight para queries Prisma (TIMESTAMP WITHOUT TIME ZONE se lee como UTC)
  const hoyUTC         = argDateToUTC(hoy)
  const pasadoMananaUTC = argDateToUTC(pasadoManana)

  // Timestamps de medianoche local Argentina para comparaciones JS
  const HOY    = hoy.getTime()
  const MANANA = manana.getTime()

  // Convierte fecha de DB a medianoche local Argentina (para comparar con HOY/MANANA)
  const FI = r => toFechaArgentina(r.FechaIngreso)
  const FS = r => toFechaArgentina(r.FechaSalida)

  // Una sola query que abarca hoy y mañana; filtrado posterior en JS
  const [reservas, alojamientos, apartDetallesRaw] = await Promise.all([
    prisma.reserva.findMany({
      where: {
        Estado:       { not: 2 },
        FechaIngreso: { lt: pasadoMananaUTC },
        FechaSalida:  { gte: hoyUTC },
      },
      include: { Pagos: true, Alojamientos: true },
    }),
    prisma.alojamiento.findMany({ where: { Activo: true } }),
    prisma.apartDetalle.findMany({
      include: {
        Alojamientos_ApartDetalles_AlojamientoApartIdToAlojamientos: true,
        Alojamientos_ApartDetalles_AlojamientoHab1IdToAlojamientos:  true,
        Alojamientos_ApartDetalles_AlojamientoHab2IdToAlojamientos:  true,
      },
    }),
  ])

  const apartMap    = buildApartMap(apartDetallesRaw)
  const habToApart  = new Map()
  const apartToHabs = new Map()

  for (const ad of apartDetallesRaw) {
    const apart = ad.Alojamientos_ApartDetalles_AlojamientoApartIdToAlojamientos
    const hab1  = ad.Alojamientos_ApartDetalles_AlojamientoHab1IdToAlojamientos
    const hab2  = ad.Alojamientos_ApartDetalles_AlojamientoHab2IdToAlojamientos
    if (!apart) continue
    if (hab1) habToApart.set(hab1.Id, apart.Id)
    if (hab2) habToApart.set(hab2.Id, apart.Id)
    apartToHabs.set(apart.Id, [hab1?.Id, hab2?.Id].filter(Boolean))
  }

  // ─── Clasificación de reservas por fecha ───
  const checkinHoy     = reservas.filter(r => FI(r) === HOY)
  const checkoutHoy    = reservas.filter(r => FS(r) === HOY)
  const activasHoy     = reservas.filter(r => FI(r) <= HOY && FS(r) > HOY)
  const checkinManana  = reservas.filter(r => FI(r) === MANANA)
  const checkoutManana = reservas.filter(r => FS(r) === MANANA)

  // ─── Métricas ───
  const PlazasOcupadasHoy = activasHoy
    .filter(r => !r.EsInvitacion)
    .reduce((s, r) => s + r.CantidadHuespedes, 0)

  // Desayuno HOY: FI < hoy Y FS >= hoy Y IncluyeDesayuno
  const ComensalesDesayunoHoy = reservas
    .filter(r => FI(r) < HOY && FS(r) >= HOY && r.IncluyeDesayuno)
    .reduce((s, r) => s + r.CantidadHuespedes, 0)

  // Desayuno MAÑANA: FI < mañana Y FS >= mañana Y IncluyeDesayuno
  const ComensalesDesayunoManana = reservas
    .filter(r => FI(r) < MANANA && FS(r) >= MANANA && r.IncluyeDesayuno)
    .reduce((s, r) => s + r.CantidadHuespedes, 0)

  // ─── Estado de unidades (lógica bidireccional Apart ↔ Hab) ───
  const ocupadoDirecto = new Set(activasHoy.map(r => r.AlojamientoId))
  const ocupadoFinal   = new Set(ocupadoDirecto)
  for (const id of ocupadoDirecto) {
    // Apart ocupado → sus habs también ocupadas
    apartToHabs.get(id)?.forEach(h => ocupadoFinal.add(h))
    // Hab ocupada → su Apart bloqueado
    const apartId = habToApart.get(id)
    if (apartId) ocupadoFinal.add(apartId)
  }

  // Solo Habitaciones (Tipo 1) y Cabañas (Tipo 0); Aparts (Tipo 2) excluidos del conteo visual
  const sinAparts = alojamientos.filter(a => a.Tipo !== 2)
  const UnidadesLibresHoy   = sinAparts.filter(a => !ocupadoFinal.has(a.Id)).map(a => a.Nombre)
  const UnidadesOcupadasHoy = sinAparts.filter(a =>  ocupadoFinal.has(a.Id)).map(a => a.Nombre)

  // ─── Limpieza del día ───
  // Expandir checkoutIds/checkinIds a las habs componentes de Aparts
  const checkoutIds = new Set()
  const checkinIds  = new Set()
  for (const r of checkoutHoy) {
    checkoutIds.add(r.AlojamientoId)
    apartToHabs.get(r.AlojamientoId)?.forEach(h => checkoutIds.add(h))
  }
  for (const r of checkinHoy) {
    checkinIds.add(r.AlojamientoId)
    apartToHabs.get(r.AlojamientoId)?.forEach(h => checkinIds.add(h))
  }

  // Expandir activasHoyMap a las habs componentes (para reglas 3 y 4 con Aparts)
  const activasHoyMap = {}
  for (const r of activasHoy) {
    activasHoyMap[r.AlojamientoId] = r
    apartToHabs.get(r.AlojamientoId)?.forEach(h => { activasHoyMap[h] = r })
  }

  const LimpiezaDelDia = []
  for (const aloj of alojamientos) {
    if (aloj.Tipo === 2) continue  // Aparts no tienen fila propia; sus habs sí

    const tareas        = []
    const tieneCheckout = checkoutIds.has(aloj.Id)
    const tieneCheckin  = checkinIds.has(aloj.Id)
    const reservaActiva = activasHoyMap[aloj.Id]

    // Regla 1: checkout hoy → limpieza profunda
    if (tieneCheckout) {
      tareas.push('Limpieza profunda + cambio total de blancos (ropa de cama y baño) — Checkout')
    }

    // Regla 2: checkin hoy sin checkout → preparación
    if (tieneCheckin && !tieneCheckout) {
      tareas.push('Preparación para ingreso (check-in)')
    }

    // Regla 3: reserva activa y día 6 de estadía → cambio de sábanas
    if (reservaActiva) {
      const dias = Math.floor((HOY - FI(reservaActiva)) / 86400000)
      if (dias === 6) {
        tareas.push('Cambio de sábanas (día 6)')
      }
    }

    // Reglas 4-6: solo si no hay checkout ni checkin hoy
    if (!tieneCheckout && !tieneCheckin) {
      if (reservaActiva) {
        const dias = Math.floor((HOY - FI(reservaActiva)) / 86400000)
        if (aloj.Tipo === 1) {
          // Regla 4: Habitación activa → limpieza regular diaria
          tareas.push('Limpieza regular diaria')
        } else if (aloj.Tipo === 0 && dias > 0 && (dias + 1) % 3 === 0) {
          // Regla 5: Cabaña activa cada 3 días
          tareas.push(`Limpieza regular (día ${dias + 1})`)
        }
      } else if (aloj.Tipo === 1) {
        // Regla 6: Habitación componente de Apart activo
        const apartId = habToApart.get(aloj.Id)
        if (apartId && activasHoyMap[apartId]) {
          tareas.push('Limpieza regular diaria')
        }
      }
    }

    if (tareas.length > 0) {
      LimpiezaDelDia.push({ NombreAlojamiento: aloj.Nombre, Tareas: tareas })
    }
  }

  // ─── Pendientes a cobrar (checkout hoy o mañana, saldo > 0.01) ───
  const PendientesCobro = reservas
    .filter(r => FS(r) === HOY || FS(r) === MANANA)
    .flatMap(r => {
      const pagado = r.Pagos.reduce((s, p) => s + toNum(p.Monto), 0)
      const saldo  = toNum(r.MontoTotal) - pagado
      if (saldo <= 0.01) return []
      return [{
        ReservaId:         r.Id,
        NombreHuesped:     r.NombreHuesped,
        NombreAlojamiento: alojNombre(r.Alojamientos, apartMap),
        SaldoPendiente:    saldo,
        EsHoy:             FS(r) === HOY,
      }]
    })
    .sort((a, b) => {
      if (a.EsHoy !== b.EsHoy) return (b.EsHoy ? 1 : 0) - (a.EsHoy ? 1 : 0)
      return a.NombreAlojamiento.localeCompare(b.NombreAlojamiento, 'es')
    })

  function fmtReservaList(r) {
    return {
      ReservaId:         r.Id,
      NombreHuesped:     r.NombreHuesped,
      NombreAlojamiento: alojNombre(r.Alojamientos, apartMap),
    }
  }

  return res.status(200).json({
    CheckInsHoy:             checkinHoy.map(fmtReservaList),
    CheckOutsHoy:            checkoutHoy.map(fmtReservaList),
    PlazasOcupadasHoy,
    ComensalesDesayunoHoy,
    ComensalesDesayunoManana,
    LimpiezaDelDia,
    UnidadesLibresHoy,
    UnidadesOcupadasHoy,
    PendientesCobro,
    CheckInsManana:          checkinManana.map(fmtReservaList),
    CheckOutsManana:         checkoutManana.map(fmtReservaList),
    Hoy:    fmtFecha(hoy),
    Manana: fmtFecha(manana),
  })
}
