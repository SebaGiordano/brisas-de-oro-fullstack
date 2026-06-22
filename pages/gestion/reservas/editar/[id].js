import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import Navbar from '@/components/gestion/Navbar'

export async function getServerSideProps(context) {
  const { req, res, params, query } = context
  const session = await getServerSession(req, res, authOptions)
  if (!session) return { redirect: { destination: '/login', permanent: false } }
  if (Number(session.user.rol) !== 0) return { redirect: { destination: '/gestion/inicio', permanent: false } }

  const proto  = req.headers['x-forwarded-proto'] ?? 'http'
  const host   = req.headers.host
  const apiUrl = `${proto}://${host}/api/gestion/reservas/editar/${params.id}`
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

export default function EditarReserva({ user, data, from }) {
  const router = useRouter()

  useEffect(() => {
    const RESERVA_ID    = data.id
    const allAloj       = data.alojamientos
    let capacidades     = Object.fromEntries(allAloj.map(a => [String(a.id), a.capacidad]))
    let totalFijo       = false
    let _confirmado     = false
    let debPersonas

    const gid = id => document.getElementById(id)

    function calcularNoches() {
      const fi = gid('FechaIngreso').value, fs = gid('FechaSalida').value
      if (!fi || !fs) return null
      const diff = Math.round((new Date(fs + 'T00:00:00') - new Date(fi + 'T00:00:00')) / 86400000)
      return diff > 0 ? diff : null
    }

    function habilitarCampo(id) { const el = gid(id); el.readOnly = false; el.classList.remove('campo-inactivo') }
    function bloquearCampo(id)  { const el = gid(id); el.readOnly = true;  el.classList.add('campo-inactivo') }
    function getCapacidad() { const id = gid('AlojamientoId').value; return id ? (capacidades[id] ?? null) : null }

    async function buscarDisponibles(prevAlojId = null) {
      const fi = gid('FechaIngreso').value, fs = gid('FechaSalida').value
      if (!fi || !fs) return
      const select = gid('AlojamientoId'), msg = gid('disponibilidad-msg')
      const curVal = prevAlojId ?? select.value
      msg.className = 'form-text text-muted'; msg.textContent = 'Verificando disponibilidad…'
      try {
        const url  = `/api/gestion/reservas/disponibles?fechaIngreso=${fi}&fechaEgreso=${fs}&excludeReservaId=${RESERVA_ID}`
        const resp = await fetch(url)
        const data = await resp.json()
        select.innerHTML = ''
        const opt0 = document.createElement('option')
        opt0.value = ''; opt0.textContent = '— Seleccioná un alojamiento —'; select.appendChild(opt0)
        data.forEach(a => {
          const opt = document.createElement('option')
          opt.value = a.id; opt.textContent = a.nombre; select.appendChild(opt)
        })
        capacidades = Object.fromEntries(data.map(a => [String(a.id), a.capacidad]))
        if (data.length === 0) {
          msg.className = 'form-text text-danger fw-semibold'
          msg.textContent = 'No hay alojamientos disponibles para las fechas seleccionadas.'
        } else {
          const cantUnidades = data.filter(a => !a.nombre.startsWith('Apart')).length
          msg.className = 'form-text text-success'
          msg.textContent = `${cantUnidades} de 16 unidades disponibles.`
        }
        if (curVal && select.querySelector(`option[value="${curVal}"]`)) {
          select.value = curVal
        } else if (curVal) {
          select.value = ''
          msg.className = 'form-text text-warning fw-semibold'
          msg.textContent = 'El alojamiento anterior no está disponible en las nuevas fechas.'
        }
        actualizarCantidadState(); actualizarPrecioState()
      } catch {
        msg.className = 'form-text text-danger'; msg.textContent = 'Error al verificar disponibilidad.'
      }
    }

    function aplicarModoInvitacion(esInv) {
      if (esInv) {
        bloquearCampo('PrecioPorDia'); gid('PrecioPorDia').value = '0'
        gid('precio-hint').textContent = 'Invitación — sin costo'
        habilitarCampo('MontoTotal')
        if (!gid('MontoTotal').value) gid('MontoTotal').value = '0'
        totalFijo = true; gid('total-hint').textContent = 'Podés registrar una colaboración voluntaria si aplica'
      } else {
        totalFijo = false; gid('MontoTotal').value = ''
        gid('total-hint').textContent = 'Se calcula automáticamente (precio × noches)'
        actualizarPrecioState(); actualizarNochesYTotal()
      }
    }

    function actualizarCantidadState() {
      const cap = getCapacidad(), input = gid('CantidadHuespedes'), hint = gid('capacidad-hint')
      if (cap) {
        input.disabled = false; input.max = cap
        hint.textContent = `Capacidad máxima: ${cap} personas`
        if (parseInt(input.value) > cap) input.value = cap
      } else {
        input.disabled = true; hint.textContent = 'Seleccioná un alojamiento primero'
      }
    }

    function actualizarPrecioState() {
      if (gid('EsInvitacion').checked) return
      const alojOk = !!gid('AlojamientoId').value
      const persOk = parseInt(gid('CantidadHuespedes').value) > 0
      if (alojOk && persOk) {
        habilitarCampo('PrecioPorDia'); gid('precio-hint').textContent = 'Ingresá el precio o aplicá un descuento sobre la tarifa'
      } else {
        bloquearCampo('PrecioPorDia'); gid('PrecioPorDia').value = ''
        gid('precio-hint').textContent = 'Completá alojamiento y personas para habilitar'
        bloquearCampo('MontoTotal'); gid('MontoTotal').value = ''
        gid('noches-display').value = ''
        gid('total-hint').textContent = 'Se calcula automáticamente (precio × noches)'
        totalFijo = false
      }
    }

    function actualizarNochesYTotal() {
      if (gid('EsInvitacion').checked) return
      const noches = calcularNoches()
      gid('noches-display').value = noches != null ? `${noches} noche${noches !== 1 ? 's' : ''}` : ''
      const precio = parseFloat(gid('PrecioPorDia').value)
      if (noches != null && precio > 0) {
        habilitarCampo('MontoTotal')
        if (!totalFijo) {
          gid('MontoTotal').value = (precio * noches).toFixed(2)
          gid('total-hint').textContent = 'Se calcula automáticamente (precio × noches)'
        }
      } else if (!totalFijo) {
        bloquearCampo('MontoTotal'); gid('MontoTotal').value = ''
      }
    }

    async function consultarPrecioSugerido() {
      if (gid('EsInvitacion').checked) return
      const alojId = gid('AlojamientoId').value
      const personas = parseInt(gid('CantidadHuespedes').value)
      if (!alojId || !personas || personas < 1) return
      const fecha = gid('FechaIngreso').value ?? ''
      try {
        const res  = await fetch(`/api/gestion/reservas/precio-sugerido?alojamientoId=${alojId}&personas=${personas}&fechaIngreso=${fecha}`)
        const d    = await res.json()
        const incluyeDesayuno = gid('IncluyeDesayuno').checked
        const precio = incluyeDesayuno ? d.precioConDesayuno : d.precioSinDesayuno
        if (precio != null && precio > 0) {
          habilitarCampo('PrecioPorDia'); gid('PrecioPorDia').value = precio
          const tempLabel = d.temporada ? ` — ${d.temporada}` : ''
          gid('precio-hint').textContent = `Tarifa configurada: $${precio}/día${tempLabel}`
          totalFijo = false; actualizarNochesYTotal()
        } else {
          gid('PrecioPorDia').value = ''
          gid('precio-hint').textContent = 'Sin tarifa configurada — ingresá el precio manualmente'
          totalFijo = false; actualizarNochesYTotal()
        }
      } catch { /* silencioso */ }
    }

    // Event listeners
    gid('EsInvitacion').addEventListener('change', function () { aplicarModoInvitacion(this.checked) })

    gid('FechaIngreso').addEventListener('change', function () {
      if (this.value) {
        const min = new Date(this.value + 'T00:00:00'); min.setDate(min.getDate() + 1)
        gid('FechaSalida').min = min.toISOString().split('T')[0]
        if (gid('FechaSalida').value && gid('FechaSalida').value <= this.value) gid('FechaSalida').value = ''
        gid('egreso-hint').textContent = ''
      } else {
        gid('egreso-hint').textContent = 'Seleccioná la fecha de ingreso primero'
      }
      actualizarNochesYTotal()
      if (gid('FechaIngreso').value && gid('FechaSalida').value) buscarDisponibles()
    })

    gid('FechaSalida').addEventListener('change', () => { actualizarNochesYTotal(); buscarDisponibles() })

    gid('AlojamientoId').addEventListener('change', () => {
      actualizarCantidadState(); gid('PrecioPorDia').value = ''
      totalFijo = false; actualizarNochesYTotal()
      gid('precio-hint').textContent = 'Buscando precio sugerido…'; consultarPrecioSugerido()
    })

    gid('CantidadHuespedes').addEventListener('input', function () {
      const cap = getCapacidad()
      if (cap && parseInt(this.value) > cap) this.value = cap
      if (parseInt(this.value) < 1 && this.value !== '') this.value = 1
      actualizarPrecioState()
      clearTimeout(debPersonas)
      debPersonas = setTimeout(() => {
        gid('PrecioPorDia').value = ''; totalFijo = false; actualizarNochesYTotal()
        gid('precio-hint').textContent = 'Buscando precio sugerido…'; consultarPrecioSugerido()
      }, 500)
    })

    gid('IncluyeDesayuno').addEventListener('change', () => { consultarPrecioSugerido() })
    gid('PrecioPorDia').addEventListener('input', () => { if (!totalFijo) actualizarNochesYTotal() })
    gid('MontoTotal').addEventListener('input', function () {
      if (!totalFijo) { totalFijo = true; gid('total-hint').textContent = 'Total editado manualmente — el precio por día no lo actualizará.' }
    })

    gid('form-reserva').addEventListener('submit', function (e) {
      const errores = [], esInv = gid('EsInvitacion').checked
      if (!gid('NombreHuesped').value.trim()) errores.push('El nombre del huésped es obligatorio.')
      if (!gid('AlojamientoId').value) errores.push('Seleccioná un alojamiento.')
      const personas = parseInt(gid('CantidadHuespedes').value)
      const cap = getCapacidad()
      if (!gid('CantidadHuespedes').value || personas < 1) errores.push('La cantidad de personas es obligatoria.')
      else if (cap && personas > cap) errores.push(`La cantidad supera la capacidad máxima (${cap} personas).`)
      const fi = gid('FechaIngreso').value, fs = gid('FechaSalida').value
      if (!fi) errores.push('La fecha de ingreso es obligatoria.')
      if (!fs) errores.push('La fecha de egreso es obligatoria.')
      else if (fi && fs <= fi) errores.push('La fecha de egreso debe ser posterior a la de ingreso.')
      if (!esInv) {
        if (!gid('PrecioPorDia').value || parseFloat(gid('PrecioPorDia').value) <= 0) errores.push('El precio por día es obligatorio.')
        if (!gid('MontoTotal').value || parseFloat(gid('MontoTotal').value) <= 0) errores.push('El total de la estadía es obligatorio.')
      }
      if (errores.length) {
        e.preventDefault(); _confirmado = false
        gid('lista-errores').innerHTML = errores.map(m => `<li>${m}</li>`).join('')
        gid('resumen-errores').classList.remove('d-none')
        gid('resumen-errores').scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      if (!_confirmado) {
        e.preventDefault()
        window.bootstrap?.Modal.getOrCreateInstance(gid('modal-confirmar-guardado')).show()
        return
      }
    })

    gid('btn-confirmar-guardado').addEventListener('click', async function () {
      _confirmado = true
      window.bootstrap?.Modal.getInstance(gid('modal-confirmar-guardado'))?.hide()
      const esInv = gid('EsInvitacion').checked
      const payload = {
        nombreHuesped:    gid('NombreHuesped').value.trim(),
        esInvitacion:     esInv,
        fechaIngreso:     gid('FechaIngreso').value,
        fechaSalida:      gid('FechaSalida').value,
        alojamientoId:    gid('AlojamientoId').value,
        cantidadHuespedes: gid('CantidadHuespedes').value,
        incluyeDesayuno:  gid('IncluyeDesayuno').checked,
        montoTotal:       gid('MontoTotal').value,
        telefono:         gid('Telefono').value,
        canalOrigen:      gid('CanalOrigen').value,
        observaciones:    gid('Observaciones').value,
      }
      const res = await fetch(`/api/gestion/reservas/editar/${RESERVA_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const d = await res.json()
      if (res.ok) {
        router.push(`/gestion/reservas/${RESERVA_ID}?mensaje=Reserva+actualizada&tipo=success`)
      } else {
        _confirmado = false
        const msgs = d.errores ?? ['Error al guardar los cambios']
        gid('lista-errores').innerHTML = msgs.map(m => `<li>${m}</li>`).join('')
        gid('resumen-errores').classList.remove('d-none')
        gid('resumen-errores').scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })

    // Inicialización
    ;(function init() {
      if (gid('EsInvitacion').checked) { aplicarModoInvitacion(true); return }
      actualizarCantidadState(); actualizarPrecioState()
      const fi = gid('FechaIngreso').value
      if (fi) {
        const min = new Date(fi + 'T00:00:00'); min.setDate(min.getDate() + 1)
        gid('FechaSalida').min = min.toISOString().split('T')[0]
      }
      const noches = calcularNoches()
      if (noches != null) gid('noches-display').value = `${noches} noche${noches !== 1 ? 's' : ''}`
      if (gid('PrecioPorDia').value && parseFloat(gid('PrecioPorDia').value) > 0) {
        habilitarCampo('PrecioPorDia'); gid('precio-hint').textContent = 'Ingresá el precio o aplicá un descuento sobre la tarifa'
      }
      if (gid('MontoTotal').value && parseFloat(gid('MontoTotal').value) > 0) {
        habilitarCampo('MontoTotal'); gid('total-hint').textContent = 'Se calcula automáticamente (precio × noches)'
      }
      if (gid('FechaIngreso').value && gid('FechaSalida').value)
        buscarDisponibles(String(data.alojamientoId))
    })()
  }, [])

  return (
    <>
      <Head><title>Editar Reserva #{data.id} — Brisas de Oro</title></Head>
      <Navbar user={user} />
      <style jsx global>{`
        .campo-inactivo { background-color: #e9ecef !important; cursor: not-allowed; }
        @media (max-width: 767.98px) {
          .btn-volver-editar, .btn-cancelar-editar { display: flex !important; align-items: center !important; justify-content: center !important; }
          #botones-editar { justify-content: center !important; }
          #botones-editar .btn { display: flex !important; align-items: center !important; justify-content: center !important; }
          #modal-confirmar-guardado .modal-content { height: auto !important; min-height: unset !important; }
          #modal-confirmar-guardado .modal-footer { padding-bottom: 1rem !important; }
        }
      `}</style>

      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Editar Reserva <span className="text-muted fw-normal">#{data.id}</span></h2>
          {from === 'listado'
            ? <Link href="/gestion/reservas" className="btn btn-outline-secondary btn-sm btn-volver-editar">
                <i className="bi bi-arrow-left me-1"></i>
                <span className="d-none d-md-inline">Volver al listado de reservas</span>
                <span className="d-md-none">Volver al listado</span>
              </Link>
            : <Link href={`/gestion/reservas/${data.id}`} className="btn btn-outline-secondary btn-sm btn-volver-editar">
                <i className="bi bi-arrow-left me-1"></i>Volver al detalle
              </Link>
          }
        </div>

        <div id="resumen-errores" className="alert alert-danger d-none" role="alert">
          <strong>Corregí los siguientes errores antes de guardar:</strong>
          <ul className="mb-0 mt-1" id="lista-errores"></ul>
        </div>

        <form id="form-reserva" noValidate>
          {/* Card 1: Titular */}
          <div className="card mb-3">
            <div className="card-header fw-semibold bg-light">Datos del titular</div>
            <div className="card-body">
              <div className="row g-3 align-items-center">
                <div className="col-md-7">
                  <label htmlFor="NombreHuesped" className="form-label">Nombre y apellido del titular <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" id="NombreHuesped" defaultValue={data.nombreHuesped} placeholder="Ej: Juan García" />
                </div>
                <div className="col-md-5 pt-md-4">
                  <div className="form-check form-check-lg border rounded p-3">
                    <input type="checkbox" className="form-check-input" id="EsInvitacion" defaultChecked={data.esInvitacion} />
                    <label htmlFor="EsInvitacion" className="form-check-label fw-semibold">
                      ¿Es invitación?
                      <span className="d-block text-muted fw-normal small">El precio queda en $0. El total es editable por colaboración voluntaria.</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Fechas */}
          <div className="card mb-3">
            <div className="card-header fw-semibold bg-light">Fechas de estadía</div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label htmlFor="FechaIngreso" className="form-label">Fecha de ingreso <span className="text-danger">*</span></label>
                  <input type="date" className="form-control" id="FechaIngreso" defaultValue={data.fechaIngreso} />
                </div>
                <div className="col-md-4">
                  <label htmlFor="FechaSalida" className="form-label">Fecha de egreso <span className="text-danger">*</span></label>
                  <input type="date" className="form-control" id="FechaSalida" defaultValue={data.fechaSalida} />
                  <div className="form-text" id="egreso-hint"></div>
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted">Cantidad de noches</label>
                  <input type="text" className="form-control bg-light text-center fw-semibold" id="noches-display" readOnly placeholder="Automático" />
                  <div className="form-text">Calculado según las fechas</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Alojamiento */}
          <div className="card mb-3">
            <div className="card-header fw-semibold bg-light">Alojamiento</div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-5">
                  <label htmlFor="AlojamientoId" className="form-label">Alojamiento <span className="text-danger">*</span></label>
                  <select className="form-select" id="AlojamientoId" defaultValue={String(data.alojamientoId)}>
                    <option value="">— Seleccioná un alojamiento —</option>
                    {data.alojamientos.map(a => (
                      <option key={a.id} value={String(a.id)}>{a.nombre}</option>
                    ))}
                  </select>
                  <div id="disponibilidad-msg" className="form-text"></div>
                </div>
                <div className="col-md-3">
                  <label htmlFor="CantidadHuespedes" className="form-label">Cantidad de personas <span className="text-danger">*</span></label>
                  <input type="number" className="form-control" id="CantidadHuespedes" min="1" defaultValue={data.cantidadHuespedes} />
                  <div id="capacidad-hint" className="form-text">Cargando capacidad…</div>
                </div>
                <div className="col-md-4 d-flex align-items-center">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="IncluyeDesayuno" defaultChecked={data.incluyeDesayuno} />
                    <label htmlFor="IncluyeDesayuno" className="form-check-label fw-normal">¿Incluye desayuno?</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Precios */}
          <div className="card mb-3">
            <div className="card-header fw-semibold bg-light">Precios</div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label htmlFor="PrecioPorDia" className="form-label">Precio por día <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input type="number" step="0.01" min="0" className="form-control campo-inactivo" id="PrecioPorDia"
                      defaultValue={data.precioPorDia || ''} placeholder="0,00" readOnly />
                  </div>
                  <div className="form-text" id="precio-hint">Completá alojamiento y personas para habilitar</div>
                </div>
                <div className="col-md-4">
                  <label htmlFor="MontoTotal" className="form-label">Total de la estadía <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input type="number" step="0.01" min="0" className="form-control campo-inactivo" id="MontoTotal"
                      defaultValue={data.montoTotal || ''} placeholder="0,00" readOnly />
                  </div>
                  <div className="form-text" id="total-hint">Se calcula automáticamente (precio × noches)</div>
                </div>
                <div className="col-md-4 d-flex align-items-center">
                  <div className="alert alert-info py-2 px-3 mb-0 small w-100">
                    <strong>Editable:</strong> podés ajustar precio o total para aplicar descuentos. Si editás el total manualmente, no se recalculará automáticamente.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Información adicional */}
          <div className="card mb-4">
            <div className="card-header fw-semibold bg-light">Información adicional <span className="text-muted fw-normal small">(opcional)</span></div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label htmlFor="Telefono" className="form-label">Teléfono de contacto</label>
                  <input type="tel" className="form-control" id="Telefono" defaultValue={data.telefono || ''} placeholder="+54 9 354 000-0000" />
                </div>
                <div className="col-md-3">
                  <label htmlFor="CanalOrigen" className="form-label">Canal de origen</label>
                  <select className="form-select" id="CanalOrigen" defaultValue={data.canalOrigen || ''}>
                    <option value="">— Sin especificar —</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Página web">Página web</option>
                    <option value="Recomendación">Recomendación</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="col-md-5">
                  <label htmlFor="Observaciones" className="form-label">Observaciones</label>
                  <textarea className="form-control" id="Observaciones" rows={2} defaultValue={data.observaciones || ''} placeholder="Sin observaciones"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div id="botones-editar" className="d-flex gap-2 mb-5">
            <button type="submit" className="btn btn-primary px-4">
              <i className="bi bi-check-lg me-1"></i>Guardar cambios
            </button>
            <Link href={`/gestion/reservas/${data.id}`} className="btn btn-outline-secondary btn-cancelar-editar">Cancelar</Link>
          </div>
        </form>

        {/* Modal confirmación */}
        <div className="modal fade" id="modal-confirmar-guardado" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 460 }}>
            <div className="modal-content">
              <div className="modal-header py-2">
                <h6 className="modal-title fw-semibold">Confirmar cambios</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body" style={{ fontSize: '.92rem' }}>
                ¿Confirmás que querés guardar los cambios en esta reserva? Si la reserva tiene pagos registrados, modificar fechas o montos puede afectar el saldo pendiente.
              </div>
              <div className="modal-footer py-2 gap-2">
                <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" className="btn btn-primary btn-sm" id="btn-confirmar-guardado">
                  <i className="bi bi-check-lg me-1"></i>Sí, guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
