import Head from 'next/head'
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import Navbar from '@/components/gestion/Navbar'

export async function getServerSideProps(context) {
  const { req, res } = context
  const session = await getServerSession(req, res, authOptions)
  if (!session) return { redirect: { destination: '/login', permanent: false } }

  const proto  = req.headers['x-forwarded-proto'] ?? 'http'
  const host   = req.headers.host
  const apiUrl = `${proto}://${host}/api/gestion/inicio`

  const response = await fetch(apiUrl, {
    headers: { cookie: req.headers.cookie ?? '' },
  })

  return {
    props: {
      user: {
        id:       session.user.id       ?? null,
        userName: session.user.userName ?? null,
        rol:      session.user.rol      ?? null,
      },
      data: response.ok ? await response.json() : {},
    },
  }
}

function abrevAloj(n) {
  if (!n) return n
  if (n.startsWith('Habitación ')) return 'Hab. ' + n.slice('Habitación '.length)
  if (n.startsWith('Apart '))      return 'Ap. '  + n.slice('Apart '.length)
  if (n.startsWith('Cabaña '))     return 'Cab. ' + n.slice('Cabaña '.length)
  return n
}

export default function GestionInicio({ data }) {
  const {
    CheckInsHoy = [], CheckOutsHoy = [],
    PlazasOcupadasHoy = 0,
    ComensalesDesayunoHoy = 0, ComensalesDesayunoManana = 0,
    LimpiezaDelDia = [],
    UnidadesLibresHoy = [], UnidadesOcupadasHoy = [],
    PendientesCobro = [],
    CheckInsManana = [], CheckOutsManana = [],
    Hoy = '', Manana = '',
  } = data

  const habitacionesLibres = UnidadesLibresHoy.filter(n => n.startsWith('Habitación'))
  const cabañasLibres      = UnidadesLibresHoy.filter(n => n.startsWith('Cabaña'))
  const habOcupadas        = UnidadesOcupadasHoy.filter(n => n.startsWith('Habitación'))
  const cabOcupadas        = UnidadesOcupadasHoy.filter(n => n.startsWith('Cabaña'))

  return (
    <>
      <Head><title>Inicio — Gestión Brisas de Oro</title></Head>
      <Navbar />

      <div className="container pb-3">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Panel de inicio</h2>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECCIÓN HOY
            ══════════════════════════════════════════════════════ */}
        <h5 className="text-uppercase text-muted fw-semibold mb-3" style={{ letterSpacing: '.06em', fontSize: '1.1rem' }}>
          <i className="bi bi-calendar3 me-1" style={{ color: '#212529' }}></i><strong>Hoy</strong> — {Hoy}
        </h5>

        {/* Fila 1: Check-ins / Check-outs hoy */}
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header fw-semibold bg-success bg-opacity-10 text-success-emphasis">
                <i className="bi bi-box-arrow-in-right me-1"></i>Check-ins de <strong>HOY</strong>
                <span className="badge bg-success ms-2">{CheckInsHoy.length}</span>
              </div>
              <div className="card-body p-0">
                {CheckInsHoy.length === 0
                  ? <p className="text-muted fst-italic p-3 mb-0">Sin check-ins para hoy.</p>
                  : <ul className="list-group list-group-flush lista-ver-items">
                      {CheckInsHoy.map(item => (
                        <li key={item.ReservaId} className="list-group-item d-flex justify-content-between align-items-center py-2">
                          <span>
                            <span className="fw-semibold">{item.NombreHuesped}</span>
                            <span className="ms-1 aloj-badge-checkin">{item.NombreAlojamiento}</span>
                          </span>
                          <Link href={`/gestion/reservas/${item.ReservaId}`} className="btn btn-outline-secondary btn-sm py-0">Ver</Link>
                        </li>
                      ))}
                    </ul>
                }
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header fw-semibold bg-warning bg-opacity-10 text-warning-emphasis">
                <i className="bi bi-box-arrow-right me-1"></i>Check-outs de <strong>HOY</strong>
                <span className="badge bg-warning text-dark ms-2">{CheckOutsHoy.length}</span>
              </div>
              <div className="card-body p-0">
                {CheckOutsHoy.length === 0
                  ? <p className="text-muted fst-italic p-3 mb-0">Sin check-outs para hoy.</p>
                  : <ul className="list-group list-group-flush lista-ver-items">
                      {CheckOutsHoy.map(item => (
                        <li key={item.ReservaId} className="list-group-item d-flex justify-content-between align-items-center py-2">
                          <span>
                            <span className="fw-semibold">{item.NombreHuesped}</span>
                            <span className="ms-1 aloj-badge-checkout-hoy">{item.NombreAlojamiento}</span>
                          </span>
                          <Link href={`/gestion/reservas/${item.ReservaId}`} className="btn btn-outline-secondary btn-sm py-0">Ver</Link>
                        </li>
                      ))}
                    </ul>
                }
              </div>
            </div>
          </div>
        </div>

        {/* Zona media: izquierda apilada (stats + limpieza) / derecha unidades */}
        <div className="row g-3 mb-3" style={{ alignItems: 'stretch' }}>

          {/* Columna izquierda: stats + limpieza */}
          <div className="col-md-6 d-flex flex-column gap-3">

            {/* Stats — tres tarjetas */}
            <div className="row g-3">
              <div className="col-12 col-sm-4 d-flex">
                <div className="card text-center flex-grow-1">
                  <div className="card-body py-3 d-flex flex-column justify-content-center">
                    <div className="display-6 fw-bold text-primary">{PlazasOcupadasHoy}</div>
                    <div className="text-muted small mt-1">
                      <span className="d-none d-md-block">Plazas ocupadas<br /><strong>HOY</strong><br /><span className="fst-italic">(Sin invitaciones)</span></span>
                      <span className="d-md-none">Plazas ocupadas <strong>HOY</strong><br /><span className="fst-italic">(sin invitaciones)</span></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-4 d-flex">
                <div className="card text-center flex-grow-1">
                  <div className="card-body py-3 d-flex flex-column justify-content-center">
                    <div className="display-6 fw-bold text-success">{ComensalesDesayunoHoy}</div>
                    <div className="text-muted small mt-1">
                      Huéspedes para desayuno <strong>HOY</strong><br />
                      <span className="fst-italic">({Hoy})</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-4 d-flex">
                <div className="card text-center flex-grow-1">
                  <div className="card-body py-3 d-flex flex-column justify-content-center">
                    <div className="display-6 fw-bold text-info">{ComensalesDesayunoManana}</div>
                    <div className="text-muted small mt-1">
                      Huéspedes para desayuno <strong>MAÑANA</strong><br />
                      <span className="fst-italic">({Manana})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Limpieza (ocupa el espacio restante de la columna) */}
            <div className="card flex-grow-1">
              <div className="card-header fw-semibold bg-light">
                <i className="bi bi-stars me-1"></i>Limpieza del día — {Hoy} <span className="text-muted fw-normal">(hoy)</span>
              </div>
              <div className="card-body p-0">
                {LimpiezaDelDia.length === 0
                  ? <p className="text-muted fst-italic p-3 mb-0">Sin tareas de limpieza para hoy.</p>
                  : <table id="tabla-limpieza" className="table table-sm table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: '120px' }}>Unidad</th>
                          <th>Tareas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {LimpiezaDelDia.map((item, i) => (
                          <tr key={i}>
                            <td className="fw-semibold">{item.NombreAlojamiento}</td>
                            <td>
                              {item.Tareas.map((tarea, j) => (
                                <span key={j} className="badge bg-primary me-1 mb-1 fw-bold" style={{ fontSize: '.78rem' }}>{tarea}</span>
                              ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                }
              </div>
            </div>

          </div>

          {/* Columna derecha: Estado de unidades (libres + ocupadas) */}
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header fw-semibold bg-light">
                <i className="bi bi-building me-1"></i>Estado de unidades hoy
              </div>
              <div className="card-body p-0">
                <div className="row g-0 h-100">

                  {/* Libres */}
                  <div className="col-6 border-end p-3">
                    <div className="fw-semibold text-success small text-uppercase mb-2" style={{ letterSpacing: '.04em' }}>
                      <i className="bi bi-check-circle-fill me-1"></i>Libres
                      <span className="badge bg-success ms-1">{UnidadesLibresHoy.length}</span>
                    </div>
                    {UnidadesLibresHoy.length === 0
                      ? <span className="text-muted fst-italic small">Ninguna libre.</span>
                      : <ul className="list-unstyled mb-0">
                          {habitacionesLibres.map(nombre => (
                            <li key={nombre} className="py-1 small">
                              <i className="bi bi-check-circle text-success me-1"></i>{nombre}
                            </li>
                          ))}
                          {habitacionesLibres.length > 0 && cabañasLibres.length > 0 && (
                            <li className="py-1"><hr className="my-0" /></li>
                          )}
                          {cabañasLibres.map(nombre => (
                            <li key={nombre} className="py-1 small">
                              <i className="bi bi-check-circle text-success me-1"></i>{nombre}
                            </li>
                          ))}
                        </ul>
                    }
                  </div>

                  {/* Ocupadas */}
                  <div className="col-6 p-3">
                    <div className="fw-semibold text-danger small text-uppercase mb-2" style={{ letterSpacing: '.04em' }}>
                      <i className="bi bi-x-circle-fill me-1"></i>Ocupadas
                      <span className="badge bg-danger ms-1">{UnidadesOcupadasHoy.length}</span>
                    </div>
                    {UnidadesOcupadasHoy.length === 0
                      ? <span className="text-muted fst-italic small">Ninguna ocupada.</span>
                      : <ul className="list-unstyled mb-0">
                          {habOcupadas.map(nombre => (
                            <li key={nombre} className="py-1 small">
                              <i className="bi bi-x-circle text-danger me-1"></i>{nombre}
                            </li>
                          ))}
                          {habOcupadas.length > 0 && cabOcupadas.length > 0 && (
                            <li className="py-1"><hr className="my-0" /></li>
                          )}
                          {cabOcupadas.map(nombre => (
                            <li key={nombre} className="py-1 small">
                              <i className="bi bi-x-circle text-danger me-1"></i>{nombre}
                            </li>
                          ))}
                        </ul>
                    }
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Pendientes a cobrar en 24 hs */}
        <div className="card mb-4">
          <div className="card-header fw-semibold bg-danger bg-opacity-10 text-danger-emphasis">
            <i className="bi bi-cash-coin me-1"></i>Pendientes a cobrar en 24 hs
            {PendientesCobro.length > 0 && (
              <span className="badge bg-danger ms-2">{PendientesCobro.length}</span>
            )}
          </div>
          <div className="card-body p-0">
            {PendientesCobro.length === 0
              ? <p className="text-muted fst-italic p-3 mb-0">Sin saldos pendientes para hoy ni mañana.</p>
              : <table className="table table-sm table-hover align-middle mb-0 tabla-pendientes">
                  <thead className="table-light">
                    <tr>
                      <th>Titular</th>
                      <th className="d-mobile-none">Unidad</th>
                      <th className="text-center d-mobile-none">Check-out</th>
                      <th className="text-end">Saldo</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {PendientesCobro.map(p => (
                      <tr key={p.ReservaId}>
                        <td className="fw-semibold">
                          {p.NombreHuesped}
                          <span className={`d-md-none ms-1 ${p.EsHoy ? 'aloj-badge-pendiente' : 'aloj-badge-checkout-hoy'}`}>
                            {abrevAloj(p.NombreAlojamiento)}
                          </span>
                        </td>
                        <td className="d-mobile-none">{p.NombreAlojamiento}</td>
                        <td className="text-center d-mobile-none">
                          {p.EsHoy
                            ? <span className="badge bg-danger">Hoy</span>
                            : <span className="badge bg-warning text-dark">Mañana</span>
                          }
                        </td>
                        <td className="text-end fw-semibold text-danger">
                          ${new Intl.NumberFormat('es-AR').format(p.SaldoPendiente)}
                        </td>
                        <td className="text-end">
                          <Link href={`/gestion/reservas/${p.ReservaId}`} className="btn btn-outline-danger btn-sm py-0">Ver</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECCIÓN MAÑANA
            ══════════════════════════════════════════════════════ */}
        <h5 className="text-uppercase text-muted fw-semibold mb-3" style={{ letterSpacing: '.06em', fontSize: '1.1rem' }}>
          <i className="bi bi-calendar3 me-1" style={{ color: '#212529' }}></i><strong>Mañana</strong> — {Manana}
        </h5>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header fw-semibold bg-success bg-opacity-10 text-success-emphasis">
                <i className="bi bi-box-arrow-in-right me-1"></i>Check-ins de <strong>MAÑANA</strong>
                <span className="badge bg-success ms-2">{CheckInsManana.length}</span>
              </div>
              <div className="card-body p-0">
                {CheckInsManana.length === 0
                  ? <p className="text-muted fst-italic p-3 mb-0">Sin check-ins para mañana.</p>
                  : <ul className="list-group list-group-flush lista-ver-items">
                      {CheckInsManana.map(item => (
                        <li key={item.ReservaId} className="list-group-item d-flex justify-content-between align-items-center py-2">
                          <span>
                            <span className="fw-semibold">{item.NombreHuesped}</span>
                            <span className="ms-1 aloj-badge-checkin">{item.NombreAlojamiento}</span>
                          </span>
                          <Link href={`/gestion/reservas/${item.ReservaId}`} className="btn btn-outline-secondary btn-sm py-0">Ver</Link>
                        </li>
                      ))}
                    </ul>
                }
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header fw-semibold bg-warning bg-opacity-10 text-warning-emphasis">
                <i className="bi bi-box-arrow-right me-1"></i>Check-outs de <strong>MAÑANA</strong>
                <span className="badge bg-warning text-dark ms-2">{CheckOutsManana.length}</span>
              </div>
              <div className="card-body p-0">
                {CheckOutsManana.length === 0
                  ? <p className="text-muted fst-italic p-3 mb-0">Sin check-outs para mañana.</p>
                  : <ul className="list-group list-group-flush lista-ver-items">
                      {CheckOutsManana.map(item => (
                        <li key={item.ReservaId} className="list-group-item d-flex justify-content-between align-items-center py-2">
                          <span>
                            <span className="fw-semibold">{item.NombreHuesped}</span>
                            <span className="ms-1 aloj-badge-manana">{item.NombreAlojamiento}</span>
                          </span>
                          <Link href={`/gestion/reservas/${item.ReservaId}`} className="btn btn-outline-secondary btn-sm py-0">Ver</Link>
                        </li>
                      ))}
                    </ul>
                }
              </div>
            </div>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @media (max-width: 767.98px) {
            /* Botones "Ver": ancho fijo uniforme, alineados al eje vertical derecho */
            .btn-sm.py-0 {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                min-width: 52px !important;
                width: 52px !important;
                padding-left: .5rem !important;
                padding-right: .5rem !important;
                margin-left: auto !important;
                font-weight: bold !important;
            }
            /* Pendientes: monto en rojo en negrita */
            td.text-end.fw-semibold.text-danger { font-weight: bold !important; }
            /* Pendientes: botón "Ver" en negrita */
            .btn-outline-danger.btn-sm.py-0 { font-weight: bold !important; }
            /* Badges numéricos de encabezados: centrado vertical */
            .badge { display: inline-flex !important; align-items: center !important; vertical-align: middle !important; }
            /* Todas las secciones con botón "Ver": padding-right igualado al de Pendientes (.25rem) */
            .lista-ver-items .list-group-item { padding-right: .25rem !important; }
            /* Pendientes: padding-left del titular igualado al de las demás secciones (1rem) */
            .tabla-pendientes tbody td:first-child,
            .tabla-pendientes thead th:first-child { padding-left: 1rem !important; }
            /* Badges de alojamiento por sección */
            .aloj-badge-checkin,
            .aloj-badge-checkout-hoy,
            .aloj-badge-manana,
            .aloj-badge-pendiente {
                border-radius: .375rem !important;
                padding: 2px 6px !important;
                font-size: .75em !important;
                font-weight: 700 !important;
                display: inline-block !important;
            }
            .aloj-badge-checkin      { background-color: #198754 !important; color: #fff !important; }
            .aloj-badge-checkout-hoy { background-color: #ffc107 !important; color: #212529 !important; }
            .aloj-badge-manana       { background-color: #ffc107 !important; color: #212529 !important; }
            .aloj-badge-pendiente    { background-color: #dc3545 !important; color: #fff !important; }
            /* Tabla de limpieza: Unidad estrecha + nowrap, Tareas flexible + word-wrap */
            #tabla-limpieza { table-layout: fixed !important; width: 100% !important; }
            #tabla-limpieza th:first-child,
            #tabla-limpieza td:first-child { width: 90px !important; white-space: nowrap !important; }
            #tabla-limpieza td:last-child,
            #tabla-limpieza th:last-child { word-wrap: break-word !important; overflow-wrap: break-word !important; }
            #tabla-limpieza .badge { white-space: normal !important; }
        }
        @media (min-width: 769px) {
            /* Badges de alojamiento en desktop */
            .aloj-badge-checkin,
            .aloj-badge-checkout-hoy,
            .aloj-badge-manana {
                border-radius: .375rem;
                padding: 2px 8px;
                font-size: .8em;
                font-weight: 600;
                display: inline-block;
            }
            .aloj-badge-checkin                    { background-color: #198754; color: #fff; }
            .aloj-badge-checkout-hoy,
            .aloj-badge-manana                     { background-color: #ffc107; color: #212529; }
            /* Saldo pendiente: negrita */
            td.text-end.fw-semibold.text-danger    { font-weight: bold !important; }
            /* Botones "Ver": negrita */
            .btn-sm.py-0                           { font-weight: bold !important; }
            /* Pendientes: padding-right de la celda Ver igualado a list-group-item (1rem) */
            .tabla-pendientes tbody td:first-child,
            .tabla-pendientes thead th:first-child { padding-left: 1rem !important; }
            .tabla-pendientes tbody td:last-child  { padding-right: 1rem !important; }
        }
      `}</style>
    </>
  )
}
