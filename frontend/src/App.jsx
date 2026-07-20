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
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [answer, setAnswer] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [lessonStartedAt, setLessonStartedAt] = useState(null)
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
      setSelectedLesson(null)
      setFeedback(null)
    }
  }

  function openLesson(lesson) {
    setSelectedLesson(lesson)
    setExerciseIndex(0)
    setAnswer(null)
    setFeedback(null)
    setLessonStartedAt(Date.now())
  }

  async function submitAnswer(option) {
    const exercise = selectedLesson?.exercises?.[exerciseIndex]
    if (!exercise || feedback) return
    const isCorrect = option.is_correct === true
    setAnswer(option.id)
    setFeedback({ isCorrect, text: isCorrect ? '¡Correcto! Muy bien.' : (exercise.explanation || 'Revisa la explicación y vuelve a intentarlo.') })
    const { error: attemptError } = await supabase.from('exercise_attempts').insert({
      user_id: session.user.id,
      exercise_id: exercise.id,
      answer: option.option_text,
      is_correct: isCorrect,
      response_time_ms: lessonStartedAt ? Date.now() - lessonStartedAt : null,
    })
    if (attemptError) setError(attemptError.message)
  }

  async function nextExercise() {
    const total = selectedLesson?.exercises?.length ?? 0
    if (exerciseIndex + 1 < total) {
      setExerciseIndex((current) => current + 1)
      setAnswer(null)
      setFeedback(null)
      return
    }
    const completedAt = Date.now()
    const duration = lessonStartedAt ? Math.round((completedAt - lessonStartedAt) / 1000) : 0
    const completed = await supabase.from('user_progress').upsert({
      user_id: session.user.id,
      lesson_id: selectedLesson.id,
      status: 'completed',
      completion_percent: 100,
      last_score: null,
      time_spent_seconds: duration,
      last_activity_at: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id' })
    if (completed.error) setError(completed.error.message)
    else setFeedback({ isCorrect: true, text: 'Lección completada. Tu progreso ya está guardado.' })
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

          {selectedLesson && (
            <section className="lesson-player">
              <div className="panel-heading compact">
                <div>
                  <p className="section-label">Lección activa</p>
                  <h2>{selectedLesson.title}</h2>
                </div>
                <button className="link-button" onClick={() => setSelectedLesson(null)}>Volver a lecciones</button>
              </div>
              <p className="lesson-objective">{selectedLesson.objective}</p>
              {selectedLesson.exercises?.[exerciseIndex] && !feedback && (
                <div className="exercise-card">
                  <small>Actividad {exerciseIndex + 1} de {selectedLesson.exercises.length}</small>
                  <h3>{selectedLesson.exercises[exerciseIndex].prompt}</h3>
                  <p>{selectedLesson.exercises[exerciseIndex].instruction}</p>
                  <div className="option-list">
                    {(selectedLesson.exercises[exerciseIndex].exercise_options ?? []).map((option) => (
                      <button className="option-button" key={option.id} onClick={() => submitAnswer(option)}>
                        {option.option_text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {feedback && (
                <div className={feedback.isCorrect ? 'feedback success' : 'feedback error'}>
                  <strong>{feedback.text}</strong>
                  {!feedback.isCorrect && (
                    <button className="primary-button" onClick={() => { setAnswer(null); setFeedback(null) }}>Intentar de nuevo</button>
                  )}
                  {exerciseIndex + 1 < (selectedLesson.exercises?.length ?? 0) && feedback.isCorrect && (
                    <button className="primary-button" onClick={nextExercise}>Siguiente actividad</button>
                  )}
                  {exerciseIndex + 1 === (selectedLesson.exercises?.length ?? 0) && (
                    <button className="primary-button" onClick={() => { setSelectedLesson(null); setFeedback(null) }}>Volver al tema</button>
                  )}
                </div>
              )}
            </section>
          )}

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
                    <button className="primary-button lesson-button" onClick={() => openLesson(lesson)}>Comenzar lección</button>
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
