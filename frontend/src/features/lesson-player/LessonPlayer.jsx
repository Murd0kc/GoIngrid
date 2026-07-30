import React, { useEffect, useState } from 'react'
import { ExerciseRenderer } from './components/ExerciseRenderer'
import { LessonStage } from './components/LessonStage'
import { fetchLessonPlayerContent } from './lessonRepository'
import { useLessonSession } from './useLessonSession'

function LessonExperience({ lesson, userId, onClose, onCompleted }) {
  const session = useLessonSession({ lesson, userId, onCompleted })
  const { current } = session

  async function handleExit() {
    try {
      await session.pause()
    } finally {
      onClose()
    }
  }

  if (session.completedSummary) {
    const summary = session.completedSummary
    return (
      <main className="lesson-shell completion-shell">
        <section className="completion-card">
          <div className="completion-icon">✓</div>
          <p className="section-label">LECCIÓN COMPLETADA</p>
          <h1>Eso ya forma parte de tu inglés.</h1>
          <p>Terminaste {lesson.title}. El siguiente repaso servirá para recuperar lo aprendido, no solo reconocerlo.</p>
          <div className="completion-stats">
            <div><strong>{Math.ceil(summary.duration / 60)}</strong><span>minutos</span></div>
            <div><strong>{summary.completedExercises}/{summary.totalExercises}</strong><span>actividades</span></div>
            <div><strong>{summary.score === null ? 'En revisión' : `${summary.score}%`}</strong><span>resultado</span></div>
          </div>
          <button className="primary-button" type="button" onClick={onClose}>Volver al tema</button>
        </section>
      </main>
    )
  }

  const isExercise = current?.kind === 'exercise'
  const canAdvance = !isExercise || (session.feedback && session.feedback.isCorrect !== false)
  const isLast = session.index + 1 === session.journey.length

  return (
    <main className="lesson-shell">
      <header className="lesson-header">
        <button className="back-button" type="button" onClick={handleExit}>← Guardar y salir</button>
        <div className="lesson-title">
          <span>{lesson.title}</span>
          <small>{current?.stage}</small>
        </div>
        <span className="step-counter">{session.index + 1}/{session.journey.length}</span>
      </header>

      <div className="progress-track" aria-label={`${session.progress}% de la lección`}>
        <span style={{ width: `${session.progress}%` }} />
      </div>

      <section className="lesson-stage-shell">
        {current?.kind === 'exercise' ? (
          <section className="stage-card exercise-stage">
            <div className="exercise-heading">
              <div>
                <p className="section-label">{current.stage}</p>
                <h2>{current.exercise.instruction}</h2>
              </div>
              <span className="time-pill">≈ {Math.max(1, Math.ceil(current.exercise.estimated_seconds / 60))} min</span>
            </div>
            {current.exercise.prompt && current.exercise.prompt !== current.exercise.instruction && (
              <p className="exercise-prompt">{current.exercise.prompt}</p>
            )}
            {!session.feedback && (
              <ExerciseRenderer
                key={current.exercise.id}
                exercise={current.exercise}
                onSubmit={session.submit}
                disabled={session.submitting}
              />
            )}
            {session.submitting && <p className="muted">Comprobando tu respuesta...</p>}
          </section>
        ) : (
          <LessonStage item={current} />
        )}

        {session.error && <div className="error-box" role="alert">{session.error}</div>}

        {session.feedback && (
          <section className={`feedback-card ${session.feedback.isCorrect === false ? 'incorrect' : session.feedback.evaluationStatus === 'pending' ? 'pending' : 'correct'}`}>
            <div>
              <span>{session.feedback.isCorrect === false ? 'Ajustemos una cosa' : session.feedback.evaluationStatus === 'pending' ? 'Práctica registrada' : 'Bien resuelto'}</span>
              <p>{session.feedback.text}</p>
            </div>
            {session.feedback.isCorrect === false && (
              <button className="secondary-button" type="button" onClick={session.retry}>Intentar otra vez</button>
            )}
          </section>
        )}

        <footer className="lesson-navigation">
          <span>{current?.kind === 'exercise' ? 'Responde para continuar' : 'Avanza cuando la idea esté clara'}</span>
          {canAdvance && (
            <button className="primary-button" type="button" onClick={session.advance}>
              {isLast ? 'Finalizar lección' : 'Continuar →'}
            </button>
          )}
        </footer>
      </section>
    </main>
  )
}

export function LessonPlayer({ lessonSummary, userId, onClose, onCompleted }) {
  const [lesson, setLesson] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    fetchLessonPlayerContent(lessonSummary.id)
      .then((data) => {
        if (active) setLesson(data)
      })
      .catch((loadError) => {
        if (active) setError(loadError.message)
      })
    return () => { active = false }
  }, [lessonSummary.id])

  if (error) {
    return (
      <main className="centered-state">
        <div className="error-box">{error}</div>
        <button className="secondary-button" type="button" onClick={onClose}>Volver al tema</button>
      </main>
    )
  }

  if (!lesson) return <main className="centered-state"><p>Preparando la lección...</p></main>

  return (
    <LessonExperience
      lesson={lesson}
      userId={userId}
      onClose={onClose}
      onCompleted={onCompleted}
    />
  )
}
