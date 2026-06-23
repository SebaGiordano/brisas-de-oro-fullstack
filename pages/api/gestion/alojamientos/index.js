import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

// Prioridad de orden: Habitacion, Apart, Cabaña
const TIPO_SORT_PRIORITY = { 1: 0, 2: 1, 0: 2 }

function extraerNumero(nombre) {
  const m = nombre.match(/\d+/)
  return m ? parseInt(m[0]) : Infinity
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'No autorizado' })

  const alojamientos = await prisma.alojamiento.findMany()

  alojamientos.sort((a, b) => {
    const pa = TIPO_SORT_PRIORITY[a.Tipo] ?? 99
    const pb = TIPO_SORT_PRIORITY[b.Tipo] ?? 99
    if (pa !== pb) return pa - pb
    const na = extraerNumero(a.Nombre)
    const nb = extraerNumero(b.Nombre)
    if (na !== nb) return na - nb
    return a.Nombre.localeCompare(b.Nombre)
  })

  return res.status(200).json(
    alojamientos.map(a => ({
      id:        a.Id,
      nombre:    a.Nombre,
      tipo:      a.Tipo,
      capacidad: a.Capacidad,
      activo:    a.Activo,
    }))
  )
}
