import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

const PAGE_SIZE = 20

function getArgTodayUTC() {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
  const [y, m, d] = fmt.format(new Date()).split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d, 3, 0, 0))
}

function toArgDateStr(date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(date))
}

function parseFechaBA(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d, 3, 0, 0))
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'No autorizado' })

  const {
    busqueda = '',
    estado = 'activas',
    estadoPago = '',
    desde = '',
    hasta = '',
    pagina = '1',
  } = req.query

  const paginaNum = Math.max(1, parseInt(pagina) || 1)
  const hoy = getArgTodayUTC()

  const where = {}

  if (estado === 'activas') {
    where.Estado = { not: 2 }
  } else if (estado === 'proximas') {
    where.Estado = { not: 2 }
    where.FechaIngreso = { gt: hoy }
  } else if (estado === 'en-curso') {
    where.Estado = { not: 2 }
    where.FechaIngreso = { lte: hoy }
    where.FechaSalida = { gt: hoy }
  } else if (estado === 'historicas') {
    where.Estado = { not: 2 }
    where.FechaSalida = { lte: hoy }
  } else if (estado === 'Cancelada') {
    where.Estado = 2
  }
  // 'todas' → sin filtro

  if (busqueda.trim()) {
    where.NombreHuesped = { contains: busqueda.trim(), mode: 'insensitive' }
  }

  if (desde) {
    const dt = parseFechaBA(desde)
    where.FechaIngreso = { ...(where.FechaIngreso ?? {}), gte: dt }
  }
  if (hasta) {
    const [y, m, d] = hasta.split('-').map(Number)
    const dt = new Date(Date.UTC(y, m - 1, d + 1, 3, 0, 0))
    where.FechaIngreso = { ...(where.FechaIngreso ?? {}), lt: dt }
  }

  const reservas = await prisma.reserva.findMany({
    where,
    include: {
      Pagos: true,
      Alojamientos: { select: { Nombre: true } },
    },
    orderBy: { FechaIngreso: 'desc' },
  })

  let items = reservas.map(r => {
    const totalCobrado   = r.Pagos.reduce((s, p) => s + Number(p.Monto), 0)
    const montoTotal     = Number(r.MontoTotal)
    const saldoPendiente = montoTotal - totalCobrado
    const noches         = Math.round((new Date(r.FechaSalida) - new Date(r.FechaIngreso)) / 86400000)

    const estadoPagoClase = r.EsInvitacion    ? 'pago-invitacion'
      : totalCobrado === 0                    ? 'pago-sin-sena'
      : saldoPendiente > 0                    ? 'pago-senado'
                                              : 'pago-pagado'

    const estadoPagoTexto = r.EsInvitacion    ? 'Invitación'
      : totalCobrado === 0                    ? 'Sin seña'
      : saldoPendiente > 0                    ? 'Señado'
                                              : 'Pagado'

    return {
      id: r.Id,
      nombreHuesped: r.NombreHuesped,
      nombreAlojamiento: r.Alojamientos.Nombre,
      fechaIngreso: toArgDateStr(r.FechaIngreso),
      fechaSalida: toArgDateStr(r.FechaSalida),
      cantidadNoches: noches,
      cantidadHuespedes: r.CantidadHuespedes,
      incluyeDesayuno: r.IncluyeDesayuno,
      esInvitacion: r.EsInvitacion,
      montoTotal: Math.round(montoTotal),
      totalCobrado: Math.round(totalCobrado),
      saldoPendiente: Math.round(saldoPendiente),
      estado: r.Estado,
      estadoPagoClase,
      estadoPagoTexto,
    }
  })

  if (estadoPago === 'sin-sena') {
    items = items.filter(i => !i.esInvitacion && i.totalCobrado === 0)
  } else if (estadoPago === 'senado') {
    items = items.filter(i => !i.esInvitacion && i.totalCobrado > 0 && i.saldoPendiente > 0)
  } else if (estadoPago === 'saldado') {
    items = items.filter(i => !i.esInvitacion && i.saldoPendiente <= 0)
  } else if (estadoPago === 'invitacion') {
    items = items.filter(i => i.esInvitacion)
  }

  const totalItems  = items.length
  const totalPaginas = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  const paginaFinal  = Math.min(paginaNum, totalPaginas)
  const offset       = (paginaFinal - 1) * PAGE_SIZE

  return res.status(200).json({
    items: items.slice(offset, offset + PAGE_SIZE),
    totalItems,
    totalPaginas,
    pagina: paginaFinal,
  })
}
