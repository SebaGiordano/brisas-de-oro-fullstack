import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

// Prioridad de orden: Habitacion, Apart, Cabaña
const TIPO_SORT_PRIORITY = { 1: 0, 2: 1, 0: 2 }

function extraerNumero(nombre) {
  const m = nombre.match(/\d+/)
  return m ? parseInt(m[0]) : Infinity
}

// Las fechas de Temporada se guardan como medianoche UTC "plana" (sin ajuste de
// huso horario), ya que representan únicamente un rango de calendario.
function toUTCDateStr(date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'UTC',
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(date))
}

function getArgTodayPlainUTC() {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
  const [y, m, d] = fmt.format(new Date()).split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'No autorizado' })

  const temporadas = await prisma.temporada.findMany({ orderBy: { FechaInicio: 'asc' } })

  let temporadaActiva = null

  const qId = parseInt(req.query.temporadaId)
  if (!isNaN(qId)) {
    temporadaActiva = temporadas.find(t => t.Id === qId) ?? null
  }
  if (!temporadaActiva) {
    const hoy = getArgTodayPlainUTC()
    temporadaActiva = temporadas.find(t => new Date(t.FechaInicio) <= hoy && hoy <= new Date(t.FechaFin)) ?? null
  }
  if (!temporadaActiva) {
    temporadaActiva = temporadas.find(t => t.Nombre === 'Temporada Baja') ?? null
  }
  if (!temporadaActiva) {
    temporadaActiva = temporadas[0] ?? null
  }

  let grupos = []
  if (temporadaActiva) {
    const tarifas = await prisma.tarifa.findMany({
      where: { TemporadaId: temporadaActiva.Id },
      include: { Alojamientos: true },
      orderBy: { CantidadPersonas: 'asc' },
    })

    const porAloj = new Map()
    for (const t of tarifas) {
      const aloj = t.Alojamientos
      if (!porAloj.has(aloj.Id)) {
        let tipo = aloj.Tipo
        if (aloj.Nombre === 'Habitación 6' || aloj.Nombre === 'Habitación 10') tipo = 2
        porAloj.set(aloj.Id, {
          alojamientoId:     aloj.Id,
          nombreAlojamiento: aloj.Nombre,
          tipo,
          tarifas: [],
        })
      }
      porAloj.get(aloj.Id).tarifas.push({
        id:                t.Id,
        cantidadPersonas:  t.CantidadPersonas,
        precioConDesayuno: Number(t.PrecioConDesayuno),
        precioSinDesayuno: Number(t.PrecioSinDesayuno),
        activo:            t.Activo,
      })
    }

    grupos = [...porAloj.values()]
    grupos.sort((a, b) => {
      const pa = TIPO_SORT_PRIORITY[a.tipo] ?? 99
      const pb = TIPO_SORT_PRIORITY[b.tipo] ?? 99
      if (pa !== pb) return pa - pb
      const na = extraerNumero(a.nombreAlojamiento)
      const nb = extraerNumero(b.nombreAlojamiento)
      if (na !== nb) return na - nb
      return a.nombreAlojamiento.localeCompare(b.nombreAlojamiento)
    })
  }

  const ultimoAjuste = req.cookies?.ultimo_ajuste_tarifas
    ? decodeURIComponent(req.cookies.ultimo_ajuste_tarifas)
    : null

  return res.status(200).json({
    grupos,
    temporadaActivaId: temporadaActiva?.Id ?? null,
    temporadas: temporadas.map(t => ({
      id:          t.Id,
      nombre:      t.Nombre,
      fechaInicio: toUTCDateStr(t.FechaInicio),
      fechaFin:    toUTCDateStr(t.FechaFin),
    })),
    ultimoAjuste,
  })
}
