import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

const ROL_LABEL  = { 0: 'Administrador', 1: 'Viewer' }
const ROL_TO_NUM = { Administrador: 0, Viewer: 1 }

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'No autorizado' })
  if (Number(session.user.rol) !== 0) return res.status(403).json({ error: 'Acceso denegado' })

  const id = parseInt(req.query.id)
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' })

  if (req.method === 'GET') {
    const usuario = await prisma.usuario.findUnique({ where: { id } })
    if (!usuario) return res.status(404).json({ error: 'No encontrado' })

    return res.status(200).json({
      id:          usuario.id,
      userName:    usuario.userName,
      phoneNumber: usuario.phoneNumber,
      rol:         ROL_LABEL[usuario.rol] ?? String(usuario.rol),
    })
  }

  if (req.method === 'PUT') {
    const { phoneNumber, rol } = req.body

    if (rol !== 'Administrador' && rol !== 'Viewer') {
      return res.status(422).json({ errores: ['Seleccioná un rol válido.'] })
    }

    const existente = await prisma.usuario.findUnique({ where: { id }, select: { id: true } })
    if (!existente) return res.status(404).json({ error: 'No encontrado' })

    await prisma.usuario.update({
      where: { id },
      data: {
        phoneNumber: phoneNumber?.trim() || null,
        rol:         ROL_TO_NUM[rol],
      },
    })

    return res.status(200).json({ ok: true })
  }

  return res.status(405).end()
}
