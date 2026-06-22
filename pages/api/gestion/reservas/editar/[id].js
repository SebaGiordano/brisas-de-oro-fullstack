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

  const id = parseInt(req.query.id)
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' })

  if (req.method === 'GET') {
    const [reserva, alojamientos] = await Promise.all([
      prisma.reserva.findUnique({ where: { Id: id } }),
      prisma.alojamiento.findMany({
        where: { Activo: true },
        select: { Id: true, Nombre: true, Capacidad: true },
        orderBy: { Id: 'asc' },
      }),
    ])
    if (!reserva) return res.status(404).json({ error: 'No encontrada' })

    const montoTotal = Number(reserva.MontoTotal)
    const noches     = Math.round((new Date(reserva.FechaSalida) - new Date(reserva.FechaIngreso)) / 86400000)
    const precioPorDia = !reserva.EsInvitacion && noches > 0 ? Math.round(montoTotal / noches) : 0

    return res.status(200).json({
      id:                reserva.Id,
      nombreHuesped:     reserva.NombreHuesped,
      telefono:          reserva.Telefono,
      canalOrigen:       reserva.CanalOrigen,
      observaciones:     reserva.Observaciones,
      esInvitacion:      reserva.EsInvitacion,
      incluyeDesayuno:   reserva.IncluyeDesayuno,
      cantidadHuespedes: reserva.CantidadHuespedes,
      alojamientoId:     reserva.AlojamientoId,
      fechaIngreso:      toArgDateStr(reserva.FechaIngreso),
      fechaSalida:       toArgDateStr(reserva.FechaSalida),
      montoTotal,
      precioPorDia,
      alojamientos:      alojamientos.map(a => ({ id: a.Id, nombre: a.Nombre, capacidad: a.Capacidad })),
    })
  }

  if (req.method === 'PUT') {
    const {
      nombreHuesped, esInvitacion,
      fechaIngreso, fechaSalida,
      alojamientoId, cantidadHuespedes, incluyeDesayuno,
      montoTotal, telefono, canalOrigen, observaciones,
    } = req.body

    const errores = []
    const esInv = esInvitacion === true || esInvitacion === 'true'

    if (!nombreHuesped?.trim()) errores.push('Nombre del titular obligatorio')
    if (!fechaIngreso)          errores.push('Fecha de ingreso obligatoria')
    if (!fechaSalida)           errores.push('Fecha de egreso obligatoria')
    if (fechaIngreso && fechaSalida && fechaSalida <= fechaIngreso)
      errores.push('La fecha de egreso debe ser posterior al ingreso')
    if (!alojamientoId) errores.push('Alojamiento obligatorio')

    const cantH = parseInt(cantidadHuespedes)
    if (!cantidadHuespedes || cantH < 1) errores.push('Cantidad de personas obligatoria')

    if (!esInv && (!montoTotal || parseFloat(montoTotal) <= 0))
      errores.push('Monto total obligatorio')

    if (errores.length) return res.status(422).json({ errores })

    const fi = parseFechaBA(fechaIngreso)
    const fs = parseFechaBA(fechaSalida)

    const conflictos = await prisma.reserva.count({
      where: {
        AlojamientoId: parseInt(alojamientoId),
        Estado:        { not: 2 },
        Id:            { not: id },
        FechaIngreso:  { lt: fs },
        FechaSalida:   { gt: fi },
      },
    })
    if (conflictos > 0)
      return res.status(409).json({ errores: ['El alojamiento no está disponible para las fechas seleccionadas'] })

    await prisma.reserva.update({
      where: { Id: id },
      data: {
        NombreHuesped:     nombreHuesped.trim(),
        Telefono:          telefono?.trim()    || null,
        FechaIngreso:      fi,
        FechaSalida:       fs,
        MontoTotal:        parseFloat(montoTotal ?? 0),
        EsInvitacion:      esInv,
        IncluyeDesayuno:   incluyeDesayuno === true || incluyeDesayuno === 'true',
        CantidadHuespedes: cantH,
        AlojamientoId:     parseInt(alojamientoId),
        CanalOrigen:       canalOrigen?.trim()   || null,
        Observaciones:     observaciones?.trim() || null,
      },
    })

    return res.status(200).json({ ok: true })
  }

  return res.status(405).end()
}
