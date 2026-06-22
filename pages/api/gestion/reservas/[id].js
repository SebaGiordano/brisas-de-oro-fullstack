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

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'No autorizado' })

  const id = parseInt(req.query.id)
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' })

  if (req.method === 'GET') {
    const reserva = await prisma.reserva.findUnique({
      where: { Id: id },
      include: {
        Alojamientos: true,
        Pagos: { orderBy: { Fecha: 'asc' } },
      },
    })
    if (!reserva) return res.status(404).json({ error: 'No encontrada' })

    const totalCobrado   = reserva.Pagos.reduce((s, p) => s + Number(p.Monto), 0)
    const montoTotal     = Number(reserva.MontoTotal)
    const saldoPendiente = montoTotal - totalCobrado
    const noches         = Math.round((new Date(reserva.FechaSalida) - new Date(reserva.FechaIngreso)) / 86400000)
    const tarifaDia      = !reserva.EsInvitacion && noches > 0 ? Math.round(montoTotal / noches) : null

    const estadoPagoClase = reserva.EsInvitacion    ? 'pago-invitacion'
      : totalCobrado === 0                          ? 'pago-sin-sena'
      : saldoPendiente > 0                          ? 'pago-senado'
                                                    : 'pago-pagado'
    const estadoPagoTexto = reserva.EsInvitacion    ? 'Invitación'
      : totalCobrado === 0                          ? 'Sin seña'
      : saldoPendiente > 0                          ? 'Señado'
                                                    : 'Pagado'

    return res.status(200).json({
      id: reserva.Id,
      nombreHuesped:     reserva.NombreHuesped,
      telefono:          reserva.Telefono,
      canalOrigen:       reserva.CanalOrigen,
      observaciones:     reserva.Observaciones,
      esInvitacion:      reserva.EsInvitacion,
      incluyeDesayuno:   reserva.IncluyeDesayuno,
      cantidadHuespedes: reserva.CantidadHuespedes,
      fechaIngreso:      toArgDateStr(reserva.FechaIngreso),
      fechaSalida:       toArgDateStr(reserva.FechaSalida),
      fechaCarga:        toArgDateTimeStr(reserva.FechaCarga),
      montoTotal:        Math.round(montoTotal),
      totalCobrado:      Math.round(totalCobrado),
      saldoPendiente:    Math.round(saldoPendiente),
      noches,
      tarifaDia,
      estado:            reserva.Estado,
      estadoPagoClase,
      estadoPagoTexto,
      alojamiento: {
        id:        reserva.Alojamientos.Id,
        nombre:    reserva.Alojamientos.Nombre,
        tipo:      reserva.Alojamientos.Tipo,
        capacidad: reserva.Alojamientos.Capacidad,
      },
      pagos: reserva.Pagos.map(p => ({
        id:            p.Id,
        tipoPago:      p.TipoPago,
        metodoPago:    p.MetodoPago,
        monto:         Number(p.Monto),
        fecha:         toArgDateTimeStr(p.Fecha),
        observaciones: p.Observaciones,
      })),
    })
  }

  if (req.method === 'POST') {
    if (Number(session.user.rol) !== 0) return res.status(403).json({ error: 'Acceso denegado' })
    const { action } = req.body
    if (action !== 'cancelar') return res.status(400).json({ error: 'Acción inválida' })

    const reserva = await prisma.reserva.findUnique({ where: { Id: id }, select: { Estado: true } })
    if (!reserva) return res.status(404).json({ error: 'No encontrada' })
    if (reserva.Estado === 2) return res.status(400).json({ error: 'Ya está cancelada' })

    await prisma.reserva.update({ where: { Id: id }, data: { Estado: 2 } })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).end()
}
