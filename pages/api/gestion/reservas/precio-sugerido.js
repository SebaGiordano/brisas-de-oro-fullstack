import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'No autorizado' })

  const { alojamientoId, personas, fechaIngreso } = req.query
  if (!alojamientoId || !personas) {
    return res.status(200).json({ precioConDesayuno: null, precioSinDesayuno: null, temporada: null })
  }

  let fechaDt = new Date()
  if (fechaIngreso) {
    const [y, m, d] = fechaIngreso.split('-').map(Number)
    fechaDt = new Date(Date.UTC(y, m - 1, d, 3, 0, 0))
  }

  const tarifa = await prisma.tarifa.findFirst({
    where: {
      AlojamientoId:    parseInt(alojamientoId),
      CantidadPersonas: parseInt(personas),
      Activo:           true,
      Temporadas: {
        Activo:      true,
        FechaInicio: { lte: fechaDt },
        FechaFin:    { gte: fechaDt },
      },
    },
    include: { Temporadas: true },
  })

  if (!tarifa) {
    return res.status(200).json({ precioConDesayuno: null, precioSinDesayuno: null, temporada: null })
  }

  return res.status(200).json({
    precioConDesayuno: Number(tarifa.PrecioConDesayuno),
    precioSinDesayuno: Number(tarifa.PrecioSinDesayuno),
    temporada:         tarifa.Temporadas.Nombre,
  })
}
