import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

const ROL_LABEL = { 0: 'Administrador', 1: 'Viewer' }

function toArgDateStr(date) {
  return new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(new Date(date))
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'No autorizado' })
  if (Number(session.user.rol) !== 0) return res.status(403).json({ error: 'Acceso denegado' })

  const usuarios = await prisma.usuario.findMany({ orderBy: { userName: 'asc' } })
  const sessionUserId = parseInt(session.user.id)

  return res.status(200).json(
    usuarios.map(u => ({
      id:              u.id,
      userName:        u.userName,
      rol:             ROL_LABEL[u.rol] ?? String(u.rol),
      phoneNumber:     u.phoneNumber,
      fechaCreacion:   u.fechaCreacion ? toArgDateStr(u.fechaCreacion) : null,
      activo:          u.activo,
      esUsuarioActual: u.id === sessionUserId,
    }))
  )
}
