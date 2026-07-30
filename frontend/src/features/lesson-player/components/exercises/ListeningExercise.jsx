import React, { useState } from 'react'
import { ChoiceExercise } from './ChoiceExercise'
import { OpenResponseExercise } from './OpenResponseExercise'

function speakDialogue(dialogue, rate) {
  if (!window.speechSynthesis) return
  const text = (dialogue ?? []).map((turn) => turn.text ?? turn.english).join(' ')
  if (!text) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = rate
  window.speechSynthesis.speak(utterance)
}

export function ListeningExercise(props) {
  const { exercise } = props
  const [plays, setPlays] = useState(0)
  const dialogue = exercise.content?.listening?.dialogue ?? []

  return (
    <div className="listening-exercise">
      <div className="audio-actions">
        <button type="button" className="listen-button" onClick={() => { speakDialogue(dialogue, 0.82); setPlays((value) => value + 1) }}>
          ▶ Escuchar
        </button>
        <button type="button" className="secondary-button" onClick={() => { speakDialogue(dialogue, 0.64); setPlays((value) => value + 1) }}>
          Escuchar más lento
        </button>
        <span>{plays === 0 ? 'Escucha antes de responder' : `${plays} reproducción${plays === 1 ? '' : 'es'}`}</span>
      </div>
      {exercise.options?.length > 0
        ? <ChoiceExercise {...props} />
        : <OpenResponseExercise {...props} />}
    </div>
  )
}
