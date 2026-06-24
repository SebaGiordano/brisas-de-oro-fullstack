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

  const proto  = req.headers['x-forwarded-proto'] ?? 'http'
  const host   = req.headers.host
  const params = new URLSearchParams()
  if (query.temporadaId) params.set('temporadaId', query.temporadaId)
  const apiUrl = `${proto}://${host}/api/gestion/tarifas?${params}`

  const response = await fetch(apiUrl, { headers: { cookie: req.headers.cookie ?? '' } })
  const data = response.ok
    ? await response.json()
    : { grupos: [], temporadaActivaId: null, temporadas: [], ultimoAjuste: null }

  return {
    props: {
      user: { id: session.user.id ?? null, userName: session.user.userName ?? null, rol: session.user.rol ?? null },
      data,
      mensaje: query.mensaje ?? null,
      mensajeTipo: query.tipo ?? 'success',
    },
  }
}

// Tipo Prisma: 0=Cabaña 1=Habitacion 2=Apart
const TIPO_HABITACION = 1
const TIPO_APART      = 2
const TIPO_CABANA     = 0

function buildRows(src, personas, alojFilter) {
  return personas.map((p, i) => {
    const srcFil = alojFilter ? src.filter(g => alojFilter(g, p)) : src
    const tars   = srcFil.flatMap(g => g.tarifas.filter(t => t.cantidadPersonas === p))
    const cds    = tars.filter(t => t.precioConDesayuno > 0).map(t => t.precioConDesayuno)
    const sds    = tars.filter(t => t.precioSinDesayuno > 0).map(t => t.precioSinDesayuno)

    const filas = srcFil.map(g => {
      const tar = g.tarifas.find(t => t.cantidadPersonas === p)
      return {
        id:     tar?.id ?? 0,
        alojId: g.alojamientoId,
        nombre: g.nombreAlojamiento,
        cd:     tar?.precioConDesayuno ?? 0,
        sd:     tar?.precioSinDesayuno ?? 0,
      }
    })

    return {
      idx:  i,
      pers: p,
      span: personas.length,
      cd:   cds.length ? Math.round(cds.reduce((a, b) => a + b, 0) / cds.length) : 0,
      sd:   sds.length ? Math.round(sds.reduce((a, b) => a + b, 0) / sds.length) : 0,
      filas,
    }
  })
}

function buildTablaGrupos(grupos) {
  const srcHab    = grupos.filter(g => g.tipo === TIPO_HABITACION)
  const srcApart  = grupos.filter(g => g.tipo === TIPO_APART)
  const srcCChica = grupos.filter(g => g.tipo === TIPO_CABANA && g.nombreAlojamiento === 'Cabaña 7')
  const srcCMed   = grupos.filter(g => g.tipo === TIPO_CABANA && g.nombreAlojamiento !== 'Cabaña 7' && g.nombreAlojamiento !== 'Cabaña 8')
  const srcCGrand = grupos.filter(g => g.tipo === TIPO_CABANA && g.nombreAlojamiento === 'Cabaña 8')

  return [
    { label: 'HABITACIONES',   tipo: 'Habitacion', activo: srcHab.length > 0,    rows: buildRows(srcHab, [1, 2, 3, 4]) },
    {
      label: 'APART', tipo: 'Apart', activo: srcApart.length > 0,
      rows: buildRows(srcApart, [2, 3, 4, 5], (g, p) =>
        p === 2 ? g.nombreAlojamiento.startsWith('Habitación') : g.nombreAlojamiento.startsWith('Apart')),
    },
    { label: 'CABAÑA CHICA',   tipo: 'Cabaña', activo: srcCChica.length > 0, rows: buildRows(srcCChica, [1, 2, 3]) },
    { label: 'CABAÑA MEDIANA', tipo: 'Cabaña', activo: srcCMed.length > 0,   rows: buildRows(srcCMed, [1, 2, 3, 4, 5, 6]) },
    { label: 'CABAÑA GRANDE',  tipo: 'Cabaña', activo: srcCGrand.length > 0, rows: buildRows(srcCGrand, [3, 4, 5, 6, 7, 8]) },
  ]
}

const TIPO_LABELS = {
  todos:      'todas las unidades',
  habitacion: 'todas las Habitaciones',
  'cabaña':   'todas las Cabañas',
  apart:      'todos los Aparts',
}
const SERV_LABELS = {
  ambos:          'ambos servicios',
  'con-desayuno': 'Con desayuno',
  'sin-desayuno': 'Sin desayuno',
}

export default function TarifasIndex({ user, data, mensaje, mensajeTipo }) {
  const router  = useRouter()
  const esAdmin = Number(user.rol) === 0
  const { grupos = [], temporadaActivaId, temporadas = [], ultimoAjuste } = data

  const tablaGrupos = buildTablaGrupos(grupos)

  useEffect(() => {
    // ── Modal edición de grupo ────────────────────────────────────────────────
    const abreviarNombre = n => n
      .replace(/^Habitación\s+/, 'Hab. ')
      .replace(/^Apart\s+/,      'Ap. ')
      .replace(/^Cabaña\s+/,     'Cab. ')

    const enc = s => String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;')

    function onEditClick() {
      const label = this.dataset.label
      const pers  = parseInt(this.dataset.pers)
      const filas = JSON.parse(this.dataset.filas)

      document.getElementById('modal-eg-titulo').textContent =
        `${label} — ${pers} persona${pers !== 1 ? 's' : ''}`
      document.getElementById('modal-eg-pers').value = pers

      let tbody = ''
      filas.forEach((f, i) => {
        const corto = enc(abreviarNombre(f.nombre))
        const largo = enc(f.nombre)
        tbody += `
          <tr>
            <td class="align-middle">
              <span class="d-none d-md-inline">${largo}</span>
              <span class="d-md-none">${corto}</span>
            </td>
            <td>
              <input type="hidden" class="fila-tarifa-id" value="${f.id}" />
              <input type="hidden" class="fila-aloj-id" value="${f.alojId}" />
              <div class="input-group input-group-sm">
                <span class="input-group-text" style="background-color:#e9ecef">$</span>
                <input type="number" class="form-control fila-cd" min="0" step="1" required value="${f.cd}" />
              </div>
            </td>
            <td>
              <div class="input-group input-group-sm">
                <span class="input-group-text" style="background-color:#e9ecef">$</span>
                <input type="number" class="form-control fila-sd" min="0" step="1" required value="${f.sd}" />
              </div>
            </td>
          </tr>`
      })

      document.getElementById('modal-eg-body').innerHTML = `
        <table class="table table-sm table-bordered mb-0">
          <colgroup><col style="width:36%"><col style="width:32%"><col style="width:32%"></colgroup>
          <thead class="table-light">
            <tr>
              <th><span class="d-none d-md-inline">Alojamiento</span><span class="d-md-none">Aloj.</span></th>
              <th><span class="d-none d-md-inline">Con desayuno</span><span class="d-md-none">C/D</span></th>
              <th><span class="d-none d-md-inline">Sin desayuno</span><span class="d-md-none">S/D</span></th>
            </tr>
          </thead>
          <tbody>${tbody}</tbody>
        </table>`

      window.bootstrap?.Modal.getOrCreateInstance(document.getElementById('modal-editar-grupo')).show()
    }

    const editBtns = document.querySelectorAll('.tar-edit-btn')
    editBtns.forEach(btn => btn.addEventListener('click', onEditClick))

    function onFormEditarGrupoSubmit(e) {
      e.preventDefault()
      const filas = [...document.querySelectorAll('#modal-eg-body tbody tr')].map(tr => ({
        tarifaId:          tr.querySelector('.fila-tarifa-id').value,
        alojamientoId:     tr.querySelector('.fila-aloj-id').value,
        precioConDesayuno: tr.querySelector('.fila-cd').value,
        precioSinDesayuno: tr.querySelector('.fila-sd').value,
      }))
      const cantPersonas = document.getElementById('modal-eg-pers').value

      fetch('/api/gestion/tarifas/editar-grupo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filas, temporadaId: temporadaActivaId, cantPersonas }),
      }).then(res => {
        if (res.ok) {
          const q = new URLSearchParams({ mensaje: 'Tarifas actualizadas', tipo: 'success' })
          if (temporadaActivaId) q.set('temporadaId', temporadaActivaId)
          router.push(`/gestion/tarifas?${q}`)
        }
      })
    }

    const formEditarGrupo = document.getElementById('form-editar-grupo')
    formEditarGrupo?.addEventListener('submit', onFormEditarGrupoSubmit)

    // ── Filtro por tipo ────────────────────────────────────────────────────────
    const botones = document.querySelectorAll('.filtro-tipo')
    const bloques = document.querySelectorAll('tbody[data-tipo]')

    function onFiltroClick() {
      const filtro = this.dataset.filtro
      botones.forEach(b => { b.className = 'btn btn-outline-secondary btn-sm filtro-tipo' })
      this.className = 'btn btn-primary btn-sm filtro-tipo active'
      bloques.forEach(tb => {
        tb.style.display = (!filtro || tb.dataset.tipo === filtro) ? '' : 'none'
      })
    }
    botones.forEach(btn => btn.addEventListener('click', onFiltroClick))

    // ── Gestión de precios ────────────────────────────────────────────────────
    const btnAjAplicar = document.getElementById('btn-aj-aplicar')

    function onAjAplicarClick() {
      const pctInput = document.getElementById('aj-pct')
      const pct = parseFloat(pctInput.value)
      if (!pct || pct === 0) { pctInput.focus(); return }

      const tipo = document.getElementById('aj-tipo').value
      const serv = document.getElementById('aj-servicio').value

      const accion = pct > 0
        ? `un <strong>aumento del ${pct}%</strong>`
        : `una <strong>reducción del ${Math.abs(pct)}%</strong>`
      const servPart = serv === 'ambos'
        ? `a <strong>${SERV_LABELS[serv]}</strong>`
        : `al servicio <strong>${SERV_LABELS[serv]}</strong>`
      const tipoText = TIPO_LABELS[tipo] ?? tipo
      const tempNombre = temporadas.find(t => t.id === temporadaActivaId)?.nombre ?? ''
      const tempPart = tempNombre ? ` (${tempNombre})` : ''

      document.getElementById('modal-aj-texto').innerHTML =
        `Estás por aplicar ${accion} ${servPart} de <strong>${tipoText}</strong>${tempPart}. ¿Confirmás el cambio?`

      document.getElementById('hid-pct').value      = pct
      document.getElementById('hid-tipo').value     = tipo
      document.getElementById('hid-servicio').value = serv

      window.bootstrap?.Modal.getOrCreateInstance(document.getElementById('modal-ajuste')).show()
    }
    btnAjAplicar?.addEventListener('click', onAjAplicarClick)

    function onFormAjusteSubmit(e) {
      e.preventDefault()
      const porcentaje  = document.getElementById('hid-pct').value
      const tipoAloj    = document.getElementById('hid-tipo').value
      const servicio    = document.getElementById('hid-servicio').value
      const tempId      = document.getElementById('hid-temporada').value

      window.bootstrap?.Modal.getInstance(document.getElementById('modal-ajuste'))?.hide()

      fetch('/api/gestion/tarifas/ajustar-precios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ porcentaje, tipoAloj, servicio, temporadaId: tempId }),
      }).then(async res => {
        const d = await res.json()
        if (res.ok) {
          const q = new URLSearchParams({ temporadaId: tempId, mensaje: d.mensaje, tipo: 'success' })
          router.push(`/gestion/tarifas?${q}`)
        }
      })
    }
    const formAjuste = document.getElementById('form-ajuste')
    formAjuste?.addEventListener('submit', onFormAjusteSubmit)

    // ── Configuración de temporadas ───────────────────────────────────────────
    function onFormTemporadasSubmit(e) {
      e.preventDefault()
      const items = temporadas.map(t => ({
        id:          t.id,
        fechaInicio: document.getElementById(`temp-inicio-${t.id}`).value,
        fechaFin:    document.getElementById(`temp-fin-${t.id}`).value,
      }))

      fetch('/api/gestion/tarifas/guardar-temporadas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      }).then(res => {
        if (res.ok) {
          router.push('/gestion/tarifas?mensaje=Temporadas+actualizadas&tipo=success')
        }
      })
    }
    const formTemporadas = document.getElementById('form-temporadas')
    formTemporadas?.addEventListener('submit', onFormTemporadasSubmit)

    return () => {
      editBtns.forEach(btn => btn.removeEventListener('click', onEditClick))
      botones.forEach(btn => btn.removeEventListener('click', onFiltroClick))
      formEditarGrupo?.removeEventListener('submit', onFormEditarGrupoSubmit)
      btnAjAplicar?.removeEventListener('click', onAjAplicarClick)
      formAjuste?.removeEventListener('submit', onFormAjusteSubmit)
      formTemporadas?.removeEventListener('submit', onFormTemporadasSubmit)
    }
  }, [data, router, temporadaActivaId, temporadas])

  return (
    <>
      <Head><title>Tarifas — Brisas de Oro</title></Head>
      <Navbar user={user} />
      <style jsx global>{`
        .filtro-tipo { transition: background-color .15s ease, color .15s ease, border-color .15s ease; }
        .temporadas-tarifas .btn-primary {
            background-color: #0d6efd !important;
            border-color: #0d6efd !important;
        }
        .filtros-tipo-tarifas .filtro-tipo.active {
            background-color: #0d6efd !important;
            border-color: #0d6efd !important;
        }
        #modal-editar-grupo thead th { font-weight: bold; }
        @media (min-width: 769px) {
            div.barra-superior-tarifas { align-items: stretch !important; }
            div.barra-superior-tarifas .temporadas-tarifas { justify-content: space-between !important; }
        }
        @media (max-width: 767.98px) {
            .filtros-tipo-tarifas {
                width: 100% !important; flex-wrap: wrap !important; gap: 4px !important; padding-top: 0 !important;
            }
            .filtros-tipo-tarifas > span { width: 100%; margin-bottom: 2px; }
            .filtros-tipo-tarifas .filtro-tipo {
                flex: 1 !important; font-size: 12px !important; padding: 5px 4px !important;
                display: flex !important; align-items: center !important; justify-content: center !important;
            }
            .temporadas-tarifas {
                flex-direction: row !important; flex-wrap: nowrap !important;
                width: 100% !important; gap: 4px !important; padding: 0 !important;
            }
            .temporadas-tarifas .btn {
                flex: 1 !important; font-size: 12px !important; padding: 5px 4px !important;
                white-space: nowrap; display: flex !important; align-items: center !important; justify-content: center !important;
            }
            .temporadas-tarifas .btn-primary { font-weight: 700 !important; }
            #modal-temporadas .modal-content { min-height: unset !important; height: auto !important; }
            #modal-temporadas .modal-body .row { align-items: center; }
            #modal-temporadas .form-control { display: flex; align-items: center; }
            #modal-editar-grupo .modal-dialog  { min-height: unset !important; }
            #modal-editar-grupo .modal-content { height: auto !important; min-height: unset !important; max-height: 90vh !important; }
            #modal-editar-grupo .modal-footer  { padding-bottom: .5rem !important; }
            #modal-editar-grupo .modal-body { padding: .5rem; }
            #modal-editar-grupo .table th,
            #modal-editar-grupo .table td { padding: .25rem .3rem; font-size: .75rem; }
            #modal-editar-grupo .input-group-text { padding: .2rem .3rem; font-size: .75rem; }
            #modal-editar-grupo .form-control  { font-size: .75rem; }
        }
        #tabla-tarifas td, #tabla-tarifas th {
            vertical-align: middle !important; text-align: center !important;
        }
        #tabla-tarifas thead th:first-child,
        .tar-aloj {
            width: 220px !important; min-width: 220px !important; max-width: 220px !important;
        }
        @media (max-width: 767.98px) {
            #tabla-tarifas thead th:first-child,
            .tar-aloj {
                width: 100px !important; min-width: 100px !important; max-width: 100px !important;
            }
        }
        .tar-aloj {
            font-weight: 700; border-right: 2px solid #adb5bd;
            vertical-align: middle !important; word-break: break-word;
        }
        #tabla-tarifas tbody tr:hover > .tar-aloj {
            background-color: #343a40 !important;
        }
        #tabla-tarifas tbody[data-tipo] + tbody[data-tipo] tr:first-child td {
            border-top: 2px solid #cccccc !important;
        }
        #tabla-tarifas thead + tbody[data-tipo] tr:first-child td {
            border-top: 2px solid #ffffff !important;
        }
        #tabla-tarifas tbody td.tar-cd,
        #tabla-tarifas tbody td.tar-sd { text-align: right !important; }
        #tabla-tarifas thead tr th:nth-child(3),
        #tabla-tarifas thead tr th:nth-child(4) { text-align: center !important; }
        @media (min-width: 768px) {
            #tabla-tarifas td, #tabla-tarifas th { padding: .6rem .85rem; font-size: .92rem; }
            .tar-aloj { font-size: 1.2rem !important; font-weight: bold !important;
                        line-height: 1 !important; background-color: #343a40 !important; color: #ffffff !important; }
            .tar-aloj-sub { display: block; margin-top: .35rem; }
            table th { font-size: 1rem !important; }
            #tabla-tarifas tbody td.tar-pers,
            #tabla-tarifas tbody td.tar-cd,
            #tabla-tarifas tbody td.tar-sd,
            #tabla-tarifas thead tr th:nth-child(2),
            #tabla-tarifas thead tr th:nth-child(3),
            #tabla-tarifas thead tr th:nth-child(4) { border-right: 1px solid #dee2e6 !important; }
            #tabla-tarifas tbody tr:nth-child(odd)  td:not(.tar-aloj) { background-color: #FFFFFF; }
            #tabla-tarifas tbody tr:nth-child(even) td:not(.tar-aloj) { background-color: #F5F5F5; }
        }
        @media (max-width: 767.98px) {
            #tabla-tarifas td, #tabla-tarifas th { padding: .28rem .35rem; font-size: .76rem; }
            .tar-aloj { font-size: .76rem !important; font-weight: bold !important;
                        line-height: 1.4 !important; background-color: #343a40 !important; color: #ffffff !important; }
            .tar-aloj-sub { display: block; margin-top: .2rem; }
            #tabla-tarifas tbody tr:hover > .tar-aloj { background-color: #343a40 !important; }
            table th { font-size: 13px !important; }
            #tabla-tarifas tbody td.text-end { font-size: 15px !important; }
            #tabla-tarifas tbody td.tar-pers { font-size: 15px !important; border-right: 1px solid #dee2e6 !important; }
            #tabla-tarifas tbody td.tar-cd { border-right: 1px solid #dee2e6 !important; }
            #tabla-tarifas tbody td.tar-sd { border-right: 1px solid #dee2e6 !important; }
            #tabla-tarifas tbody tr:nth-child(odd)  td:not(.tar-aloj) { background-color: #FFFFFF; }
            #tabla-tarifas tbody tr:nth-child(even) td:not(.tar-aloj) { background-color: #F5F5F5; }
        }
      `}</style>

      <div className="container">
        {/* ── Encabezado ── */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Tarifas</h2>
        </div>

        {/* ── Barra superior ── */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3 gap-3 barra-superior-tarifas">

          {/* Filtro por tipo */}
          <div className="d-flex align-items-center gap-2 flex-wrap pt-1 filtros-tipo-tarifas">
            <span className="text-dark small fw-semibold">Filtrar por tipo:</span>
            <button type="button" className="btn btn-primary btn-sm filtro-tipo active" data-filtro="">Todos</button>
            <button type="button" className="btn btn-outline-secondary btn-sm filtro-tipo" data-filtro="Habitacion">Habitación</button>
            <button type="button" className="btn btn-outline-secondary btn-sm filtro-tipo" data-filtro="Apart">Apart</button>
            <button type="button" className="btn btn-outline-secondary btn-sm filtro-tipo" data-filtro="Cabaña">Cabaña</button>
          </div>

          {/* Pestañas de temporada */}
          {temporadas.length > 0 && (
            <div className="d-flex flex-column gap-1 px-4 temporadas-tarifas">
              {temporadas.map(t => (
                <Link key={t.id} href={`/gestion/tarifas?temporadaId=${t.id}`}
                  className={`btn btn-sm ${t.id === temporadaActivaId ? 'btn-primary' : 'btn-outline-secondary'}`}>
                  {t.nombre}
                </Link>
              ))}
              {esAdmin && (
                <button type="button" className="btn btn-outline-secondary btn-sm"
                  data-bs-toggle="modal" data-bs-target="#modal-temporadas">
                  Configurar
                </button>
              )}
            </div>
          )}

          {/* Gestión de precios */}
          {esAdmin && (
            <div className="d-mobile-none">
              <div className="card border-secondary">
                <div className="card-header fw-semibold bg-light py-2">
                  <i className="bi bi-percent me-1"></i>Gestión de precios
                </div>
                <div className="card-body py-2 px-3">
                  <div className="d-flex align-items-end gap-2 flex-wrap">
                    <div>
                      <label htmlFor="aj-pct" className="form-label small fw-semibold mb-1">Porcentaje</label>
                      <div className="input-group input-group-sm">
                        <input type="number" id="aj-pct" className="form-control" style={{ width: 60 }}
                          placeholder="10" step="1" min="-99" max="1000" />
                        <span className="input-group-text" style={{ backgroundColor: '#e9ecef' }}>%</span>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="aj-tipo" className="form-label small fw-semibold mb-1">Aplicar a</label>
                      <select id="aj-tipo" className="form-select form-select-sm" style={{ width: 'auto' }}>
                        <option value="todos">Todos</option>
                        <option value="habitacion">Habitaciones</option>
                        <option value="cabaña">Cabañas</option>
                        <option value="apart">Aparts</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="aj-servicio" className="form-label small fw-semibold mb-1">Servicio</label>
                      <select id="aj-servicio" className="form-select form-select-sm" style={{ width: 'auto' }}>
                        <option value="ambos">Ambos</option>
                        <option value="con-desayuno">Con desayuno</option>
                        <option value="sin-desayuno">Sin desayuno</option>
                      </select>
                    </div>
                    <div className="pb-1">
                      <button type="button" id="btn-aj-aplicar" className="btn btn-warning btn-sm">
                        <i className="bi bi-calculator me-1"></i>Aplicar
                      </button>
                    </div>
                  </div>

                  {ultimoAjuste && (
                    <div className="mt-2 pt-2 border-top small text-muted">
                      <i className="bi bi-clock-history me-1"></i>
                      <strong>Último ajuste:</strong> {ultimoAjuste.split('|').join(' — ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ── Mensajes ── */}
        {mensaje && (
          <div className={`alert alert-${mensajeTipo} alert-dismissible fade show`} role="alert">
            <i className={`bi bi-${mensajeTipo === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
            {mensaje}
            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
          </div>
        )}

        {/* ── Modal de confirmación de ajuste ── */}
        {esAdmin && (
          <div className="modal fade" id="modal-ajuste" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 460 }}>
              <div className="modal-content">
                <div className="modal-header py-2">
                  <h6 className="modal-title fw-semibold">Confirmar ajuste de precios</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body" id="modal-aj-texto" style={{ fontSize: '.92rem' }}></div>
                <div className="modal-footer py-2 gap-2">
                  <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancelar</button>
                  <form id="form-ajuste" className="d-inline">
                    <input type="hidden" id="hid-pct" />
                    <input type="hidden" id="hid-tipo" />
                    <input type="hidden" id="hid-servicio" />
                    <input type="hidden" id="hid-temporada" defaultValue={temporadaActivaId ?? ''} />
                    <button type="submit" className="btn btn-warning btn-sm">
                      <i className="bi bi-check-lg me-1"></i>Confirmar
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Modal de configuración de temporadas ── */}
        {esAdmin && (
          <div className="modal fade" id="modal-temporadas" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 480 }}>
              <div className="modal-content">
                <div className="modal-header py-2">
                  <h6 className="modal-title fw-semibold">
                    <i className="bi bi-calendar-range me-1"></i>Configurar temporadas
                  </h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form id="form-temporadas">
                  <div className="modal-body py-3">
                    {temporadas.map((t, i) => (
                      <div key={t.id}>
                        <div className="mb-3">
                          <div className="fw-semibold mb-2">{t.nombre}</div>
                          <div className="row g-2">
                            <div className="col-6">
                              <label className="form-label small mb-1">Fecha inicio</label>
                              <input type="date" id={`temp-inicio-${t.id}`} defaultValue={t.fechaInicio}
                                className="form-control form-control-sm" />
                            </div>
                            <div className="col-6">
                              <label className="form-label small mb-1">Fecha fin</label>
                              <input type="date" id={`temp-fin-${t.id}`} defaultValue={t.fechaFin}
                                className="form-control form-control-sm" />
                            </div>
                          </div>
                        </div>
                        {i < temporadas.length - 1 && <hr className="my-2" />}
                      </div>
                    ))}
                  </div>
                  <div className="modal-footer py-2 gap-2">
                    <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      <i className="bi bi-check-lg me-1"></i>Guardar fechas
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ── Modal edición de grupo ── */}
        {esAdmin && (
          <div className="modal fade" id="modal-editar-grupo" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 540 }}>
              <div className="modal-content">
                <div className="modal-header py-2">
                  <h6 className="modal-title fw-semibold" id="modal-eg-titulo">Editar tarifa</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form id="form-editar-grupo">
                  <input type="hidden" id="modal-eg-pers" />
                  <div className="modal-body" id="modal-eg-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {/* filas generadas por JS */}
                  </div>
                  <div className="modal-footer py-2 gap-2">
                    <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" className="btn btn-primary btn-sm px-4">
                      <i className="bi bi-check-lg me-1"></i>Guardar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ── Tabla agrupada ── */}
        {grupos.length === 0 ? (
          <div className="alert alert-info">
            {temporadas.length === 0
              ? <span>No hay temporadas configuradas. Se crearán al reiniciar la aplicación.</span>
              : <span>No hay tarifas para esta temporada. Se crearán al reiniciar la aplicación.</span>}
          </div>
        ) : (
          <div className="card">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0" id="tabla-tarifas">
                  <thead className="table-dark">
                    <tr>
                      <th style={{ fontSize: 13, fontWeight: 'bold' }}>Alojamiento</th>
                      <th style={{ fontSize: 13, fontWeight: 'bold' }}><span className="d-none d-md-inline">Personas</span><span className="d-md-none">Pers.</span></th>
                      <th style={{ fontSize: 13, fontWeight: 'bold' }}><span className="d-none d-md-inline">Con desayuno</span><span className="d-md-none">C/D</span></th>
                      <th style={{ fontSize: 13, fontWeight: 'bold' }}><span className="d-none d-md-inline">Sin desayuno</span><span className="d-md-none">S/D</span></th>
                      <th style={{ fontSize: 13, fontWeight: 'bold' }}>Acciones</th>
                    </tr>
                  </thead>
                  {tablaGrupos.filter(g => g.activo).map(g => (
                    <tbody key={g.label} data-tipo={g.tipo}>
                      {g.rows.map(row => (
                        <tr key={row.idx}>
                          {row.idx === 0 && (
                            <td rowSpan={row.span} className="tar-aloj">
                              {g.label.startsWith('CABAÑA ')
                                ? <>CABAÑA<br /><span className="tar-aloj-sub">{g.label.substring(7)}</span></>
                                : g.label}
                            </td>
                          )}
                          <td className="tar-pers">{row.pers}</td>
                          <td className="text-end text-nowrap tar-cd">
                            {row.cd > 0 ? `$${row.cd.toLocaleString('es-AR')}` : <span className="text-muted">—</span>}
                          </td>
                          <td className="text-end text-nowrap tar-sd">
                            {row.sd > 0 ? `$${row.sd.toLocaleString('es-AR')}` : <span className="text-muted">—</span>}
                          </td>
                          <td>
                            {esAdmin && (
                              <button type="button" className="btn btn-outline-primary btn-sm tar-edit-btn"
                                title="Editar"
                                data-label={g.label}
                                data-pers={row.pers}
                                data-filas={JSON.stringify(row.filas)}>
                                <i className="bi bi-pencil"></i>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ))}
                </table>
              </div>
              <div className="d-md-none text-center text-muted" style={{ fontSize: 11, marginTop: 6 }}>← Deslizá para ver más →</div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
