import { useEffect, useMemo, useRef, useState } from 'react'
import { buildLessonJourney, calculateLessonScore, getJourneyProgress } from './domain/journey'
import { saveLessonProgress, submitExerciseAttempt } from './lessonRepository'

function readSavedSession(storageKey) {
  const raw = localStorage.getItem(storageKey)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed === 'number') return { index: parsed, results: [], elapsedSeconds: 0 }
    if (parsed && typeof parsed === 'object') return parsed
  } catch {
    const legacyIndex = Number.parseInt(raw, 10)
    if (Number.isFinite(legacyIndex)) return { index: legacyIndex, results: [], elapsedSeconds: 0 }
  }

  localStorage.removeItem(storageKey)
  return null
}

export function useLessonSession({ lesson, userId, onCompleted }) {
  const journey = useMemo(() => buildLessonJourney(lesson), [lesson])
  const storageKey = `goingrid:lesson:${userId}:${lesson.id}`
  const savedSession = useMemo(() => readSavedSession(storageKey), [storageKey])
  const safeStoredIndex = Number.isFinite(savedSession?.index)
    && savedSession.index >= 0
    && savedSession.index < journey.length
    ? savedSession.index
    : 0
  const [index, setIndex] = useState(safeStoredIndex)
  const [feedback, setFeedback] = useState(null)
  const [results, setResults] = useState(Array.isArray(savedSession?.results) ? savedSession.results : [])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [completedSummary, setCompletedSummary] = useState(null)
  const baseElapsedSeconds = useRef(Math.max(0, savedSession?.elapsedSeconds ?? 0))
  const activeSessionStartedAt = useRef(Date.now())
  const stepStartedAt = useRef(Date.now())
  const current = journey[index]
  const progress = completedSummary ? 100 : getJourneyProgress(index, journey.length)
  const elapsedSeconds = () => (
    baseElapsedSeconds.current
    + Math.max(0, Math.round((Date.now() - activeSessionStartedAt.current) / 1000))
  )

  useEffect(() => {
    if (completedSummary) return
    saveLessonProgress({
      userId,
      lessonId: lesson.id,
      status: 'in_progress',
      completionPercent: progress,
      score: null,
      timeSpentSeconds: elapsedSeconds(),
    }).catch((progressError) => setError(progressError.message))
  }, [completedSummary, lesson.id, progress, userId])

  useEffect(() => {
    stepStartedAt.current = Date.now()
    setFeedback(null)
  }, [index])

  useEffect(() => {
    if (completedSummary) return
    localStorage.setItem(storageKey, JSON.stringify({
      index,
      results,
      elapsedSeconds: elapsedSeconds(),
    }))
  }, [completedSummary, index, results, storageKey])

  async function submit(answer) {
    if (current?.kind !== 'exercise' || submitting || feedback) return
    try {
      setSubmitting(true)
      setError('')
      const responseTimeMs = Date.now() - stepStartedAt.current
      const result = await submitExerciseAttempt(current.exercise.id, answer, responseTimeMs)
      const normalizedResult = {
        exerciseId: current.exercise.id,
        isCorrect: result.is_correct,
        evaluationStatus: result.evaluation_status,
      }

      setResults((previous) => {
        const existing = previous.find((item) => item.exerciseId === current.exercise.id)
        const nextResult = existing
          ? {
              ...normalizedResult,
              isCorrect: existing.isCorrect,
              evaluationStatus: existing.evaluationStatus,
              resolved: result.is_correct !== false,
            }
          : {
              ...normalizedResult,
              resolved: result.is_correct !== false,
            }
        return [
          ...previous.filter((item) => item.exerciseId !== current.exercise.id),
          nextResult,
        ]
      })

      setFeedback({
        isCorrect: result.is_correct,
        evaluationStatus: result.evaluation_status,
        text: result.feedback,
      })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSubmitting(false)
    }
  }

  function retry() {
    setFeedback(null)
    stepStartedAt.current = Date.now()
  }

  async function pause() {
    const timeSpentSeconds = elapsedSeconds()
    localStorage.setItem(storageKey, JSON.stringify({
      index,
      results,
      elapsedSeconds: timeSpentSeconds,
    }))
    await saveLessonProgress({
      userId,
      lessonId: lesson.id,
      status: 'in_progress',
      completionPercent: progress,
      score: null,
      timeSpentSeconds,
    })
  }

  async function finishLesson() {
    const duration = Math.max(1, elapsedSeconds())
    const score = calculateLessonScore(results)
    await saveLessonProgress({
      userId,
      lessonId: lesson.id,
      status: 'completed',
      completionPercent: 100,
      score,
      timeSpentSeconds: duration,
    })
    localStorage.removeItem(storageKey)
    setCompletedSummary({
      duration,
      score,
      completedExercises: results.length,
      totalExercises: lesson.exercises.length,
    })
    await onCompleted?.()
  }

  async function advance() {
    try {
      setError('')
      if (index + 1 >= journey.length) {
        await finishLesson()
        return
      }

      const nextIndex = index + 1
      setIndex(nextIndex)
    } catch (advanceError) {
      setError(advanceError.message)
    }
  }

  return {
    current,
    index,
    journey,
    progress,
    feedback,
    error,
    submitting,
    completedSummary,
    submit,
    retry,
    pause,
    advance,
  }
}
