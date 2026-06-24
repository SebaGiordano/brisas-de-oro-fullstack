import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

function parseFechaPlanaUTC(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'No autorizado' })
  if (Number(session.user.rol) !== 0) return res.status(403).json({ error: 'Acceso denegado' })

  const { items } = req.body
  if (!Array.isArray(items)) return res.status(400).json({ error: 'items inválido' })

  for (const item of items) {
    const id = parseInt(item.id)
    if (isNaN(id) || !item.fechaInicio || !item.fechaFin) continue

    await prisma.temporada.update({
      where: { Id: id },
      data: {
        FechaInicio: parseFechaPlanaUTC(item.fechaInicio),
        FechaFin:    parseFechaPlanaUTC(item.fechaFin),
      },
    })
  }

  return res.status(200).json({ ok: true })
}
