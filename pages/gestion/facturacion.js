import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import Navbar from '@/components/gestion/Navbar'

export async function getServerSideProps(context) {
  const { req, res, query } = context
  const session = await getServerSession(req, res, authOptions)
  if (!session) return { redirect: { destination: '/login', permanent: false } }

  const {
    titular = '', titularSaldos = '', desde = '', hasta = '',
    metodoPago = '', concepto = '', orden = 'desc', tab = 'movimientos',
  } = query

  const proto  = req.headers['x-forwarded-proto'] ?? 'http'
  const host   = req.headers.host
  const params = new URLSearchParams({ titular, titularSaldos, desde, hasta, metodoPago, concepto, orden, tab })
  const apiUrl = `${proto}://${host}/api/gestion/facturacion?${params}`

  const response = await fetch(apiUrl, { headers: { cookie: req.headers.cookie ?? '' } })
  const data = response.ok
    ? await response.json()
    : { movimientos: [], totalPeriodo: 0, saldosPendientes: [], tab: 'movimientos' }

  return {
    props: {
      user: { id: session.user.id ?? null, userName: session.user.userName ?? null, rol: session.user.rol ?? null },
      data,
      filtros: { titular, titularSaldos, desde, hasta, metodoPago, concepto, orden },
      tabActiva: tab === 'saldos' ? 'saldos' : 'movimientos',
    },
  }
}

const TIPO_LABEL   = { 0: 'Seña', 1: 'Cancelación', 2: 'Ajuste / Corrección', 3: 'Pago parcial' }
const METODO_LABEL = { 0: 'Transferencia', 1: 'Efectivo', 2: 'Tarjeta crédito', 3: 'Tarjeta débito' }

export default function Facturacion({ user, data, filtros, tabActiva }) {
  const router  = useRouter()
  const esAdmin = Number(user.rol) === 0
  const { movimientos = [], totalPeriodo = 0, saldosPendientes = [] } = data

  function handleFiltrarMovimientos(e) {
    e.preventDefault()
    const f = e.currentTarget
    const q = new URLSearchParams({
      tab: 'movimientos',
      titular:    f.titular.value,
      desde:      f.desde?.value ?? '',
      hasta:      f.hasta?.value ?? '',
      metodoPago: f.metodoPago.value,
      concepto:   f.concepto.value,
      orden:      f.orden.value,
    })
    router.push(`/gestion/facturacion?${q}`)
  }

  function handleFiltrarSaldos(e) {
    e.preventDefault()
    const f = e.currentTarget
    const q = new URLSearchParams({
      tab: 'saldos',
      titularSaldos: f.titularSaldos.value,
    })
    router.push(`/gestion/facturacion?${q}`)
  }

  useEffect(() => {
    function initAutocomplete(inputId) {
      const input = document.getElementById(inputId)
      if (!input) return

      const wrapper = document.createElement('div')
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
            const res   = await fetch(`/api/gestion/facturacion/titulares?q=${encodeURIComponent(q)}`)
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
          li.addEventListener('pointerdown', e => {
            e.preventDefault()
            input.value = nombre
            dropdown.style.display = 'none'
          })
          dropdown.appendChild(li)
        })
        dropdown.style.display = 'block'
      }

      input.addEventListener('keydown', e => {
        const items     = [...dropdown.querySelectorAll('li')]
        const activeIdx = items.findIndex(li => li.classList.contains('ac-active'))

        if (e.key === 'ArrowDown') {
          e.preventDefault()
          const next = activeIdx < items.length - 1 ? activeIdx + 1 : 0
          items.forEach(li => li.classList.remove('ac-active'))
          items[next]?.classList.add('ac-active')
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          const prev = activeIdx > 0 ? activeIdx - 1 : items.length - 1
          items.forEach(li => li.classList.remove('ac-active'))
          items[prev]?.classList.add('ac-active')
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
    }

    initAutocomplete('input-titular-mov')
    initAutocomplete('input-titular-saldos')
  }, [])

  return (
    <>
      <Head><title>Facturación — Brisas de Oro</title></Head>
      <Navbar user={user} />
      <style jsx global>{`
        .badge-pago      { display: inline-block; padding: .35em .7em; font-size: .85em; font-weight: 600; border-radius: 4px; }
        .pago-sin-sena   { background-color: #FFCCCC; color: #7A0000; }
        .pago-senado     { background-color: #FFF3CC; color: #7A5F00; }
        .pago-pagado     { background-color: #CCFFCC; color: #1A5C1A; }
        .pago-invitacion { background-color: #E0E0E0; color: #333333; }
        @media (max-width: 767.98px) {
            /* Scroll horizontal en tablas */
            .tabla-fact-responsive { overflow-x: auto; overflow-y: auto; max-height: 400px; -webkit-overflow-scrolling: touch; }
            .tabla-fact-responsive table { min-width: 600px; }
            .tabla-mov table { min-width: 800px; }
            .tabla-fact-responsive td,
            .tabla-fact-responsive th { white-space: nowrap; }
            /* Botones centrados */
            .btn { display: inline-flex !important; align-items: center; justify-content: center; }
            /* Pestañas: se apoyan sobre el borde superior del bloque (sin separador adicional) */
            #facturacionTabs { display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; justify-content: center !important; width: 100% !important; margin-bottom: -1px !important; border-bottom: none !important; position: relative !important; z-index: 1 !important; }
            /* Bloque de contenido: borde completo en los cuatro lados */
            #facturacionTabsContent { border-top: 1px solid #dee2e6 !important; }
            /* Pestañas: cada botón ocupa mitad del ancho, texto en una línea */
            .nav-tabs .nav-link { display: inline-flex !important; align-items: center; gap: 4px; }
            #facturacionTabs .nav-link { display: flex !important; flex: 1 !important; justify-content: center !important; align-items: center !important; gap: 4px !important; font-size: 14px !important; padding: 10px .75rem !important; white-space: nowrap !important; }
            /* Botón activo: fondo azul sólido, z-index para cubrir el borde debajo */
            #facturacionTabs .nav-link.active { background-color: #0d6efd !important; color: #fff !important; border-color: #0d6efd !important; position: relative !important; z-index: 2 !important; }
            /* Font-size tabla movimientos */
            .tabla-mov table { font-size: 12px; }
            /* Encabezado fijo al hacer scroll vertical */
            .tabla-fact-responsive thead { position: sticky; top: 0; z-index: 4; }
            .tabla-fact-responsive thead th { background-color: #212529 !important; }
            /* Columnas fijas en tabla movimientos */
            .col-fecha-sticky {
                position: sticky; left: 0; z-index: 2;
                width: 52px !important; min-width: 52px !important; max-width: 52px !important;
                white-space: nowrap; padding-right: 4px !important;
                background-color: #fff !important;
                border-right: 1px solid #dee2e6 !important;
            }
            .col-titular-sticky {
                position: sticky; left: 52px; z-index: 2;
                width: 90px !important; min-width: 90px !important; max-width: 90px !important;
                overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                background-color: #fff !important;
                border-right: 2px solid #9db5c7 !important;
                box-shadow: 3px 0 6px -2px rgba(0,0,0,.15);
            }
            thead .col-fecha-sticky,
            thead .col-titular-sticky {
                z-index: 3;
                background-color: #212529 !important;
            }
            /* Monto total de saldos en negrita */
            #pane-saldos tfoot td.text-danger { font-weight: 700 !important; }
            /* Formulario Saldos: fila 1 = Titular, fila 2 = Filtrar + Limpiar al 50% */
            #pane-saldos form .row { flex-wrap: wrap !important; }
            #pane-saldos form .row > div:first-child { flex: 0 0 100% !important; width: 100% !important; max-width: 100% !important; }
            #input-titular-saldos { font-size: 16px !important; }
            #pane-saldos form .row > div:nth-child(2),
            #pane-saldos form .row > div:nth-child(3) { flex: 1 !important; }
            #pane-saldos form .row > div:nth-child(2) .btn,
            #pane-saldos form .row > div:nth-child(3) .btn { width: 100% !important; display: flex !important; }
            /* Formulario Movimientos: fila 1 = Titular, fila 2 = Método, fila 3 = Filtrar + Limpiar al 50% */
            #pane-movimientos form .row > div:first-child { flex: 0 0 100% !important; width: 100% !important; max-width: 100% !important; }
            #input-titular-mov { font-size: 16px !important; }
            #pane-movimientos form select[name="metodoPago"] { font-size: 16px !important; }
            #pane-movimientos form .row > div:nth-child(4) { flex: 0 0 100% !important; width: 100% !important; max-width: 100% !important; order: 2 !important; }
            #pane-movimientos form .row > div:nth-child(7),
            #pane-movimientos form .row > div:nth-child(8) { flex: 1 !important; order: 3 !important; }
            #pane-movimientos form .row > div:nth-child(7) .btn,
            #pane-movimientos form .row > div:nth-child(8) .btn { width: 100% !important; display: flex !important; }
            /* Autocompletado: scroll suave en iOS */
            .ac-dropdown { -webkit-overflow-scrolling: touch !important; }
            /* Prevenir zoom automático en iOS (ocurre cuando font-size < 16px) */
            input, select, textarea { font-size: 16px !important; }
        }
        @media (min-width: 769px) {
            /* Filtros Movimientos: una sola fila, campos proporcionales */
            #pane-movimientos form .row { flex-wrap: nowrap !important; }
            #pane-movimientos form .row > div:not(.col-auto) { flex: 1 !important; min-width: 0 !important; }
        }
        .ac-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            z-index: 1050;
            background: #fff;
            border: 1px solid #ced4da;
            border-top: none;
            border-radius: 0 0 .375rem .375rem;
            max-height: 280px;
            overflow-y: auto;
            display: none;
            box-shadow: 0 4px 8px rgba(0,0,0,.08);
        }
        .ac-dropdown li {
            padding: .35rem .6rem;
            font-size: .875rem;
            cursor: pointer;
            list-style: none;
        }
        .ac-dropdown li:hover,
        .ac-dropdown li.ac-active {
            background-color: #e9f0ff;
            color: #0d47a1;
        }
      `}</style>

      <div className="container">
        {/* ── Encabezado ── */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Facturación</h2>
        </div>

        {/* ── Pestañas ── */}
        <ul className="nav nav-tabs" id="facturacionTabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button className={`nav-link ${tabActiva === 'movimientos' ? 'active' : ''}`}
              id="btn-tab-movimientos"
              data-bs-toggle="tab" data-bs-target="#pane-movimientos"
              type="button" role="tab">
              <i className="bi bi-arrow-left-right me-1"></i>Movimientos
              <span className="badge bg-secondary ms-1">{movimientos.length}</span>
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button className={`nav-link ${tabActiva === 'saldos' ? 'active' : ''}`}
              id="btn-tab-saldos"
              data-bs-toggle="tab" data-bs-target="#pane-saldos"
              type="button" role="tab">
              <i className="bi bi-exclamation-circle me-1"></i>Saldos pendientes
              {saldosPendientes.length > 0 && (
                <span className="badge bg-danger ms-1">{saldosPendientes.length}</span>
              )}
            </button>
          </li>
        </ul>

        <div className="tab-content border border-top-0 rounded-bottom bg-white" id="facturacionTabsContent">

          {/* ════════ Tab 1 — Movimientos ════════ */}
          <div className={`tab-pane fade ${tabActiva === 'movimientos' ? 'show active' : ''} p-3`}
            id="pane-movimientos" role="tabpanel">

            {/* ── Filtros ── */}
            <form className="mb-3" onSubmit={handleFiltrarMovimientos}>
              <input type="hidden" name="tab" value="movimientos" />
              <div className="row g-2 align-items-end">
                <div className="col-12 col-sm-6 col-md-auto">
                  <label className="form-label small fw-semibold mb-1">Titular</label>
                  <input type="text" id="input-titular-mov" name="titular" defaultValue={filtros.titular}
                    className="form-control form-control-sm" placeholder="Nombre del titular..."
                    autoComplete="off" />
                </div>
                <div className="col-12 col-sm-6 col-md-auto d-mobile-none">
                  <label className="form-label small fw-semibold mb-1">Desde</label>
                  <input type="date" name="desde" defaultValue={filtros.desde}
                    className="form-control form-control-sm" />
                </div>
                <div className="col-12 col-sm-6 col-md-auto d-mobile-none">
                  <label className="form-label small fw-semibold mb-1">Hasta</label>
                  <input type="date" name="hasta" defaultValue={filtros.hasta}
                    className="form-control form-control-sm" />
                </div>
                <div className="col-12 col-sm-6 col-md-auto">
                  <label className="form-label small fw-semibold mb-1">Método de pago</label>
                  <select name="metodoPago" className="form-select form-select-sm" defaultValue={filtros.metodoPago}>
                    <option value="">Todos</option>
                    {Object.entries(METODO_LABEL).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-sm-6 col-md-auto d-mobile-none">
                  <label className="form-label small fw-semibold mb-1">Concepto</label>
                  <select name="concepto" className="form-select form-select-sm" defaultValue={filtros.concepto}>
                    <option value="">Todos</option>
                    {Object.entries(TIPO_LABEL).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-sm-6 col-md-auto d-mobile-none">
                  <label className="form-label small fw-semibold mb-1">Ordenar por</label>
                  <select name="orden" className="form-select form-select-sm" defaultValue={filtros.orden}>
                    <option value="desc">Más recientes primero</option>
                    <option value="asc">Más antiguos primero</option>
                  </select>
                </div>
                <div className="col-auto">
                  <button type="submit" className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-funnel me-1"></i>Filtrar
                  </button>
                </div>
                <div className="col-auto">
                  <Link href="/gestion/facturacion" className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-x-lg me-1"></i>Limpiar
                  </Link>
                </div>
              </div>
            </form>

            {/* ── Tabla de movimientos ── */}
            {movimientos.length === 0 ? (
              <div className="text-center text-muted py-5">
                <i className="bi bi-inbox fs-2 d-block mb-2 opacity-50"></i>
                No hay movimientos para los filtros seleccionados.
              </div>
            ) : (
              <>
                <div className="table-responsive tabla-fact-responsive tabla-mov">
                  <table className="table table-sm table-hover table-bordered align-middle mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th className="text-nowrap col-fecha-sticky">Fecha</th>
                        <th className="col-titular-sticky">Titular</th>
                        <th>Alojamiento</th>
                        <th>Concepto</th>
                        <th>Método</th>
                        <th className="text-end">Monto</th>
                        <th>Observaciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movimientos.map((mov, i) => (
                        <tr key={i}>
                          <td className="text-nowrap col-fecha-sticky">
                            <span className="d-mobile-none">{mov.fecha}</span>
                            <span className="d-desktop-none">{mov.fechaCorta}</span>
                          </td>
                          <td className="col-titular-sticky">
                            {esAdmin ? (
                              <Link href={`/gestion/reservas/${mov.reservaId}`}
                                className="text-decoration-none fw-semibold">
                                {mov.nombreHuesped}
                              </Link>
                            ) : (
                              <span className="fw-semibold text-dark">{mov.nombreHuesped}</span>
                            )}
                          </td>
                          <td>{mov.nombreAlojamiento}</td>
                          <td>{TIPO_LABEL[mov.tipoPago] ?? mov.tipoPago}</td>
                          <td>{METODO_LABEL[mov.metodoPago] ?? mov.metodoPago}</td>
                          <td className={`text-end fw-bold text-nowrap ${mov.monto < 0 ? 'text-danger' : 'text-success'}`}>
                            ${mov.monto.toLocaleString('es-AR')}
                          </td>
                          <td className="text-muted small">{mov.observaciones ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="table-light fw-bold">
                      <tr>
                        <td colSpan={5} className="text-end">Total del período:</td>
                        <td className="text-end fs-6 text-nowrap" style={{ backgroundColor: '#d4edda', color: '#155724', fontWeight: 'bold' }}>
                          ${totalPeriodo.toLocaleString('es-AR')}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="d-md-none text-center text-muted" style={{ fontSize: 11, marginTop: 6 }}>← Deslizá para ver más →</div>
                <div className="text-muted small mt-2">
                  {movimientos.length} movimiento{movimientos.length !== 1 ? 's' : ''}
                </div>
              </>
            )}
          </div>

          {/* ════════ Tab 2 — Saldos pendientes ════════ */}
          <div className={`tab-pane fade ${tabActiva === 'saldos' ? 'show active' : ''} p-3`}
            id="pane-saldos" role="tabpanel">

            {/* ── Filtro de saldos ── */}
            <form className="mb-3" onSubmit={handleFiltrarSaldos}>
              <input type="hidden" name="tab" value="saldos" />
              <div className="row g-2 align-items-end">
                <div className="col-auto">
                  <label className="form-label small fw-semibold mb-1">Titular</label>
                  <input type="text" id="input-titular-saldos" name="titularSaldos" defaultValue={filtros.titularSaldos}
                    className="form-control form-control-sm" placeholder="Nombre del titular..."
                    autoComplete="off" />
                </div>
                <div className="col-auto">
                  <button type="submit" className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-funnel me-1"></i>Filtrar
                  </button>
                </div>
                <div className="col-auto">
                  <Link href="/gestion/facturacion?tab=saldos" className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-x-lg me-1"></i>Limpiar
                  </Link>
                </div>
              </div>
            </form>

            {saldosPendientes.length === 0 ? (
              filtros.titularSaldos === '' ? (
                <div className="text-center text-success py-5">
                  <i className="bi bi-check-circle fs-2 d-block mb-2"></i>
                  <strong>¡Todo al día!</strong> No hay reservas con saldo pendiente.
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-inbox fs-2 d-block mb-2 opacity-50"></i>
                  No se encontraron saldos para el titular buscado.
                </div>
              )
            ) : (
              <>
                <div className="table-responsive tabla-fact-responsive">
                  <table className="table table-sm table-hover table-bordered align-middle mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>Titular</th>
                        <th>Alojamiento</th>
                        <th className="text-center d-mobile-none">Ingreso</th>
                        <th className="text-center d-mobile-none">Egreso</th>
                        <th className="text-end d-mobile-none">Total estadía</th>
                        <th className="text-end d-mobile-none">Cobrado</th>
                        <th className="text-end">Saldo pendiente</th>
                        <th className="text-center d-mobile-none">Estado pago</th>
                        <th className="text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {saldosPendientes.map(s => (
                        <tr key={s.reservaId}>
                          <td className="fw-semibold">{s.nombreHuesped}</td>
                          <td>{s.nombreAlojamiento}</td>
                          <td className="text-center text-nowrap d-mobile-none">
                            {s.fechaIngreso.split('-').reverse().join('/')}
                          </td>
                          <td className="text-center text-nowrap d-mobile-none">
                            {s.fechaSalida.split('-').reverse().join('/')}
                          </td>
                          <td className="text-end text-nowrap d-mobile-none">${s.montoTotal.toLocaleString('es-AR')}</td>
                          <td className="text-end text-success text-nowrap d-mobile-none">
                            ${s.totalCobrado.toLocaleString('es-AR')}
                          </td>
                          <td className="text-end fw-bold text-danger text-nowrap">
                            ${s.saldoPendiente.toLocaleString('es-AR')}
                          </td>
                          <td className="text-center d-mobile-none">
                            <span className={`badge-pago ${s.estadoPagoClase}`}>{s.estadoPagoTexto}</span>
                          </td>
                          <td className="text-center">
                            {esAdmin && (
                              <Link href={`/gestion/pagos/agregar?reservaId=${s.reservaId}&from=saldos`}
                                className="btn btn-outline-success btn-sm">
                                <i className="bi bi-plus-circle me-1"></i>Agregar Pago
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="table-light fw-bold">
                      <tr>
                        <td colSpan={2} className="text-end d-desktop-none">Total:</td>
                        <td colSpan={2} className="d-mobile-none"></td>
                        <td colSpan={4} className="text-end d-mobile-none">Total saldo pendiente:</td>
                        <td className="text-end text-nowrap" style={{ backgroundColor: '#f8d7da', color: '#721c24', fontWeight: 'bold' }}>
                          ${saldosPendientes.reduce((s, x) => s + x.saldoPendiente, 0).toLocaleString('es-AR')}
                        </td>
                        <td className="d-mobile-none"></td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="d-md-none text-center text-muted" style={{ fontSize: 11, marginTop: 6 }}>← Deslizá para ver más →</div>
                <div className="text-muted small mt-2">
                  {saldosPendientes.length} reserva{saldosPendientes.length !== 1 ? 's' : ''} con saldo pendiente
                </div>
              </>
            )}
          </div>

        </div>

        {/* ── Modal: sin permisos ── */}
        <div className="modal fade" id="modalSinPermisos" tabIndex={-1}
          aria-labelledby="modalSinPermisosLabel" aria-hidden="true">
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title" id="modalSinPermisosLabel">
                  <i className="bi bi-lock-fill text-warning me-2"></i>Acceso restringido
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div className="modal-body pt-1">
                <p className="mb-0 text-muted">No tenés permisos para realizar esta acción.</p>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
