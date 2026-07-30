import test from 'node:test'
import assert from 'node:assert/strict'
import { buildLessonJourney, calculateLessonScore, getJourneyProgress } from './journey.js'

test('buildLessonJourney keeps every section and exercise exactly once', () => {
  const lesson = {
    id: 'lesson-1',
    sections: [
      { id: 'examples', section_type: 'examples', sort_order: 2 },
      { id: 'explanation', section_type: 'explanation', sort_order: 1 },
      { id: 'review', section_type: 'review', sort_order: 3 },
    ],
    exercises: [
      { id: 'grammar', skill: 'grammar', exercise_type: 'choice', sort_order: 2 },
      { id: 'warmup', skill: 'vocabulary', exercise_type: 'context_prediction', sort_order: 1 },
      { id: 'review-exercise', skill: 'review', exercise_type: 'spaced_retrieval', sort_order: 3 },
    ],
  }

  const journey = buildLessonJourney(lesson)
  assert.equal(journey[0].kind, 'orientation')
  assert.deepEqual(
    journey.filter((item) => item.kind === 'section').map((item) => item.section.id).sort(),
    ['examples', 'explanation', 'review'],
  )
  assert.deepEqual(
    journey.filter((item) => item.kind === 'exercise').map((item) => item.exercise.id).sort(),
    ['grammar', 'review-exercise', 'warmup'],
  )
  assert.ok(journey.findIndex((item) => item.exercise?.id === 'warmup') < journey.findIndex((item) => item.section?.id === 'explanation'))
})

test('calculateLessonScore ignores pending work', () => {
  const score = calculateLessonScore([
    { evaluationStatus: 'graded', isCorrect: true },
    { evaluationStatus: 'graded', isCorrect: false },
    { evaluationStatus: 'pending', isCorrect: null },
  ])
  assert.equal(score, 50)
  assert.equal(calculateLessonScore([{ evaluationStatus: 'pending', isCorrect: null }]), null)
})

test('getJourneyProgress clamps values', () => {
  assert.equal(getJourneyProgress(3, 10), 30)
  assert.equal(getJourneyProgress(12, 10), 100)
  assert.equal(getJourneyProgress(1, 0), 0)
})
