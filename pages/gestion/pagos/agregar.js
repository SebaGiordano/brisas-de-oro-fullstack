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
  if (Number(session.user.rol) !== 0) return { redirect: { destination: '/gestion/inicio', permanent: false } }

  const reservaId = parseInt(query.reservaId)
  if (isNaN(reservaId)) return { notFound: true }

  const proto  = req.headers['x-forwarded-proto'] ?? 'http'
  const host   = req.headers.host
  const apiUrl = `${proto}://${host}/api/gestion/pagos/agregar?reservaId=${reservaId}`
  const response = await fetch(apiUrl, { headers: { cookie: req.headers.cookie ?? '' } })
  if (!response.ok) return { notFound: true }

  return {
    props: {
      user: { id: session.user.id ?? null, userName: session.user.userName ?? null, rol: session.user.rol ?? null },
      data: await response.json(),
      from: query.from ?? null,
    },
  }
}

export default function AgregarPago({ user, data, from }) {
  const router = useRouter()

  const TIPO_LABEL   = { 0: 'Seña', 1: 'Cancelación total', 2: 'Ajuste / Corrección', 3: 'Pago parcial' }
  const METODO_LABEL = { 0: 'Transferencia', 1: 'Efectivo', 2: 'Tarjeta crédito', 3: 'Tarjeta débito' }

  const saldoClase = data.saldoPendiente > 0
    ? 'saldo-deuda'
    : data.saldoPendiente < 0
      ? 'saldo-negativo'
      : 'saldo-cero'

  useEffect(() => {
    const MONTO_TOTAL   = data.montoTotal
    const TOTAL_COBRADO = data.totalCobrado
    const SALDO_PEND    = data.saldoPendiente
    let _confirmadoPago = false
    let _prevTipo       = null

    const gid = id => document.getElementById(id)

    function getTipo()   { return gid('TipoPago').value }
    function getMonto()  { return parseFloat(gid('Monto').value) }
    function getMetodo() { return gid('MetodoPago').value }
    function getFecha()  { return gid('Fecha').value }

    function mostrarPanelSena(mostrar) {
      gid('panel-sena').style.display = mostrar ? '' : 'none'
    }

    function actualizarAvisoExceso() {
      const monto = getMonto(), tipo = getTipo()
      const avisoEl = gid('aviso-exceso')
      if (!isNaN(monto) && monto > SALDO_PEND && tipo !== '2') {
        avisoEl.style.display = ''
      } else {
        avisoEl.style.display = 'none'
      }
    }

    function actualizarMontoSugerido() {
      const pct = parseInt(gid('pct-sena').value) || 40
      const sugerido = Math.round(MONTO_TOTAL * pct / 100)
      gid('monto-sugerido').textContent = `$${sugerido.toLocaleString('es-AR')}`
      gid('monto-sugerido-val').dataset.val = sugerido
    }

    function manejarCambioTipo() {
      const tipo = getTipo()
      mostrarPanelSena(tipo === '0')
      if (tipo === '2') {
        // Ajuste: el aviso de exceso no aplica
        gid('aviso-exceso').style.display = 'none'
        if (SALDO_PEND < 0) {
          gid('Monto').value = Math.abs(SALDO_PEND)
        } else {
          // No hay excedente
          const modal = window.bootstrap?.Modal.getOrCreateInstance(gid('modal-sin-excedente'))
          modal?.show()
          return
        }
      } else {
        if (tipo === '1') {
          if (SALDO_PEND > 0) gid('Monto').value = SALDO_PEND
        } else {
          gid('Monto').value = ''
          gid('Monto').dispatchEvent(new Event('input'))
        }
        actualizarAvisoExceso()
      }
    }

    // TipoPago inicial
    gid('TipoPago').value = String(data.tipoPago)
    manejarCambioTipo()

    gid('TipoPago').addEventListener('change', function () {
      _prevTipo = null
      manejarCambioTipo()
    })

    gid('modal-sin-excedente').addEventListener('hidden.bs.modal', function () {
      gid('TipoPago').value = '1'
      manejarCambioTipo()
    })

    gid('pct-sena').addEventListener('input', actualizarMontoSugerido)
    actualizarMontoSugerido()

    gid('btn-usar-monto').addEventListener('click', function () {
      gid('Monto').value = gid('monto-sugerido-val').dataset.val
      actualizarAvisoExceso()
    })

    gid('Monto').addEventListener('input', actualizarAvisoExceso)

    // Fecha hoy por defecto
    const hoy = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Argentina/Buenos_Aires',
      year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(new Date())
    if (!gid('Fecha').value) gid('Fecha').value = hoy

    gid('form-pago').addEventListener('submit', function (e) {
      e.preventDefault()
      if (_confirmadoPago) {
        _confirmadoPago = false
        return
      }
      const errores = []
      const tipo = getTipo(), metodo = getMetodo(), monto = getMonto(), fecha = getFecha()
      if (!tipo && tipo !== '0') errores.push('Seleccioná el concepto del pago.')
      if (!metodo && metodo !== '0') errores.push('Seleccioná el método de pago.')
      if (!gid('Monto').value || isNaN(monto) || monto <= 0) errores.push('El monto debe ser mayor a cero.')
      if (!fecha) errores.push('La fecha es obligatoria.')
      if (errores.length) {
        gid('lista-errores').innerHTML = errores.map(m => `<li>${m}</li>`).join('')
        gid('resumen-errores').classList.remove('d-none')
        gid('resumen-errores').scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      gid('resumen-errores').classList.add('d-none')

      // Poblar modal confirmación
      gid('conf-concepto').textContent = TIPO_LABEL[parseInt(tipo)] ?? tipo
      gid('conf-monto').textContent    = `$${monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
      gid('conf-metodo').textContent   = METODO_LABEL[parseInt(metodo)] ?? metodo
      gid('conf-fecha').textContent    = fecha

      window.bootstrap?.Modal.getOrCreateInstance(gid('modal-confirmar-pago')).show()
    })

    gid('btn-confirmar-pago').addEventListener('click', async function () {
      window.bootstrap?.Modal.getInstance(gid('modal-confirmar-pago'))?.hide()
      const tipo = getTipo(), metodo = getMetodo(), monto = getMono(), fecha = getFecha()
      const obs = gid('Observaciones').value.trim()
      try {
        const res = await fetch(`/api/gestion/pagos/agregar?reservaId=${data.reservaId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tipoPago: tipo, metodoPago: metodo, monto, fecha, observaciones: obs || null }),
        })
        const d = await res.json()
        if (res.ok) {
          router.push(`/gestion/reservas/${data.reservaId}?mensaje=Pago+registrado&tipo=success`)
        } else {
          const msgs = d.errores ?? ['Error al registrar el pago.']
          gid('lista-errores').innerHTML = msgs.map(m => `<li>${m}</li>`).join('')
          gid('resumen-errores').classList.remove('d-none')
        }
      } catch {
        gid('lista-errores').innerHTML = '<li>Error de red. Intentá nuevamente.</li>'
        gid('resumen-errores').classList.remove('d-none')
      }
    })

    // Helper para obtener monto (necesario porque getMono se llama en el handler)
    function getMono() { return parseFloat(gid('Monto').value) }
  }, [])

  return (
    <>
      <Head><title>Registrar pago — Reserva #{data.reservaId} — Brisas de Oro</title></Head>
      <Navbar user={user} />
      <style jsx global>{`
        .detalle-label { font-size: .78rem; font-weight: 600; color: #6c757d; text-transform: uppercase; letter-spacing: .04em; }
        .detalle-valor { font-size: 1rem; }
        .saldo-cero     { color: #1A5C1A; }
        .saldo-deuda    { color: #dc3545; font-weight: bold; }
        .saldo-negativo { color: #198754; font-weight: bold; }
        @media (max-width: 767.98px) {
          .btn-volver-pago { display: flex !important; align-items: center !important; justify-content: center !important; }
          #resumen-row > div:nth-child(1) { order: 1; flex: 0 0 33.333% !important; max-width: 33.333% !important; }
          #resumen-row > div:nth-child(2) { order: 2; flex: 0 0 33.333% !important; max-width: 33.333% !important; }
          #resumen-row > div:nth-child(6) { order: 3; flex: 0 0 33.333% !important; max-width: 33.333% !important; }
          #resumen-row > div:nth-child(3) { order: 4; flex: 0 0 33.333% !important; max-width: 33.333% !important; margin-top: .75rem !important; }
          #resumen-row > div:nth-child(4) { order: 5; flex: 0 0 33.333% !important; max-width: 33.333% !important; margin-top: .75rem !important; }
          #resumen-row > div:nth-child(5) { order: 6; flex: 0 0 33.333% !important; max-width: 33.333% !important; margin-top: .75rem !important; display: flex !important; align-items: center !important; justify-content: center !important; font-weight: 700 !important; }
          #resumen-row > div:nth-child(7)  { order: 7;  flex: 0 0 100% !important; max-width: 100% !important; }
          #resumen-row > div:nth-child(8)  { order: 8;  flex: 0 0 100% !important; max-width: 100% !important; display: flex !important; justify-content: space-between !important; align-items: baseline !important; }
          #resumen-row > div:nth-child(9)  { order: 9;  flex: 0 0 100% !important; max-width: 100% !important; display: flex !important; justify-content: space-between !important; align-items: baseline !important; }
          #resumen-row > div:nth-child(10) { order: 10; flex: 0 0 100% !important; max-width: 100% !important; display: flex !important; justify-content: space-between !important; align-items: baseline !important; }
          #resumen-row .detalle-label,
          #resumen-row .detalle-valor { white-space: nowrap !important; }
          #resumen-row > div:nth-child(8) .detalle-valor,
          #resumen-row > div:nth-child(9) .detalle-valor,
          #resumen-row > div:nth-child(10) .detalle-valor { font-size: 1rem !important; }
          #resumen-row > div:nth-child(10) .detalle-valor { text-align: right !important; }
          #botones-pago { justify-content: center !important; }
          #botones-pago .btn { display: flex !important; align-items: center !important; justify-content: center !important; }
        }
      `}</style>

      <div className="container">
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h2 className="mb-0">Registrar pago</h2>
            <div className="d-flex gap-2">
              {from === 'calendario' && (
                <Link href="/gestion/calendario" className="btn btn-outline-secondary btn-sm btn-volver-pago">
                  <i className="bi bi-calendar3 me-1"></i>
                  <span className="d-none d-md-inline">Volver al calendario</span>
                  <span className="d-md-none">Calendario</span>
                </Link>
              )}
              <Link
                href={from === 'saldos' ? '/gestion/facturacion?tab=saldos' : `/gestion/reservas/${data.reservaId}`}
                className="btn btn-outline-secondary btn-sm btn-volver-pago"
              >
                <i className="bi bi-arrow-left me-1"></i>
                {from === 'saldos' ? (
                  <>
                    <span className="d-none d-md-inline">Volver a saldos pendientes</span>
                    <span className="d-md-none">Saldos pendientes</span>
                  </>
                ) : (
                  <>
                    <span className="d-none d-md-inline">Volver al detalle de la reserva</span>
                    <span className="d-md-none">Volver al detalle</span>
                  </>
                )}
              </Link>
            </div>
          </div>
        </div>

        <div id="resumen-errores" className="alert alert-danger d-none" role="alert">
          <strong>Corregí los siguientes errores:</strong>
          <ul className="mb-0 mt-1" id="lista-errores"></ul>
        </div>

        {/* Resumen readonly */}
        <div className="card mb-4 border-secondary">
          <div className="card-header fw-semibold bg-light">
            <i className="bi bi-receipt me-2"></i>Reserva #{data.reservaId} — Resumen
          </div>
          <div className="card-body py-2">
            <div className="row gx-2 gy-1" id="resumen-row">
              <div className="col-3">
                <div className="detalle-label">Titular</div>
                <div className="detalle-valor fw-semibold">{data.nombreHuesped}</div>
              </div>
              <div className="col-3">
                <div className="detalle-label">Alojamiento</div>
                <div className="detalle-valor">{data.nombreAlojamiento}</div>
              </div>
              <div className="col-2">
                <div className="detalle-label">Ingreso</div>
                <div className="detalle-valor">{data.fechaIngreso.split('-').reverse().join('/')}</div>
              </div>
              <div className="col-2">
                <div className="detalle-label">Salida</div>
                <div className="detalle-valor">{data.fechaSalida.split('-').reverse().join('/')}</div>
                <div className="text-muted small d-none d-md-block">
                  (<strong>{data.noches} noche{data.noches !== 1 ? 's' : ''}</strong>)
                </div>
              </div>
              <div className="col-2 d-md-none text-muted small">
                (<strong>{data.noches} noche{data.noches !== 1 ? 's' : ''}</strong>)
              </div>
              <div className="col-2">
                <div className="detalle-label">Tarifa por día</div>
                <div className="detalle-valor fw-semibold">
                  {data.tarifaDia != null
                    ? `$${data.tarifaDia.toLocaleString('es-AR')}`
                    : <span className="text-muted">—</span>}
                </div>
              </div>

              <div className="col-12"><hr className="my-1" /></div>

              <div className="col-4">
                <div className="detalle-label">Total estadía</div>
                <div className="detalle-valor fs-5 fw-semibold">${data.montoTotal.toLocaleString('es-AR')}</div>
              </div>
              <div className="col-4">
                <div className="detalle-label" style={{ color: '#198754', fontWeight: 'bold' }}>Total cobrado</div>
                <div className="detalle-valor fs-5 text-success fw-semibold">${data.totalCobrado.toLocaleString('es-AR')}</div>
              </div>
              <div className="col-4">
                <div className="detalle-label" style={{ fontSize: '1.1rem', color: '#dc3545', fontWeight: 'bold' }}>Saldo pendiente</div>
                <div className={`detalle-valor ${saldoClase}`} style={{ fontSize: '1.2rem' }}>
                  ${data.saldoPendiente.toLocaleString('es-AR')}
                  {data.saldoPendiente === 0 && (
                    <i className="bi bi-check-circle-fill fs-5 ms-1 text-success"></i>
                  )}
                  {data.saldoPendiente < 0 && (
                    <span className="d-block small fw-normal mt-1" style={{ color: '#000000' }}>(A devolver al cliente)</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Seña */}
        <div id="panel-sena" className="card mb-4" style={{ display: 'none', borderColor: '#90CAF9' }}>
          <div className="card-body py-3" style={{ backgroundColor: '#E3F2FD' }}>
            <div className="mb-2">
              <i className="bi bi-calculator me-1 text-primary"></i>
              <span className="fw-semibold text-primary small text-uppercase" style={{ letterSpacing: '.04em' }}>
                Calculadora de seña
              </span>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-auto">
                <label htmlFor="pct-sena" className="form-label mb-0 small">Porcentaje:</label>
              </div>
              <div className="col-auto">
                <div className="input-group input-group-sm" style={{ width: 120 }}>
                  <input type="number" id="pct-sena" className="form-control" min="1" max="100" step="1" defaultValue={40} />
                  <span className="input-group-text">%</span>
                </div>
              </div>
              <div className="col-auto">
                <span className="text-muted small">del total de ${data.montoTotal.toLocaleString('es-AR')}</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3 mt-3">
              <div>
                <span className="small text-muted">Monto sugerido:</span>
                <span id="monto-sugerido" className="fs-5 fw-bold text-primary ms-2">$0</span>
              </div>
              <button type="button" id="btn-usar-monto" className="btn btn-primary btn-sm">
                <i className="bi bi-arrow-down-circle me-1"></i>Usar este monto
              </button>
            </div>
            <span id="monto-sugerido-val" data-val="0" style={{ display: 'none' }}></span>
          </div>
        </div>

        {/* Formulario pago */}
        <form id="form-pago" noValidate>
          <div className="card mb-4">
            <div className="card-header fw-semibold bg-light">Datos del pago</div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label htmlFor="TipoPago" className="form-label">Concepto <span className="text-danger">*</span></label>
                  <select className="form-select" id="TipoPago" defaultValue={String(data.tipoPago)}>
                    <option value="0">Seña</option>
                    <option value="3">Pago parcial</option>
                    <option value="1">Cancelación total</option>
                    <option value="2">Ajuste / Corrección</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label htmlFor="MetodoPago" className="form-label">Método de pago <span className="text-danger">*</span></label>
                  <select className="form-select" id="MetodoPago">
                    <option value="1">Efectivo</option>
                    <option value="0">Transferencia</option>
                    <option value="2">Tarjeta crédito</option>
                    <option value="3">Tarjeta débito</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label htmlFor="Fecha" className="form-label">Fecha <span className="text-danger">*</span></label>
                  <input type="date" className="form-control" id="Fecha" />
                </div>
                <div className="col-md-4">
                  <label htmlFor="Monto" className="form-label">Monto <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input type="number" step="0.01" min="0.01" className="form-control" id="Monto" placeholder="0,00" />
                  </div>
                  <div id="aviso-exceso" className="alert alert-warning py-1 px-2 mt-2 small mb-0" style={{ display: 'none' }}>
                    <i className="bi bi-exclamation-triangle me-1"></i>
                    El monto supera el saldo pendiente. Verificá que sea correcto.
                  </div>
                </div>
                <div className="col-md-8">
                  <label htmlFor="Observaciones" className="form-label">Observaciones <span className="text-muted fw-normal small">(opcional)</span></label>
                  <input type="text" className="form-control" id="Observaciones" placeholder="Sin observaciones" />
                </div>
              </div>

              <div id="botones-pago" className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-success px-4" id="btn-registrar-pago">
                  <i className="bi bi-check-lg me-1"></i>Registrar pago
                </button>
                <Link href={`/gestion/reservas/${data.reservaId}`} className="btn btn-outline-secondary">
                  Cancelar
                </Link>
              </div>
            </div>
          </div>
        </form>

        {/* Modal confirmación pago */}
        <div className="modal fade" id="modal-confirmar-pago" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 460 }}>
            <div className="modal-content">
              <div className="modal-header py-2 bg-success bg-opacity-10">
                <h6 className="modal-title fw-semibold text-success-emphasis">Confirmar registro de pago</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body" style={{ fontSize: '.92rem' }}>
                <table className="table table-sm table-borderless mb-2">
                  <tbody>
                    <tr><th style={{ width: '40%' }}>Concepto</th><td id="conf-concepto">—</td></tr>
                    <tr><th>Monto</th><td id="conf-monto">—</td></tr>
                    <tr><th>Método</th><td id="conf-metodo">—</td></tr>
                    <tr><th>Fecha</th><td id="conf-fecha">—</td></tr>
                  </tbody>
                </table>
                <p className="mb-0 small">
                  ¿Confirmás el registro de este pago?{' '}
                  <strong>Esta acción no se puede deshacer.</strong>
                </p>
              </div>
              <div className="modal-footer py-2 gap-2">
                <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" className="btn btn-success btn-sm" id="btn-confirmar-pago">
                  <i className="bi bi-check-lg me-1"></i>Confirmar pago
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal sin excedente */}
        <div className="modal fade" id="modal-sin-excedente" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 420 }}>
            <div className="modal-content">
              <div className="modal-header py-2">
                <h6 className="modal-title fw-semibold">Ajuste / Corrección no disponible</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body small">
                No hay pagos en exceso registrados. Este concepto solo aplica cuando el total cobrado supera el monto de la estadía.
              </div>
              <div className="modal-footer py-2">
                <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Entendido</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
