import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

// Tipo Prisma: 0=Cabaña 1=Habitacion 2=Apart
const TIPO_TO_NUM = { habitacion: 1, 'cabaña': 0, apart: 2 }

const TIPO_LABELS = {
  todos:      'todas las unidades',
  habitacion: 'todas las Habitaciones',
  'cabaña':   'todas las Cabañas',
  apart:      'todos los Aparts',
}
const SERV_LABELS = {
  ambos:          'ambos servicios',
  'con-desayuno': 'Con desayuno',
  'sin-desayuno': 'Sin desayuno',
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'No autorizado' })
  if (Number(session.user.rol) !== 0) return res.status(403).json({ error: 'Acceso denegado' })

  const { porcentaje, tipoAloj, servicio, temporadaId } = req.body

  const pct = parseFloat(porcentaje)
  if (!pct || pct === 0 || isNaN(pct)) {
    return res.status(422).json({ error: 'El porcentaje no puede ser 0.' })
  }

  const tempId = parseInt(temporadaId)
  const temporada = await prisma.temporada.findUnique({ where: { Id: tempId } })
  if (!temporada) return res.status(404).json({ error: 'Temporada no encontrada' })

  const where = { TemporadaId: tempId }
  if (tipoAloj !== 'todos') {
    const tipoNum = TIPO_TO_NUM[tipoAloj]
    if (tipoNum === undefined) return res.status(400).json({ error: 'Tipo inválido' })
    where.Alojamientos = { Tipo: tipoNum }
  }

  const tarifas = await prisma.tarifa.findMany({ where, include: { Alojamientos: true } })

  const factor = 1 + pct / 100
  let modificadas = 0

  for (const t of tarifas) {
    const cd = Number(t.PrecioConDesayuno)
    const sd = Number(t.PrecioSinDesayuno)
    const data = {}
    if (servicio !== 'sin-desayuno' && cd > 0) data.PrecioConDesayuno = Math.round(cd * factor)
    if (servicio !== 'con-desayuno' && sd > 0) data.PrecioSinDesayuno = Math.round(sd * factor)

    if (Object.keys(data).length > 0) {
      await prisma.tarifa.update({ where: { Id: t.Id }, data })
      modificadas++
    }
  }

  const signo  = pct > 0 ? '+' : '-'
  const pctAbs = Math.abs(pct)
  const fechaStr = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(new Date())

  const cookieValue = `${signo}${pctAbs}%|${SERV_LABELS[servicio] ?? servicio}|${TIPO_LABELS[tipoAloj] ?? tipoAloj}|${temporada.Nombre}|${fechaStr}`
  const maxAge = 90 * 24 * 60 * 60
  res.setHeader('Set-Cookie', `ultimo_ajuste_tarifas=${encodeURIComponent(cookieValue)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`)

  return res.status(200).json({
    mensaje: `Se modificaron ${modificadas} tarifa${modificadas !== 1 ? 's' : ''}.`,
  })
}
