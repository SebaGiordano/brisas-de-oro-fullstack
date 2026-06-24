import Link from 'next/link'
import Head from 'next/head'
import Script from 'next/script'
import { useRouter } from 'next/router'
import { useSession, signOut } from 'next-auth/react'

const NAV_LINKS = [
  { href: '/gestion/inicio',       label: 'Inicio' },
  { href: '/gestion/dashboard',    label: 'Dashboard' },
  { href: '/gestion/calendario',   label: 'Calendario' },
  { href: '/gestion/reservas',     label: 'Reservas' },
  { href: '/gestion/facturacion',  label: 'Facturación' },
  { href: '/gestion/alojamientos', label: 'Alojamientos' },
  { href: '/gestion/tarifas',      label: 'Tarifas' },
]

const ADMIN_LINKS = [
  { href: '/gestion/usuarios',       label: 'Usuarios' },
  { href: '/gestion/reservas/nueva', label: '+ Nueva Reserva', bold: true },
]

export default function Navbar() {
  const router  = useRouter()
  const { data: session } = useSession()
  const isAdmin = Number(session?.user?.rol) === 0
  const links   = isAdmin ? [...NAV_LINKS, ...ADMIN_LINKS] : NAV_LINKS

  function isActive(href, label) {
    const path = router.pathname
    if (label === 'Reservas') {
      return path.startsWith('/gestion/reservas') && path !== '/gestion/reservas/nueva'
    }
    return path === href
  }

  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" crossOrigin="anonymous" />
      </Head>
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" strategy="lazyOnload" />

      <header>
        <nav className="navbar navbar-expand-md navbar-toggleable-md navbar-light bg-white border-bottom box-shadow mb-3 fixed-top">
          <div className="container-fluid">
            <Link className="navbar-brand" href="/gestion/inicio">
              <img src="/images/logo.png" height="50" alt="Brisas de Oro"
                style={{ height: '50px', width: 'auto', objectFit: 'contain', display: 'block' }} />
            </Link>

            <button className="navbar-toggler" type="button"
              data-bs-toggle="collapse" data-bs-target=".navbar-collapse"
              aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="navbar-collapse collapse d-md-inline-flex justify-content-between">
              <ul className="navbar-nav flex-grow-1">
                {links.map(({ href, label, bold }) => (
                  <li className="nav-item" key={href}>
                    <Link
                      href={href}
                      className={`nav-link text-dark${isActive(href, label) ? ' active' : ''}${bold ? ' fw-semibold' : ''}`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>

              {session && (
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted small fw-bold">{session.user.userName}</span>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm fw-bold btn-salir"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                  >
                    Salir
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <style jsx global>{`
        body {
          font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
            "Noto Sans", "Liberation Sans", Arial, sans-serif !important;
        }
        .navbar-nav { align-items: center; }
        .btn-salir:hover, .btn-salir:active, .btn-salir:focus {
          background-color: #dc3545 !important;
          border-color: #dc3545 !important;
          color: #fff !important;
        }
        .navbar-nav .nav-link.active {
          background-color: #0d6efd;
          color: #fff !important;
          border-radius: 6px;
          font-weight: 600;
          padding: .35rem 1rem;
          line-height: 1.5;
        }
        .navbar { overflow: hidden; min-height: unset; }
        .navbar .navbar-brand, .navbar .nav-link, .navbar .navbar-toggler { padding-top: 0; padding-bottom: 0; }
        body { padding-top: 90px; }
        @media (max-width: 575.98px) { body { padding-top: 60px; } }
        @media (max-width: 767.98px) {
          footer .container { white-space: normal !important; word-wrap: break-word !important; text-align: center !important; }
          body > .container { padding-top: 12px !important; }
          .navbar { overflow: visible !important; }
          .navbar-collapse.show {
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
            background: #fff;
            border-radius: 0 0 12px 12px;
            box-shadow: 0 6px 20px rgba(0,0,0,.1);
            padding: 8px 12px 14px;
            width: 100%;
          }
          .navbar-collapse.show .navbar-nav {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 6px;
            width: 100%;
            padding: 0 !important;
            margin: 0 !important;
          }
          .navbar-collapse.show .navbar-nav .nav-item { width: 100%; }
          .navbar-collapse.show .navbar-nav .nav-link {
            display: block !important;
            text-align: center !important;
            padding: 12px 16px !important;
            border-radius: 8px !important;
            background-color: #f1f3f5 !important;
            color: #343a40 !important;
            font-weight: 500 !important;
            line-height: 1.4 !important;
          }
          .navbar-collapse.show .navbar-nav .nav-link.active {
            background-color: #0d6efd !important;
            color: #fff !important;
          }
          .navbar-collapse.show > div {
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
            border-top: 1px solid #dee2e6 !important;
            padding-top: 10px !important;
            margin-top: 6px !important;
            width: 100% !important;
          }
          .navbar-collapse.show > div .text-muted { font-size: 15px !important; }
          .navbar-collapse.show .btn-outline-secondary {
            border-color: #dc3545 !important;
            color: #dc3545 !important;
          }
          .navbar-toggler {
            height: 42px !important;
            width: 42px !important;
            padding: 6px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .navbar-toggler .navbar-toggler-icon {
            width: 26px !important;
            height: 26px !important;
          }
          .navbar-collapse.show .navbar-nav .nav-link.nav-tap-active {
            background-color: #0d6efd !important;
            color: #fff !important;
          }
        }
      `}</style>
    </>
  )
}
