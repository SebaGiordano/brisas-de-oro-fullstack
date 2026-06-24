import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

function toArgDateStr(date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(date))
}

function toArgDateTimeStr(date) {
  const fmt = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  })
  return fmt.format(new Date(date)).replace(',', ' |')
}

function toArgDateShortStr(date) {
  return new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    day: '2-digit', month: '2-digit',
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
    titular = '',
    titularSaldos = '',
    desde = '',
    hasta = '',
    metodoPago = '',
    concepto = '',
    orden = 'desc',
    tab = 'movimientos',
  } = req.query

  // ── Movimientos ──
  const whereMov = {}

  if (titular.trim()) {
    whereMov.Reservas = { NombreHuesped: { contains: titular.trim(), mode: 'insensitive' } }
  }
  if (desde) {
    whereMov.Fecha = { ...(whereMov.Fecha ?? {}), gte: parseFechaBA(desde) }
  }
  if (hasta) {
    const [y, m, d] = hasta.split('-').map(Number)
    whereMov.Fecha = { ...(whereMov.Fecha ?? {}), lt: new Date(Date.UTC(y, m - 1, d + 1, 3, 0, 0)) }
  }
  if (metodoPago !== '') {
    whereMov.MetodoPago = parseInt(metodoPago)
  }
  if (concepto !== '') {
    whereMov.TipoPago = parseInt(concepto)
  }

  const pagos = await prisma.pago.findMany({
    where: whereMov,
    include: { Reservas: { include: { Alojamientos: { select: { Nombre: true } } } } },
    orderBy: { Fecha: orden === 'asc' ? 'asc' : 'desc' },
  })

  const movimientos = pagos.map(p => ({
    reservaId:         p.ReservaId,
    fecha:             toArgDateTimeStr(p.Fecha),
    fechaCorta:        toArgDateShortStr(p.Fecha),
    nombreHuesped:     p.Reservas.NombreHuesped,
    nombreAlojamiento: p.Reservas.Alojamientos.Nombre,
    tipoPago:          p.TipoPago,
    metodoPago:        p.MetodoPago,
    monto:             Number(p.Monto),
    observaciones:     p.Observaciones,
  }))

  const totalPeriodo = movimientos.reduce((s, m) => s + m.monto, 0)

  // ── Saldos pendientes ──
  const whereSaldos = { Estado: { not: 2 }, EsInvitacion: false }
  if (titularSaldos.trim()) {
    whereSaldos.NombreHuesped = { contains: titularSaldos.trim(), mode: 'insensitive' }
  }

  const reservas = await prisma.reserva.findMany({
    where: whereSaldos,
    include: { Pagos: true, Alojamientos: { select: { Nombre: true } } },
    orderBy: { FechaSalida: 'asc' },
  })

  const saldosPendientes = reservas
    .map(r => {
      const totalCobrado   = r.Pagos.reduce((s, p) => s + Number(p.Monto), 0)
      const montoTotal     = Number(r.MontoTotal)
      const saldoPendiente = montoTotal - totalCobrado
      const estadoPagoClase = totalCobrado === 0 ? 'pago-sin-sena' : 'pago-senado'
      const estadoPagoTexto = totalCobrado === 0 ? 'Sin seña' : 'Señado'
      return {
        reservaId:         r.Id,
        nombreHuesped:     r.NombreHuesped,
        nombreAlojamiento: r.Alojamientos.Nombre,
        fechaIngreso:      toArgDateStr(r.FechaIngreso),
        fechaSalida:       toArgDateStr(r.FechaSalida),
        montoTotal:        Math.round(montoTotal),
        totalCobrado:      Math.round(totalCobrado),
        saldoPendiente:    Math.round(saldoPendiente),
        estadoPagoClase,
        estadoPagoTexto,
      }
    })
    .filter(s => s.saldoPendiente > 0)

  return res.status(200).json({
    movimientos,
    totalPeriodo: Math.round(totalPeriodo),
    saldosPendientes,
    tab: tab === 'saldos' ? 'saldos' : 'movimientos',
  })
}
