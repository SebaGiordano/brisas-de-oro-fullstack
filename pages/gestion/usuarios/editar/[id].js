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
  const apiUrl = `${proto}://${host}/api/gestion/usuarios/${params.id}`
  const response = await fetch(apiUrl, { headers: { cookie: req.headers.cookie ?? '' } })
  if (!response.ok) return { notFound: true }

  return {
    props: {
      user: { id: session.user.id ?? null, userName: session.user.userName ?? null, rol: session.user.rol ?? null },
      data: await response.json(),
    },
  }
}

export default function EditarUsuario({ user, data }) {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber ?? '')
  const [rol, setRol] = useState(data.rol)
  const [errores, setErrores] = useState([])

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const res = await fetch(`/api/gestion/usuarios/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, rol }),
      })
      const d = await res.json()
      if (res.ok) {
        router.push('/gestion/usuarios?mensaje=Usuario+actualizado&tipo=success')
      } else {
        setErrores(d.errores ?? ['Error al actualizar el usuario.'])
      }
    } catch {
      setErrores(['Error de red. Intentá nuevamente.'])
    }
  }

  return (
    <>
      <Head><title>Editar usuario — {data.userName} — Brisas de Oro</title></Head>
      <Navbar user={user} />
      <style jsx global>{`
        @media (max-width: 767.98px) {
          #btns-editar-usr { justify-content: center !important; }
        }
        @media (min-width: 769px) {
          #btns-editar-usr { justify-content: center !important; }
        }
      `}</style>

      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Editar usuario</h2>
          <Link href="/gestion/usuarios" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i>Volver al listado
          </Link>
        </div>

        <div className="card" style={{ maxWidth: 540 }}>
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
              <div className="mb-3">
                <label className="form-label">Nombre de usuario</label>
                <input type="text" className="form-control" value={data.userName}
                  disabled style={{ backgroundColor: '#f8f9fa' }} />
                <div className="form-text text-muted">El nombre de usuario no se puede modificar.</div>
              </div>

              <div className="mb-3">
                <label htmlFor="PhoneNumber" className="form-label">Número de celular</label>
                <input id="PhoneNumber" className="form-control" placeholder="ej: 11 1234-5678"
                  value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
              </div>

              <div className="mb-4">
                <label htmlFor="Rol" className="form-label">
                  Rol <span className="text-danger">*</span>
                </label>
                <select id="Rol" className="form-select" value={rol} onChange={e => setRol(e.target.value)}>
                  <option value="Administrador">Administrador</option>
                  <option value="Viewer">Viewer</option>
                </select>
                <div className="form-text text-muted">
                  <strong>Administrador:</strong> acceso completo.{' '}
                  <strong>Viewer:</strong> solo lectura.
                </div>
              </div>

              <div id="btns-editar-usr" className="d-flex gap-2">
                <button type="submit" className="btn btn-primary px-4">
                  <i className="bi bi-check-lg me-1"></i>Guardar cambios
                </button>
                <Link href="/gestion/usuarios" className="btn btn-outline-secondary">Cancelar</Link>
              </div>
            </form>

          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
