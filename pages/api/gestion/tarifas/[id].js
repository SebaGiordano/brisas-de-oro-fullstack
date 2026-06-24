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
    const tarifa = await prisma.tarifa.findUnique({
      where: { Id: id },
      include: { Alojamientos: true, Temporadas: true },
    })
    if (!tarifa) return res.status(404).json({ error: 'No encontrada' })

    return res.status(200).json({
      id:                 tarifa.Id,
      nombreAlojamiento:  tarifa.Alojamientos.Nombre,
      nombreTemporada:    tarifa.Temporadas.Nombre,
      cantidadPersonas:   tarifa.CantidadPersonas,
      precioConDesayuno:  Number(tarifa.PrecioConDesayuno),
      precioSinDesayuno:  Number(tarifa.PrecioSinDesayuno),
    })
  }

  if (req.method === 'PUT') {
    const { precioConDesayuno, precioSinDesayuno } = req.body
    const cd = parseFloat(precioConDesayuno)
    const sd = parseFloat(precioSinDesayuno)

    const errores = []
    if (isNaN(cd) || cd < 0) errores.push('El precio con desayuno debe ser mayor o igual a 0.')
    if (isNaN(sd) || sd < 0) errores.push('El precio sin desayuno debe ser mayor o igual a 0.')
    if (errores.length) return res.status(422).json({ errores })

    const existente = await prisma.tarifa.findUnique({ where: { Id: id }, select: { Id: true } })
    if (!existente) return res.status(404).json({ error: 'No encontrada' })

    await prisma.tarifa.update({
      where: { Id: id },
      data: { PrecioConDesayuno: cd, PrecioSinDesayuno: sd },
    })

    return res.status(200).json({ ok: true })
  }

  return res.status(405).end()
}
