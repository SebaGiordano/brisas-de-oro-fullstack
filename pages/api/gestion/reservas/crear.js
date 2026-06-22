import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

function parseFechaBA(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d, 3, 0, 0))
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'No autorizado' })
  if (Number(session.user.rol) !== 0) return res.status(403).json({ error: 'Acceso denegado' })

  const {
    nombreHuesped, esInvitacion,
    fechaIngreso, fechaSalida,
    alojamientoId, cantidadHuespedes, incluyeDesayuno,
    precioPorDia, montoTotal,
    telefono, canalOrigen, observaciones,
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

  if (!esInv) {
    if (!precioPorDia || parseFloat(precioPorDia) <= 0) errores.push('Precio por día obligatorio')
    if (!montoTotal   || parseFloat(montoTotal) <= 0)   errores.push('Monto total obligatorio')
  }

  if (errores.length) return res.status(422).json({ errores })

  const fi = parseFechaBA(fechaIngreso)
  const fs = parseFechaBA(fechaSalida)

  const conflictos = await prisma.reserva.count({
    where: {
      AlojamientoId: parseInt(alojamientoId),
      Estado:        { not: 2 },
      FechaIngreso:  { lt: fs },
      FechaSalida:   { gt: fi },
    },
  })
  if (conflictos > 0)
    return res.status(409).json({ errores: ['El alojamiento no está disponible para las fechas seleccionadas'] })

  const reserva = await prisma.reserva.create({
    data: {
      AlojamientoId:     parseInt(alojamientoId),
      NombreHuesped:     nombreHuesped.trim(),
      Telefono:          telefono?.trim()    || null,
      FechaIngreso:      fi,
      FechaSalida:       fs,
      MontoTotal:        parseFloat(montoTotal ?? 0),
      MontoSena:         0,
      Estado:            0,
      EsInvitacion:      esInv,
      IncluyeDesayuno:   incluyeDesayuno === true || incluyeDesayuno === 'true',
      CantidadHuespedes: cantH,
      CanalOrigen:       canalOrigen?.trim()   || null,
      Observaciones:     observaciones?.trim() || null,
      FechaCarga:        new Date(),
    },
  })

  return res.status(201).json({ id: reserva.Id })
}
