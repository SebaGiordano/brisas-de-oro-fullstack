import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

function parseFechaBA(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d, 3, 0, 0))
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'No autorizado' })

  const { fechaIngreso, fechaEgreso, excludeReservaId } = req.query
  if (!fechaIngreso || !fechaEgreso) return res.status(400).json({ error: 'Fechas requeridas' })

  const fi = parseFechaBA(fechaIngreso)
  const fs = parseFechaBA(fechaEgreso)
  const excludeId = excludeReservaId ? parseInt(excludeReservaId) : null

  const whereReservas = {
    Estado: { not: 2 },
    FechaIngreso: { lt: fs },
    FechaSalida:  { gt: fi },
  }
  if (excludeId) whereReservas.Id = { not: excludeId }

  const [reservasOcupadas, apartDetalles, alojamientos] = await Promise.all([
    prisma.reserva.findMany({ where: whereReservas, select: { AlojamientoId: true } }),
    prisma.apartDetalle.findMany({
      select: { AlojamientoApartId: true, AlojamientoHab1Id: true, AlojamientoHab2Id: true },
    }),
    prisma.alojamiento.findMany({
      where: { Activo: true },
      select: { Id: true, Nombre: true, Capacidad: true },
      orderBy: { Id: 'asc' },
    }),
  ])

  const ocupadosSet = new Set(reservasOcupadas.map(r => r.AlojamientoId))

  // Build Apart maps
  const apartToHabs = {}
  const hab1ToApart = {}
  const hab2ToApart = {}
  for (const ad of apartDetalles) {
    apartToHabs[ad.AlojamientoApartId] = { hab1: ad.AlojamientoHab1Id, hab2: ad.AlojamientoHab2Id }
    hab1ToApart[ad.AlojamientoHab1Id]  = ad.AlojamientoApartId
    hab2ToApart[ad.AlojamientoHab2Id]  = ad.AlojamientoApartId
  }

  const unavailable = new Set(ocupadosSet)
  for (const alojId of ocupadosSet) {
    if (apartToHabs[alojId]) {
      // Occupied is an Apart: block its two habitaciones
      unavailable.add(apartToHabs[alojId].hab1)
      unavailable.add(apartToHabs[alojId].hab2)
    }
    if (hab1ToApart[alojId]) {
      // Occupied is hab1 of an Apart: block the Apart (but not hab2 individually)
      unavailable.add(hab1ToApart[alojId])
    }
    if (hab2ToApart[alojId]) {
      // Occupied is hab2 of an Apart: block the Apart (but not hab1 individually)
      unavailable.add(hab2ToApart[alojId])
    }
  }

  const disponibles = alojamientos
    .filter(a => !unavailable.has(a.Id))
    .map(a => ({ id: a.Id, nombre: a.Nombre, capacidad: a.Capacidad }))

  return res.status(200).json(disponibles)
}
