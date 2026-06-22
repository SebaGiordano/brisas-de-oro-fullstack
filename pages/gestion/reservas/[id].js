import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import Navbar from '@/components/gestion/Navbar'

export async function getServerSideProps(context) {
  const { req, res, query, params } = context
  const session = await getServerSession(req, res, authOptions)
  if (!session) return { redirect: { destination: '/login', permanent: false } }

  const proto  = req.headers['x-forwarded-proto'] ?? 'http'
  const host   = req.headers.host
  const apiUrl = `${proto}://${host}/api/gestion/reservas/${params.id}`
  const response = await fetch(apiUrl, { headers: { cookie: req.headers.cookie ?? '' } })

  if (!response.ok) return { notFound: true }

  return {
    props: {
      user: { id: session.user.id ?? null, userName: session.user.userName ?? null, rol: session.user.rol ?? null },
      data: await response.json(),
      from: query.from ?? null,
      mensaje: query.mensaje ?? null,
      mensajeTipo: query.tipo ?? 'success',
    },
  }
}

const TIPO_PAGO_LABEL   = { 0: 'Seña', 1: 'Cancelación', 2: 'Ajuste / Corrección', 3: 'Pago parcial' }
const METODO_PAGO_LABEL = { 0: 'Transferencia', 1: 'Efectivo', 2: 'Tarjeta crédito', 3: 'Tarjeta débito' }

export default function ReservaDetalle({ user, data, from, mensaje, mensajeTipo }) {
  const router       = useRouter()
  const esAdmin      = Number(user.rol) === 0
  const fromCal      = from === 'calendario'

  const saldoPendiente = data.saldoPendiente
  const estadoBadge    = data.estado === 0 ? ['bg-success', 'Confirmada']
    : data.estado === 1 ? ['bg-secondary', 'Finalizada']
    : ['bg-danger', 'Cancelada']

  const estadoPagoClase = data.estadoPagoClase
  const estadoPagoTexto = data.estadoPagoTexto

  function fmtDate(s) { return s ? s.split('-').reverse().join('/') : '—' }

  async function confirmarCancelar() {
    window.bootstrap?.Modal.getInstance(document.getElementById('modal-cancelar-reserva'))?.hide()
    const res = await fetch(`/api/gestion/reservas/${data.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancelar' }),
    })
    if (res.ok) {
      router.replace(`/gestion/reservas?mensaje=Reserva+cancelada&tipo=success`)
    }
  }

  const obsLarga = data.observaciones && data.observaciones.length > 80

  return (
    <>
      <Head><title>Reserva #{data.id} — Brisas de Oro</title></Head>
      <Navbar user={user} />
      <style jsx global>{`
        .badge-pago { display: inline-block; padding: .35em .7em; font-size: .85em; font-weight: 600; border-radius: 4px; }
        .pago-sin-sena   { background-color: #FFCCCC; color: #7A0000; }
        .pago-senado     { background-color: #FFF3CC; color: #7A5F00; }
        .pago-pagado     { background-color: #CCFFCC; color: #1A5C1A; }
        .pago-invitacion { background-color: #E0E0E0; color: #333333; }
        .detalle-label { font-size: .8rem; font-weight: 600; color: #6c757d; text-transform: uppercase; letter-spacing: .03em; }
        .detalle-valor { font-size: 1rem; }
        @media (max-width: 767.98px) {
          #titulo-datos-aloj { font-size: .875rem !important; letter-spacing: .02em !important; white-space: nowrap !important; }
          #fechas-precios-row .fp-fecha { flex: 0 0 50% !important; max-width: 50% !important; }
          #fechas-precios-row .fp-total { flex: 0 0 100% !important; max-width: 100% !important; display: flex !important; justify-content: space-between !important; align-items: baseline !important; }
          #fechas-precios-row .fp-total .detalle-label,
          #fechas-precios-row .fp-total .detalle-valor { white-space: nowrap !important; }
          #fp-saldo .detalle-valor { text-align: right !important; }
          #fp-saldo .detalle-valor.text-danger { font-weight: bold !important; color: #dc3545 !important; }
          #fila-fecha-registro { border-top: 1px solid #dee2e6 !important; border-bottom: 1px solid #dee2e6 !important; background-color: #f8f9fa !important; border-radius: 4px !important; }
          .btn-agregar-pago-card { display: flex !important; align-items: center !important; justify-content: center !important; }
          #tabla-pagos table { min-width: 600px !important; }
          #tabla-pagos td, #tabla-pagos th { white-space: nowrap !important; }
          .btn-listado-top { display: flex !important; align-items: center !important; justify-content: center !important; }
          #nav-bar-mobile .btn-nav-mobile { flex: 1 !important; display: flex !important; align-items: center !important; justify-content: center !important; }
          #detalle-acciones { flex-wrap: nowrap !important; gap: .35rem !important; justify-content: center !important; }
          #detalle-acciones .btn { font-size: .78rem !important; padding: .35rem .65rem !important; display: flex !important; align-items: center !important; justify-content: center !important; white-space: nowrap !important; }
          #detalle-acciones .btn-listado-bottom { display: none !important; }
          #detalle-acciones .btn-cal-bottom { display: none !important; }
          #modal-cancelar-reserva .modal-dialog  { min-height: unset !important; }
          #modal-cancelar-reserva .modal-content { height: auto !important; min-height: unset !important; max-height: 90vh !important; }
          #modal-cancelar-reserva .modal-footer  { padding-bottom: .75rem !important; }
        }
        @media (min-width: 769px) {
          #fila-fecha-registro { flex: 0 0 100% !important; max-width: 100% !important; display: flex !important; align-items: center !important; gap: .75rem !important; border-top: 1px solid #dee2e6 !important; border-bottom: 1px solid #dee2e6 !important; background-color: #f8f9fa !important; border-radius: 0 !important; padding: .4rem .75rem !important; margin-top: 1.5rem !important; }
          #fila-fecha-registro .detalle-label, #fila-fecha-registro .detalle-valor { margin-bottom: 0 !important; }
        }
      `}</style>

      <div className="container">
        {mensaje && (
          <div className={`alert alert-${mensajeTipo} alert-dismissible fade show`} role="alert">
            {mensaje}
            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
          </div>
        )}

        {/* Barra mobile (calendario) */}
        {fromCal && (
          <div id="nav-bar-mobile" className="d-md-none d-flex gap-2 mb-3">
            <Link href="/gestion/calendario" className="btn btn-outline-secondary btn-sm btn-nav-mobile">
              <i className="bi bi-arrow-left me-1"></i>Volver al calendario
            </Link>
            <Link href="/gestion/reservas" className="btn btn-outline-secondary btn-sm btn-nav-mobile">
              <i className="bi bi-list me-1"></i>Ver listado de reservas
            </Link>
          </div>
        )}

        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h2 className="mb-1">Reserva #{data.id}</h2>
            <div className="d-flex gap-2 align-items-center">
              <span className={`badge ${estadoBadge[0]}`}>{estadoBadge[1]}</span>
              <span className={`badge-pago ${estadoPagoClase}`}>{estadoPagoTexto}</span>
              {data.esInvitacion && <span className="text-muted small"><i className="bi bi-gift me-1"></i>Invitación</span>}
            </div>
          </div>
          <div className={`d-flex gap-2 ${fromCal ? 'd-none d-md-flex' : ''}`}>
            {fromCal && (
              <Link href="/gestion/calendario" className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-arrow-left me-1"></i>Volver al calendario
              </Link>
            )}
            <Link href="/gestion/reservas" className="btn btn-outline-secondary btn-sm btn-listado-top">
              <i className="bi bi-list me-1"></i>Ver listado de reservas
            </Link>
          </div>
        </div>

        {/* Datos de la reserva */}
        <div className="row g-3 mb-3">
          {/* Información */}
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header fw-semibold bg-light">
                <i className="bi bi-info-circle me-2"></i>Información de la reserva
              </div>
              <div className="card-body">
                <div className="row g-0">
                  <div className="col-6 pe-3 border-end">
                    <div className="small fw-semibold text-secondary text-uppercase mb-3" style={{ letterSpacing: '.05em' }}>
                      Datos del titular
                    </div>
                    <div className="mb-3">
                      <div className="detalle-label">Nombre del titular</div>
                      <div className="detalle-valor fw-semibold">{data.nombreHuesped}</div>
                    </div>
                    <div className="mb-3">
                      <div className="detalle-label">Teléfono</div>
                      <div className="detalle-valor">
                        {data.telefono || <span className="text-muted fst-italic">No registrado</span>}
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="detalle-label">Canal de origen</div>
                      <div className="detalle-valor">
                        {data.canalOrigen || <span className="text-muted">—</span>}
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="detalle-label">Observaciones</div>
                      {!data.observaciones
                        ? <div className="detalle-valor text-muted fst-italic">Sin observaciones</div>
                        : !obsLarga
                          ? <div className="detalle-valor p-2 rounded" style={{ backgroundColor: '#FFFDE7', border: '1px solid #FFF176', fontSize: '.9rem' }}>{data.observaciones}</div>
                          : <div className="detalle-valor p-2 rounded" style={{ backgroundColor: '#FFFDE7', border: '1px solid #FFF176', fontSize: '.9rem' }}>
                              {data.observaciones.substring(0, 80)}...
                              <button type="button" className="btn btn-link btn-sm p-0 ms-1 align-baseline"
                                data-bs-toggle="modal" data-bs-target="#modalObservaciones">Ver más</button>
                            </div>
                      }
                    </div>
                    <div className="mb-0">
                      <div className="detalle-label">¿Es invitación?</div>
                      <div className="detalle-valor">
                        {data.esInvitacion
                          ? <span className="text-success fw-semibold"><i className="bi bi-check-circle-fill me-1"></i>Sí</span>
                          : <span className="text-muted">No</span>}
                      </div>
                    </div>
                  </div>
                  <div className="col-6 ps-3">
                    <div id="titulo-datos-aloj" className="small fw-semibold text-secondary text-uppercase mb-3" style={{ letterSpacing: '.05em' }}>
                      Datos del alojamiento
                    </div>
                    <div className="mb-3">
                      <div className="detalle-label">Alojamiento</div>
                      <div className="detalle-valor fw-semibold">{data.alojamiento.nombre}</div>
                    </div>
                    <div className="mb-3">
                      <div className="detalle-label">Tipo</div>
                      <div className="detalle-valor">{['Cabaña', 'Habitación', 'Apart'][data.alojamiento.tipo] ?? '—'}</div>
                    </div>
                    <div className="mb-3">
                      <div className="detalle-label">Capacidad máxima</div>
                      <div className="detalle-valor">{data.alojamiento.capacidad} personas</div>
                    </div>
                    <div className="mb-3">
                      <div className="detalle-label">Huéspedes</div>
                      <div className="detalle-valor">{data.cantidadHuespedes} personas</div>
                    </div>
                    <div className="mb-0">
                      <div className="detalle-label">¿Incluye desayuno?</div>
                      <div className="detalle-valor">
                        {data.incluyeDesayuno
                          ? <span className="text-success fw-semibold"><i className="bi bi-check-circle-fill me-1"></i>Sí</span>
                          : <span className="text-muted">No</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fechas y precios */}
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header fw-semibold bg-light">
                <i className="bi bi-calendar-range me-2"></i>Fechas y precios
              </div>
              <div className="card-body">
                <div id="fechas-precios-row" className="row g-3">
                  <div className="col-sm-4 fp-fecha">
                    <div className="detalle-label">Ingreso</div>
                    <div className="detalle-valor">{fmtDate(data.fechaIngreso)}</div>
                  </div>
                  <div className="col-sm-4 fp-fecha">
                    <div className="detalle-label">Egreso</div>
                    <div className="detalle-valor">{fmtDate(data.fechaSalida)}</div>
                  </div>
                  <div className="col-sm-4 fp-fecha">
                    <div className="detalle-label">Noches</div>
                    <div className="detalle-valor fw-semibold">{data.noches}</div>
                  </div>
                  {data.tarifaDia && (
                    <div className="col-sm-4 fp-fecha">
                      <div className="detalle-label">Tarifa por día</div>
                      <div className="detalle-valor fw-semibold">${data.tarifaDia.toLocaleString('es-AR')}</div>
                    </div>
                  )}
                  <div className="col-12"><hr className="my-1" /></div>
                  <div className="col-sm-6 fp-total">
                    <div className="detalle-label">Total estadía</div>
                    <div className="detalle-valor fw-semibold fs-5">${data.montoTotal.toLocaleString('es-AR')}</div>
                  </div>
                  <div className="col-sm-6 fp-total">
                    <div className="detalle-label">Estado de pago</div>
                    <div className="detalle-valor">
                      <span className={`badge-pago ${estadoPagoClase}`}>{estadoPagoTexto}</span>
                    </div>
                  </div>
                  <div className="col-sm-6 fp-total">
                    <div className="detalle-label" style={{ color: '#198754', fontWeight: 'bold' }}>Total cobrado</div>
                    <div className="detalle-valor text-success fw-semibold">${data.totalCobrado.toLocaleString('es-AR')}</div>
                  </div>
                  <div id="fp-saldo" className="col-sm-6 fp-total">
                    <div className="detalle-label" style={{ color: '#dc3545', fontWeight: 'bold' }}>Saldo pendiente</div>
                    <div className={`detalle-valor fw-bold ${saldoPendiente > 0 ? 'text-danger' : 'text-success'}`}>
                      ${saldoPendiente.toLocaleString('es-AR')}
                      {saldoPendiente < 0 && (
                        <span className="d-block small fw-normal mt-1" style={{ color: '#000' }}>(A devolver al cliente)</span>
                      )}
                    </div>
                  </div>
                  <div id="fila-fecha-registro" className="col-sm-6 fp-total">
                    <div className="detalle-label">Fecha de registro</div>
                    <div className="detalle-valor text-muted small">{data.fechaCarga}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagos */}
        <div className="card mb-4">
          <div className="card-header fw-semibold bg-light d-flex justify-content-between align-items-center">
            <span><i className="bi bi-cash-stack me-2"></i>Pagos</span>
            {esAdmin && (
              <Link href={`/gestion/pagos/agregar?reservaId=${data.id}${fromCal ? '&from=calendario' : ''}`}
                className="btn btn-sm btn-outline-success btn-agregar-pago-card">
                <i className="bi bi-plus-lg me-1"></i>Agregar pago
              </Link>
            )}
          </div>
          <div className="card-body p-0">
            {data.pagos.length === 0 ? (
              <div className="text-center text-muted py-4">
                <i className="bi bi-inbox fs-3 d-block mb-1 opacity-50"></i>
                Sin pagos registrados
              </div>
            ) : (
              <>
                <div id="tabla-pagos" className="table-responsive">
                  <table className="table table-sm mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Fecha / Hora</th>
                        <th>Tipo</th>
                        <th>Método</th>
                        <th className="text-end">Monto</th>
                        <th>Observaciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.pagos.map(p => (
                        <tr key={p.id}>
                          <td className="text-nowrap">{p.fecha}</td>
                          <td>{TIPO_PAGO_LABEL[p.tipoPago] ?? p.tipoPago}</td>
                          <td>{METODO_PAGO_LABEL[p.metodoPago] ?? p.metodoPago}</td>
                          <td className={`text-end fw-semibold ${p.monto < 0 ? 'text-danger' : ''}`}>
                            ${p.monto.toLocaleString('es-AR')}
                          </td>
                          <td className="text-muted small">{p.observaciones || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="table-light fw-bold">
                      <tr>
                        <td colSpan={3} className="text-end fw-bold">Total estadía:</td>
                        <td className="text-end fw-bold">${data.montoTotal.toLocaleString('es-AR')}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="text-end fw-bold">Total cobrado:</td>
                        <td className="text-end fw-bold text-success">${data.totalCobrado.toLocaleString('es-AR')}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="text-end fw-bold">Saldo pendiente:</td>
                        <td className={`text-end fw-bold ${saldoPendiente > 0 ? 'text-danger' : 'text-success'}`}>
                          ${saldoPendiente.toLocaleString('es-AR')}
                          {saldoPendiente < 0 && (
                            <span className="d-block small fw-normal" style={{ color: '#000' }}>(A devolver al cliente)</span>
                          )}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="d-md-none text-center text-muted" style={{ fontSize: 11, marginTop: 6 }}>
                  ← Deslizá para ver más →
                </div>
              </>
            )}
          </div>
        </div>

        {/* Botones */}
        <div id="detalle-acciones" className="d-flex flex-wrap gap-2">
          {esAdmin && (
            <>
              <Link href={`/gestion/reservas/editar/${data.id}`} className="btn btn-primary">
                <i className="bi bi-pencil me-1"></i>Editar reserva
              </Link>
              <Link href={`/gestion/pagos/agregar?reservaId=${data.id}${fromCal ? '&from=calendario' : ''}`}
                className="btn btn-outline-success">
                <i className="bi bi-plus-circle me-1"></i>Agregar pago
              </Link>
              {data.estado !== 2 && (
                <button type="button" className="btn btn-outline-danger"
                  data-bs-toggle="modal" data-bs-target="#modal-cancelar-reserva">
                  <i className="bi bi-x-circle me-1"></i>Cancelar reserva
                </button>
              )}
            </>
          )}
          {fromCal && (
            <Link href="/gestion/calendario" className="btn btn-outline-secondary btn-cal-bottom">
              <i className="bi bi-arrow-left me-1"></i>Volver al calendario
            </Link>
          )}
          <Link href="/gestion/reservas"
            className={`btn btn-outline-secondary btn-listado-bottom ${esAdmin ? 'ms-auto' : ''}`}>
            <i className="bi bi-list me-1"></i>Ver listado de reservas
          </Link>
        </div>

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
                  <strong>{data.nombreHuesped}</strong>? Esta acción no se puede deshacer.</p>
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

        {/* Modal observaciones */}
        {obsLarga && (
          <div className="modal fade" id="modalObservaciones" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title"><i className="bi bi-chat-text me-2"></i>Observaciones completas</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">
                  <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{data.observaciones}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
