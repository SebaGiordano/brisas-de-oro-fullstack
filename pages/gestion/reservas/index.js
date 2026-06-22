import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import Navbar from '@/components/gestion/Navbar'

export async function getServerSideProps(context) {
  const { req, res, query } = context
  const session = await getServerSession(req, res, authOptions)
  if (!session) return { redirect: { destination: '/login', permanent: false } }

  const {
    busqueda = '', estado = 'activas', estadoPago = '',
    desde = '', hasta = '', pagina = '1',
  } = query

  const proto  = req.headers['x-forwarded-proto'] ?? 'http'
  const host   = req.headers.host
  const params = new URLSearchParams({ busqueda, estado, estadoPago, desde, hasta, pagina })
  const apiUrl = `${proto}://${host}/api/gestion/reservas?${params}`

  const response = await fetch(apiUrl, { headers: { cookie: req.headers.cookie ?? '' } })
  const data     = response.ok ? await response.json() : { items: [], totalItems: 0, totalPaginas: 1, pagina: 1 }

  return {
    props: {
      user:      { id: session.user.id ?? null, userName: session.user.userName ?? null, rol: session.user.rol ?? null },
      data,
      filtros:   { busqueda, estado, estadoPago, desde, hasta },
      mensaje:   query.mensaje ?? null,
      mensajeTipo: query.tipo ?? 'success',
    },
  }
}

export default function ReservasIndex({ user, data, filtros, mensaje, mensajeTipo }) {
  const router   = useRouter()
  const { items = [], totalItems = 0, totalPaginas = 1, pagina = 1 } = data
  const esAdmin  = Number(user.rol) === 0
  const cancelRef = useRef(null)

  function buildQuery(extra = {}) {
    return new URLSearchParams({
      busqueda:   filtros.busqueda,
      estado:     filtros.estado,
      estadoPago: filtros.estadoPago,
      desde:      filtros.desde,
      hasta:      filtros.hasta,
      pagina:     pagina,
      ...extra,
    }).toString()
  }

  function pageLink(p) { return `/gestion/reservas?${buildQuery({ pagina: p })}` }

  function handleFiltrar(e) {
    e.preventDefault()
    const f = e.currentTarget
    const q = new URLSearchParams({
      busqueda:   f.busqueda.value,
      estado:     f.estado?.value ?? filtros.estado,
      estadoPago: f.estadoPago.value,
      desde:      f.desde?.value ?? '',
      hasta:      f.hasta?.value ?? '',
      pagina:     1,
    })
    router.push(`/gestion/reservas?${q}`)
  }

  useEffect(() => {
    // Autocomplete
    const input = document.getElementById('input-busqueda-reservas')
    if (!input) return

    const wrapper  = document.createElement('div')
    wrapper.style.position = 'relative'
    input.parentNode.insertBefore(wrapper, input)
    wrapper.appendChild(input)

    const dropdown = document.createElement('ul')
    dropdown.className = 'ac-dropdown'
    dropdown.setAttribute('role', 'listbox')
    wrapper.appendChild(dropdown)

    let debounce
    input.addEventListener('input', () => {
      clearTimeout(debounce)
      const q = input.value.trim()
      if (q.length < 1) { dropdown.style.display = 'none'; return }
      debounce = setTimeout(async () => {
        try {
          const res   = await fetch(`/api/gestion/reservas/titulares?q=${encodeURIComponent(q)}`)
          const items = await res.json()
          renderDropdown(items)
        } catch { dropdown.style.display = 'none' }
      }, 220)
    })

    function renderDropdown(items) {
      dropdown.innerHTML = ''
      if (!items.length) { dropdown.style.display = 'none'; return }
      items.forEach(nombre => {
        const li = document.createElement('li')
        li.setAttribute('role', 'option')
        li.textContent = nombre
        li.addEventListener('mousedown', e => {
          e.preventDefault()
          input.value = nombre
          dropdown.style.display = 'none'
        })
        dropdown.appendChild(li)
      })
      dropdown.style.display = 'block'
    }

    input.addEventListener('keydown', e => {
      const its = [...dropdown.querySelectorAll('li')]
      const idx = its.findIndex(li => li.classList.contains('ac-active'))
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        its.forEach(li => li.classList.remove('ac-active'))
        its[idx < its.length - 1 ? idx + 1 : 0]?.classList.add('ac-active')
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        its.forEach(li => li.classList.remove('ac-active'))
        its[idx > 0 ? idx - 1 : its.length - 1]?.classList.add('ac-active')
      } else if (e.key === 'Enter') {
        const active = dropdown.querySelector('li.ac-active')
        if (active && dropdown.style.display !== 'none') {
          e.preventDefault()
          input.value = active.textContent
          dropdown.style.display = 'none'
        }
      } else if (e.key === 'Escape') {
        dropdown.style.display = 'none'
      }
    })

    document.addEventListener('click', e => {
      if (!wrapper.contains(e.target)) dropdown.style.display = 'none'
    })
  }, [])

  // Cancel modal
  function abrirCancelar(id, nombre) {
    cancelRef.current = id
    document.getElementById('modal-cancelar-nombre').textContent = nombre
    window.bootstrap?.Modal.getOrCreateInstance(document.getElementById('modal-cancelar-reserva')).show()
  }

  async function confirmarCancelar() {
    const id = cancelRef.current
    window.bootstrap?.Modal.getInstance(document.getElementById('modal-cancelar-reserva'))?.hide()
    if (!id) return
    const res = await fetch(`/api/gestion/reservas/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancelar' }),
    })
    if (res.ok) {
      router.replace(`/gestion/reservas?${buildQuery()}&mensaje=Reserva+cancelada&tipo=success`)
    }
  }

  const ESTADO_OPTS = [
    ['activas',    'Todas (sin canceladas)'],
    ['proximas',   'Próximas a ingresar'],
    ['en-curso',   'En curso'],
    ['historicas', 'Históricas'],
    ['Cancelada',  'Canceladas'],
    ['todas',      'Todas (incluye canceladas)'],
  ]
  const PAGO_OPTS = [
    ['',           'Todos'],
    ['sin-sena',   'Sin seña'],
    ['senado',     'Señado'],
    ['saldado',    'Saldado al 100%'],
    ['invitacion', 'Invitación'],
  ]

  const TIPO_ALOJ = { 0: 'Cabaña', 1: 'Habitación', 2: 'Apart' }

  return (
    <>
      <Head><title>Reservas — Brisas de Oro</title></Head>
      <Navbar user={user} />
      <style jsx global>{`
        .badge-pago { display: inline-block; padding: .3em .65em; font-size: .8em; font-weight: 600; border-radius: 4px; white-space: nowrap; }
        .pago-sin-sena   { background-color: #FFCCCC; color: #7A0000; }
        .pago-senado     { background-color: #FFF3CC; color: #7A5F00; }
        .pago-pagado     { background-color: #CCFFCC; color: #1A5C1A; }
        .pago-invitacion { background-color: #E0E0E0; color: #333333; }
        .table > :not(caption) > * > * { vertical-align: middle; }
        .col-titular-res .fw-semibold { font-weight: bold !important; }
        .col-saldo-res { font-weight: bold !important; color: #dc3545 !important; }
        .col-saldo-negativo { background-color: #fde8e8 !important; }
        .ac-dropdown {
          position: absolute; top: 100%; left: 0; right: 0; z-index: 1050;
          background: #fff; border: 1px solid #ced4da; border-top: none;
          border-radius: 0 0 .375rem .375rem; max-height: 280px; overflow-y: auto;
          display: none; box-shadow: 0 4px 8px rgba(0,0,0,.08);
        }
        .ac-dropdown li { padding: .35rem .6rem; font-size: .875rem; cursor: pointer; list-style: none; }
        .ac-dropdown li:hover, .ac-dropdown li.ac-active { background-color: #e9f0ff; color: #0d47a1; }
        @media (max-width: 767.98px) {
          .tabla-reservas-responsive { overflow-x: auto; overflow-y: auto; max-height: 400px; -webkit-overflow-scrolling: touch; }
          .tabla-reservas-responsive table { min-width: 900px; }
          .tabla-reservas-responsive td, .tabla-reservas-responsive th { white-space: nowrap; }
          .btn { display: inline-flex !important; align-items: center; justify-content: center; }
          #filtros-reservas-row > div:nth-child(6),
          #filtros-reservas-row > div:nth-child(7) { flex: 1 !important; }
          #filtros-reservas-row > div:nth-child(6) .btn,
          #filtros-reservas-row > div:nth-child(7) .btn { width: 100% !important; display: flex !important; }
          #modal-cancelar-reserva .modal-dialog  { min-height: unset !important; }
          #modal-cancelar-reserva .modal-content { height: auto !important; min-height: unset !important; max-height: 90vh !important; }
          #modal-cancelar-reserva .modal-footer  { padding-bottom: .75rem !important; }
          .tabla-reservas-responsive td.text-center { vertical-align: middle; }
          .tabla-reservas-responsive thead { position: sticky; top: 0; z-index: 4; }
          .tabla-reservas-responsive thead th { background-color: #212529 !important; }
          .col-titular-res { position: sticky; left: 0; z-index: 2; background-color: #fff !important; box-shadow: 3px 0 6px -2px rgba(0,0,0,.15); border-bottom: 1px solid #dee2e6 !important; }
          thead .col-titular-res { z-index: 3; background-color: #212529 !important; }
          .titular-saldo-negativo { background-color: #fde8e8 !important; }
        }
        @media (min-width: 769px) {
          #filtros-reservas-row { flex-wrap: nowrap !important; }
          #filtros-reservas-row > div:not(.col-auto) { flex: 1 !important; min-width: 0 !important; }
        }
      `}</style>

      <div className="container">
        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="mb-0">Reservas</h2>
            {totalItems > 0 && (
              <small className="text-muted">{totalItems} resultado{totalItems !== 1 ? 's' : ''}</small>
            )}
          </div>
          <Link href="/gestion/reservas/nueva?from=listado" className="btn btn-primary">
            <i className="bi bi-plus-lg me-1"></i>Nueva reserva
          </Link>
        </div>

        {/* Mensajes */}
        {mensaje && (
          <div className={`alert alert-${mensajeTipo} alert-dismissible fade show`} role="alert">
            <i className={`bi bi-${mensajeTipo === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
            {mensaje}
            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
          </div>
        )}

        {/* Filtros */}
        <form className="card mb-3" onSubmit={handleFiltrar}>
          <div className="card-body">
            <div id="filtros-reservas-row" className="row g-2 align-items-end">
              <div className="col-12 col-sm-6 col-md-2">
                <label className="form-label small fw-semibold mb-1">Buscar por nombre</label>
                <input type="text" id="input-busqueda-reservas" name="busqueda"
                  defaultValue={filtros.busqueda}
                  className="form-control" placeholder="Titular..." autoComplete="off" />
              </div>
              <div className="col-12 col-sm-6 col-md-2 d-mobile-none">
                <label className="form-label small fw-semibold mb-1">Ingreso desde</label>
                <input type="date" name="desde" defaultValue={filtros.desde} className="form-control" />
              </div>
              <div className="col-12 col-sm-6 col-md-2 d-mobile-none">
                <label className="form-label small fw-semibold mb-1">Ingreso hasta</label>
                <input type="date" name="hasta" defaultValue={filtros.hasta} className="form-control" />
              </div>
              <div className="col-12 col-sm-6 col-md-2 d-mobile-none">
                <label className="form-label small fw-semibold mb-1">Estado de reserva</label>
                <select name="estado" className="form-select" defaultValue={filtros.estado}>
                  {ESTADO_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div className="col-12 col-sm-6 col-md-2">
                <label className="form-label small fw-semibold mb-1">Estado de pago</label>
                <select name="estadoPago" className="form-select" defaultValue={filtros.estadoPago}>
                  {PAGO_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div className="col-auto">
                <button type="submit" className="btn btn-outline-primary">
                  <i className="bi bi-funnel me-1"></i>Filtrar
                </button>
              </div>
              <div className="col-auto">
                <Link href="/gestion/reservas" className="btn btn-outline-secondary">
                  <i className="bi bi-x-lg me-1"></i>Limpiar
                </Link>
              </div>
            </div>
          </div>
        </form>

        {/* Tabla */}
        {items.length === 0 ? (
          <div className="card">
            <div className="card-body text-center text-muted py-5">
              <i className="bi bi-calendar-x fs-1 d-block mb-2 opacity-50"></i>
              No hay reservas registradas para los filtros seleccionados.
            </div>
          </div>
        ) : (
          <>
            <div className="table-responsive tabla-reservas-responsive">
              <table className="table table-sm table-hover table-bordered align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th className="col-titular-res">Titular</th>
                    <th>Alojamiento</th>
                    <th className="text-center">Ingreso</th>
                    <th className="text-center">Egreso</th>
                    <th className="text-center">Noches</th>
                    <th className="text-center">Pers.</th>
                    <th className="text-center">Desayuno</th>
                    <th className="text-end">Total</th>
                    <th className="text-end">Cobrado</th>
                    <th className="text-end">Saldo pendiente</th>
                    <th className="text-center">Estado pago</th>
                    <th className="text-center">Estado</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => {
                    const cancelada = item.estado === 2
                    const estadoBadge = item.estado === 0 ? ['bg-success', 'Confirmada']
                      : item.estado === 1 ? ['bg-secondary', 'Finalizada']
                      : ['bg-danger', 'Cancelada']
                    return (
                      <tr key={item.id} className={cancelada ? 'table-secondary text-muted' : ''}>
                        <td className={`col-titular-res${item.saldoPendiente < 0 ? ' titular-saldo-negativo' : ''}`}>
                          <span className="fw-semibold">{item.nombreHuesped}</span>
                          {item.esInvitacion && (
                            <><br /><small className="text-muted"><i className="bi bi-gift me-1"></i>Invitación</small></>
                          )}
                        </td>
                        <td>{item.nombreAlojamiento}</td>
                        <td className="text-center text-nowrap">{item.fechaIngreso.split('-').reverse().join('/')}</td>
                        <td className="text-center text-nowrap">{item.fechaSalida.split('-').reverse().join('/')}</td>
                        <td className="text-center">{item.cantidadNoches}</td>
                        <td className="text-center">{item.cantidadHuespedes}</td>
                        <td className="text-center">
                          {item.incluyeDesayuno
                            ? <i className="bi bi-check-circle-fill text-success" title="Incluye desayuno"></i>
                            : <i className="bi bi-x-circle-fill text-danger" title="No incluye desayuno"></i>}
                        </td>
                        <td className="text-end text-nowrap">${item.montoTotal.toLocaleString('es-AR')}</td>
                        <td className="text-end text-nowrap">${item.totalCobrado.toLocaleString('es-AR')}</td>
                        <td className={`text-end text-nowrap col-saldo-res${item.saldoPendiente < 0 ? ' col-saldo-negativo' : ''}`}>
                          ${item.saldoPendiente.toLocaleString('es-AR')}
                        </td>
                        <td className="text-center">
                          <span className={`badge-pago ${item.estadoPagoClase}`}>{item.estadoPagoTexto}</span>
                        </td>
                        <td className="text-center">
                          <span className={`badge ${estadoBadge[0]}`}>{estadoBadge[1]}</span>
                        </td>
                        <td className="text-center text-nowrap">
                          <Link href={`/gestion/reservas/${item.id}`}
                            className="btn btn-outline-secondary btn-sm" title="Ver detalle">
                            <i className="bi bi-eye"></i>
                          </Link>
                          {esAdmin && (
                            <Link href={`/gestion/reservas/editar/${item.id}?from=listado`}
                              className="btn btn-outline-primary btn-sm ms-1" title="Editar">
                              <i className="bi bi-pencil"></i>
                            </Link>
                          )}
                          {esAdmin && !cancelada && (
                            <button type="button"
                              className="btn btn-outline-danger btn-sm ms-1"
                              title="Cancelar reserva"
                              onClick={() => abrirCancelar(item.id, item.nombreHuesped)}>
                              <i className="bi bi-x-circle"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="d-md-none text-center text-muted" style={{ fontSize: 11, marginTop: 6 }}>
              ← Deslizá para ver más →
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <nav className="mt-3" aria-label="Páginas">
                <ul className="pagination pagination-sm justify-content-center mb-0">
                  <li className={`page-item ${pagina === 1 ? 'disabled' : ''}`}>
                    <Link className="page-link" href={pageLink(pagina - 1)}>‹</Link>
                  </li>
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(i => (
                    <li key={i} className={`page-item ${i === pagina ? 'active' : ''}`}>
                      <Link className="page-link" href={pageLink(i)}>{i}</Link>
                    </li>
                  ))}
                  <li className={`page-item ${pagina === totalPaginas ? 'disabled' : ''}`}>
                    <Link className="page-link" href={pageLink(pagina + 1)}>›</Link>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}

        {/* Modal cancelación */}
        <div className="modal fade" id="modal-cancelar-reserva" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-semibold">Cancelar reserva</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">¿Estás seguro que querés cancelar la reserva de{' '}
                  <strong id="modal-cancelar-nombre"></strong>? Esta acción no se puede deshacer.</p>
              </div>
              <div className="modal-footer">
                <div className="d-flex gap-2 w-100">
                  <button type="button" className="btn btn-secondary flex-fill" data-bs-dismiss="modal">No, volver</button>
                  <button type="button" className="btn btn-danger flex-fill" onClick={confirmarCancelar}>
                    Sí, cancelar reserva
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
