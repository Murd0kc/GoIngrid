import React, { useMemo, useState } from 'react'

const letterGroups = [
  { label: 'A–G', start: 0, end: 7 },
  { label: 'H–N', start: 7, end: 14 },
  { label: 'O–T', start: 14, end: 20 },
  { label: 'U–Z', start: 20, end: 26 },
]

function speak(text) {
  if (!window.speechSynthesis || !text) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = 0.78
  window.speechSynthesis.speak(utterance)
}

function AlphabetPractice({ letters }) {
  const [groupIndex, setGroupIndex] = useState(0)
  const [expandedLetter, setExpandedLetter] = useState(null)
  const currentGroup = letterGroups[groupIndex]
  const visibleLetters = letters.slice(currentGroup.start, currentGroup.end)

  return (
    <section className="learning-block alphabet-practice">
      <div className="block-heading">
        <div>
          <p className="section-label">REFERENCIA INTERACTIVA</p>
          <h3>Las 26 letras y sus nombres</h3>
        </div>
        <span className="counter-pill">26 letras</span>
      </div>
      <p className="support-copy">
        Pulsa una letra para escuchar su nombre. Abre “detalle” para ver el error
        más común de quienes hablan español.
      </p>
      <div className="segment-control" role="tablist" aria-label="Grupos del alfabeto">
        {letterGroups.map((group, index) => (
          <button
            className={groupIndex === index ? 'active' : ''}
            key={group.label}
            onClick={() => setGroupIndex(index)}
            role="tab"
            type="button"
          >
            {group.label}
          </button>
        ))}
      </div>
      <div className="alphabet-grid">
        {visibleLetters.map((item) => (
          <article className="alphabet-card" key={item.letter}>
            <button
              className="letter-sound"
              onClick={() => speak(item.letter)}
              type="button"
              aria-label={`Escuchar la letra ${item.letter}`}
            >
              <b>{item.letter}</b>
              <span>{item.name}</span>
              <small>{item.ipa}</small>
              <i aria-hidden="true">▶</i>
            </button>
            <button
              className="detail-toggle"
              type="button"
              onClick={() => setExpandedLetter(expandedLetter === item.letter ? null : item.letter)}
              aria-expanded={expandedLetter === item.letter}
            >
              {expandedLetter === item.letter ? 'Ocultar' : 'Detalle'}
            </button>
            {expandedLetter === item.letter && (
              <div className="letter-detail">
                <p><strong>Ejemplo:</strong> {item.example}</p>
                <p><strong>Evita:</strong> {item.common_error}</p>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

export function TopicOverview({ topic, lessons }) {
  const overview = topic.learning_overview ?? {}
  const letters = overview.letters ?? overview.pronunciation_targets?.filter((item) => item.letter) ?? []
  const completedLessons = lessons.filter((lesson) => lesson.progress?.status === 'completed').length
  const progress = lessons.length ? Math.round((completedLessons / lessons.length) * 100) : 0
  const outcomes = useMemo(() => overview.learning_outcomes ?? [], [overview.learning_outcomes])

  return (
    <section className="topic-overview">
      <div className="topic-hero">
        <div>
          <p className="section-label">TEMA {String(topic.sort_order).padStart(2, '0')}</p>
          <h2>{topic.title}</h2>
          <p>{overview.explanation_es || topic.description}</p>
        </div>
        <div className="topic-progress" aria-label={`${progress}% completado`}>
          <strong>{progress}%</strong>
          <span>del tema</span>
        </div>
      </div>

      <div className="topic-metrics">
        <div><strong>{lessons.length}</strong><span>lecciones</span></div>
        <div><strong>{lessons.reduce((total, lesson) => total + (lesson.estimated_minutes ?? 0), 0)}</strong><span>minutos</span></div>
        <div><strong>{completedLessons}</strong><span>completadas</span></div>
      </div>

      {outcomes.length > 0 && (
        <section className="learning-block">
          <p className="section-label">AL FINAL PODRÁS</p>
          <div className="outcome-grid">
            {outcomes.map((outcome, index) => (
              <div className="outcome-item" key={outcome}>
                <span>{index + 1}</span>
                <p>{outcome}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {letters.length === 26 && <AlphabetPractice letters={letters} />}

      {overview.key_language?.length > 0 && (
        <section className="learning-block">
          <div className="block-heading">
            <div>
              <p className="section-label">INGLÉS QUE VAS A USAR</p>
              <h3>Frases clave en contexto</h3>
            </div>
          </div>
          <div className="phrase-grid">
            {overview.key_language.map((phrase) => (
              <button type="button" key={phrase} onClick={() => speak(phrase)}>
                <span>{phrase}</span>
                <i aria-hidden="true">▶ Escuchar</i>
              </button>
            ))}
          </div>
        </section>
      )}

      {overview.spanish_speaker_notes?.length > 0 && (
        <details className="speaker-notes">
          <summary>Errores frecuentes de hispanohablantes</summary>
          <ul>
            {overview.spanish_speaker_notes.map((note) => <li key={note}>{note}</li>)}
          </ul>
        </details>
      )}
    </section>
  )
}
