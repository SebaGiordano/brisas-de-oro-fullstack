import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'No autorizado' })
  if (Number(session.user.rol) !== 0) return res.status(403).json({ error: 'Acceso denegado' })

  const id = parseInt(req.query.id)
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' })

  if (req.method === 'GET') {
    const alojamiento = await prisma.alojamiento.findUnique({ where: { Id: id } })
    if (!alojamiento) return res.status(404).json({ error: 'No encontrado' })

    return res.status(200).json({
      id:        alojamiento.Id,
      nombre:    alojamiento.Nombre,
      tipo:      alojamiento.Tipo,
      capacidad: alojamiento.Capacidad,
      activo:    alojamiento.Activo,
    })
  }

  if (req.method === 'PUT') {
    const { nombre, capacidad, activo } = req.body

    const errores = []
    if (!nombre || !nombre.trim()) errores.push('El nombre es obligatorio.')
    const cap = parseInt(capacidad)
    if (isNaN(cap) || cap < 1 || cap > 100) errores.push('La capacidad debe estar entre 1 y 100.')
    if (errores.length) return res.status(422).json({ errores })

    const existente = await prisma.alojamiento.findUnique({ where: { Id: id }, select: { Id: true } })
    if (!existente) return res.status(404).json({ error: 'No encontrado' })

    await prisma.alojamiento.update({
      where: { Id: id },
      data: {
        Nombre:    nombre.trim(),
        Capacidad: cap,
        Activo:    Boolean(activo),
      },
    })

    return res.status(200).json({ ok: true })
  }

  return res.status(405).end()
}
