import React, { useState } from 'react'
import { supabase } from '../../lib/supabase'

const messageByCode = {
  invalid_credentials: 'El correo o la contraseña no coinciden.',
  email_not_confirmed: 'Confirma tu correo antes de iniciar sesión.',
  user_already_exists: 'Ya existe una cuenta con ese correo.',
}

function readableAuthError(error) {
  return messageByCode[error?.code] ?? error?.message ?? 'No pudimos completar la solicitud.'
}

export function AuthScreen() {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setSubmitting(true)

    const result = mode === 'signin'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    setSubmitting(false)

    if (result.error) {
      setMessage(readableAuthError(result.error))
      return
    }

    if (mode === 'signup') {
      setMessage('Cuenta creada. Ya puedes iniciar sesión.')
      setMode('signin')
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-story">
        <p className="eyebrow">INGLÉS PARA LA VIDA REAL</p>
        <h1>GoIngrid</h1>
        <p>
          Aprende con explicaciones claras, práctica variada y situaciones que
          conectan con lo que necesitas decir fuera de la aplicación.
        </p>
        <div className="auth-benefits" aria-label="Beneficios">
          <span>Ruta A1 guiada</span>
          <span>Feedback inmediato</span>
          <span>Práctica oral</span>
        </div>
      </section>

      <section className="auth-card">
        <p className="section-label">{mode === 'signin' ? 'BIENVENIDO DE NUEVO' : 'EMPIEZA DESDE CERO'}</p>
        <h2>{mode === 'signin' ? 'Continúa aprendiendo' : 'Crea tu cuenta'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Correo
            <input
              autoComplete="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Contraseña
            <input
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              type="password"
              minLength="6"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? 'Procesando...' : mode === 'signin' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>
        {message && <p className="auth-message" role="status">{message}</p>}
        <button
          className="link-button"
          type="button"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setMessage('')
          }}
        >
          {mode === 'signin' ? 'Crear una cuenta nueva' : 'Ya tengo una cuenta'}
        </button>
      </section>
    </main>
  )
}
