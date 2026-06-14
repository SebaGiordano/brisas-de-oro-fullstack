import Head from 'next/head'
import Script from 'next/script'
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getServerSession } from 'next-auth/next'
import authOptions from '@/pages/api/auth/[...nextauth]'
import Navbar from '@/components/gestion/Navbar'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const fmt    = v => Math.round(v).toLocaleString('es-AR')
const fmtPct = v => Number(v).toFixed(1) + '%'

export async function getServerSideProps(context) {
  const { req, res } = context
  const session = await getServerSession(req, res, authOptions)
  if (!session) return { redirect: { destination: '/login', permanent: false } }

  const qs     = new URLSearchParams(context.query).toString()
  const proto  = req.headers['x-forwarded-proto'] ?? 'http'
  const host   = req.headers.host
  const apiUrl = `${proto}://${host}/api/gestion/dashboard${qs ? '?' + qs : ''}`

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

export default function Dashboard({ user, data }) {
  const router    = useRouter()
  const chartsRef = useRef({})
  const [chartjsLoaded, setChartjsLoaded] = useState(false)

  const [mes,       setMes]       = useState(data.Mes      != null ? String(data.Mes)      : '')
  const [anno,      setAnno]      = useState(data.Anno     != null ? String(data.Anno)     : '')
  const [desde,     setDesde]     = useState(data.Desde    || '')
  const [hasta,     setHasta]     = useState(data.Hasta    || '')
  const [comparar,  setComparar]  = useState(!!data.Comparar)
  const [mesComp,   setMesComp]   = useState(data.MesComp  != null ? String(data.MesComp)  : '')
  const [annoComp,  setAnnoComp]  = useState(data.AnnoComp != null ? String(data.AnnoComp) : '')
  const [desdeComp, setDesdeComp] = useState(data.DesdeComp || '')
  const [hastaComp, setHastaComp] = useState(data.HastaComp || '')

  useEffect(() => {
    setMes(data.Mes        != null ? String(data.Mes)      : '')
    setAnno(data.Anno      != null ? String(data.Anno)     : '')
    setDesde(data.Desde    || '')
    setHasta(data.Hasta    || '')
    setComparar(!!data.Comparar)
    setMesComp(data.MesComp   != null ? String(data.MesComp)  : '')
    setAnnoComp(data.AnnoComp != null ? String(data.AnnoComp) : '')
    setDesdeComp(data.DesdeComp || '')
    setHastaComp(data.HastaComp || '')
  }, [data])

  // Inicialización de gráficos
  useEffect(() => {
    if (!chartjsLoaded) return
    const Chart = window.Chart
    if (!Chart) return

    Object.values(chartsRef.current).forEach(c => { try { c?.destroy() } catch {} })
    chartsRef.current = {}

    const p   = data.Periodo
    if (!p) return
    const fi  = p.IngresosFechaIngreso
    const pro = p.IngresosProrrateo
    const ocu = p.Ocupacion

    const D = {
      ing: {
        fi:  [fi.Efectivo, fi.Transferencia, fi.TarjetaCredito, fi.TarjetaDebito],
        pro: [pro.Efectivo, pro.Transferencia, pro.TarjetaCredito, pro.TarjetaDebito],
      },
      ocu: {
        un:     { habOcup: ocu.DiasHabOcupados,   cabOcup: ocu.DiasCabOcupados,   total: ocu.DiasTotal },
        plazas: { habOcup: ocu.PlazasHabOcupadas, cabOcup: ocu.PlazasCabOcupadas, total: ocu.PlazasTotalDisponibles },
      },
      can: {
        labels: p.Canales.map(c => c.Canal),
        data:   p.Canales.map(c => c.Cantidad),
      },
    }

    const METODOS       = ['Efectivo', 'Transferencia', 'T. Crédito', 'T. Débito']
    const C_AZ          = 'rgba(54,162,235,.75)'
    const C_OR          = 'rgba(255,159,64,.75)'
    const OCU_LABELS    = ['Habitaciones ocupadas', 'Cabañas ocupadas', 'Unidades disponibles']
    const OCU_PL_LABELS = ['Personas en habitaciones', 'Personas en cabañas', 'Plazas libres']
    const OCU_COLORS    = ['rgba(54,162,235,.75)', 'rgba(75,192,192,.75)', 'rgba(200,200,200,.5)']
    const PIE_COLORS    = ['rgba(54,162,235,.8)', 'rgba(75,192,192,.8)', 'rgba(255,99,132,.8)', 'rgba(255,205,86,.8)']

    function ocuSlices(d) {
      const h = d.total > 0 ? +(d.habOcup / d.total * 100).toFixed(1) : 0
      const c = d.total > 0 ? +(d.cabOcup / d.total * 100).toFixed(1) : 0
      return [h, c, +Math.max(0, 100 - h - c).toFixed(1)]
    }

    function mkIng(id, dat, small) {
      const el = document.getElementById(id); if (!el) return
      const pctPlugin = {
        id: 'pctAboveBars',
        afterDatasetsDraw(chart) {
          const ctx = chart.ctx
          chart.data.datasets.forEach((ds, i) => {
            const meta = chart.getDatasetMeta(i)
            if (meta.hidden) return
            const total = ds.data.reduce((a, b) => a + b, 0)
            meta.data.forEach((bar, j) => {
              if (!ds.data[j]) return
              const pct = total > 0 ? (ds.data[j] / total * 100).toFixed(1) : '0'
              ctx.save()
              ctx.fillStyle = '#555'
              ctx.font = `bold ${small ? 9 : 11}px sans-serif`
              ctx.textAlign = 'center'
              ctx.textBaseline = 'bottom'
              ctx.fillText(pct + '%', bar.x, bar.y - 1)
              ctx.restore()
            })
          })
        },
      }
      return new Chart(el, {
        type: 'bar',
        plugins: [pctPlugin],
        data: {
          labels: METODOS,
          datasets: [
            { label: 'Por fecha ingreso', data: dat.fi,  backgroundColor: C_AZ },
            { label: 'Por prorrateo',     data: dat.pro, backgroundColor: C_OR },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          layout: { padding: { top: small ? 12 : 16 } },
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: small ? 10 : 12 } } } },
          scales: { y: { beginAtZero: true, ticks: { font: { size: small ? 10 : 11 } } } },
        },
      })
    }

    function mkOcuBlock(id, slices, colors) {
      const el = document.getElementById(id); if (!el) return
      return new Chart(el, {
        type: 'bar',
        data: { labels: OCU_LABELS, datasets: [{ data: slices, backgroundColor: colors }] },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%', font: { size: 11 } } } },
        },
      })
    }

    function mkCan(id, labels, dat, small) {
      const el = document.getElementById(id); if (!el || !labels.length) return
      return new Chart(el, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Reservas', data: dat, backgroundColor: C_AZ }] },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: small ? 10 : 11 } } } },
        },
      })
    }

    function mkPieOcu(id, labels, dat, colors) {
      const el = document.getElementById(id); if (!el) return
      if (el._chartInst) el._chartInst.destroy()
      el._chartInst = new Chart(el, {
        type: 'pie',
        data: { labels, datasets: [{ data: dat, backgroundColor: colors }] },
        options: {
          responsive: true, maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: { size: 12 },
                generateLabels(chart) {
                  const ds  = chart.data.datasets[0]
                  const sum = ds.data.reduce((a, b) => a + b, 0)
                  const items = chart.data.labels.map((lbl, i) => ({
                    text:        `${lbl} — ${sum > 0 ? (ds.data[i] / sum * 100).toFixed(1) : '0.0'}%`,
                    fillStyle:   Array.isArray(ds.backgroundColor) ? ds.backgroundColor[i] : ds.backgroundColor,
                    strokeStyle: 'transparent', lineWidth: 0, hidden: false, index: i,
                  }))
                  const totPct = sum > 0 ? (ds.data[0] + ds.data[1]).toFixed(1) : '0.0'
                  items.splice(2, 0, {
                    text:        `Total ocupado — ${totPct}%`,
                    fillStyle:   'rgba(80,80,80,0.15)',
                    strokeStyle: 'transparent', lineWidth: 0, hidden: false, index: -1,
                  })
                  return items
                },
              },
            },
          },
        },
      })
    }

    function mkPie(id, labels, dat, colors) {
      const el = document.getElementById(id); if (!el) return
      if (el._chartInst) el._chartInst.destroy()
      el._chartInst = new Chart(el, {
        type: 'pie',
        data: { labels, datasets: [{ data: dat, backgroundColor: colors }] },
        options: {
          responsive: true, maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: { size: 12 },
                generateLabels(chart) {
                  const ds  = chart.data.datasets[0]
                  const sum = ds.data.reduce((a, b) => a + b, 0)
                  return chart.data.labels.map((lbl, i) => ({
                    text:        `${lbl} — ${sum > 0 ? (ds.data[i] / sum * 100).toFixed(1) : '0.0'}%`,
                    fillStyle:   Array.isArray(ds.backgroundColor) ? ds.backgroundColor[i] : ds.backgroundColor,
                    strokeStyle: 'transparent', lineWidth: 0, hidden: false, index: i,
                  }))
                },
              },
            },
          },
        },
      })
    }

    // Gráficos de escritorio
    chartsRef.current.ing   = mkIng('chart-ing',    D.ing,               false)
    chartsRef.current.ocuUn = mkOcuBlock('chart-ocu-un', ocuSlices(D.ocu.un),     OCU_COLORS)
    chartsRef.current.ocuPl = mkOcuBlock('chart-ocu-pl', ocuSlices(D.ocu.plazas), OCU_COLORS)
    chartsRef.current.can   = mkCan('chart-can',    D.can.labels, D.can.data, false)

    // Gráficos de comparación
    if (data.Comparar && data.PeriodoComparacion) {
      const cp   = data.PeriodoComparacion
      const cfi  = cp.IngresosFechaIngreso
      const cpro = cp.IngresosProrrateo
      const DC = {
        ing: {
          fi:  [cfi.Efectivo, cfi.Transferencia, cfi.TarjetaCredito, cfi.TarjetaDebito],
          pro: [cpro.Efectivo, cpro.Transferencia, cpro.TarjetaCredito, cpro.TarjetaDebito],
        },
        can: { labels: cp.Canales.map(c => c.Canal), data: cp.Canales.map(c => c.Cantidad) },
      }
      chartsRef.current.cmpIngP1 = mkIng('cmp-ing-p1', D.ing,  true)
      chartsRef.current.cmpIngP2 = mkIng('cmp-ing-p2', DC.ing, true)
      chartsRef.current.cmpCanP1 = mkCan('cmp-can-p1', D.can.labels,  D.can.data,  true)
      chartsRef.current.cmpCanP2 = mkCan('cmp-can-p2', DC.can.labels, DC.can.data, true)
    }

    // Listeners de modales (pie charts mobile)
    const modalDefs = [
      ['modal-chart-ing',    () => mkPie('chart-ing-m',       METODOS,       D.ing.fi,              PIE_COLORS)],
      ['modal-chart-ocu-un', () => mkPieOcu('chart-ocu-un-m', OCU_LABELS,    ocuSlices(D.ocu.un),     OCU_COLORS)],
      ['modal-chart-ocu-pl', () => mkPieOcu('chart-ocu-pl-m', OCU_PL_LABELS, ocuSlices(D.ocu.plazas), OCU_COLORS)],
      ['modal-chart-can',    () => mkPie('chart-can-m',        D.can.labels,  D.can.data,             PIE_COLORS)],
    ]
    const listeners = []
    for (const [id, fn] of modalDefs) {
      const el = document.getElementById(id)
      if (!el) continue
      el.addEventListener('shown.bs.modal', fn)
      listeners.push([el, fn])
    }

    // Popovers
    if (window.bootstrap) {
      document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => {
        new window.bootstrap.Popover(el, { trigger: 'click' })
      })
    }
    const closePopovers = e => {
      if (!e.target.closest('[data-bs-toggle="popover"]') && window.bootstrap) {
        document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => {
          window.bootstrap.Popover.getInstance(el)?.hide()
        })
      }
    }
    document.addEventListener('click', closePopovers, true)

    // iOS date placeholders
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      ;['desde', 'hasta', 'desdeComp', 'hastaComp'].forEach(name => {
        const inp = document.querySelector('#form-filtro input[name="' + name + '"]')
        if (!inp) return
        function mostrarPlaceholder() {
          if (!inp.value) { inp.type = 'text'; inp.placeholder = 'dd/mm/aaaa' }
        }
        inp.addEventListener('focus', () => { inp.type = 'date' })
        inp.addEventListener('blur',  mostrarPlaceholder)
        mostrarPlaceholder()
      })
    }

    return () => {
      Object.values(chartsRef.current).forEach(c => { try { c?.destroy() } catch {} })
      chartsRef.current = {}
      for (const [el, fn] of listeners) el.removeEventListener('shown.bs.modal', fn)
      document.removeEventListener('click', closePopovers, true)
      ;['chart-ing-m', 'chart-ocu-un-m', 'chart-ocu-pl-m', 'chart-can-m'].forEach(id => {
        const el = document.getElementById(id)
        if (el?._chartInst) { el._chartInst.destroy(); delete el._chartInst }
      })
    }
  }, [data, chartjsLoaded])

  // Exclusión mutua Mes/Año ↔ Desde/Hasta
  function onMesChange(v)       { setMes(v);       if (v) { setDesde('');    setHasta('')    } }
  function onAnnoChange(v)      { setAnno(v);      if (v) { setDesde('');    setHasta('')    } }
  function onDesdeChange(v)     { setDesde(v);     if (v) { setMes('');      setAnno('')     } }
  function onHastaChange(v)     { setHasta(v);     if (v) { setMes('');      setAnno('')     } }
  function onMesCompChange(v)   { setMesComp(v);   if (v) { setDesdeComp(''); setHastaComp('') } }
  function onAnnoCompChange(v)  { setAnnoComp(v);  if (v) { setDesdeComp(''); setHastaComp('') } }
  function onDesdeCompChange(v) { setDesdeComp(v); if (v) { setMesComp('');   setAnnoComp('')  } }
  function onHastaCompChange(v) { setHastaComp(v); if (v) { setMesComp('');   setAnnoComp('')  } }

  function handleSubmit(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (mes)   params.set('mes', mes)
    if (anno)  params.set('anno', anno)
    if (desde) params.set('desde', desde)
    if (hasta) params.set('hasta', hasta)
    if (comparar) {
      params.set('comparar', 'true')
      if (mesComp)   params.set('mesComp', mesComp)
      if (annoComp)  params.set('annoComp', annoComp)
      if (desdeComp) params.set('desdeComp', desdeComp)
      if (hastaComp) params.set('hastaComp', hastaComp)
    }
    router.push(`/gestion/dashboard?${params.toString()}`)
  }

  const p   = data.Periodo   || {}
  const fi  = p.IngresosFechaIngreso || {}
  const pro = p.IngresosProrrateo    || {}
  const ocu = p.Ocupacion            || {}
  const cp  = data.PeriodoComparacion
  const cfi  = cp?.IngresosFechaIngreso || {}
  const cpro = cp?.IngresosProrrateo    || {}
  const cocu = cp?.Ocupacion            || {}

  return (
    <>
      <Navbar />
      <Head><title>Dashboard — Brisas de Oro</title></Head>
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js"
        strategy="afterInteractive"
        onReady={() => setChartjsLoaded(true)}
      />

      <div className="container">
        <style jsx global>{`
          #tabla-ingresos-wrap .fw-semibold { font-weight: bold !important; }
          #tabla-ocu-un-wrap tr.table-light td.fw-semibold,
          #tabla-ocu-pl-wrap tr.table-light td.fw-semibold { font-weight: bold !important; }
          #tabla-canales-wrap td:nth-child(3) { font-weight: bold !important; }
          .d-contents { display: contents; }
          @media (max-width: 767.98px) {
            #filtro-btns { flex: 0 0 100% !important; max-width: 100% !important; justify-content: center !important; }
            #filtro-btns .btn { flex: 1 !important; }
            #filtro-btns a.btn { display: flex !important; align-items: center !important; justify-content: center !important; }
            #tabla-ingresos-wrap table { min-width: 650px !important; }
            #tabla-ingresos-wrap th { white-space: nowrap !important; }
            #tabla-ingresos-wrap th:first-child { width: 180px !important; min-width: 180px !important; }
            #tabla-ingresos-wrap td:first-child { white-space: nowrap !important; }
            #form-filtro input[name="desde"],
            #form-filtro input[name="hasta"] { text-align: center !important; }
            #tabla-ocu-un-wrap table { min-width: 400px !important; }
            #tabla-ocu-un-wrap td, #tabla-ocu-un-wrap th { white-space: nowrap !important; }
            #tabla-ocu-pl-wrap table { min-width: 400px !important; }
            #tabla-ocu-pl-wrap td, #tabla-ocu-pl-wrap th { white-space: nowrap !important; }
            #subtit-ocu-un, #subtit-ocu-pl { white-space: nowrap !important; font-size: .7rem !important; }
            #tabla-ingresos-wrap { margin-bottom: 0 !important; }
            .modal-grafico .modal-content { height: auto !important; min-height: unset !important; }
            .modal-grafico .modal-footer { padding-bottom: 1rem !important; }
            .btn-grafico-container { display: flex !important; justify-content: center !important; }
          }
          @media (min-width: 769px) {
            #filtro-hint { flex: 0 0 100% !important; }
            #filtro-btns .btn { width: 110px !important; }
          }
        `}</style>

        {/* ── Encabezado ── */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Dashboard</h2>
        </div>

        {/* ── Filtros ── */}
        <form onSubmit={handleSubmit} className="mb-4" id="form-filtro">
          {/* Fila 1 */}
          <div className="row g-2 align-items-end mb-2">
            <div className="col-6 col-md-auto">
              <label className="form-label small mb-1">Mes</label>
              <select name="mes" className="form-select form-select-sm" value={mes} onChange={e => onMesChange(e.target.value)}>
                <option value="">—</option>
                {MESES.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-auto">
              <label className="form-label small mb-1">Año</label>
              <select name="anno" className="form-select form-select-sm" value={anno} onChange={e => onAnnoChange(e.target.value)}>
                <option value="">—</option>
                {(data.AnnosDisponibles || []).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-auto">
              <label className="form-label small mb-1">Desde</label>
              <input type="date" name="desde" className="form-control form-control-sm"
                     placeholder="dd/mm/aaaa" value={desde} onChange={e => onDesdeChange(e.target.value)} />
            </div>
            <div className="col-6 col-md-auto">
              <label className="form-label small mb-1">Hasta</label>
              <input type="date" name="hasta" className="form-control form-control-sm"
                     placeholder="dd/mm/aaaa" value={hasta} onChange={e => onHastaChange(e.target.value)} />
            </div>
            <div id="filtro-btns" className="col-auto d-flex gap-2">
              <button type="submit" className="btn btn-primary btn-sm">
                <i className="bi bi-funnel me-1"></i>Filtrar
              </button>
              <a href="/gestion/dashboard" className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-x-lg me-1"></i>Limpiar
              </a>
            </div>
            <div id="filtro-hint" className="col-auto align-self-end pb-1">
              <span className="text-muted fst-italic" style={{fontSize:'.74rem'}}>Desde/Hasta tiene prioridad sobre Mes/Año</span>
            </div>
          </div>
          {/* Fila 2: comparación */}
          <div className="row g-2 align-items-end">
            <div className="col-auto align-self-center">
              <div className="form-check mb-0">
                <input type="checkbox" className="form-check-input" id="chk-comparar"
                       name="comparar" value="true"
                       checked={comparar}
                       onChange={e => setComparar(e.target.checked)} />
                <label className="form-check-label small" htmlFor="chk-comparar">Comparar con otro período</label>
              </div>
            </div>
            <div id="comp-row" className={comparar ? 'd-contents' : 'd-none'}>
              <div className="col-auto">
                <label className="form-label small mb-1"><span className="d-none d-md-inline">Mes (<strong>Comparativo</strong>)</span><span className="d-md-none">Mes (<strong>Comparativo</strong>)</span></label>
                <select name="mesComp" className="form-select form-select-sm" value={mesComp} onChange={e => onMesCompChange(e.target.value)}>
                  <option value="">—</option>
                  {MESES.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                </select>
              </div>
              <div className="col-auto">
                <label className="form-label small mb-1"><span className="d-none d-md-inline">Año (<strong>Comparativo</strong>)</span><span className="d-md-none">Año (<strong>Comparativo</strong>)</span></label>
                <select name="annoComp" className="form-select form-select-sm" value={annoComp} onChange={e => onAnnoCompChange(e.target.value)}>
                  <option value="">—</option>
                  {(data.AnnosDisponibles || []).map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="col-auto">
                <label className="form-label small mb-1"><span className="d-none d-md-inline">Desde (<strong>Comparativo</strong>)</span><span className="d-md-none">Desde (<strong>Comparativo</strong>)</span></label>
                <input type="date" name="desdeComp" className="form-control form-control-sm"
                       placeholder="dd/mm/aaaa" value={desdeComp} onChange={e => onDesdeCompChange(e.target.value)} />
              </div>
              <div className="col-auto">
                <label className="form-label small mb-1"><span className="d-none d-md-inline">Hasta (<strong>Comparativo</strong>)</span><span className="d-md-none">Hasta (<strong>Comparativo</strong>)</span></label>
                <input type="date" name="hastaComp" className="form-control form-control-sm"
                       placeholder="dd/mm/aaaa" value={hastaComp} onChange={e => onHastaCompChange(e.target.value)} />
              </div>
            </div>
          </div>
        </form>

        {/* ── Label período ── */}
        <h5 className="text-muted mb-3" style={{fontSize:'.85rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em'}}>
          <i className="bi bi-calendar3 me-1"></i>{p.Label}
        </h5>

        {/* ══ SECCIÓN 1 — Tarjetas de resumen ══ */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card text-center h-100 border-primary border-opacity-50">
              <div className="card-body py-3">
                <div className="fs-4 fw-bold text-primary">${fmt(p.TotalIngresos)}</div>
                <div className="text-muted small mt-1"><strong>Total ingresos</strong><br /><span className="fst-italic">(Por fecha ingreso)</span></div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card text-center h-100 border-success border-opacity-50">
              <div className="card-body py-3">
                <div className="fs-4 fw-bold text-success">{fmtPct(p.PctOcupacion)}</div>
                <div className="text-muted small mt-1"><strong>Ocupación total</strong><br /><span className="fst-italic">(Hab. + Cabañas)</span></div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card text-center h-100 border-warning border-opacity-50">
              <div className="card-body py-3">
                <div className="fs-4 fw-bold text-warning">{p.CantidadReservas}</div>
                <div className="text-muted small mt-1"><strong>Reservas del período</strong><br /><span className="fst-italic">(Ingreso en el período)</span></div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card text-center h-100 border-info border-opacity-50">
              <div className="card-body py-3">
                <div className="fs-4 fw-bold text-info">{Number(p.PromedioNoches).toFixed(1)}</div>
                <div className="text-muted small mt-1"><strong>Promedio de noches</strong><br /><span className="fst-italic">(Por reserva)</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ SECCIÓN 2 — Ingresos por método de pago ══ */}
        <div className="card mb-4">
          <div className="card-header fw-semibold bg-light">
            <i className="bi bi-cash-stack me-1"></i>Ingresos por método de pago
            <span className="text-muted fw-normal small ms-2">(excluye invitaciones)</span>
          </div>
          <div className="card-body">
            <div id="tabla-ingresos-wrap" className="table-responsive mb-3">
              <table className="table table-sm table-bordered align-middle mb-0" style={{fontSize:'.85rem'}}>
                <thead className="table-dark">
                  <tr><th>Variante</th><th className="text-end">Efectivo</th><th className="text-end">Transferencia</th><th className="text-end">T. Crédito</th><th className="text-end">T. Débito</th><th className="text-end fw-semibold">Total</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className="text-muted">Por fecha de ingreso</span>
                      <button type="button" className="d-md-none btn btn-link btn-sm p-0 ms-1 align-baseline border-0 text-secondary lh-1"
                              data-bs-toggle="popover" data-bs-trigger="click" data-bs-placement="top"
                              data-bs-content="Cuenta el total de la reserva según el mes de ingreso del huésped">ⓘ</button>
                      <div className="text-muted d-none d-md-block" style={{fontSize:'.73rem',fontWeight:400,lineHeight:1.3,marginTop:'2px'}}>
                        Cuenta el total de la reserva según el mes de ingreso del huésped
                      </div>
                    </td>
                    <td className="text-end">${fmt(fi.Efectivo)}</td>
                    <td className="text-end">${fmt(fi.Transferencia)}</td>
                    <td className="text-end">${fmt(fi.TarjetaCredito)}</td>
                    <td className="text-end">${fmt(fi.TarjetaDebito)}</td>
                    <td className="text-end fw-semibold">${fmt(fi.Total)}</td>
                  </tr>
                  <tr className="table-light">
                    <td>
                      <span className="text-muted">Por prorrateo</span>
                      <button type="button" className="d-md-none btn btn-link btn-sm p-0 ms-1 align-baseline border-0 text-secondary lh-1"
                              data-bs-toggle="popover" data-bs-trigger="click" data-bs-placement="top"
                              data-bs-content="Cuenta solo los días del período seleccionado, prorrateando estadías que abarcan más de un mes">ⓘ</button>
                      <div className="text-muted d-none d-md-block" style={{fontSize:'.73rem',fontWeight:400,lineHeight:1.3,marginTop:'2px'}}>
                        Cuenta solo los días correspondientes al período seleccionado, prorrateando estadías que abarcan más de un mes
                      </div>
                    </td>
                    <td className="text-end">${fmt(pro.Efectivo)}</td>
                    <td className="text-end">${fmt(pro.Transferencia)}</td>
                    <td className="text-end">${fmt(pro.TarjetaCredito)}</td>
                    <td className="text-end">${fmt(pro.TarjetaDebito)}</td>
                    <td className="text-end fw-semibold">${fmt(pro.Total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="d-md-none text-center text-muted" style={{fontSize:'11px',marginTop:'6px'}}>← Deslizá para ver más →</div>
            <hr className="my-3 d-mobile-none" style={{borderColor:'#dee2e6',opacity:.6}} />
            <div style={{maxHeight:'220px'}} className="d-mobile-none"><canvas id="chart-ing"></canvas></div>
            <div className="btn-grafico-container">
              <button type="button" className="btn btn-outline-primary btn-sm d-desktop-none mt-2"
                      data-bs-toggle="modal" data-bs-target="#modal-chart-ing">
                <i className="bi bi-pie-chart me-1"></i>Ver gráfico de ingresos
              </button>
            </div>
          </div>
        </div>

        {/* ══ SECCIÓN 3 — Porcentaje de ocupación ══ */}
        <div className="card mb-4">
          <div className="card-header fw-semibold bg-light">
            <i className="bi bi-building me-1"></i>Porcentaje de ocupación
            <span className="text-muted fw-normal small ms-2">(excluye invitaciones)</span>
          </div>
          <div className="card-body">
            {/* Bloque 1: Unidades */}
            <div className="fw-semibold mb-1">Ocupación de unidades</div>
            <div id="subtit-ocu-un" className="text-muted mb-2" style={{fontSize:'.78rem'}}>
              <span className="d-none d-md-inline">Porcentaje</span><span className="d-md-none">%</span> de instalaciones ocupadas sobre el total disponible del período
            </div>
            <div id="tabla-ocu-un-wrap" className="table-responsive">
              <table className="table table-sm table-bordered align-middle mb-0" style={{fontSize:'.85rem'}}>
                <thead className="table-dark">
                  <tr>
                    <th></th>
                    <th className="text-center">Habitaciones</th>
                    <th className="text-center">Cabañas</th>
                    <th className="text-center fw-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-muted">
                      <span className="d-none d-md-inline">Días ocupados / Días disponibles</span>
                      <span className="d-md-none">Días oc. / Días disp.</span>
                    </td>
                    <td className="text-center">{ocu.DiasHabOcupados} / {ocu.DiasHabTotal}</td>
                    <td className="text-center">{ocu.DiasCabOcupados} / {ocu.DiasCabTotal}</td>
                    <td className="text-center fw-semibold">{ocu.DiasTotalOcupados} / {ocu.DiasTotal}</td>
                  </tr>
                  <tr className="table-light">
                    <td className="text-muted">Porcentaje</td>
                    <td className="text-center fw-semibold text-primary">{fmtPct(ocu.PctHabitaciones)}</td>
                    <td className="text-center fw-semibold text-success">{fmtPct(ocu.PctCabanas)}</td>
                    <td className="text-center fw-semibold text-danger">{fmtPct(ocu.PctTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="d-md-none text-center text-muted" style={{fontSize:'11px',marginTop:'6px'}}>← Deslizá para ver más →</div>
            <hr className="my-3 d-mobile-none" style={{borderColor:'#dee2e6',opacity:.6}} />
            <div style={{maxHeight:'200px'}} className="d-mobile-none"><canvas id="chart-ocu-un"></canvas></div>
            <div className="btn-grafico-container">
              <button type="button" className="btn btn-outline-primary btn-sm d-desktop-none mt-2"
                      data-bs-toggle="modal" data-bs-target="#modal-chart-ocu-un">
                <i className="bi bi-pie-chart me-1"></i>Ver gráfico de unidades
              </button>
            </div>

            <hr className="my-4" style={{borderWidth:'2px',borderColor:'#495057',opacity:.2}} />

            {/* Bloque 2: Plazas */}
            <div className="fw-semibold mb-1">Ocupación de plazas</div>
            <div id="subtit-ocu-pl" className="text-muted mb-2" style={{fontSize:'.78rem'}}>
              <span className="d-none d-md-inline">Porcentaje</span><span className="d-md-none">%</span> de personas reales sobre la capacidad máxima total del período
            </div>
            <div id="tabla-ocu-pl-wrap" className="table-responsive">
              <table className="table table-sm table-bordered align-middle mb-0" style={{fontSize:'.85rem'}}>
                <thead className="table-dark">
                  <tr>
                    <th></th>
                    <th className="text-center">Habitaciones</th>
                    <th className="text-center">Cabañas</th>
                    <th className="text-center fw-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-muted">
                      <span className="d-none d-md-inline">Personas alojadas / Plazas disponibles</span>
                      <span className="d-md-none">Pers. aloj. / Plazas disp.</span>
                    </td>
                    <td className="text-center">{ocu.PlazasHabOcupadas} / {ocu.PlazasHabDisponibles}</td>
                    <td className="text-center">{ocu.PlazasCabOcupadas} / {ocu.PlazasCabDisponibles}</td>
                    <td className="text-center fw-semibold">{ocu.PlazasTotalOcupadas} / {ocu.PlazasTotalDisponibles}</td>
                  </tr>
                  <tr className="table-light">
                    <td className="text-muted">Porcentaje</td>
                    <td className="text-center fw-semibold text-primary">{fmtPct(ocu.PctPlazasHabitaciones)}</td>
                    <td className="text-center fw-semibold text-success">{fmtPct(ocu.PctPlazasCabanas)}</td>
                    <td className="text-center fw-semibold text-danger">{fmtPct(ocu.PctPlazasTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="d-md-none text-center text-muted" style={{fontSize:'11px',marginTop:'6px'}}>← Deslizá para ver más →</div>
            <hr className="my-3 d-mobile-none" style={{borderColor:'#dee2e6',opacity:.6}} />
            <div style={{maxHeight:'200px'}} className="d-mobile-none"><canvas id="chart-ocu-pl"></canvas></div>
            <div className="btn-grafico-container">
              <button type="button" className="btn btn-outline-primary btn-sm d-desktop-none mt-2"
                      data-bs-toggle="modal" data-bs-target="#modal-chart-ocu-pl">
                <i className="bi bi-pie-chart me-1"></i>Ver gráfico de plazas
              </button>
            </div>
          </div>
        </div>

        {/* ══ SECCIÓN 4 — Reservas por canal de origen ══ */}
        <div className="card mb-4">
          <div className="card-header fw-semibold bg-light">
            <i className="bi bi-diagram-3 me-1"></i>Reservas por canal de origen
          </div>
          <div className="card-body">
            {!p.Canales?.length ? (
              <p className="text-muted fst-italic mb-0">Sin reservas en el período.</p>
            ) : (
              <>
                <div id="tabla-canales-wrap" className="table-responsive mb-3">
                  <table className="table table-sm table-bordered align-middle mb-0" style={{fontSize:'.85rem'}}>
                    <thead className="table-dark">
                      <tr><th>Canal</th><th className="text-center">Reservas</th><th className="text-center">%</th></tr>
                    </thead>
                    <tbody>
                      {p.Canales.map((c, i) => (
                        <tr key={i}><td>{c.Canal}</td><td className="text-center fw-semibold">{c.Cantidad}</td><td className="text-center">{fmtPct(c.Porcentaje)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{maxHeight:'220px'}} className="d-mobile-none"><canvas id="chart-can"></canvas></div>
                <div className="btn-grafico-container">
                  <button type="button" className="btn btn-outline-primary btn-sm d-desktop-none mt-2"
                          data-bs-toggle="modal" data-bs-target="#modal-chart-can">
                    <i className="bi bi-pie-chart me-1"></i>Ver gráfico de canales
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ══ SECCIÓN 5 — Comparación de períodos ══ */}
        {data.Comparar && cp && (
          <>
            <hr className="my-4" />
            <h5 className="text-muted mb-3" style={{fontSize:'.85rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em'}}>
              <i className="bi bi-arrow-left-right me-1"></i>Comparación de períodos
            </h5>

            {/* Resumen comparativo */}
            <div className="row g-3 mb-4">
              {[
                { pp: p,  hdr: p.Label,  bdr: 'border-primary', bgCls: 'bg-primary bg-opacity-10' },
                { pp: cp, hdr: cp.Label, bdr: 'border-warning', bgCls: 'bg-warning bg-opacity-10' },
              ].map(({ pp, hdr, bdr, bgCls }) => (
                <div className="col-md-6" key={hdr}>
                  <div className={`card h-100 ${bdr} border-opacity-25`}>
                    <div className={`card-header fw-semibold py-2 ${bgCls}`}>{hdr}</div>
                    <div className="card-body">
                      <div className="row g-2 text-center">
                        <div className="col-6"><div className="border rounded p-2"><div className="fw-bold text-primary">${fmt(pp.TotalIngresos)}</div><div className="text-muted" style={{fontSize:'.72rem'}}>Ingresos</div></div></div>
                        <div className="col-6"><div className="border rounded p-2"><div className="fw-bold text-success">{fmtPct(pp.PctOcupacion)}</div><div className="text-muted" style={{fontSize:'.72rem'}}>Ocupación</div></div></div>
                        <div className="col-6"><div className="border rounded p-2"><div className="fw-bold text-warning">{pp.CantidadReservas}</div><div className="text-muted" style={{fontSize:'.72rem'}}>Reservas</div></div></div>
                        <div className="col-6"><div className="border rounded p-2"><div className="fw-bold text-info">{Number(pp.PromedioNoches).toFixed(1)}</div><div className="text-muted" style={{fontSize:'.72rem'}}>Prom. noches</div></div></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ingresos comparativos */}
            <div className="row g-3 mb-4">
              {[
                { pfi: fi,  ppro: pro, hdr: p.Label,  isComp: false, cid: 'cmp-ing-p1' },
                { pfi: cfi, ppro: cpro, hdr: cp.Label, isComp: true,  cid: 'cmp-ing-p2' },
              ].map(({ pfi, ppro, hdr, isComp, cid }) => (
                <div className="col-md-6" key={cid}>
                  <div className="card">
                    <div className={`card-header fw-semibold small py-2 ${isComp ? 'bg-warning bg-opacity-10' : 'bg-primary bg-opacity-10'}`}>
                      <i className="bi bi-cash-stack me-1"></i>Ingresos — {hdr}
                    </div>
                    <div className="card-body p-2">
                      <div className="table-responsive mb-2">
                        <table className="table table-sm table-bordered mb-0" style={{fontSize:'.77rem'}}>
                          <thead className="table-dark">
                            <tr><th>Variante</th><th className="text-end">Efect.</th><th className="text-end">Trans.</th><th className="text-end">Créd.</th><th className="text-end">Déb.</th><th className="text-end">Total</th></tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="text-muted">F. ingreso</td>
                              <td className="text-end">${fmt(pfi.Efectivo)}</td><td className="text-end">${fmt(pfi.Transferencia)}</td>
                              <td className="text-end">${fmt(pfi.TarjetaCredito)}</td><td className="text-end">${fmt(pfi.TarjetaDebito)}</td>
                              <td className="text-end fw-semibold">${fmt(pfi.Total)}</td>
                            </tr>
                            <tr className="table-light">
                              <td className="text-muted">Prorrateo</td>
                              <td className="text-end">${fmt(ppro.Efectivo)}</td><td className="text-end">${fmt(ppro.Transferencia)}</td>
                              <td className="text-end">${fmt(ppro.TarjetaCredito)}</td><td className="text-end">${fmt(ppro.TarjetaDebito)}</td>
                              <td className="text-end fw-semibold">${fmt(ppro.Total)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div style={{height:'155px'}}><canvas id={cid}></canvas></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ocupación comparativa */}
            <div className="row g-3 mb-4">
              {[
                { ocuItem: ocu,  hdr: p.Label,  isComp: false },
                { ocuItem: cocu, hdr: cp.Label, isComp: true  },
              ].map(({ ocuItem, hdr, isComp }) => (
                <div className="col-md-6" key={hdr + '-ocu'}>
                  <div className="card">
                    <div className={`card-header fw-semibold small py-2 ${isComp ? 'bg-warning bg-opacity-10' : 'bg-primary bg-opacity-10'}`}>
                      <i className="bi bi-building me-1"></i>Ocupación — {hdr}
                    </div>
                    <div className="card-body p-2">
                      <table className="table table-sm table-bordered mb-0" style={{fontSize:'.8rem'}}>
                        <tbody>
                          <tr><td className="text-muted">Habitaciones</td><td className="text-center text-muted">{ocuItem.DiasHabOcupados}/{ocuItem.DiasHabTotal} días</td><td className="text-center fw-semibold text-primary">{fmtPct(ocuItem.PctHabitaciones)}</td></tr>
                          <tr><td className="text-muted">Cabañas</td><td className="text-center text-muted">{ocuItem.DiasCabOcupados}/{ocuItem.DiasCabTotal} días</td><td className="text-center fw-semibold text-success">{fmtPct(ocuItem.PctCabanas)}</td></tr>
                          <tr className="table-light"><td className="fw-semibold">Total</td><td className="text-center text-muted">{ocuItem.DiasTotalOcupados}/{ocuItem.DiasTotal} días</td><td className="text-center fw-semibold text-danger">{fmtPct(ocuItem.PctTotal)}</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Canales comparativos */}
            <div className="row g-3 mb-4">
              {[
                { pp: p,  hdr: p.Label,  isComp: false, cid: 'cmp-can-p1' },
                { pp: cp, hdr: cp.Label, isComp: true,  cid: 'cmp-can-p2' },
              ].map(({ pp, hdr, isComp, cid }) => (
                <div className="col-md-6" key={cid}>
                  <div className="card">
                    <div className={`card-header fw-semibold small py-2 ${isComp ? 'bg-warning bg-opacity-10' : 'bg-primary bg-opacity-10'}`}>
                      <i className="bi bi-diagram-3 me-1"></i>Canales — {hdr}
                    </div>
                    <div className="card-body p-2">
                      {!pp.Canales?.length ? (
                        <p className="text-muted fst-italic small mb-0">Sin reservas.</p>
                      ) : (
                        <>
                          <table className="table table-sm table-bordered mb-2" style={{fontSize:'.8rem'}}>
                            <thead className="table-dark"><tr><th>Canal</th><th className="text-center">Reservas</th><th className="text-center">%</th></tr></thead>
                            <tbody>
                              {pp.Canales.map((c, i) => (
                                <tr key={i}><td>{c.Canal}</td><td className="text-center fw-semibold">{c.Cantidad}</td><td className="text-center">{fmtPct(c.Porcentaje)}</td></tr>
                              ))}
                            </tbody>
                          </table>
                          <div style={{height:'140px'}}><canvas id={cid}></canvas></div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Modales de gráficos (mobile) ── */}
        {[
          { modalId: 'modal-chart-ing',    titulo: 'Ingresos por método de pago', canvasId: 'chart-ing-m'    },
          { modalId: 'modal-chart-ocu-un', titulo: 'Ocupación de unidades',       canvasId: 'chart-ocu-un-m' },
          { modalId: 'modal-chart-ocu-pl', titulo: 'Ocupación de plazas',         canvasId: 'chart-ocu-pl-m' },
          { modalId: 'modal-chart-can',    titulo: 'Reservas por canal',           canvasId: 'chart-can-m'    },
        ].map(({ modalId, titulo, canvasId }) => (
          <div key={modalId} className="modal fade modal-grafico" id={modalId} tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header py-2">
                  <h6 className="modal-title fw-semibold">{titulo}</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">
                  <canvas id={canvasId} style={{maxHeight:'60vh'}}></canvas>
                </div>
                <div className="modal-footer py-2">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
