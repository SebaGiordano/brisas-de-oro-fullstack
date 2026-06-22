import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

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
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'No autorizado' })
  if (Number(session.user.rol) !== 0) return res.status(403).json({ error: 'Acceso denegado' })

  const reservaId = parseInt(req.query.reservaId)
  if (isNaN(reservaId)) return res.status(400).json({ error: 'reservaId inválido' })

  if (req.method === 'GET') {
    const reserva = await prisma.reserva.findUnique({
      where: { Id: reservaId },
      include: {
        Pagos:         true,
        Alojamientos:  { select: { Nombre: true } },
      },
    })
    if (!reserva) return res.status(404).json({ error: 'No encontrada' })

    const totalCobrado   = reserva.Pagos.reduce((s, p) => s + Number(p.Monto), 0)
    const montoTotal     = Number(reserva.MontoTotal)
    const saldoPendiente = montoTotal - totalCobrado
    const noches         = Math.round((new Date(reserva.FechaSalida) - new Date(reserva.FechaIngreso)) / 86400000)
    const tarifaDia      = noches > 0 ? Math.round(montoTotal / noches) : null

    // Suggested tipoPago: 2=AjusteCorreccion if saldo<0, 1=Cancelacion if hay pagos, else 0=Sena
    const tipoPago = saldoPendiente < 0 ? 2 : reserva.Pagos.length > 0 ? 1 : 0

    return res.status(200).json({
      reservaId:        reserva.Id,
      nombreHuesped:    reserva.NombreHuesped,
      nombreAlojamiento: reserva.Alojamientos.Nombre,
      fechaIngreso:     toArgDateStr(reserva.FechaIngreso),
      fechaSalida:      toArgDateStr(reserva.FechaSalida),
      noches,
      tarifaDia,
      montoTotal:       Math.round(montoTotal),
      totalCobrado:     Math.round(totalCobrado),
      saldoPendiente:   Math.round(saldoPendiente),
      tipoPago,
    })
  }

  if (req.method === 'POST') {
    const { tipoPago, metodoPago, monto, fecha, observaciones } = req.body

    const errores = []
    if (tipoPago === undefined || tipoPago === null || tipoPago === '') errores.push('Concepto obligatorio')
    if (metodoPago === undefined || metodoPago === null || metodoPago === '') errores.push('Método de pago obligatorio')
    if (monto === undefined || monto === null || monto === '') errores.push('Monto obligatorio')
    if (!fecha) errores.push('Fecha obligatoria')
    if (errores.length) return res.status(422).json({ errores })

    const reserva = await prisma.reserva.findUnique({ where: { Id: reservaId }, select: { Id: true } })
    if (!reserva) return res.status(404).json({ error: 'No encontrada' })

    await prisma.pago.create({
      data: {
        ReservaId:     reservaId,
        TipoPago:      parseInt(tipoPago),
        MetodoPago:    parseInt(metodoPago),
        Monto:         parseFloat(monto),
        Fecha:         parseFechaBA(fecha),
        Observaciones: observaciones?.trim() || null,
      },
    })

    return res.status(201).json({ ok: true })
  }

  return res.status(405).end()
}
