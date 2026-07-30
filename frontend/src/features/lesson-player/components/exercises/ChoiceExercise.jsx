import React from 'react'

export function ChoiceExercise({ exercise, onSubmit, disabled }) {
  return (
    <div className="option-list">
      {(exercise.options ?? []).map((option, index) => (
        <button
          className="option-button"
          disabled={disabled}
          key={option.id}
          type="button"
          onClick={() => onSubmit({
            kind: 'option',
            option_id: option.id,
            value: option.option_text,
          })}
        >
          <span>{String.fromCharCode(65 + index)}</span>
          <strong>{option.option_text}</strong>
        </button>
      ))}
    </div>
  )
}
