import React from 'react'
import { supabase } from '../../lib/supabase'
import { LessonPlayer } from '../lesson-player/LessonPlayer'
import { TopicOverview } from './TopicOverview'
import { useCurriculum } from './useCurriculum'

function LessonStatus({ progress }) {
  if (progress?.status === 'completed') return <span className="status-badge complete">Completada</span>
  if (progress?.status === 'in_progress') return <span className="status-badge current">En progreso</span>
  return <span className="status-badge">Nueva</span>
}

export function CurriculumBrowser({ session }) {
  const curriculum = useCurriculum(session.user.id)

  if (curriculum.selectedLesson) {
    return (
      <LessonPlayer
        lessonSummary={curriculum.selectedLesson}
        userId={session.user.id}
        onClose={() => curriculum.setSelectedLesson(null)}
        onCompleted={async () => {
          await curriculum.refreshLessons()
        }}
      />
    )
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <a className="brand-lockup" href="#top" aria-label="GoIngrid inicio">
          <span>G</span>
          <strong>GoIngrid</strong>
        </a>
        <div className="header-actions">
          <span className="level-pill">A1 · Principiante</span>
          <button className="ghost-button" type="button" onClick={() => supabase.auth.signOut()}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="dashboard-banner" id="top">
        <div>
          <p className="eyebrow">TU SIGUIENTE PASO</p>
          <h1>Aprende algo que puedas usar hoy.</h1>
          <p>Explicación breve, práctica guiada y una misión de comunicación real.</p>
        </div>
        <div className="daily-goal">
          <span>Meta diaria</span>
          <strong>15 min</strong>
          <small>Una lección enfocada</small>
        </div>
      </section>

      <section className="workspace">
        <aside className="module-panel">
          <p className="section-label">RUTA A1</p>
          {curriculum.loading ? <p className="muted">Cargando módulos...</p> : curriculum.modules.map((module) => (
            <button
              className={curriculum.selectedModule?.id === module.id ? 'module-card active' : 'module-card'}
              key={module.id}
              type="button"
              onClick={() => curriculum.setSelectedModule(module)}
            >
              <span>Módulo {module.sort_order}</span>
              <strong>{module.title}</strong>
              <small>{module.description}</small>
            </button>
          ))}
        </aside>

        <section className="content-panel">
          <div className="panel-heading">
            <div>
              <p className="section-label">CONTENIDO CONECTADO</p>
              <h2>{curriculum.selectedModule?.title ?? 'Selecciona un módulo'}</h2>
            </div>
          </div>

          {curriculum.error && <div className="error-box" role="alert">{curriculum.error}</div>}

          {!curriculum.selectedTopic && (
            <>
              <p className="panel-intro">Elige un tema para conocer el objetivo, estudiar la base y comenzar sus lecciones.</p>
              <div className="topic-grid">
                {curriculum.topicLoading ? <p className="muted">Cargando temas...</p> : curriculum.topics.map((topic) => (
                  <button className="topic-card" key={topic.id} type="button" onClick={() => curriculum.openTopic(topic)}>
                    <span>Tema {String(topic.sort_order).padStart(2, '0')}</span>
                    <strong>{topic.title}</strong>
                    <small>{topic.description}</small>
                    <i>Explorar tema →</i>
                  </button>
                ))}
              </div>
            </>
          )}

          {curriculum.selectedTopic && (
            <>
              <button className="back-button" type="button" onClick={() => curriculum.openTopic(null)}>
                ← Volver a temas
              </button>
              {curriculum.topicLoading ? (
                <div className="loading-card">Preparando el tema...</div>
              ) : (
                <>
                  <TopicOverview topic={curriculum.selectedTopic} lessons={curriculum.lessons} />
                  <section className="lesson-panel">
                    <div className="panel-heading compact">
                      <div>
                        <p className="section-label">RUTA DEL TEMA</p>
                        <h2>Lecciones</h2>
                      </div>
                      <span className="activity-count">{curriculum.lessons.length} pasos principales</span>
                    </div>
                    <div className="lesson-list">
                      {curriculum.lessons.map((lesson, index) => (
                        <article className="lesson-card" key={lesson.id}>
                          <div className="lesson-card-top">
                            <span>Lección {lesson.sort_order}</span>
                            <LessonStatus progress={lesson.progress} />
                          </div>
                          <h3>{lesson.title}</h3>
                          <p>{lesson.objective}</p>
                          <div className="lesson-meta">
                            <small>≈ {lesson.estimated_minutes} min</small>
                            <small>{index === 0 ? 'Fundamento' : 'Construye sobre lo anterior'}</small>
                          </div>
                          <button
                            className="primary-button lesson-button"
                            type="button"
                            onClick={() => curriculum.setSelectedLesson(lesson)}
                          >
                            {lesson.progress?.status === 'in_progress' ? 'Continuar' : lesson.progress?.status === 'completed' ? 'Repasar' : 'Comenzar'}
                          </button>
                        </article>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </>
          )}
        </section>
      </section>
    </main>
  )
}
