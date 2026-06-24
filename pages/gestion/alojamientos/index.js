import Head from 'next/head'
import Link from 'next/link'
import { useEffect } from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import Navbar from '@/components/gestion/Navbar'
import Footer from '@/components/gestion/Footer'

export async function getServerSideProps(context) {
  const { req, res, query } = context
  const session = await getServerSession(req, res, authOptions)
  if (!session) return { redirect: { destination: '/login', permanent: false } }

  const proto  = req.headers['x-forwarded-proto'] ?? 'http'
  const host   = req.headers.host
  const apiUrl = `${proto}://${host}/api/gestion/alojamientos`
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

const NOMBRE_TIPO = { 0: 'Cabaña', 1: 'Habitación', 2: 'Apart' }
const CLASE_TIPO  = { 0: 'bg-success', 1: 'bg-primary', 2: 'bg-info text-dark' }
const TIPO_KEY    = { 0: 'Cabaña', 1: 'Habitacion', 2: 'Apart' }

export default function AlojamientosIndex({ user, items, mensaje, mensajeTipo }) {
  const esAdmin = Number(user.rol) === 0

  useEffect(() => {
    const botones = document.querySelectorAll('.filtro-tipo-aloj')
    const filas   = document.querySelectorAll('tbody tr[data-tipo]')

    function onClick(e) {
      const btn = e.currentTarget
      const filtro = btn.dataset.filtro
      botones.forEach(b => { b.className = 'btn btn-outline-secondary btn-sm filtro-tipo-aloj' })
      btn.className = 'btn btn-primary btn-sm filtro-tipo-aloj active'
      filas.forEach(tr => {
        tr.style.display = (!filtro || tr.dataset.tipo === filtro) ? '' : 'none'
      })
    }

    botones.forEach(btn => btn.addEventListener('click', onClick))
    return () => botones.forEach(btn => btn.removeEventListener('click', onClick))
  }, [])

  async function toggleActivo(id, activoActual, nombre) {
    if (activoActual) {
      if (!confirm(`¿Desactivar ${nombre}? No aparecerá en el formulario de nueva reserva.`)) return
    }
    const res = await fetch('/api/gestion/alojamientos/activar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, activo: !activoActual }),
    })
    if (res.ok) window.location.reload()
  }

  const totalActivos = items.filter(a => a.activo).length

  return (
    <>
      <Head><title>Alojamientos — Brisas de Oro</title></Head>
      <Navbar user={user} />
      <style jsx global>{`
        .filtro-tipo-aloj { transition: background-color .15s ease, color .15s ease, border-color .15s ease; }
        .filtro-tipo-aloj.active {
            background-color: #0d6efd !important;
            border-color: #0d6efd !important;
        }
        @media (max-width: 767.98px) {
            .tabla-aloj-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; }
            .tabla-aloj-responsive td,
            .tabla-aloj-responsive th { white-space: nowrap; padding: 0.5rem 0.6rem; }
            .filtros-aloj-sticky {
                flex-wrap: nowrap !important; overflow-x: auto;
            }
            .filtros-aloj-sticky .filtro-tipo-aloj {
                font-size: 11px; padding: 3px 8px; white-space: nowrap; flex-shrink: 0;
            }
            .filtros-aloj-sticky .text-muted { flex-shrink: 0; font-size: 11px; }
            .tabla-aloj-responsive .btn { display: inline-flex !important; align-items: center; justify-content: center; }
        }
      `}</style>

      <div className="container">
        {/* ── Encabezado ── */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Alojamientos</h2>
        </div>

        {/* ── Filtro por tipo ── */}
        <div className="d-flex align-items-center gap-2 flex-wrap mb-3 filtros-aloj-sticky">
          <span className="text-muted small fw-semibold">Filtrar por tipo:</span>
          <button type="button" className="btn btn-primary btn-sm filtro-tipo-aloj active" data-filtro="">Todos</button>
          <button type="button" className="btn btn-outline-secondary btn-sm filtro-tipo-aloj" data-filtro="Habitacion">Habitación</button>
          <button type="button" className="btn btn-outline-secondary btn-sm filtro-tipo-aloj" data-filtro="Apart">Apart</button>
          <button type="button" className="btn btn-outline-secondary btn-sm filtro-tipo-aloj" data-filtro="Cabaña">Cabaña</button>
        </div>

        {/* ── Mensajes ── */}
        {mensaje && (
          <div className={`alert alert-${mensajeTipo} alert-dismissible fade show`} role="alert">
            <i className={`bi bi-${mensajeTipo === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
            {mensaje}
            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
          </div>
        )}

        {/* ── Tabla ── */}
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive tabla-aloj-responsive">
              <table className="table table-sm table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Nombre</th>
                    <th className="text-center">Tipo</th>
                    <th className="text-center">Capacidad</th>
                    <th className="text-center">Estado</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(a => (
                    <tr key={a.id} className={!a.activo ? 'table-secondary text-muted' : ''} data-tipo={TIPO_KEY[a.tipo]}>
                      <td className="fw-semibold">{a.nombre}</td>
                      <td className="text-center">
                        <span className={`badge ${CLASE_TIPO[a.tipo]}`}>{NOMBRE_TIPO[a.tipo]}</span>
                      </td>
                      <td className="text-center">{a.capacidad} personas</td>
                      <td className="text-center">
                        {a.activo
                          ? <span className="badge bg-success">Activo</span>
                          : <span className="badge bg-danger">Inactivo</span>}
                      </td>
                      <td className="text-center text-nowrap">
                        <Link href={`/gestion/alojamientos/editar/${a.id}`} className="btn btn-outline-primary btn-sm" title="Editar">
                          <i className="bi bi-pencil"></i>
                        </Link>
                        {esAdmin && (
                          a.activo ? (
                            <button type="button" className="btn btn-outline-warning btn-sm" title="Desactivar"
                              onClick={() => toggleActivo(a.id, a.activo, a.nombre)}>
                              <i className="bi bi-eye-slash"></i>
                            </button>
                          ) : (
                            <button type="button" className="btn btn-outline-success btn-sm" title="Activar"
                              onClick={() => toggleActivo(a.id, a.activo, a.nombre)}>
                              <i className="bi bi-eye"></i>
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
          {items.length} alojamiento{items.length !== 1 ? 's' : ''} registrado{items.length !== 1 ? 's' : ''}
          {' '}· {totalActivos} activo{totalActivos !== 1 ? 's' : ''}
        </div>
      </div>
      <Footer />
    </>
  )
}
