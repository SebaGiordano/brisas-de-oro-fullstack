import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import Navbar from '@/components/gestion/Navbar'
import Footer from '@/components/gestion/Footer'

export async function getServerSideProps({ req, res, query }) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return { redirect: { destination: '/login', permanent: false } }
  if (Number(session.user.rol) !== 0) return { redirect: { destination: '/gestion/inicio', permanent: false } }
  return {
    props: {
      user: { id: session.user.id ?? null, userName: session.user.userName ?? null, rol: session.user.rol ?? null },
      from: query.from ?? null,
    },
  }
}

export default function NuevaReserva({ user, from }) {
  const router = useRouter()

  useEffect(() => {
    let capacidades = {}
    let totalFijo   = false
    let _debPrecio

    const gid = id => document.getElementById(id)

    function calcularNoches() {
      const fi = gid('FechaIngreso').value, fs = gid('FechaSalida').value
      if (!fi || !fs) return null
      const diff = Math.round((new Date(fs + 'T00:00:00') - new Date(fi + 'T00:00:00')) / 86400000)
      return diff > 0 ? diff : null
    }

    function habilitarCampo(id) { const el = gid(id); el.readOnly = false; el.classList.remove('campo-inactivo') }
    function bloquearCampo(id)  { const el = gid(id); el.readOnly = true;  el.classList.add('campo-inactivo') }

    function getCapacidad() {
      const id = gid('AlojamientoId').value
      return id ? (capacidades[id] ?? null) : null
    }

    function resetDownstreamDeAlojamiento() {
      const c = gid('CantidadHuespedes')
      c.disabled = true; c.value = ''
      gid('capacidad-hint').textContent = 'Seleccioná un alojamiento primero'
      bloquearCampo('PrecioPorDia'); bloquearCampo('MontoTotal')
      gid('PrecioPorDia').value = ''; gid('MontoTotal').value = ''
      gid('total-hint').textContent = 'Se calcula automáticamente (precio × noches)'
      totalFijo = false
    }

    async function buscarDisponibles() {
      const fi = gid('FechaIngreso').value, fs = gid('FechaSalida').value
      if (!fi || !fs) return
      const select = gid('AlojamientoId'), msg = gid('disponibilidad-msg')
      select.disabled = true
      select.innerHTML = '<option value="">Verificando disponibilidad…</option>'
      msg.className = 'form-text text-muted'; msg.textContent = ''
      resetDownstreamDeAlojamiento()
      try {
        const resp = await fetch(`/api/gestion/reservas/disponibles?fechaIngreso=${fi}&fechaEgreso=${fs}`)
        const data = await resp.json()
        select.innerHTML = ''
        if (data.length === 0) {
          select.innerHTML = '<option value="">— Sin disponibilidad —</option>'
          msg.className = 'form-text text-danger fw-semibold'
          msg.textContent = 'No hay alojamientos disponibles para las fechas seleccionadas.'
        } else {
          const opt0 = document.createElement('option')
          opt0.value = ''; opt0.textContent = '— Seleccioná un alojamiento —'
          select.appendChild(opt0)
          data.forEach(a => {
            const opt = document.createElement('option')
            opt.value = a.id; opt.textContent = a.nombre
            select.appendChild(opt)
          })
          capacidades = Object.fromEntries(data.map(a => [String(a.id), a.capacidad]))
          select.disabled = false
          const cantUnidades = data.filter(a => !a.nombre.startsWith('Apart')).length
          msg.className = 'form-text text-success'
          msg.textContent = `${cantUnidades} de 16 unidades disponibles.`
        }
      } catch {
        select.innerHTML = '<option value="">— Error al verificar —</option>'
        select.disabled = false
        msg.className = 'form-text text-danger'
        msg.textContent = 'Error al verificar disponibilidad. Intentá de nuevo.'
      }
    }

    function aplicarModoInvitacion(esInv) {
      if (esInv) {
        bloquearCampo('PrecioPorDia'); gid('PrecioPorDia').value = '0'
        gid('precio-hint').textContent = 'Invitación — sin costo'
        habilitarCampo('MontoTotal')
        if (!gid('MontoTotal').value) gid('MontoTotal').value = '0'
        totalFijo = true
        gid('total-hint').textContent = 'Podés registrar una colaboración voluntaria si aplica'
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
        input.disabled = true; input.value = ''
        hint.textContent = 'Seleccioná un alojamiento primero'
      }
    }

    function actualizarPrecioState() {
      if (gid('EsInvitacion').checked) return
      const alojOk = !!gid('AlojamientoId').value
      const persOk = parseInt(gid('CantidadHuespedes').value) > 0
      if (alojOk && persOk) {
        habilitarCampo('PrecioPorDia')
        gid('precio-hint').textContent = 'Ingresá el precio o aplicá un descuento sobre la tarifa'
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
        const data = await res.json()
        const incluyeDesayuno = gid('IncluyeDesayuno').checked
        const precio = incluyeDesayuno ? data.precioConDesayuno : data.precioSinDesayuno
        if (precio != null && precio > 0) {
          habilitarCampo('PrecioPorDia'); gid('PrecioPorDia').value = precio
          const tempLabel = data.temporada ? ` — ${data.temporada}` : ''
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
      const egreso = gid('FechaSalida')
      if (this.value) {
        const min = new Date(this.value + 'T00:00:00'); min.setDate(min.getDate() + 1)
        egreso.min = min.toISOString().split('T')[0]
        if (egreso.value && egreso.value <= this.value) egreso.value = ''
        egreso.disabled = false; gid('egreso-hint').textContent = ''
      } else {
        egreso.disabled = true; egreso.value = ''
        gid('egreso-hint').textContent = 'Seleccioná la fecha de ingreso primero'
      }
      const select = gid('AlojamientoId')
      select.disabled = true; select.innerHTML = '<option value="">— Seleccioná las fechas primero —</option>'
      gid('disponibilidad-msg').textContent = ''; capacidades = {}
      resetDownstreamDeAlojamiento(); actualizarNochesYTotal()
    })

    gid('FechaSalida').addEventListener('change', () => { actualizarNochesYTotal(); buscarDisponibles() })

    gid('AlojamientoId').addEventListener('change', () => {
      actualizarCantidadState(); actualizarPrecioState()
      gid('precio-hint').textContent = 'Buscando tarifa…'; consultarPrecioSugerido()
    })

    gid('IncluyeDesayuno').addEventListener('change', () => { consultarPrecioSugerido() })

    gid('CantidadHuespedes').addEventListener('input', function () {
      const cap = getCapacidad()
      if (cap && parseInt(this.value) > cap) this.value = cap
      if (parseInt(this.value) < 1 && this.value !== '') this.value = 1
      actualizarPrecioState()
      clearTimeout(_debPrecio)
      _debPrecio = setTimeout(() => { gid('precio-hint').textContent = 'Buscando tarifa…'; consultarPrecioSugerido() }, 400)
    })

    gid('PrecioPorDia').addEventListener('input', () => { if (!totalFijo) actualizarNochesYTotal() })

    gid('MontoTotal').addEventListener('input', function () {
      if (!totalFijo) { totalFijo = true; gid('total-hint').textContent = 'Total editado manualmente — el precio por día no lo actualizará.' }
    })

    // Modal confirmación
    function formatFecha(val) {
      if (!val) return '—'; const [y, m, d] = val.split('-'); return `${d}/${m}/${y}`
    }

    function poblarModalResumen() {
      const alojSelect = gid('AlojamientoId')
      const alojNombre = alojSelect.selectedIndex >= 0 ? alojSelect.options[alojSelect.selectedIndex].text : '—'
      const esInv = gid('EsInvitacion').checked
      const noches = calcularNoches()
      const personas = parseInt(gid('CantidadHuespedes').value) || 0
      const precio   = parseFloat(gid('PrecioPorDia').value) || 0
      const total    = parseFloat(gid('MontoTotal').value) || 0
      const fmtNum   = n => n.toLocaleString('es-AR')
      const rows = [
        ['Titular',              gid('NombreHuesped').value.trim()],
        ['¿Es invitación?',      esInv ? 'Sí' : 'No'],
        ['Fecha de ingreso',     formatFecha(gid('FechaIngreso').value)],
        ['Fecha de egreso',      formatFecha(gid('FechaSalida').value)],
        ['Cantidad de noches',   noches != null ? `${noches} noche${noches !== 1 ? 's' : ''}` : '—'],
        ['Alojamiento',          alojNombre],
        ['Cantidad de personas', personas > 0 ? `${personas} persona${personas !== 1 ? 's' : ''}` : '—'],
        ['Incluye desayuno',     gid('IncluyeDesayuno').checked ? 'Sí' : 'No'],
        ['Precio por día',       esInv ? 'Invitación (sin costo)' : `$${fmtNum(precio)}`],
        ['Total de estadía',     `$${fmtNum(total)}${esInv ? ' (Invitación)' : ''}`],
        ['Teléfono de contacto', gid('Telefono').value.trim() || 'Sin especificar'],
        ['Canal de origen',      gid('CanalOrigen').value || 'Sin especificar'],
        ['Observaciones',        gid('Observaciones').value.trim() || 'Sin observaciones'],
      ]
      gid('modal-resumen-reserva').innerHTML =
        `<table class="table table-sm table-borderless mb-0">` +
        rows.map(([label, value]) =>
          `<tr><td class="text-muted pe-3" style="white-space:nowrap;width:1%;font-size:.85rem;">${label}</td>` +
          `<td class="fw-semibold" style="font-size:.9rem;">${value}</td></tr>`
        ).join('') + `</table>`
    }

    gid('form-reserva').addEventListener('submit', function (e) {
      const errores = []
      const esInv   = gid('EsInvitacion').checked
      const today   = new Date().toISOString().split('T')[0]
      const fi      = gid('FechaIngreso').value
      const fs      = gid('FechaSalida').value

      if (!gid('NombreHuesped').value.trim()) errores.push('Nombre y apellido del titular — Obligatorio')
      if (!fi) errores.push('Fecha de ingreso — Obligatorio')
      else if (fi < today) errores.push('Fecha de ingreso — No puede ser anterior a hoy')
      if (!fs) errores.push('Fecha de egreso — Obligatorio')
      else if (fi && fs <= fi) errores.push('Fecha de egreso — Debe ser posterior a la fecha de ingreso')
      if (!gid('AlojamientoId').value) errores.push('Alojamiento — Obligatorio')
      const personas = parseInt(gid('CantidadHuespedes').value)
      const cap = getCapacidad()
      if (!gid('CantidadHuespedes').value || personas < 1) errores.push('Cantidad de personas — Obligatorio')
      else if (cap && personas > cap) errores.push(`Cantidad de personas — Supera la capacidad máxima (${cap} personas)`)
      if (!esInv) {
        if (!gid('PrecioPorDia').value || parseFloat(gid('PrecioPorDia').value) <= 0)
          errores.push('Precio por día — Obligatorio')
        if (!gid('MontoTotal').value || parseFloat(gid('MontoTotal').value) <= 0)
          errores.push('Total de la estadía — Obligatorio')
      }
      if (errores.length) {
        e.preventDefault()
        gid('lista-errores').innerHTML = errores.map(m => `<li>${m}</li>`).join('')
        gid('resumen-errores').classList.remove('d-none')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      e.preventDefault()
      poblarModalResumen()
      window.bootstrap?.Modal.getOrCreateInstance(gid('modal-confirmar-reserva')).show()
    })

    gid('btn-confirmar-reserva').addEventListener('click', async function () {
      window.bootstrap?.Modal.getInstance(gid('modal-confirmar-reserva'))?.hide()
      const fi = gid('FechaIngreso').value, fs = gid('FechaSalida').value
      const esInv = gid('EsInvitacion').checked
      const payload = {
        nombreHuesped:    gid('NombreHuesped').value.trim(),
        esInvitacion:     esInv,
        fechaIngreso:     fi,
        fechaSalida:      fs,
        alojamientoId:    gid('AlojamientoId').value,
        cantidadHuespedes: gid('CantidadHuespedes').value,
        incluyeDesayuno:  gid('IncluyeDesayuno').checked,
        precioPorDia:     gid('PrecioPorDia').value,
        montoTotal:       gid('MontoTotal').value,
        telefono:         gid('Telefono').value,
        canalOrigen:      gid('CanalOrigen').value,
        observaciones:    gid('Observaciones').value,
      }
      const res = await fetch('/api/gestion/reservas/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok) {
        router.push(`/gestion/reservas/${data.id}?mensaje=Reserva+creada+exitosamente&tipo=success`)
      } else {
        const msgs = data.errores ?? ['Error al guardar la reserva']
        gid('lista-errores').innerHTML = msgs.map(m => `<li>${m}</li>`).join('')
        gid('resumen-errores').classList.remove('d-none')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })

    // Inicialización
    gid('FechaIngreso').min = new Date().toISOString().split('T')[0]
    if (gid('EsInvitacion').checked) aplicarModoInvitacion(true)
  }, [])

  return (
    <>
      <Head><title>Nueva Reserva — Brisas de Oro</title></Head>
      <Navbar user={user} />
      <style jsx global>{`
        .campo-inactivo { background-color: #e9ecef !important; cursor: not-allowed; }
        @media (max-width: 767.98px) {
          .btn-nav-crear { display: flex !important; align-items: center !important; justify-content: center !important; }
          #botones-crear { justify-content: center !important; }
          #botones-crear .btn { display: flex !important; align-items: center !important; justify-content: center !important; }
          #modal-confirmar-reserva .modal-content { height: auto !important; min-height: unset !important; }
          #modal-confirmar-reserva .modal-footer { padding-bottom: 1rem !important; }
        }
        @media (min-width: 769px) {
          #botones-crear { justify-content: center !important; }
        }
      `}</style>

      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Nueva Reserva</h2>
          <Link href="/gestion/reservas" className="btn btn-outline-secondary btn-sm btn-nav-crear">
            {from === 'listado'
              ? <><span className="d-none d-md-inline">← Volver al listado de reservas</span><span className="d-md-none">← Volver al listado</span></>
              : 'Ir al listado de reservas →'}
          </Link>
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
                  <label htmlFor="NombreHuesped" className="form-label">
                    Nombre y apellido del titular <span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" id="NombreHuesped" placeholder="Ej: Juan García" />
                </div>
                <div className="col-md-5 pt-md-4">
                  <div className="form-check form-check-lg border rounded p-3">
                    <input type="checkbox" className="form-check-input" id="EsInvitacion" />
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
                  <input type="date" className="form-control" id="FechaIngreso" />
                </div>
                <div className="col-md-4">
                  <label htmlFor="FechaSalida" className="form-label">Fecha de egreso <span className="text-danger">*</span></label>
                  <input type="date" className="form-control" id="FechaSalida" disabled />
                  <div className="form-text" id="egreso-hint">Seleccioná la fecha de ingreso primero</div>
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
                  <select className="form-select" id="AlojamientoId" disabled>
                    <option value="">— Seleccioná las fechas primero —</option>
                  </select>
                  <div id="disponibilidad-msg" className="form-text"></div>
                </div>
                <div className="col-md-3">
                  <label htmlFor="CantidadHuespedes" className="form-label">Cantidad de personas <span className="text-danger">*</span></label>
                  <input type="number" className="form-control" id="CantidadHuespedes" min="1" disabled />
                  <div id="capacidad-hint" className="form-text">Seleccioná un alojamiento primero</div>
                </div>
                <div className="col-md-4 d-flex align-items-center">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="IncluyeDesayuno" />
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
                    <input type="number" step="0.01" min="0" className="form-control campo-inactivo" id="PrecioPorDia" placeholder="0,00" readOnly />
                  </div>
                  <div className="form-text" id="precio-hint">Completá alojamiento y personas para habilitar</div>
                </div>
                <div className="col-md-4">
                  <label htmlFor="MontoTotal" className="form-label">Total de la estadía <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input type="number" step="0.01" min="0" className="form-control campo-inactivo" id="MontoTotal" placeholder="0,00" readOnly />
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
                  <input type="tel" className="form-control" id="Telefono" placeholder="+54 9 354 000-0000" />
                </div>
                <div className="col-md-3">
                  <label htmlFor="CanalOrigen" className="form-label">Canal de origen</label>
                  <select className="form-select" id="CanalOrigen">
                    <option value="">— Sin especificar —</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Página web">Página web</option>
                    <option value="Recomendación">Recomendación</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="col-md-5">
                  <label htmlFor="Observaciones" className="form-label">Observaciones</label>
                  <textarea className="form-control" id="Observaciones" rows={2} placeholder="Sin observaciones"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div id="botones-crear" className="d-flex gap-2 mb-5">
            <button type="submit" className="btn btn-primary px-4">Guardar Reserva</button>
            <Link href="/gestion/reservas" className="btn btn-outline-secondary">Cancelar</Link>
          </div>
        </form>

        {/* Modal confirmación */}
        <div className="modal fade" id="modal-confirmar-reserva" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 480 }}>
            <div className="modal-content">
              <div className="modal-header py-2">
                <h5 className="modal-title fw-semibold">
                  <i className="bi bi-check2-circle me-2 text-success"></i>Confirmar nueva reserva
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body pb-1">
                <div id="modal-resumen-reserva"></div>
              </div>
              <div className="modal-footer py-2 gap-2">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  <i className="bi bi-arrow-left me-1"></i>Volver y corregir
                </button>
                <button type="button" className="btn btn-success px-4" id="btn-confirmar-reserva">
                  <i className="bi bi-check-lg me-1"></i>Confirmar y guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
