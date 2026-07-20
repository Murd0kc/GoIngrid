import React, { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export function App() {
  const [modules, setModules] = useState([])
  const [selectedModule, setSelectedModule] = useState(null)
  const [topics, setTopics] = useState([])
  const [lessons, setLessons] = useState([])
  const [exercises, setExercises] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
  }, [])

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

  return (
    <main className="app-shell">
      <header className="hero">
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
