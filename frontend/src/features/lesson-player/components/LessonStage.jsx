import React, { useState } from 'react'

function speak(text) {
  if (!window.speechSynthesis || !text) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = 0.82
  window.speechSynthesis.speak(utterance)
}

function Dialogue({ turns = [], showTranslation = false }) {
  if (!turns.length) return null
  return (
    <div className="dialogue">
      {turns.map((turn, index) => (
        <div className="dialogue-turn" key={`${turn.speaker}-${index}`}>
          <span>{turn.speaker}</span>
          <button type="button" onClick={() => speak(turn.text ?? turn.english)}>
            <strong>{turn.text ?? turn.english}</strong>
            {showTranslation && turn.spanish && <small>{turn.spanish}</small>}
            <i aria-hidden="true">▶</i>
          </button>
        </div>
      ))}
    </div>
  )
}

function ExamplesStage({ content }) {
  const [revealed, setRevealed] = useState({})
  const examples = content.examples ?? []
  const phrases = content.phrases ?? []

  return (
    <div className="stage-content">
      <Dialogue turns={content.dialogue} showTranslation />
      {examples.length > 0 && (
        <div className="example-stack">
          {examples.map((example, index) => (
            <article key={`${example.english}-${index}`}>
              <button type="button" className="example-sound" onClick={() => speak(example.english)}>
                ▶ <strong>{example.english}</strong>
              </button>
              {example.meaning_es && (
                <>
                  <button
                    type="button"
                    className="meaning-toggle"
                    onClick={() => setRevealed((current) => ({ ...current, [index]: !current[index] }))}
                  >
                    {revealed[index] ? 'Ocultar significado' : 'Ver significado'}
                  </button>
                  {revealed[index] && <p>{example.meaning_es}</p>}
                </>
              )}
            </article>
          ))}
        </div>
      )}
      {phrases.length > 0 && (
        <div className="phrase-practice-list">
          {phrases.map((phrase) => (
            <button type="button" key={phrase} onClick={() => speak(phrase)}>
              <span>{phrase}</span><i>▶</i>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function PronunciationStage({ content }) {
  const targets = content.models ?? content.targets ?? []
  return (
    <div className="stage-content">
      {content.target && <p className="lead-copy">{content.target}</p>}
      <div className="sound-grid">
        {targets.map((target, index) => (
          <button type="button" key={`${target.text}-${index}`} onClick={() => speak(target.text)}>
            <strong>{target.text}</strong>
            {target.ipa && <span>{target.ipa}</span>}
            {target.error && <small>Evita: {target.error}</small>}
            <i>▶ Escuchar</i>
          </button>
        ))}
      </div>
      {content.notes?.length > 0 && (
        <ul className="teaching-notes">
          {content.notes.map((note) => <li key={note}>{note}</li>)}
        </ul>
      )}
    </div>
  )
}

function ReadingStage({ content }) {
  return (
    <div className="stage-content reading-stage">
      {content.title && <h3>{content.title}</h3>}
      {content.text && <p className="reading-text">{content.text}</p>}
      {content.interactive_vocabulary?.length > 0 && (
        <div className="word-chips">
          {content.interactive_vocabulary.map((word) => <span key={word}>{word}</span>)}
        </div>
      )}
    </div>
  )
}

function ReviewStage({ content }) {
  const mastery = content.mastery_criteria ?? content.mastery ?? {}
  const minimum = mastery.minimum_score ?? 0.8
  return (
    <div className="stage-content">
      <div className="mastery-card">
        <span>Meta de dominio</span>
        <strong>{Math.round(minimum * 100)}%</strong>
        <p>Equivocarte aquí no borra tu avance: el error se convierte en una oportunidad de repaso.</p>
      </div>
    </div>
  )
}

export function LessonStage({ item }) {
  if (item.kind === 'orientation') {
    const lesson = item.lesson
    return (
      <section className="stage-card orientation-stage">
        <p className="section-label">ANTES DE EMPEZAR</p>
        <h2>{lesson.title}</h2>
        <p className="lead-copy">{lesson.objective}</p>
        <div className="mission-grid">
          <div><span>Duración</span><strong>≈ {lesson.estimated_minutes} min</strong></div>
          <div><span>Recorrido</span><strong>Aprender → practicar → usar</strong></div>
          <div><span>Objetivo</span><strong>Comunicación comprensible</strong></div>
        </div>
      </section>
    )
  }

  const { section } = item
  const content = section.content ?? {}

  return (
    <section className={`stage-card section-stage section-${section.section_type}`}>
      <p className="section-label">{item.stage}</p>
      <h2>{section.title}</h2>

      {section.section_type === 'explanation' && (
        <div className="stage-content">
          <p className="lead-copy">{content.explanation_es || content.text}</p>
          {content.communication_goal && <div className="focus-note"><strong>Para qué sirve</strong><p>{content.communication_goal}</p></div>}
          {content.objective && <div className="focus-note"><strong>En esta lección</strong><p>{content.objective}</p></div>}
          {content.language_focus?.length > 0 && (
            <div className="phrase-practice-list">
              {content.language_focus.map((phrase) => (
                <button type="button" key={phrase} onClick={() => speak(phrase)}>
                  <span>{phrase}</span><i>▶</i>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {section.section_type === 'examples' && <ExamplesStage content={content} />}
      {section.section_type === 'pronunciation' && <PronunciationStage content={content} />}
      {section.section_type === 'listening' && (
        <div className="stage-content">
          <p className="support-copy">Escucha primero sin leer. Después abre el diálogo para comprobar lo que entendiste.</p>
          <button
            className="secondary-button"
            type="button"
            onClick={() => speak((content.dialogue ?? []).map((turn) => turn.text ?? turn.english).join(' '))}
          >
            ▶ Escuchar diálogo
          </button>
          <details className="transcript">
            <summary>Ver transcripción</summary>
            <Dialogue turns={content.dialogue} />
          </details>
        </div>
      )}
      {section.section_type === 'reading' && <ReadingStage content={content} />}
      {section.section_type === 'conversation' && (
        <div className="stage-content">
          <div className="mission-card">
            <span>Situación</span>
            <h3>{content.situation}</h3>
            <p>{content.communication_goal}</p>
          </div>
        </div>
      )}
      {section.section_type === 'review' && <ReviewStage content={content} />}
      {section.section_type === 'writing' && <div className="stage-content"><p>{content.prompt ?? content.text}</p></div>}
    </section>
  )
}
