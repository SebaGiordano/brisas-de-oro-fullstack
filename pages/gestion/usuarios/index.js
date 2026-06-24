import Head from 'next/head'
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import Navbar from '@/components/gestion/Navbar'
import Footer from '@/components/gestion/Footer'

export async function getServerSideProps(context) {
  const { req, res, query } = context
  const session = await getServerSession(req, res, authOptions)
  if (!session) return { redirect: { destination: '/login', permanent: false } }
  if (Number(session.user.rol) !== 0) return { redirect: { destination: '/gestion/inicio', permanent: false } }

  const proto  = req.headers['x-forwarded-proto'] ?? 'http'
  const host   = req.headers.host
  const apiUrl = `${proto}://${host}/api/gestion/usuarios`
  const response = await fetch(apiUrl, { headers: { cookie: req.headers.cookie ?? '' } })
  const items = response.ok ? await response.json() : []

  return {
    props: {
      user: { id: session.user.id ?? null, userName: session.user.userName ?? null, rol: session.user.rol ?? null },
      items,
      mensaje: query.mensaje ?? null,
      mensajeTipo: query.tipo ?? 'success',
    },
  }
}

export default function UsuariosIndex({ user, items, mensaje, mensajeTipo }) {
  async function toggleActivo(id, activoActual, userName) {
    if (activoActual) {
      if (!confirm(`¿Desactivar al usuario ${userName}? No podrá iniciar sesión hasta que sea reactivado.`)) return
    }
    const res = await fetch('/api/gestion/usuarios/activar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, activo: !activoActual }),
    })
    if (res.ok) {
      window.location.reload()
    } else {
      const d = await res.json()
      alert(d.error ?? 'No se pudo actualizar el usuario.')
    }
  }

  return (
    <>
      <Head><title>Usuarios — Brisas de Oro</title></Head>
      <Navbar user={user} />
      <style jsx global>{`
        @media (max-width: 767.98px) {
            .tabla-usr-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; }
            .tabla-usr-responsive table { min-width: 520px; }
            .tabla-usr-responsive td,
            .tabla-usr-responsive th { white-space: nowrap; padding: 0.5rem 0.6rem; text-align: center; vertical-align: middle; }
            .tabla-usr-responsive td:first-child,
            .tabla-usr-responsive th:first-child { text-align: left; }
            .tabla-usr-responsive td.text-center {
                display: table-cell;
                vertical-align: middle;
            }
            .tabla-usr-responsive thead { position: sticky; top: 0; z-index: 4; }
            .tabla-usr-responsive thead th { background-color: #212529 !important; }
            .col-usuario-sticky {
                position: sticky; left: 0; z-index: 2;
                background-color: #fff !important;
                box-shadow: 3px 0 6px -2px rgba(0,0,0,.15);
            }
            thead .col-usuario-sticky { z-index: 5; background-color: #212529 !important; }
            .btn { display: inline-flex !important; align-items: center; justify-content: center; }
            .badge { display: inline-flex !important; align-items: center; justify-content: center; }
            .tabla-usr-responsive td.text-center { vertical-align: middle; }
        }
      `}</style>

      <div className="container">
        {/* ── Encabezado ── */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Usuarios</h2>
          <Link href="/gestion/usuarios/crear" className="btn btn-primary">
            <i className="bi bi-person-plus me-1"></i>Nuevo usuario
          </Link>
        </div>

        {/* ── Mensajes ── */}
        {mensaje && (
          <div className={`alert alert-${mensajeTipo} alert-dismissible fade show`} role="alert">
            <i className={`bi bi-${mensajeTipo === 'success' ? 'check-circle' : mensajeTipo === 'warning' ? 'exclamation-triangle' : 'info-circle'} me-2`}></i>
            {mensaje}
            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
          </div>
        )}

        {/* ── Tabla ── */}
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive tabla-usr-responsive">
              <table className="table table-sm table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th className="col-usuario-sticky">Usuario</th>
                    <th className="text-center">Rol</th>
                    <th>Celular</th>
                    <th className="text-center">Alta</th>
                    <th className="text-center">Estado</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(u => (
                    <tr key={u.id} className={!u.activo ? 'table-secondary text-muted' : ''}>
                      <td className="col-usuario-sticky">
                        <span className="fw-semibold">{u.userName}</span>
                        {u.esUsuarioActual && (
                          <span className="badge bg-secondary ms-1 small">vos</span>
                        )}
                      </td>
                      <td className="text-center">
                        {u.rol === 'Administrador'
                          ? <span className="badge bg-danger">Administrador</span>
                          : <span className="badge bg-secondary">{u.rol}</span>}
                      </td>
                      <td>{u.phoneNumber ?? '—'}</td>
                      <td className="text-center text-nowrap text-muted small">
                        {u.fechaCreacion ?? '—'}
                      </td>
                      <td className="text-center">
                        {u.activo
                          ? <span className="badge bg-success">Activo</span>
                          : <span className="badge bg-danger">Inactivo</span>}
                      </td>
                      <td className="text-center text-nowrap">
                        <Link href={`/gestion/usuarios/editar/${u.id}`} className="btn btn-outline-primary btn-sm" title="Editar">
                          <i className="bi bi-pencil"></i>
                        </Link>
                        {!u.esUsuarioActual && (
                          u.activo ? (
                            <button type="button" className="btn btn-outline-danger btn-sm" title="Desactivar"
                              onClick={() => toggleActivo(u.id, u.activo, u.userName)}>
                              <i className="bi bi-person-x"></i>
                            </button>
                          ) : (
                            <button type="button" className="btn btn-outline-success btn-sm" title="Activar"
                              onClick={() => toggleActivo(u.id, u.activo, u.userName)}>
                              <i className="bi bi-person-check"></i>
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-md-none text-center text-muted" style={{ fontSize: 11, marginTop: 6 }}>← Deslizá para ver más →</div>
          </div>
        </div>
        <div className="text-muted small mt-2">
          {items.length} usuario{items.length !== 1 ? 's' : ''} registrado{items.length !== 1 ? 's' : ''}
        </div>
      </div>
      <Footer />
    </>
  )
}
