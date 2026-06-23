import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'No autorizado' })
  if (Number(session.user.rol) !== 0) return res.status(403).json({ error: 'Acceso denegado' })

  const { id, activo } = req.body
  const idNum = parseInt(id)
  if (isNaN(idNum)) return res.status(400).json({ error: 'ID inválido' })

  const existente = await prisma.alojamiento.findUnique({ where: { Id: idNum }, select: { Id: true } })
  if (!existente) return res.status(404).json({ error: 'No encontrado' })

  await prisma.alojamiento.update({
    where: { Id: idNum },
    data: { Activo: Boolean(activo) },
  })

  return res.status(200).json({ ok: true })
}
