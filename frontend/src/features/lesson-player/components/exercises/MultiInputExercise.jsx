import React, { useState } from 'react'

export function MultiInputExercise({ exercise, onSubmit, disabled }) {
  const prompts = exercise.content?.prompts ?? []
  const [answers, setAnswers] = useState(() => prompts.map(() => ''))
  const complete = answers.every((answer) => answer.trim())

  return (
    <div className="multi-input-exercise">
      {prompts.map((prompt, index) => (
        <label key={`${prompt}-${index}`}>
          <span>{prompt}</span>
          <input
            autoComplete="off"
            value={answers[index]}
            onChange={(event) => setAnswers((current) => current.map((answer, answerIndex) => (
              answerIndex === index ? event.target.value : answer
            )))}
          />
        </label>
      ))}
      <button
        className="primary-button"
        disabled={disabled || !complete}
        type="button"
        onClick={() => onSubmit({ kind: 'multi_text', value: answers.map((answer) => answer.trim()) })}
      >
        Comprobar respuestas
      </button>
    </div>
  )
}
