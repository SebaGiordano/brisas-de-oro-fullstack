import Head from 'next/head'
import Script from 'next/script'
import { useEffect } from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import Navbar from '@/components/gestion/Navbar'

const EMPTY_DATA = { reservas: [], alojamientos: [], apartMap: [], esAdmin: false }

function safeJSON(obj) {
  return JSON.stringify(obj)
    .replace(/&/g, '\\u0026')
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
}

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return { redirect: { destination: '/login', permanent: false } }

  const proto  = req.headers['x-forwarded-proto'] ?? 'http'
  const host   = req.headers.host
  const apiRes = await fetch(`${proto}://${host}/api/gestion/calendario`, {
    headers: { cookie: req.headers.cookie ?? '' },
  })

  return {
    props: {
      user: {
        id:       session.user.id       ?? null,
        userName: session.user.userName ?? null,
        rol:      session.user.rol      ?? null,
      },
      data: apiRes.ok ? await apiRes.json() : EMPTY_DATA,
    },
  }
}

export default function CalendarioPage({ user, data }) {
  useEffect(() => {
    if (!data) return

    let cancelled = false
    const controller = new AbortController()
    const { signal } = controller
    let bsModal = null
    let _rszTimer

    const tryInit = () => {
      if (cancelled) return
      if (!window.bootstrap) { setTimeout(tryInit, 50); return }

      const RESERVAS      = JSON.parse(document.getElementById('cal-reservas').textContent)
      const ALOJ_LIST     = JSON.parse(document.getElementById('cal-alojamientos').textContent)
      const APART_MAP_RAW = JSON.parse(document.getElementById('cal-apart-map').textContent)
      const URLS          = JSON.parse(document.getElementById('cal-urls').textContent)
      const ES_ADMIN      = document.getElementById('cal-admin').textContent.trim() === 'true'

    // Mapa nombre -> alojamiento
    const alojMap = {}
    ALOJ_LIST.forEach(a => { alojMap[a.nombre] = a })

    // Mapa apartId -> [hab1Id, hab2Id]
    const APART_MAP = {}
    APART_MAP_RAW.forEach(d => { APART_MAP[d.apartId] = [d.hab1Id, d.hab2Id] })

    const ROW_CFG = [
      { nombre: 'Habitación 4',  bg: '#D6E4F0' },
      { nombre: 'Habitación 5',  bg: '#D6E4F0' },
      { nombre: 'Habitación 6',  bg: '#FAD7B0' },
      { nombre: 'Habitación 8',  bg: '#FAD7B0' },
      { nombre: 'Habitación 7',  bg: '#D6E4F0' },
      { nombre: 'Habitación 9',  bg: '#D6E4F0' },
      { nombre: 'Habitación 10', bg: '#FAD7B0' },
      { nombre: 'Habitación 11', bg: '#FAD7B0' },
      { divider: true },
      { nombre: 'Cabaña 1', bg: '#D6E4F0' },
      { nombre: 'Cabaña 2', bg: '#D6E4F0' },
      { nombre: 'Cabaña 3', bg: '#D6E4F0' },
      { nombre: 'Cabaña 4', bg: '#D6E4F0' },
      { nombre: 'Cabaña 5', bg: '#D6E4F0' },
      { nombre: 'Cabaña 6', bg: '#D6E4F0' },
      { divider: true },
      { nombre: 'Cabaña 7', bg: '#D6E4F0' },
      { nombre: 'Cabaña 8', bg: '#D6E4F0' },
    ]

    const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                         'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
    const DAY_NAMES   = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
    const M_BG  = ['#d4e6f1', '#fde8c8']
    const M_WE  = ['#b8d8ee', '#fbc78a']

    const NUM_DAYS  = 366
    const H1    = 22
    const H2    = 22
    const ROW_H = 29
    const TODAY_IDX = 183

    const isMobile = window.innerWidth < 768
    const COL_INST  = isMobile ? 48 : 140
    const COL_CAP   = isMobile ? 28 : 52
    let colWidth    = isMobile ? 40 : 70
    const TODAY = new Date()
    TODAY.setHours(0, 0, 0, 0)
    const startDate = new Date(TODAY)
    startDate.setDate(startDate.getDate() - TODAY_IDX)

    const calWrapper = document.getElementById('cal-wrapper')

    // ── Utilidades ────────────────────────────────────────────────────────────

    function iso(d) { return d.toISOString().slice(0, 10) }

    function fmtFecha(s) {
      const [y, m, d] = s.split('-')
      return `${d}/${m}/${y}`
    }

    function fmtPeso(n) {
      return '$' + Math.round(n).toLocaleString('es-AR')
    }

    function getDias() {
      const dias = []
      for (let i = 0; i < NUM_DAYS; i++) {
        const d = new Date(startDate)
        d.setDate(d.getDate() + i)
        dias.push(d)
      }
      return dias
    }

    function gruposMes(dias) {
      const gs = []
      dias.forEach(d => {
        const key = `${d.getFullYear()}-${d.getMonth()}`
        const last = gs[gs.length - 1]
        if (!last || last.key !== key)
          gs.push({ key, month: d.getMonth(), year: d.getFullYear(), count: 1, si: gs.length })
        else
          last.count++
      })
      return gs
    }

    function mapDiaMes(dias, grupos) {
      const map = {}
      dias.forEach(d => {
        const key = `${d.getFullYear()}-${d.getMonth()}`
        map[iso(d)] = grupos.find(g => g.key === key).si
      })
      return map
    }

    function colores(res) {
      if (res.esInvitacion)          return { bg: '#E8D5F5', fg: '#6B21A8', brd: '#a855f7' }
      if (res.saldoPendiente < .01)  return { bg: '#CCFFCC', fg: '#1A5C1A', brd: '#4ade80' }
      if (res.totalCobrado   > .01)  return { bg: '#FFF3CC', fg: '#7A5F00', brd: '#fbbf24' }
      return                                { bg: '#FFCCCC', fg: '#7A0000', brd: '#f87171' }
    }

    function textoReserva(res, nights) {
      const full      = res.nombreHuesped.trim()
      const firstName = full.split(/\s+/)[0]
      const p         = res.cantidadHuespedes
      const d         = res.incluyeDesayuno
      const des       = d ? 'C/D' : 'S/D'
      if (nights === 1) return firstName
      if (nights === 2) return `${firstName} | ${p}p | ${des}`
      if (nights === 3) return `${full} | ${p}p | ${des}`
      if (nights <= 5)  return `${full} | ${p} pers. | ${des}`
      return `${full} | ${p} personas | ${d ? 'Con desayuno' : 'Sin desayuno'}`
    }

    // ── Ajuste de font-size por celda ─────────────────────────────────────────
    const _cvs = document.createElement('canvas')
    const _ctx = _cvs.getContext('2d')

    function bsFont(text, targetPx, family) {
      let lo = 9, hi = 500
      for (let n = 0; n < 20; n++) {
        const mid = (lo + hi) / 2
        _ctx.font = `${mid}px ${family}`
        if (_ctx.measureText(text).width < targetPx) lo = mid; else hi = mid
      }
      return Math.max(9, (lo + hi) / 2)
    }

    function getTargetPx(avail, nights) {
      if (nights <= 6) return avail * 0.9
      return avail * Math.min(1, 8 / nights) * 0.78
    }

    function ajustarFonts() {
      const cells = document.querySelectorAll('#cal-tbody .cal-res')
      if (!cells.length) return
      const family = getComputedStyle(cells[0]).fontFamily || 'sans-serif'
      const PAD_MOBILE = 4

      const cellData = Array.from(cells).map(td => {
        const nights = parseInt(td.dataset.nights) || 1
        const avail  = isMobile
          ? Math.max(0, nights * colWidth - PAD_MOBILE)
          : Math.max(0, td.clientWidth
              - (parseFloat(getComputedStyle(td).paddingLeft)  || 0)
              - (parseFloat(getComputedStyle(td).paddingRight) || 0))
        return { td, text: td.textContent.trim(), avail, nights }
      })

      cellData.forEach(({ td, text, avail, nights }) => {
        if (avail < 4 || !text) return
        const fs = bsFont(text, getTargetPx(avail, nights), family)
        td.style.fontSize     = fs.toFixed(1) + 'px'
        td.style.whiteSpace   = 'nowrap'
        td.style.textOverflow = 'ellipsis'
        td.style.textAlign    = 'center'
        td.style.overflow     = 'hidden'
      })
    }

    function estadoTexto(res) {
      if (res.esInvitacion)         return 'Invitación'
      if (res.saldoPendiente < .01) return 'Cancelado total'
      if (res.totalCobrado   > .01) return 'Señado'
      return 'Sin seña'
    }

    // ── Modal ─────────────────────────────────────────────────────────────────

    bsModal = new window.bootstrap.Modal(document.getElementById('modal-reserva'), { focus: false })

    document.getElementById('modal-reserva').addEventListener('shown.bs.modal', () => {
      if (document.activeElement) document.activeElement.blur()
    }, { signal })

    ;['modal-btn-detalle', 'modal-btn-pago'].forEach(id => {
      const el = document.getElementById(id)
      if (el) el.addEventListener('click', function () { this.blur() }, { signal })
    })

    const btnCerrar = document.getElementById('modal-btn-cerrar')
    if (btnCerrar) {
      btnCerrar.addEventListener('click', function () {
        this.blur()
        this.classList.add('active')
        setTimeout(() => bsModal.hide(), 200)
      }, { signal })
      document.getElementById('modal-reserva').addEventListener('hidden.bs.modal', () => {
        btnCerrar.classList.remove('active')
      }, { signal })
    }

    function mostrarModal(res) {
      document.getElementById('modal-titulo').textContent = `Reserva — ${res.nombreHuesped}`

      const c   = colores(res)
      const est = estadoTexto(res)
      const sal = res.saldoPendiente

      const noches = Math.round((new Date(res.fechaSalida) - new Date(res.fechaIngreso)) / 86400000)

      document.getElementById('modal-cuerpo').innerHTML = `
<table class="table table-sm table-borderless mb-0" style="font-size:.88rem;">
  <tr><td class="text-muted pe-3" style="white-space:nowrap">Alojamiento</td>
      <td class="fw-semibold">${res.nombreAlojamiento}</td></tr>
  <tr><td class="text-muted">Ingreso</td>    <td>${fmtFecha(res.fechaIngreso)}</td></tr>
  <tr><td class="text-muted">Egreso</td>     <td>${fmtFecha(res.fechaSalida)}</td></tr>
  <tr><td class="text-muted">Noches</td>     <td>${noches}</td></tr>
  <tr><td class="text-muted">Personas</td>   <td>${res.cantidadHuespedes}</td></tr>
  <tr><td class="text-muted">Desayuno</td>   <td>${res.incluyeDesayuno ? 'Sí incluye' : 'No incluye'}</td></tr>
  ${res.precioPorDia != null ? `<tr><td class="text-muted">Tarifa por día</td><td>${fmtPeso(res.precioPorDia)}</td></tr>` : ''}
  <tr><td class="text-muted">Total estadía</td>
      <td>${fmtPeso(res.montoTotal)}</td></tr>
  <tr><td class="text-muted">Total cobrado</td>
      <td style="color:#198754;font-weight:bold;">${fmtPeso(res.totalCobrado)}</td></tr>
  <tr><td class="text-muted">Saldo pendiente</td>
      <td class="${sal > .01 ? 'text-danger fw-bold' : 'fw-bold'}">${fmtPeso(sal)}</td></tr>
  <tr><td class="text-muted">Estado de pago</td>
      <td><span style="display:inline-block;padding:.2em .55em;border-radius:4px;font-size:.8em;font-weight:600;background:${c.bg};color:${c.fg};border:1px solid ${c.brd};">${est}</span></td></tr>
</table>`

      document.getElementById('modal-btn-detalle').href = `${URLS.detalle}/${res.id}?from=calendario`
      const btnPago = document.getElementById('modal-btn-pago')
      if (btnPago) btnPago.href = `${URLS.pago}?reservaId=${res.id}&from=calendario`

      bsModal.show()
    }

    // ── Encabezado ────────────────────────────────────────────────────────────

    function renderEncabezado(dias, grupos, dmMap) {
      const thead = document.getElementById('cal-thead')
      thead.innerHTML = ''
      const todayIso = iso(new Date())

      const tr1 = document.createElement('tr')

      function thFijo(texto, left, ancho) {
        const th = document.createElement('th')
        th.textContent = texto
        th.rowSpan = 2
        Object.assign(th.style, {
          position:'sticky', top:'0', left:left+'px', zIndex:'5',
          width:ancho+'px', minWidth:ancho+'px',
          background:'#343a40', color:'#fff',
          textAlign:'center', verticalAlign:'middle',
          padding:'3px 6px', fontSize:'.78rem', fontWeight:'600',
          whiteSpace:'nowrap', boxSizing:'border-box',
        })
        return th
      }

      tr1.appendChild(thFijo(isMobile ? 'Inst.' : 'Instalación', 0, COL_INST))
      tr1.appendChild(thFijo('Cap.', COL_INST, COL_CAP))

      dias.forEach(d => {
        const si = dmMap[iso(d)]
        const th = document.createElement('th')
        th.textContent = isMobile
          ? MONTH_NAMES[d.getMonth()].slice(0, 3)
          : `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`
        Object.assign(th.style, {
          position:'sticky', top:'0', zIndex:'2',
          background: M_BG[si % 2],
          textAlign:'center', fontSize:'.68rem', fontWeight:'700',
          padding:'0 2px', height:H1+'px', lineHeight:H1+'px',
          overflow:'hidden', whiteSpace:'nowrap',
          borderRight:'1px solid #dee2e6', boxSizing:'border-box',
        })
        tr1.appendChild(th)
      })

      thead.appendChild(tr1)

      const tr2 = document.createElement('tr')

      dias.forEach(d => {
        const dIso  = iso(d)
        const dow   = d.getDay()
        const isHoy = dIso === todayIso
        const isWE  = dow === 0 || dow === 6
        const si    = dmMap[dIso]

        const th = document.createElement('th')
        th.textContent = `${DAY_NAMES[dow]} ${d.getDate()}`
        Object.assign(th.style, {
          position:'sticky', top:H1+'px', zIndex:'2',
          width:colWidth+'px', minWidth:colWidth+'px',
          background:'#fff', color:'#333',
          textAlign:'center', fontSize: isMobile ? '9px' : '.68rem', fontWeight:'500',
          padding: isMobile ? '1px 0' : '2px 1px', whiteSpace:'nowrap',
          height:H2+'px', lineHeight:(H2-2)+'px',
          borderRight: '1px solid #dee2e6',
          borderBottom:'2px solid #495057', boxSizing:'border-box',
        })
        tr2.appendChild(th)
      })

      thead.appendChild(tr2)
    }

    // ── Cuerpo ────────────────────────────────────────────────────────────────

    function renderCuerpo(dias, dmMap) {
      const tbody = document.getElementById('cal-tbody')
      tbody.innerHTML = ''
      const todayIso = iso(new Date())

      const hab1ToApart = {}
      const hab2ToApart = {}
      Object.entries(APART_MAP).forEach(([aptId, habs]) => {
        hab1ToApart[habs[0]] = { apartId: parseInt(aptId), hab2Id: habs[1] }
        hab2ToApart[habs[1]] = { apartId: parseInt(aptId), hab1Id: habs[0] }
      })

      const skipDays = {}

      ROW_CFG.forEach(fila => {
        if (fila.divider) {
          const tr = document.createElement('tr')
          tr.className = 'cal-divider'
          const td = document.createElement('td')
          td.colSpan = 2 + dias.length
          tr.appendChild(td)
          tbody.appendChild(tr)
          return
        }

        const aloj = alojMap[fila.nombre]
        if (!aloj) return

        const tr = document.createElement('tr')
        tr.style.height = ROW_H + 'px'

        const tdI = document.createElement('td')
        tdI.textContent = isMobile
          ? aloj.nombre.replace('Habitación ', 'Hab. ').replace('Cabaña ', 'Cab. ')
          : aloj.nombre
        Object.assign(tdI.style, {
          position:'sticky', left:'0', zIndex:'1',
          background: fila.bg, width:COL_INST+'px', minWidth:COL_INST+'px',
          fontWeight:'600', fontSize: isMobile ? '.7rem' : '.78rem',
          padding: isMobile ? '2px 4px' : '2px 8px',
          whiteSpace:'nowrap', verticalAlign:'middle',
          height: ROW_H + 'px', boxSizing:'border-box',
        })
        tr.appendChild(tdI)

        const tdC = document.createElement('td')
        tdC.textContent = aloj.capacidad
        Object.assign(tdC.style, {
          position:'sticky', left:COL_INST+'px', zIndex:'1',
          background: fila.bg, width:COL_CAP+'px', minWidth:COL_CAP+'px',
          textAlign:'center', fontSize: isMobile ? '9px' : '.78rem',
          padding: isMobile ? '1px 1px' : '2px 3px',
          verticalAlign:'middle', borderRight:'2px solid #9db5c7',
          height: ROW_H + 'px', boxSizing:'border-box',
        })
        tr.appendChild(tdC)

        const resDirectas = RESERVAS.filter(r => r.alojamientoId === aloj.id)

        const infoH1   = hab1ToApart[aloj.id]
        const resApart = infoH1 ? RESERVAS.filter(r => r.alojamientoId === infoH1.apartId) : []

        const misSkips = skipDays[aloj.id] || new Set()

        let i = 0
        while (i < dias.length) {
          if (misSkips.has(i)) { i++; continue }

          const d    = dias[i]
          const dIso = iso(d)

          const resAptHoy = infoH1
            ? resApart.find(r => r.fechaIngreso <= dIso && r.fechaSalida > dIso)
            : null

          if (resAptHoy) {
            let span = 0
            for (let j = i; j < dias.length; j++) {
              if (iso(dias[j]) < resAptHoy.fechaSalida) span++
              else break
            }
            const c  = colores(resAptHoy)
            const td = document.createElement('td')
            td.colSpan        = span
            td.rowSpan        = 2
            td.className      = 'cal-res'
            td.dataset.nights = span
            td.textContent    = textoReserva(resAptHoy, span)
            Object.assign(td.style, {
              background:    c.bg,
              color:         c.fg,
              borderLeft:   `3px solid ${c.brd}`,
              padding:      isMobile ? '1px 2px' : '2px 6px',
              maxWidth:     (span * colWidth) + 'px',
              overflow:     'hidden',
              verticalAlign: 'middle',
              boxSizing:    'border-box',
            })
            if (isMobile) td.style.setProperty('max-width', (span * colWidth) + 'px', 'important')
            td.addEventListener('click', () => mostrarModal(resAptHoy))
            tr.appendChild(td)

            if (!skipDays[infoH1.hab2Id]) skipDays[infoH1.hab2Id] = new Set()
            for (let k = i; k < i + span; k++) skipDays[infoH1.hab2Id].add(k)

            i += span
            continue
          }

          const res = resDirectas.find(r => r.fechaIngreso <= dIso && r.fechaSalida > dIso)

          if (res) {
            let span = 0
            for (let j = i; j < dias.length; j++) {
              if (iso(dias[j]) < res.fechaSalida) span++
              else break
            }
            const c  = colores(res)
            const td = document.createElement('td')
            td.colSpan        = span
            td.className      = 'cal-res'
            td.dataset.nights = span
            td.textContent    = textoReserva(res, span)
            Object.assign(td.style, {
              background:    c.bg,
              color:         c.fg,
              borderLeft:   `3px solid ${c.brd}`,
              padding:      isMobile ? '1px 2px' : '2px 6px',
              maxWidth:     (span * colWidth) + 'px',
              height:       ROW_H + 'px',
              overflow:     'hidden',
              verticalAlign: 'middle',
              boxSizing:    'border-box',
            })
            if (isMobile) td.style.setProperty('max-width', (span * colWidth) + 'px', 'important')
            td.addEventListener('click', () => mostrarModal(res))
            tr.appendChild(td)
            i += span
          } else {
            const td = document.createElement('td')
            td.style.width    = colWidth + 'px'
            td.style.minWidth = colWidth + 'px'
            td.style.height   = ROW_H + 'px'
            td.style.borderRight = '1px solid #dee2e6'
            tr.appendChild(td)
            i++
          }
        }

        tbody.appendChild(tr)
      })
    }

    // ── Render principal ──────────────────────────────────────────────────────

    function render() {
      const dias   = getDias()
      const grupos = gruposMes(dias)
      const dmMap  = mapDiaMes(dias, grupos)
      renderEncabezado(dias, grupos, dmMap)
      renderCuerpo(dias, dmMap)
      ajustarFonts()
    }

    // ── Controles ─────────────────────────────────────────────────────────────

    document.getElementById('btn-prev').addEventListener('click', () => {
      calWrapper.scrollLeft -= 7 * colWidth
    }, { signal })
    document.getElementById('btn-next').addEventListener('click', () => {
      calWrapper.scrollLeft += 7 * colWidth
    }, { signal })
    document.getElementById('btn-hoy').addEventListener('click', () => {
      calWrapper.scrollLeft = Math.max(0, (TODAY_IDX - 2) * colWidth)
    }, { signal })

    window.addEventListener('resize', () => {
      clearTimeout(_rszTimer)
      _rszTimer = setTimeout(ajustarFonts, 120)
    }, { signal })

    // ── Render inicial ────────────────────────────────────────────────────────

    const doRender = () => {
      render()
      calWrapper.scrollLeft = Math.max(0, (TODAY_IDX - 2) * colWidth)
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', doRender, { signal })
    } else {
      doRender()
    }
    }

    tryInit()

    return () => {
      cancelled = true
      controller.abort()
      clearTimeout(_rszTimer)
      try { bsModal?.dispose() } catch {}
    }
  }, [data])

  return (
    <>
      <Navbar />
      <Head><title>Calendario — Brisas de Oro</title></Head>

      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        strategy="beforeInteractive"
      />

      <div className="container">
        {/* Data islands */}
        <script type="application/json" id="cal-reservas"
          dangerouslySetInnerHTML={{ __html: safeJSON(data.reservas) }} />
        <script type="application/json" id="cal-alojamientos"
          dangerouslySetInnerHTML={{ __html: safeJSON(data.alojamientos) }} />
        <script type="application/json" id="cal-apart-map"
          dangerouslySetInnerHTML={{ __html: safeJSON(data.apartMap) }} />
        <script type="application/json" id="cal-urls"
          dangerouslySetInnerHTML={{ __html: safeJSON({ detalle: '/gestion/reservas', pago: '/gestion/pagos/agregar' }) }} />
        <script type="application/json" id="cal-admin"
          dangerouslySetInnerHTML={{ __html: data.esAdmin ? 'true' : 'false' }} />

        {/* Título + controles */}
        <div id="cal-topbar" className="mb-2 d-flex align-items-center justify-content-between gap-2 flex-wrap">
          <h2 className="mb-0">Calendario</h2>
          <div className="d-flex align-items-center gap-2">
            <div className="btn-group btn-group-sm">
              <button id="btn-prev" className="btn btn-outline-secondary" title="7 días atrás" style={{minHeight:'38px',minWidth:'48px'}}>&#9664; 7d</button>
              <button id="btn-hoy" className="btn btn-primary" style={{minHeight:'38px',minWidth:'48px'}}>Hoy</button>
              <button id="btn-next" className="btn btn-outline-secondary" title="7 días adelante" style={{minHeight:'38px',minWidth:'48px'}}>7d &#9654;</button>
            </div>
          </div>
        </div>

        {/* Contenedor del calendario */}
        <div id="cal-wrapper" style={{overflow:'auto',maxHeight:'calc(100vh - 180px)',border:'1px solid #dee2e6',borderRadius:'.375rem',position:'relative',marginBottom:'16px',touchAction:'pan-x pan-y pinch-zoom',WebkitOverflowScrolling:'touch'}}>
          <table id="cal-table" style={{borderCollapse:'separate',borderSpacing:0,tableLayout:'fixed'}}>
            <thead id="cal-thead"></thead>
            <tbody id="cal-tbody"></tbody>
          </table>
        </div>

        {/* Leyenda */}
        <div style={{display:'flex',flexWrap:'nowrap',justifyContent:'center',alignItems:'center',gap:'8px',marginTop:'6px',fontSize:'clamp(10px,.75rem,13px)',color:'#555',whiteSpace:'nowrap'}}>
          <span style={{display:'flex',alignItems:'center',gap:'3px',flexShrink:0}}>
            <span style={{display:'inline-block',width:'11px',height:'11px',background:'#FFCCCC',border:'1px solid #f87171',borderRadius:'2px',flexShrink:0}}></span>Sin seña
          </span>
          <span style={{display:'flex',alignItems:'center',gap:'3px',flexShrink:0}}>
            <span style={{display:'inline-block',width:'11px',height:'11px',background:'#FFF3CC',border:'1px solid #fbbf24',borderRadius:'2px',flexShrink:0}}></span>Señado
          </span>
          <span style={{display:'flex',alignItems:'center',gap:'3px',flexShrink:0}}>
            <span style={{display:'inline-block',width:'11px',height:'11px',background:'#CCFFCC',border:'1px solid #4ade80',borderRadius:'2px',flexShrink:0}}></span>Saldado
          </span>
          <span style={{display:'flex',alignItems:'center',gap:'3px',flexShrink:0}}>
            <span style={{display:'inline-block',width:'11px',height:'11px',background:'#E8D5F5',border:'1px solid #a855f7',borderRadius:'2px',flexShrink:0}}></span>Invitación
          </span>
        </div>

        {/* Modal de reserva */}
        <div className="modal fade" id="modal-reserva" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" style={{maxWidth:'440px'}}>
            <div className="modal-content">
              <div className="modal-header py-2">
                <h6 className="modal-title fw-semibold" id="modal-titulo"></h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body py-2" id="modal-cuerpo" style={{fontSize:'.88rem'}}></div>
              <div className="modal-footer py-2 gap-2">
                <a id="modal-btn-detalle" href="#" className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-eye me-1"></i>Ver detalle
                </a>
                <a id="modal-btn-pago" href="#" className="btn btn-outline-primary btn-sm" style={{display: data.esAdmin ? 'inline-flex' : 'none'}}>
                  <i className="bi bi-cash me-1"></i>Agregar pago
                </a>
                <button id="modal-btn-cerrar" className="btn btn-secondary btn-sm ms-auto">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        #cal-table td, #cal-table th {
          border-right: 1px solid #dee2e6;
          border-bottom: 1px solid #e9ecef;
        }
        .cal-res {
          cursor: pointer;
          vertical-align: middle;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cal-res:hover { filter: brightness(.93); }
        .cal-divider td {
          padding: 0 !important;
          height: 0 !important;
          line-height: 0 !important;
          border-top: 3px solid #000 !important;
          border-bottom: none !important;
        }
        #cal-tbody tr:not(.cal-divider) {
          height: 29px !important;
          max-height: 29px !important;
        }
        #cal-tbody tr:not(.cal-divider) td {
          height: 29px !important;
          line-height: 29px !important;
          overflow: hidden !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          box-sizing: border-box !important;
          white-space: nowrap !important;
        }
        #cal-tbody .cal-res {
          line-height: 29px !important;
          overflow: hidden !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          text-overflow: ellipsis !important;
        }
        @media (max-width: 767.98px) {
          #modal-reserva .modal-dialog  { min-height: unset !important; }
          #modal-reserva .modal-content { height: auto !important; min-height: unset !important; max-height: 90vh !important; }
          #modal-reserva .modal-footer  { padding-bottom: .75rem !important; }
          #modal-reserva .btn { display: flex !important; align-items: center !important; justify-content: center !important; }
        }
        @media (min-width: 769px) {
          #cal-topbar { display: grid !important; grid-template-columns: 1fr auto 1fr !important; align-items: center !important; }
          #cal-topbar > div { grid-column: 2 !important; }
        }
      `}</style>
    </>
  )
}
