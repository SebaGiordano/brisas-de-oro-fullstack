import { getServerSession } from 'next-auth/next'
import authOptions from '@/pages/api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

function getArgToday() {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
  const [y, m, d] = fmt.format(new Date()).split('-').map(Number)
  return new Date(y, m - 1, d)
}

function addMeses(date, n) {
  return new Date(date.getFullYear(), date.getMonth() + n, date.getDate())
}

function argToUTC(d) {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
}

function toArgDateStr(date) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
  return fmt.format(new Date(date))
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'No autorizado' })

  const hoy           = getArgToday()
  const desdeLimit    = addMeses(hoy, -7)
  const hastaLimit    = addMeses(hoy,  7)
  const desdeLimitUTC = argToUTC(desdeLimit)
  const hastaLimitUTC = argToUTC(hastaLimit)

  const [reservas, alojamientos, apartDetalles] = await Promise.all([
    prisma.reserva.findMany({
      where: {
        Estado:       { not: 2 },
        FechaIngreso: { lt: hastaLimitUTC },
        FechaSalida:  { gt: desdeLimitUTC },
      },
      include: { Pagos: true, Alojamientos: true },
    }),
    prisma.alojamiento.findMany({
      where:   { Activo: true },
      select:  { Id: true, Nombre: true, Capacidad: true },
      orderBy: { Id: 'asc' },
    }),
    prisma.apartDetalle.findMany({
      select: {
        AlojamientoApartId: true,
        AlojamientoHab1Id:  true,
        AlojamientoHab2Id:  true,
      },
    }),
  ])

  const reservasJSON = reservas.map(r => {
    const totalCobrado   = r.Pagos.reduce((s, p) => s + Number(p.Monto), 0)
    const saldoPendiente = Number(r.MontoTotal) - totalCobrado
    const fiStr = toArgDateStr(r.FechaIngreso)
    const fsStr = toArgDateStr(r.FechaSalida)
    const [fy, fm, fd] = fiStr.split('-').map(Number)
    const [sy, sm, sd] = fsStr.split('-').map(Number)
    const noches = Math.round(
      (new Date(sy, sm - 1, sd) - new Date(fy, fm - 1, fd)) / 86400000
    )
    return {
      id:                r.Id,
      alojamientoId:     r.AlojamientoId,
      nombreAlojamiento: r.Alojamientos.Nombre,
      nombreHuesped:     r.NombreHuesped,
      cantidadHuespedes: r.CantidadHuespedes,
      incluyeDesayuno:   r.IncluyeDesayuno,
      fechaIngreso:      fiStr,
      fechaSalida:       fsStr,
      montoTotal:        Number(r.MontoTotal),
      precioPorDia:      noches > 0 ? Math.round(Number(r.MontoTotal) / noches) : null,
      esInvitacion:      r.EsInvitacion,
      totalCobrado:      Math.round(totalCobrado),
      saldoPendiente:    Math.round(saldoPendiente),
    }
  })

  const alojamientosJSON = alojamientos.map(a => ({
    id:        a.Id,
    nombre:    a.Nombre,
    capacidad: a.Capacidad,
  }))

  const apartMapJSON = apartDetalles.map(d => ({
    apartId: d.AlojamientoApartId,
    hab1Id:  d.AlojamientoHab1Id,
    hab2Id:  d.AlojamientoHab2Id,
  }))

  return res.status(200).json({
    reservas:     reservasJSON,
    alojamientos: alojamientosJSON,
    apartMap:     apartMapJSON,
    esAdmin:      session.user.rol === 0,
  })
}
