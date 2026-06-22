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
        .detalle-label { font-size: .78rem; text-transform: uppercase; letter-spacing: .04em; color: #6c757d; font-weight: 600; margin-bottom: .1rem; }
        .saldo-deuda    { color: #dc3545; font-weight: 700; }
        .saldo-cero     { color: #198754; font-weight: 700; }
        .saldo-negativo { color: #0d6efd; font-weight: 700; }
        @media (max-width: 767.98px) {
          #resumen-row { display: flex; flex-direction: column; }
          #resumen-row .col-divider { order: 6; }
          .btn-volver-pago { display: flex !important; align-items: center !important; justify-content: center !important; }
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
              <Link href={`/gestion/reservas/${data.reservaId}`} className="btn btn-outline-secondary btn-sm btn-volver-pago">
                <i className="bi bi-arrow-left me-1"></i>
                <span className="d-none d-md-inline">Volver al detalle de la reserva</span>
                <span className="d-md-none">Volver al detalle</span>
              </Link>
            </div>
          </div>
          <p className="text-muted small mt-1 mb-0">
            Reserva #{data.reservaId} — {data.nombreHuesped}
          </p>
        </div>

        <div id="resumen-errores" className="alert alert-danger d-none" role="alert">
          <strong>Corregí los siguientes errores:</strong>
          <ul className="mb-0 mt-1" id="lista-errores"></ul>
        </div>

        {/* Resumen readonly */}
        <div className="card mb-4">
          <div className="card-header fw-semibold bg-light">Resumen de la reserva</div>
          <div className="card-body">
            <div className="row g-3" id="resumen-row">
              <div className="col-6 col-md-3">
                <div className="detalle-label">Titular</div>
                <div className="fw-semibold">{data.nombreHuesped}</div>
              </div>
              <div className="col-6 col-md-3">
                <div className="detalle-label">Alojamiento</div>
                <div>{data.nombreAlojamiento}</div>
              </div>
              <div className="col-6 col-md-3">
                <div className="detalle-label">Ingreso</div>
                <div>{data.fechaIngreso}</div>
              </div>
              <div className="col-6 col-md-3">
                <div className="detalle-label">Salida</div>
                <div>{data.fechaSalida}</div>
              </div>
              <div className="col-6 col-md-3">
                <div className="detalle-label">Noches</div>
                <div>{data.noches}</div>
              </div>
              <div className="col-6 col-md-3">
                <div className="detalle-label">Tarifa/día</div>
                <div>{data.tarifaDia != null ? `$${data.tarifaDia.toLocaleString('es-AR')}` : '—'}</div>
              </div>
              <div className="col-12 col-divider"><hr className="my-1" /></div>
              <div className="col-6 col-md-3">
                <div className="detalle-label">Total estadía</div>
                <div className="fw-semibold">${data.montoTotal.toLocaleString('es-AR')}</div>
              </div>
              <div className="col-6 col-md-3">
                <div className="detalle-label">Total cobrado</div>
                <div>${data.totalCobrado.toLocaleString('es-AR')}</div>
              </div>
              <div className="col-6 col-md-3">
                <div className="detalle-label">Saldo pendiente</div>
                <div className={saldoClase}>
                  {data.saldoPendiente < 0
                    ? `−$${Math.abs(data.saldoPendiente).toLocaleString('es-AR')}`
                    : `$${data.saldoPendiente.toLocaleString('es-AR')}`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Seña */}
        <div id="panel-sena" className="card mb-3 border-warning" style={{ display: 'none' }}>
          <div className="card-header bg-warning bg-opacity-10 fw-semibold text-warning-emphasis">Calculadora de seña</div>
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-auto">
                <label htmlFor="pct-sena" className="form-label mb-1">Porcentaje de seña</label>
                <div className="input-group" style={{ maxWidth: 160 }}>
                  <input type="number" id="pct-sena" className="form-control" min="1" max="100" defaultValue={40} />
                  <span className="input-group-text">%</span>
                </div>
              </div>
              <div className="col-auto">
                <div className="detalle-label">Monto sugerido</div>
                <div className="fs-5 fw-bold" id="monto-sugerido">$0</div>
                <span id="monto-sugerido-val" data-val="0" style={{ display: 'none' }}></span>
              </div>
              <div className="col-auto">
                <button type="button" className="btn btn-outline-warning btn-sm" id="btn-usar-monto">
                  Usar este monto
                </button>
              </div>
            </div>
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
                <div className="col-md-5">
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
                <div className="col-md-7">
                  <label htmlFor="Observaciones" className="form-label">Observaciones <span className="text-muted fw-normal small">(opcional)</span></label>
                  <input type="text" className="form-control" id="Observaciones" placeholder="Sin observaciones" />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <button type="submit" className="btn btn-success px-4">
              <i className="bi bi-cash-coin me-1"></i>Registrar pago
            </button>
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
