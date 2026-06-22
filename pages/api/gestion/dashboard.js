import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function getArgHoy() {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
  const [y, m] = fmt.format(new Date()).split('-')
  return { year: +y, month: +m }
}

function parseLocalDate(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function toArgTs(date) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
  const [y, m, d] = fmt.format(new Date(date)).split('-')
  return new Date(+y, +m - 1, +d).getTime()
}

function resolvePeriod(mes, anno, desde, hasta, defMes, defAnno) {
  if (desde && hasta) {
    const d = parseLocalDate(desde)
    const h = parseLocalDate(hasta)
    return { desde: d, hasta: h, hastaExcl: new Date(h.getTime() + 86400000), isMes: false }
  }
  const m = mes ? +mes : defMes
  const y = anno ? +anno : defAnno
  return {
    desde:     new Date(y, m - 1, 1),
    hasta:     new Date(y, m, 0),
    hastaExcl: new Date(y, m, 1),
    isMes: true, mes: m, anno: y,
  }
}

function buildLabel(p) {
  if (p.isMes) return `${MESES[p.mes - 1]} ${p.anno}`
  const f = d => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
  return `${f(p.desde)} – ${f(p.hasta)}`
}

function toNum(v) { return v != null ? Number(v) : 0 }

function calcPeriodo(reservas, alojamientos, apartToHabs, period) {
  const desdeTs     = period.desde.getTime()
  const hastaTs     = period.hasta.getTime()
  const hastaExclTs = period.hastaExcl.getTime()
  const diasPeriodo = Math.round((hastaExclTs - desdeTs) / 86400000)

  const alojMap = {}
  for (const a of alojamientos) alojMap[a.Id] = a
  const habList = alojamientos.filter(a => a.Activo && a.Tipo === 1)
  const cabList = alojamientos.filter(a => a.Activo && a.Tipo === 0)

  function overlapDias(r) {
    const fi = toArgTs(r.FechaIngreso)
    const fs = toArgTs(r.FechaSalida)
    return Math.max(0, (Math.min(fs, hastaExclTs) - Math.max(fi, desdeTs)) / 86400000)
  }

  const enPeriodo = reservas.filter(r => {
    const fi = toArgTs(r.FechaIngreso)
    return fi >= desdeTs && fi <= hastaTs
  })

  // Ingresos por fecha de ingreso
  const fi = { Transferencia: 0, Efectivo: 0, TarjetaCredito: 0, TarjetaDebito: 0 }
  for (const r of enPeriodo) {
    for (const p of r.Pagos) {
      const v = toNum(p.Monto)
      if      (p.MetodoPago === 0) fi.Transferencia  += v
      else if (p.MetodoPago === 1) fi.Efectivo        += v
      else if (p.MetodoPago === 2) fi.TarjetaCredito  += v
      else if (p.MetodoPago === 3) fi.TarjetaDebito   += v
    }
  }
  for (const k of Object.keys(fi)) fi[k] = Math.round(fi[k])
  fi.Total = fi.Transferencia + fi.Efectivo + fi.TarjetaCredito + fi.TarjetaDebito

  // Ingresos por prorrateo
  const pro = { Transferencia: 0, Efectivo: 0, TarjetaCredito: 0, TarjetaDebito: 0 }
  for (const r of reservas) {
    const rFi      = toArgTs(r.FechaIngreso)
    const rFs      = toArgTs(r.FechaSalida)
    const totalDias = Math.max(1, (rFs - rFi) / 86400000)
    const solap     = overlapDias(r)
    if (solap <= 0) continue
    const frac = solap / totalDias
    for (const p of r.Pagos) {
      const v = toNum(p.Monto) * frac
      if      (p.MetodoPago === 0) pro.Transferencia  += v
      else if (p.MetodoPago === 1) pro.Efectivo        += v
      else if (p.MetodoPago === 2) pro.TarjetaCredito  += v
      else if (p.MetodoPago === 3) pro.TarjetaDebito   += v
    }
  }
  for (const k of Object.keys(pro)) pro[k] = Math.round(pro[k])
  pro.Total = pro.Transferencia + pro.Efectivo + pro.TarjetaCredito + pro.TarjetaDebito

  const CantidadReservas = enPeriodo.length
  const totalNoches = enPeriodo.reduce((s, r) => {
    const fi2 = toArgTs(r.FechaIngreso)
    const fs2 = toArgTs(r.FechaSalida)
    return s + Math.max(0, (fs2 - fi2) / 86400000)
  }, 0)
  const PromedioNoches = CantidadReservas > 0 ? +(totalNoches / CantidadReservas).toFixed(1) : 0

  // Ocupación de unidades y plazas
  let DiasHabOcupados = 0, DiasCabOcupados = 0
  let PlazasHabOcupadas = 0, PlazasCabOcupadas = 0
  for (const r of reservas) {
    const solap = overlapDias(r)
    if (solap <= 0) continue
    const aloj = alojMap[r.AlojamientoId]
    if (!aloj) continue
    if (aloj.Tipo === 1) {
      DiasHabOcupados   += solap
      PlazasHabOcupadas += r.CantidadHuespedes * solap
    } else if (aloj.Tipo === 0) {
      DiasCabOcupados   += solap
      PlazasCabOcupadas += r.CantidadHuespedes * solap
    } else if (aloj.Tipo === 2) {
      const habs = apartToHabs.get(r.AlojamientoId) || []
      DiasHabOcupados   += solap * habs.length
      PlazasHabOcupadas += r.CantidadHuespedes * solap
    }
  }
  DiasHabOcupados   = Math.round(DiasHabOcupados)
  DiasCabOcupados   = Math.round(DiasCabOcupados)
  PlazasHabOcupadas = Math.round(PlazasHabOcupadas)
  PlazasCabOcupadas = Math.round(PlazasCabOcupadas)

  const DiasHabTotal      = habList.length * diasPeriodo
  const DiasCabTotal      = cabList.length * diasPeriodo
  const DiasTotal         = DiasHabTotal + DiasCabTotal
  const DiasTotalOcupados = DiasHabOcupados + DiasCabOcupados

  const PctHabitaciones = DiasHabTotal > 0 ? +(DiasHabOcupados / DiasHabTotal * 100).toFixed(1) : 0
  const PctCabanas      = DiasCabTotal > 0 ? +(DiasCabOcupados / DiasCabTotal * 100).toFixed(1) : 0
  const PctTotal        = DiasTotal    > 0 ? +(DiasTotalOcupados / DiasTotal   * 100).toFixed(1) : 0

  const PlazasHabDisponibles   = habList.reduce((s, a) => s + a.Capacidad, 0) * diasPeriodo
  const PlazasCabDisponibles   = cabList.reduce((s, a) => s + a.Capacidad, 0) * diasPeriodo
  const PlazasTotalOcupadas    = PlazasHabOcupadas + PlazasCabOcupadas
  const PlazasTotalDisponibles = PlazasHabDisponibles + PlazasCabDisponibles

  const PctPlazasHabitaciones = PlazasHabDisponibles   > 0 ? +(PlazasHabOcupadas   / PlazasHabDisponibles   * 100).toFixed(1) : 0
  const PctPlazasCabanas      = PlazasCabDisponibles   > 0 ? +(PlazasCabOcupadas   / PlazasCabDisponibles   * 100).toFixed(1) : 0
  const PctPlazasTotal        = PlazasTotalDisponibles > 0 ? +(PlazasTotalOcupadas / PlazasTotalDisponibles * 100).toFixed(1) : 0

  // Canales
  const canalCount = {}
  for (const r of enPeriodo) {
    const c = r.CanalOrigen || 'Sin canal'
    canalCount[c] = (canalCount[c] || 0) + 1
  }
  const Canales = Object.entries(canalCount)
    .sort((a, b) => b[1] - a[1])
    .map(([Canal, Cantidad]) => ({
      Canal,
      Cantidad,
      Porcentaje: CantidadReservas > 0 ? +(Cantidad / CantidadReservas * 100).toFixed(1) : 0,
    }))

  return {
    Label: buildLabel(period),
    TotalIngresos: fi.Total,
    PctOcupacion:  PctTotal,
    CantidadReservas,
    PromedioNoches,
    IngresosFechaIngreso: fi,
    IngresosProrrateo:    pro,
    Ocupacion: {
      DiasHabOcupados, DiasHabTotal,
      DiasCabOcupados, DiasCabTotal,
      DiasTotalOcupados, DiasTotal,
      PctHabitaciones, PctCabanas, PctTotal,
      PlazasHabOcupadas,  PlazasHabDisponibles,
      PlazasCabOcupadas,  PlazasCabDisponibles,
      PlazasTotalOcupadas, PlazasTotalDisponibles,
      PctPlazasHabitaciones, PctPlazasCabanas, PctPlazasTotal,
    },
    Canales,
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'No autorizado' })

  const { mes, anno, desde, hasta, mesComp, annoComp, desdeComp, hastaComp, comparar } = req.query
  const { year: hoyAnno, month: hoyMes } = getArgHoy()

  const period = resolvePeriod(mes, anno, desde, hasta, hoyMes, hoyAnno)

  let broadDesde     = period.desde
  let broadHastaExcl = period.hastaExcl
  let periodComp     = null

  const doComparar = comparar === 'true'
  if (doComparar && (mesComp || annoComp || desdeComp || hastaComp)) {
    periodComp = resolvePeriod(mesComp, annoComp, desdeComp, hastaComp, hoyMes, hoyAnno)
    if (periodComp.desde     < broadDesde)     broadDesde     = periodComp.desde
    if (periodComp.hastaExcl > broadHastaExcl) broadHastaExcl = periodComp.hastaExcl
  }

  const [reservas, alojamientos, apartDetallesRaw] = await Promise.all([
    prisma.reserva.findMany({
      where: {
        Estado:       { not: 2 },
        EsInvitacion: false,
        FechaIngreso: { lt: broadHastaExcl },
        FechaSalida:  { gt: broadDesde },
      },
      include: { Pagos: true, Alojamientos: true },
    }),
    prisma.alojamiento.findMany({ where: { Activo: true } }),
    prisma.apartDetalle.findMany({
      select: { AlojamientoApartId: true, AlojamientoHab1Id: true, AlojamientoHab2Id: true },
    }),
  ])

  const apartToHabs = new Map()
  for (const ad of apartDetallesRaw) {
    apartToHabs.set(ad.AlojamientoApartId,
      [ad.AlojamientoHab1Id, ad.AlojamientoHab2Id].filter(Boolean))
  }

  const AnnosDisponibles = []
  for (let y = hoyAnno - 4; y <= hoyAnno + 1; y++) AnnosDisponibles.push(y)

  // Devolver mes/anno inferidos para el form (defaults cuando no hay desde/hasta)
  const hasFechas = !!(desde && hasta)
  const respMes   = hasFechas ? (mes  ? +mes  : null) : (mes  ? +mes  : hoyMes)
  const respAnno  = hasFechas ? (anno ? +anno : null) : (anno ? +anno : hoyAnno)

  return res.status(200).json({
    AnnosDisponibles,
    Mes:   respMes,
    Anno:  respAnno,
    Desde: desde     || null,
    Hasta: hasta     || null,
    MesComp:   mesComp   ? +mesComp   : null,
    AnnoComp:  annoComp  ? +annoComp  : null,
    DesdeComp: desdeComp || null,
    HastaComp: hastaComp || null,
    Comparar: doComparar,
    Periodo:            calcPeriodo(reservas, alojamientos, apartToHabs, period),
    PeriodoComparacion: periodComp
      ? calcPeriodo(reservas, alojamientos, apartToHabs, periodComp)
      : null,
  })
}
