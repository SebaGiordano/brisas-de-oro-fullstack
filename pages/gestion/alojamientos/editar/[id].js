import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import Navbar from '@/components/gestion/Navbar'
import Footer from '@/components/gestion/Footer'

export async function getServerSideProps(context) {
  const { req, res, params } = context
  const session = await getServerSession(req, res, authOptions)
  if (!session) return { redirect: { destination: '/login', permanent: false } }
  if (Number(session.user.rol) !== 0) return { redirect: { destination: '/gestion/inicio', permanent: false } }

  const proto  = req.headers['x-forwarded-proto'] ?? 'http'
  const host   = req.headers.host
  const apiUrl = `${proto}://${host}/api/gestion/alojamientos/${params.id}`
  const response = await fetch(apiUrl, { headers: { cookie: req.headers.cookie ?? '' } })
  if (!response.ok) return { notFound: true }

  return {
    props: {
      user: { id: session.user.id ?? null, userName: session.user.userName ?? null, rol: session.user.rol ?? null },
      data: await response.json(),
    },
  }
}

const NOMBRE_TIPO = { 0: 'Cabaña', 1: 'Habitación', 2: 'Apart' }

export default function EditarAlojamiento({ user, data }) {
  const router = useRouter()
  const [nombre, setNombre]       = useState(data.nombre)
  const [capacidad, setCapacidad] = useState(data.capacidad)
  const [activo, setActivo]       = useState(data.activo)
  const [errores, setErrores]     = useState([])

  async function handleSubmit(e) {
    e.preventDefault()

    const erroresLocal = []
    if (!nombre.trim()) erroresLocal.push('El nombre es obligatorio.')
    const cap = parseInt(capacidad)
    if (isNaN(cap) || cap < 1 || cap > 100) erroresLocal.push('La capacidad debe estar entre 1 y 100.')
    if (erroresLocal.length) { setErrores(erroresLocal); return }

    try {
      const res = await fetch(`/api/gestion/alojamientos/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, capacidad: cap, activo }),
      })
      const d = await res.json()
      if (res.ok) {
        router.push('/gestion/alojamientos?mensaje=Alojamiento+actualizado&tipo=success')
      } else {
        setErrores(d.errores ?? ['Error al actualizar el alojamiento.'])
      }
    } catch {
      setErrores(['Error de red. Intentá nuevamente.'])
    }
  }

  return (
    <>
      <Head><title>Editar — {data.nombre} — Brisas de Oro</title></Head>
      <Navbar user={user} />

      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Editar alojamiento</h2>
          <Link href="/gestion/alojamientos" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i>Volver al listado
          </Link>
        </div>

        <div className="card" style={{ maxWidth: 480 }}>
          <div className="card-body">

            {errores.length > 0 && (
              <div className="alert alert-danger">
                <strong>Corregí los siguientes errores:</strong>
                <ul className="mb-0 mt-1">
                  {errores.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Tipo — solo lectura */}
              <div className="mb-3">
                <label className="form-label">Tipo</label>
                <input type="text" className="form-control" value={NOMBRE_TIPO[data.tipo] ?? data.tipo}
                  disabled style={{ backgroundColor: '#f8f9fa' }} />
                <div className="form-text text-muted">El tipo de alojamiento no se puede modificar.</div>
              </div>

              {/* Nombre */}
              <div className="mb-3">
                <label htmlFor="Nombre" className="form-label">
                  Nombre <span className="text-danger">*</span>
                </label>
                <input id="Nombre" className="form-control" placeholder="Ej: Cabaña 1"
                  value={nombre} onChange={e => setNombre(e.target.value)} />
              </div>

              {/* Capacidad */}
              <div className="mb-3">
                <label htmlFor="Capacidad" className="form-label">
                  Capacidad máxima <span className="text-danger">*</span>
                </label>
                <div className="input-group" style={{ maxWidth: 160 }}>
                  <input id="Capacidad" type="number" className="form-control" min="1" max="100"
                    value={capacidad} onChange={e => setCapacidad(e.target.value)} />
                  <span className="input-group-text" style={{ backgroundColor: '#e9ecef' }}>personas</span>
                </div>
              </div>

              {/* Estado */}
              <div className="mb-4">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="Activo" role="switch"
                    checked={activo} onChange={e => setActivo(e.target.checked)} />
                  <label className="form-check-label" htmlFor="Activo">
                    Alojamiento activo
                  </label>
                </div>
                <div className="form-text text-muted">
                  Los alojamientos inactivos no aparecen al crear nuevas reservas.
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary px-4">
                  <i className="bi bi-check-lg me-1"></i>Guardar cambios
                </button>
                <Link href="/gestion/alojamientos" className="btn btn-outline-secondary">Cancelar</Link>
              </div>
            </form>

          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
