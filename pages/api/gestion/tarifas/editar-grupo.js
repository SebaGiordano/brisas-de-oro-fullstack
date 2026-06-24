import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'No autorizado' })
  if (Number(session.user.rol) !== 0) return res.status(403).json({ error: 'Acceso denegado' })

  const { filas, temporadaId, cantPersonas } = req.body
  if (!Array.isArray(filas)) return res.status(400).json({ error: 'filas inválido' })

  const tempId = parseInt(temporadaId)
  const cant   = parseInt(cantPersonas)
  if (isNaN(tempId) || isNaN(cant)) return res.status(400).json({ error: 'Parámetros inválidos' })

  let updated = 0
  let created = 0

  for (const f of filas) {
    const tarifaId = parseInt(f.tarifaId)
    const alojId   = parseInt(f.alojamientoId)
    const cd        = parseFloat(f.precioConDesayuno) || 0
    const sd        = parseFloat(f.precioSinDesayuno) || 0

    if (tarifaId > 0) {
      await prisma.tarifa.update({
        where: { Id: tarifaId },
        data: { PrecioConDesayuno: cd, PrecioSinDesayuno: sd },
      })
      updated++
    } else {
      await prisma.tarifa.create({
        data: {
          AlojamientoId:     alojId,
          TemporadaId:       tempId,
          CantidadPersonas:  cant,
          PrecioConDesayuno: cd,
          PrecioSinDesayuno: sd,
          Activo:            true,
        },
      })
      created++
    }
  }

  return res.status(200).json({ updated, created })
}
