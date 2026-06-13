import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Login() {
  const router = useRouter()
  const [form, setForm]       = useState({ userName: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      userName: form.userName,
      password: form.password,
      redirect: false,
    })

    setLoading(false)

    if (result?.ok) {
      router.push('/gestion/inicio')
    } else {
      setError('Usuario o contraseña incorrectos.')
    }
  }

  return (
    <>
      <Head>
        <title>Acceso — Brisas de Oro</title>
      </Head>

      <div className="login-page">
        <div className="login-card">

          <div className="login-logo">B</div>
          <h1 className="login-title">Brisas de Oro</h1>
          <p className="login-sub">Panel de gestión</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="field">
              <label htmlFor="userName">Usuario</label>
              <input
                id="userName"
                type="text"
                value={form.userName}
                onChange={e => setForm({ ...form, userName: e.target.value })}
                autoComplete="username"
                placeholder="Tu nombre de usuario"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Verificando…' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          background: #201E1B;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .login-card {
          background: var(--crema-a);
          border: 1px solid var(--borde);
          border-radius: 14px;
          padding: 2.75rem 2.25rem 2.25rem;
          width: 100%;
          max-width: 380px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0,0,0,0.35);
        }
        .login-logo {
          width: 52px;
          height: 52px;
          background: #201E1B;
          color: var(--oro);
          font-family: Georgia, serif;
          font-size: 1.75rem;
          font-weight: 700;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .login-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.65rem;
          font-weight: 600;
          color: var(--texto);
          margin-bottom: 0.25rem;
          letter-spacing: 0.01em;
        }
        .login-sub {
          font-size: 0.72rem;
          color: var(--texto-suave);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 2rem;
        }
        .login-form {
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .field label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--texto-medio);
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }
        .field input {
          background: var(--blanco);
          border: 1px solid var(--borde);
          border-radius: 8px;
          padding: 0.68rem 0.9rem;
          font-family: 'Nunito', sans-serif;
          font-size: 0.95rem;
          color: var(--texto);
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
          width: 100%;
        }
        .field input::placeholder {
          color: var(--texto-suave);
          opacity: 0.6;
        }
        .field input:focus {
          border-color: var(--oro);
          box-shadow: 0 0 0 3px rgba(184,152,42,0.15);
        }
        .login-error {
          background: #fff5f5;
          border: 1px solid #ffc5c5;
          border-radius: 8px;
          padding: 0.6rem 0.9rem;
          font-size: 0.85rem;
          color: #c0392b;
          text-align: center;
        }
        .login-btn {
          background: var(--oro);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.78rem;
          font-family: 'Nunito', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-top: 0.15rem;
          width: 100%;
        }
        .login-btn:hover:not(:disabled) {
          background: var(--oro-hover);
        }
        .login-btn:active:not(:disabled) {
          transform: translateY(1px);
        }
        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </>
  )
}
