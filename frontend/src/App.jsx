import React, { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authMode, setAuthMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [modules, setModules] = useState([])
  const [selectedModule, setSelectedModule] = useState(null)
  const [topics, setTopics] = useState([])
  const [lessons, setLessons] = useState([])
  const [exercises, setExercises] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setAuthLoading(false)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) {
      setLoading(false)
      return
    }
    async function loadModules() {
      const { data, error: queryError } = await supabase
        .from('modules')
        .select('id, title, description, sort_order, levels!inner(code, name)')
        .eq('levels.code', 'A1')
        .order('sort_order')

      if (queryError) setError(queryError.message)
      else {
        setModules(data ?? [])
        setSelectedModule(data?.[0] ?? null)
      }
      setLoading(false)
    }
    loadModules()
  }, [session])

  useEffect(() => {
    if (!selectedModule) return
    async function loadTopics() {
      const { data, error: queryError } = await supabase
        .from('topics')
        .select('id, title, description, sort_order')
        .eq('module_id', selectedModule.id)
        .order('sort_order')
      if (queryError) setError(queryError.message)
      else setTopics(data ?? [])
    }
    loadTopics()
  }, [selectedModule])

  async function openTopic(topic) {
    setError('')
    const { data, error: queryError } = await supabase
      .from('lessons')
      .select('id, title, objective, estimated_minutes, sort_order, exercises(id, exercise_type, prompt, explanation, difficulty, sort_order, exercise_options(id, option_text, is_correct, sort_order))')
      .eq('topic_id', topic.id)
      .order('sort_order')
    if (queryError) setError(queryError.message)
    else {
      const nextLessons = data ?? []
      setLessons(nextLessons)
      setExercises(nextLessons.flatMap((lesson) => lesson.exercises ?? []))
    }
  }

  async function handleAuth(event) {
    event.preventDefault()
    setAuthMessage('')
    const result = authMode === 'signin'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })
    if (result.error) setAuthMessage(result.error.message)
    else if (authMode === 'signup') setAuthMessage('Cuenta creada. Revisa tu correo si la confirmación está activada.')
  }

  if (authLoading) return <main className="auth-shell"><p>Cargando GoIngrid...</p></main>

  if (!session) return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">INGLÉS PARA LA VIDA REAL</p>
        <h1>GoIngrid</h1>
        <p className="hero-copy">Aprende con contexto, práctica guiada y conversaciones que se adaptan a ti.</p>
        <h2>{authMode === 'signin' ? 'Inicia sesión' : 'Crea tu cuenta'}</h2>
        <form onSubmit={handleAuth}>
          <label>Correo<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Contraseña<input type="password" minLength="6" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          <button className="primary-button" type="submit">{authMode === 'signin' ? 'Entrar' : 'Crear cuenta'}</button>
        </form>
        {authMessage && <p className="auth-message">{authMessage}</p>}
        <button className="link-button" onClick={() => { setAuthMode(authMode === 'signin' ? 'signup' : 'signin'); setAuthMessage('') }}>
          {authMode === 'signin' ? 'Crear una cuenta nueva' : 'Ya tengo una cuenta'}
        </button>
      </section>
    </main>
  )

  return (
    <main className="app-shell">
      <header className="hero">
        <button className="signout-button" onClick={() => supabase.auth.signOut()}>Cerrar sesión</button>
        <p className="eyebrow">INGLÉS PARA LA VIDA REAL</p>
        <h1>GoIngrid</h1>
        <p className="hero-copy">Aprende con contexto, práctica guiada y conversaciones que se adaptan a ti.</p>
      </header>

      <section className="workspace">
        <aside className="module-panel">
          <p className="section-label">Tu ruta A1</p>
          {loading ? <p>Cargando módulos...</p> : modules.map((module) => (
            <button
              className={selectedModule?.id === module.id ? 'module-card active' : 'module-card'}
              key={module.id}
              onClick={() => setSelectedModule(module)}
            >
              <span>Módulo {module.sort_order}</span>
              <strong>{module.title}</strong>
            </button>
          ))}
        </aside>

        <section className="content-panel">
          <div className="panel-heading">
            <div>
              <p className="section-label">Contenido conectado</p>
              <h2>{selectedModule?.title ?? 'Selecciona un módulo'}</h2>
            </div>
            <span className="level-pill">A1 · Principiante</span>
          </div>

          {error && <div className="error-box">{error}</div>}

          <div className="topic-grid">
            {topics.map((topic) => (
              <button className="topic-card" key={topic.id} onClick={() => openTopic(topic)}>
                <span>Tema {topic.sort_order}</span>
                <strong>{topic.title}</strong>
                <small>4 lecciones · 40 actividades</small>
              </button>
            ))}
          </div>

          {lessons.length > 0 && (
            <div className="lesson-panel">
              <div className="panel-heading compact">
                <div>
                  <p className="section-label">Tema seleccionado</p>
                  <h2>{lessons.length} lecciones disponibles</h2>
                </div>
                <span className="activity-count">{exercises.length} ejercicios</span>
              </div>
              <div className="lesson-list">
                {lessons.map((lesson) => (
                  <article className="lesson-card" key={lesson.id}>
                    <span>Lección {lesson.sort_order}</span>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.objective}</p>
                    <small>{lesson.exercises?.length ?? 0} actividades · {lesson.estimated_minutes} min</small>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}
