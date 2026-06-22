import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'No autorizado' })

  const q = (req.query.q ?? '').trim()
  if (!q) return res.status(200).json([])

  const reservas = await prisma.reserva.findMany({
    where: { NombreHuesped: { startsWith: q, mode: 'insensitive' } },
    select: { NombreHuesped: true },
    distinct: ['NombreHuesped'],
    orderBy: { NombreHuesped: 'asc' },
    take: 10,
  })

  return res.status(200).json(reservas.map(r => r.NombreHuesped))
}
