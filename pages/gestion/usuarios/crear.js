import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import Navbar from '@/components/gestion/Navbar'
import Footer from '@/components/gestion/Footer'

export async function getServerSideProps(context) {
  const { req, res } = context
  const session = await getServerSession(req, res, authOptions)
  if (!session) return { redirect: { destination: '/login', permanent: false } }
  if (Number(session.user.rol) !== 0) return { redirect: { destination: '/gestion/inicio', permanent: false } }

  return {
    props: {
      user: { id: session.user.id ?? null, userName: session.user.userName ?? null, rol: session.user.rol ?? null },
    },
  }
}

export default function CrearUsuario({ user }) {
  const router = useRouter()

  useEffect(() => {
    let _confirmadoCrear = false

    const gid = id => document.getElementById(id)

    function onSubmit(e) {
      if (_confirmadoCrear) return
      e.preventDefault()

      gid('conf-username').textContent = gid('UserName').value.trim() || '—'
      gid('conf-rol').textContent = gid('Rol').value || '—'

      const celular = gid('PhoneNumber').value.trim()
      const fila = gid('conf-celular-row')
      if (celular) {
        gid('conf-celular').textContent = celular
        fila.style.display = ''
      } else {
        fila.style.display = 'none'
      }

      window.bootstrap?.Modal.getOrCreateInstance(gid('modal-confirmar-crear')).show()
    }

    async function onConfirmar() {
      _confirmadoCrear = true
      window.bootstrap?.Modal.getInstance(gid('modal-confirmar-crear'))?.hide()

      const body = {
        userName:        gid('UserName').value.trim(),
        password:         gid('Password').value,
        confirmPassword:  gid('ConfirmPassword').value,
        phoneNumber:      gid('PhoneNumber').value.trim(),
        rol:              gid('Rol').value,
      }

      try {
        const res = await fetch('/api/gestion/usuarios/crear', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        const d = await res.json()
        if (res.ok) {
          router.push('/gestion/usuarios?mensaje=Usuario+creado+correctamente&tipo=success')
        } else {
          const msgs = d.errores ?? ['Error al crear el usuario.']
          gid('lista-errores').innerHTML = msgs.map(m => `<li>${m}</li>`).join('')
          gid('resumen-errores').classList.remove('d-none')
          gid('resumen-errores').scrollIntoView({ behavior: 'smooth', block: 'start' })
          _confirmadoCrear = false
        }
      } catch {
        gid('lista-errores').innerHTML = '<li>Error de red. Intentá nuevamente.</li>'
        gid('resumen-errores').classList.remove('d-none')
        _confirmadoCrear = false
      }
    }

    const form = gid('form-crear-usr')
    const btnConfirmar = gid('btn-confirmar-crear')
    form.addEventListener('submit', onSubmit)
    btnConfirmar.addEventListener('click', onConfirmar)

    return () => {
      form.removeEventListener('submit', onSubmit)
      btnConfirmar.removeEventListener('click', onConfirmar)
    }
  }, [router])

  return (
    <>
      <Head><title>Nuevo usuario — Brisas de Oro</title></Head>
      <Navbar user={user} />
      <style jsx global>{`
        @media (max-width: 767.98px) {
            #btn-volver-crear-usr   { display: flex !important; align-items: center !important; justify-content: center !important; }
            #btn-cancelar-crear-usr { display: flex !important; align-items: center !important; justify-content: center !important; }
            #btns-crear-usr         { justify-content: center !important; }
            #modal-confirmar-crear .modal-content { height: auto !important; min-height: unset !important; }
            #modal-confirmar-crear .modal-footer  { padding-bottom: 1rem !important; }
        }
        @media (min-width: 769px) {
            #btns-crear-usr { justify-content: center !important; }
        }
      `}</style>

      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Nuevo usuario</h2>
          <Link id="btn-volver-crear-usr" href="/gestion/usuarios" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i>Volver al listado
          </Link>
        </div>

        <div id="resumen-errores" className="alert alert-danger d-none" role="alert">
          <strong>Corregí los siguientes errores:</strong>
          <ul className="mb-0 mt-1" id="lista-errores"></ul>
        </div>

        <div className="card" style={{ maxWidth: 540 }}>
          <div className="card-body">

            <form id="form-crear-usr" noValidate>
              <div className="mb-3">
                <label htmlFor="UserName" className="form-label">
                  Nombre de usuario <span className="text-danger">*</span>
                </label>
                <input id="UserName" className="form-control" placeholder="ej: maria.gonzalez" />
              </div>

              <div className="mb-3">
                <label htmlFor="Password" className="form-label">
                  Contraseña <span className="text-danger">*</span>
                </label>
                <input id="Password" type="password" className="form-control" />
              </div>

              <div className="mb-3">
                <label htmlFor="ConfirmPassword" className="form-label">
                  Confirmar contraseña <span className="text-danger">*</span>
                </label>
                <input id="ConfirmPassword" type="password" className="form-control" />
              </div>

              <div className="mb-3">
                <label htmlFor="PhoneNumber" className="form-label">Número de celular</label>
                <input id="PhoneNumber" className="form-control" placeholder="ej: 11 1234-5678" />
              </div>

              <div className="mb-4">
                <label htmlFor="Rol" className="form-label">
                  Rol <span className="text-danger">*</span>
                </label>
                <select id="Rol" className="form-select" defaultValue="Viewer">
                  <option value="Administrador">Administrador</option>
                  <option value="Viewer">Viewer</option>
                </select>
                <div className="form-text text-muted">
                  <strong>Administrador:</strong> acceso completo.{' '}
                  <strong>Viewer:</strong> solo lectura.
                </div>
              </div>

              <div id="btns-crear-usr" className="d-flex gap-2">
                <button type="submit" className="btn btn-primary px-4">
                  <i className="bi bi-check-lg me-1"></i>Crear usuario
                </button>
                <Link id="btn-cancelar-crear-usr" href="/gestion/usuarios" className="btn btn-outline-secondary">Cancelar</Link>
              </div>
            </form>

          </div>
        </div>

        {/* Modal de confirmación */}
        <div className="modal fade" id="modal-confirmar-crear" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 400 }}>
            <div className="modal-content">
              <div className="modal-header py-2">
                <h6 className="modal-title fw-semibold">Confirmar nuevo usuario</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body pb-2">
                <table className="table table-sm table-borderless mb-0" style={{ fontSize: '.9rem' }}>
                  <tbody>
                    <tr>
                      <td className="text-muted pe-3" style={{ whiteSpace: 'nowrap' }}>Nombre de usuario</td>
                      <td className="fw-semibold" id="conf-username"></td>
                    </tr>
                    <tr>
                      <td className="text-muted pe-3">Rol</td>
                      <td className="fw-semibold" id="conf-rol"></td>
                    </tr>
                    <tr id="conf-celular-row">
                      <td className="text-muted pe-3">Celular</td>
                      <td className="fw-semibold" id="conf-celular"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="modal-footer py-2 gap-2">
                <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">
                  Volver y corregir
                </button>
                <button type="button" className="btn btn-success btn-sm" id="btn-confirmar-crear">
                  <i className="bi bi-check-lg me-1"></i>Sí, crear usuario
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
