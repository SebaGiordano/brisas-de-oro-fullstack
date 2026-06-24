import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import Navbar from '@/components/gestion/Navbar'

export async function getServerSideProps(context) {
  const { req, res, params } = context
  const session = await getServerSession(req, res, authOptions)
  if (!session) return { redirect: { destination: '/login', permanent: false } }
  if (Number(session.user.rol) !== 0) return { redirect: { destination: '/gestion/inicio', permanent: false } }

  const proto  = req.headers['x-forwarded-proto'] ?? 'http'
  const host   = req.headers.host
  const apiUrl = `${proto}://${host}/api/gestion/tarifas/${params.id}`
  const response = await fetch(apiUrl, { headers: { cookie: req.headers.cookie ?? '' } })
  if (!response.ok) return { notFound: true }

  return {
    props: {
      user: { id: session.user.id ?? null, userName: session.user.userName ?? null, rol: session.user.rol ?? null },
      data: await response.json(),
    },
  }
}

export default function EditarTarifa({ user, data }) {
  const router = useRouter()
  const [precioConDesayuno, setPrecioConDesayuno] = useState(data.precioConDesayuno)
  const [precioSinDesayuno, setPrecioSinDesayuno] = useState(data.precioSinDesayuno)
  const [errores, setErrores] = useState([])

  async function handleSubmit(e) {
    e.preventDefault()

    const cd = parseFloat(precioConDesayuno)
    const sd = parseFloat(precioSinDesayuno)
    const erroresLocal = []
    if (isNaN(cd) || cd < 0) erroresLocal.push('El precio con desayuno debe ser mayor o igual a 0.')
    if (isNaN(sd) || sd < 0) erroresLocal.push('El precio sin desayuno debe ser mayor o igual a 0.')
    if (erroresLocal.length) { setErrores(erroresLocal); return }

    try {
      const res = await fetch(`/api/gestion/tarifas/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ precioConDesayuno: cd, precioSinDesayuno: sd }),
      })
      const d = await res.json()
      if (res.ok) {
        router.push('/gestion/tarifas?mensaje=Tarifa+actualizada&tipo=success')
      } else {
        setErrores(d.errores ?? ['Error al actualizar la tarifa.'])
      }
    } catch {
      setErrores(['Error de red. Intentá nuevamente.'])
    }
  }

  return (
    <>
      <Head><title>Editar tarifa — {data.nombreAlojamiento} — Brisas de Oro</title></Head>
      <Navbar user={user} />

      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Editar tarifa</h2>
          <Link href="/gestion/tarifas" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i>Volver al listado
          </Link>
        </div>

        <div className="card" style={{ maxWidth: 420 }}>
          <div className="card-body">

            {errores.length > 0 && (
              <div className="alert alert-danger">
                <strong>Corregí los siguientes errores:</strong>
                <ul className="mb-0 mt-1">
                  {errores.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}

            {/* Alojamiento, temporada y personas — solo lectura */}
            <div className="mb-3">
              <label className="form-label">Alojamiento</label>
              <input type="text" className="form-control" value={data.nombreAlojamiento}
                disabled style={{ backgroundColor: '#f8f9fa' }} />
            </div>

            <div className="mb-3">
              <label className="form-label">Temporada</label>
              <input type="text" className="form-control" value={data.nombreTemporada}
                disabled style={{ backgroundColor: '#f8f9fa' }} />
            </div>

            <div className="mb-3">
              <label className="form-label">Personas</label>
              <input type="text" className="form-control"
                value={`${data.cantidadPersonas} ${data.cantidadPersonas === 1 ? 'persona' : 'personas'}`}
                disabled style={{ backgroundColor: '#f8f9fa' }} />
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Precio con desayuno */}
              <div className="mb-3">
                <label htmlFor="PrecioConDesayuno" className="form-label">
                  Precio con desayuno <span className="text-danger">*</span>
                </label>
                <div className="input-group" style={{ maxWidth: 220 }}>
                  <span className="input-group-text">$</span>
                  <input id="PrecioConDesayuno" type="number" className="form-control"
                    min="0" step="1" placeholder="0"
                    value={precioConDesayuno} onChange={e => setPrecioConDesayuno(e.target.value)} />
                </div>
              </div>

              {/* Precio sin desayuno */}
              <div className="mb-4">
                <label htmlFor="PrecioSinDesayuno" className="form-label">
                  Precio sin desayuno <span className="text-danger">*</span>
                </label>
                <div className="input-group" style={{ maxWidth: 220 }}>
                  <span className="input-group-text">$</span>
                  <input id="PrecioSinDesayuno" type="number" className="form-control"
                    min="0" step="1" placeholder="0"
                    value={precioSinDesayuno} onChange={e => setPrecioSinDesayuno(e.target.value)} />
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary px-4">
                  <i className="bi bi-check-lg me-1"></i>Guardar cambios
                </button>
                <Link href="/gestion/tarifas" className="btn btn-outline-secondary">Cancelar</Link>
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  )
}
