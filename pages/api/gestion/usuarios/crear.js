import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

const ROL_TO_NUM = { Administrador: 0, Viewer: 1 }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'No autorizado' })
  if (Number(session.user.rol) !== 0) return res.status(403).json({ error: 'Acceso denegado' })

  const { userName, password, confirmPassword, phoneNumber, rol } = req.body
  const userNameTrim = (userName ?? '').trim()

  const errores = []
  if (!userNameTrim) {
    errores.push('El nombre de usuario es obligatorio.')
  } else if (!/^[a-zA-Z0-9]+$/.test(userNameTrim)) {
    errores.push('El nombre de usuario solo puede contener letras y números, sin espacios ni caracteres especiales.')
  }
  if (!password || password.length < 6) errores.push('La contraseña debe tener al menos 6 caracteres.')
  if (password !== confirmPassword) errores.push('Las contraseñas no coinciden.')
  if (rol !== 'Administrador' && rol !== 'Viewer') errores.push('Seleccioná un rol válido.')

  if (userNameTrim && /^[a-zA-Z0-9]+$/.test(userNameTrim)) {
    const existente = await prisma.usuario.findFirst({
      where: { userName: { equals: userNameTrim, mode: 'insensitive' } },
    })
    if (existente) errores.push('Ya existe un usuario con ese nombre.')
  }

  if (errores.length) return res.status(422).json({ errores })

  const passwordHash = await bcrypt.hash(password, 10)

  const usuario = await prisma.usuario.create({
    data: {
      userName:      userNameTrim,
      passwordHash,
      rol:           ROL_TO_NUM[rol],
      phoneNumber:   phoneNumber?.trim() || null,
      activo:        true,
      fechaCreacion: new Date(),
    },
  })

  return res.status(201).json({ id: usuario.id, userName: usuario.userName })
}
