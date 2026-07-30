import React, { useState } from 'react'

export function OrderingExercise({ exercise, onSubmit, disabled }) {
  const tokens = exercise.content?.tokens ?? []
  const [available, setAvailable] = useState(tokens.map((token, index) => ({ token, index })))
  const [ordered, setOrdered] = useState([])

  function choose(item) {
    setAvailable((current) => current.filter((candidate) => candidate.index !== item.index))
    setOrdered((current) => [...current, item])
  }

  function remove(item) {
    setOrdered((current) => current.filter((candidate) => candidate.index !== item.index))
    setAvailable((current) => [...current, item].sort((a, b) => a.index - b.index))
  }

  return (
    <div className="ordering-exercise">
      <div className="answer-zone" aria-label="Tu frase">
        {ordered.length === 0 && <span>Construye la frase aquí</span>}
        {ordered.map((item) => (
          <button type="button" key={item.index} onClick={() => remove(item)}>{item.token}</button>
        ))}
      </div>
      <div className="token-bank" aria-label="Palabras disponibles">
        {available.map((item) => (
          <button type="button" key={item.index} onClick={() => choose(item)}>{item.token}</button>
        ))}
      </div>
      <button
        className="primary-button"
        disabled={disabled || ordered.length !== tokens.length}
        type="button"
        onClick={() => onSubmit({ kind: 'text', value: ordered.map((item) => item.token).join(' ') })}
      >
        Comprobar orden
      </button>
    </div>
  )
}
