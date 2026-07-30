import React, { useMemo, useState } from 'react'

export function ReadingExercise({ exercise, onSubmit, disabled }) {
  const reading = exercise.content?.reading ?? {}
  const questions = reading.questions ?? []
  const vocabulary = exercise.content?.vocabulary ?? []
  const [answers, setAnswers] = useState(() => questions.map(() => ''))
  const [selectedWord, setSelectedWord] = useState(null)
  const glossary = useMemo(() => new Map(vocabulary.map((item) => [
    (item.term ?? item.word ?? '').toLowerCase(),
    item,
  ])), [vocabulary])
  const complete = questions.length > 0 && answers.every((answer) => answer.trim())

  function wordDetails(word) {
    const normalized = word.toLowerCase()
    return glossary.get(normalized)
      ?? vocabulary.find((item) => normalized.includes((item.term ?? item.word ?? '').toLowerCase()))
      ?? null
  }

  return (
    <div className="reading-exercise">
      <article className="reading-passage">
        <span>{reading.title ?? exercise.prompt}</span>
        <p>{reading.text}</p>
      </article>
      {reading.interactive_vocabulary?.length > 0 && (
        <div className="interactive-words">
          <span>Explora palabras del texto:</span>
          <div>
            {reading.interactive_vocabulary.map((word) => (
              <button type="button" key={word} onClick={() => setSelectedWord(word)}>{word}</button>
            ))}
          </div>
          {selectedWord && (
            <div className="word-definition">
              <strong>{selectedWord}</strong>
              <p>{wordDetails(selectedWord)?.meaning_es ?? 'Palabra clave: intenta inferirla por la frase antes de buscar ayuda.'}</p>
            </div>
          )}
        </div>
      )}
      <div className="reading-questions">
        {questions.map((question, index) => (
          <div className="reading-question" key={question.prompt}>
            <span>{question.prompt}</span>
            {question.options?.length > 0 ? (
              <div className="compact-options">
                {question.options.map((option) => (
                  <button
                    className={answers[index] === option ? 'selected' : ''}
                    type="button"
                    key={option}
                    onClick={() => setAnswers((current) => current.map((answer, answerIndex) => (
                      answerIndex === index ? option : answer
                    )))}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <input
                autoComplete="off"
                value={answers[index]}
                onChange={(event) => setAnswers((current) => current.map((answer, answerIndex) => (
                  answerIndex === index ? event.target.value : answer
                )))}
              />
            )}
          </div>
        ))}
      </div>
      <button
        className="primary-button"
        disabled={disabled || !complete}
        type="button"
        onClick={() => onSubmit({ kind: 'reading_answers', value: answers.map((answer) => answer.trim()) })}
      >
        Comprobar comprensión
      </button>
    </div>
  )
}
