import React, { useMemo, useState } from 'react'

export function MatchingExercise({ exercise, onSubmit, disabled }) {
  const pairs = exercise.content?.pairs ?? []
  const categorizedItems = exercise.content?.items ?? []
  const categories = exercise.content?.categories ?? []
  const isPairing = pairs.length > 0
  const rows = isPairing
    ? pairs.map((pair) => ({ key: pair.term, label: pair.term }))
    : categorizedItems.map((item) => ({ key: item.text, label: item.text }))
  const choices = useMemo(() => (
    isPairing
      ? [...new Set(pairs.map((pair) => pair.meaning_es))].reverse()
      : categories
  ), [categories, isPairing, pairs])
  const [answers, setAnswers] = useState({})
  const complete = rows.length > 0 && rows.every((row) => answers[row.key])

  return (
    <div className="matching-exercise">
      {rows.map((row) => (
        <label key={row.key}>
          <strong>{row.label}</strong>
          <select
            value={answers[row.key] ?? ''}
            onChange={(event) => setAnswers((current) => ({ ...current, [row.key]: event.target.value }))}
          >
            <option value="">Selecciona...</option>
            {choices.map((choice) => <option value={choice} key={choice}>{choice}</option>)}
          </select>
        </label>
      ))}
      <button
        className="primary-button"
        disabled={disabled || !complete}
        type="button"
        onClick={() => onSubmit({
          kind: 'matching',
          value: rows.map((row) => `${row.key}=${answers[row.key]}`),
        })}
      >
        Comprobar relaciones
      </button>
    </div>
  )
}
