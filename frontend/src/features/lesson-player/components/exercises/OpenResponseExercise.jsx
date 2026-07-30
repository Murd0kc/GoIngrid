import React, { useState } from 'react'

export function OpenResponseExercise({ exercise, onSubmit, disabled }) {
  const [response, setResponse] = useState('')
  const criteria = exercise.content?.success_criteria ?? exercise.content?.evaluation_criteria ?? []
  const isRoleplay = exercise.exercise_type === 'ai_roleplay'

  return (
    <div className="open-response">
      {isRoleplay && (
        <div className="roleplay-brief">
          <span>Simulación guiada</span>
          <strong>Tu interlocutor: {exercise.content?.role ?? 'una persona en la situación'}</strong>
          <p>Por ahora esta actividad registra tu respuesta escrita. La conversación adaptativa con IA se conectará en la fase de voz e IA.</p>
        </div>
      )}
      {criteria.length > 0 && (
        <ul className="criteria-list">
          {criteria.map((criterion) => <li key={criterion}>{criterion}</li>)}
        </ul>
      )}
      <label>
        <span>Tu respuesta en inglés</span>
        <textarea
          rows="5"
          value={response}
          onChange={(event) => setResponse(event.target.value)}
          placeholder="Escribe una respuesta completa..."
        />
      </label>
      <button
        className="primary-button"
        disabled={disabled || !response.trim()}
        type="button"
        onClick={() => onSubmit({ kind: 'open_text', value: response.trim() })}
      >
        Registrar respuesta
      </button>
    </div>
  )
}
