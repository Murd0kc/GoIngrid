const sectionStage = {
  explanation: 'Aprende',
  examples: 'Observa',
  listening: 'Escucha',
  pronunciation: 'Pronuncia',
  reading: 'Lee',
  conversation: 'Comunica',
  review: 'Consolida',
  writing: 'Escribe',
}

const skillStage = {
  vocabulary: 'Vocabulario',
  grammar: 'Construye',
  listening: 'Escucha',
  pronunciation: 'Pronuncia',
  reading: 'Lee',
  interaction: 'Interactúa',
  conversation: 'Comunica',
  integrated: 'Transfiere',
  review: 'Recupera',
}

function sorted(items = []) {
  return [...items].sort((a, b) => a.sort_order - b.sort_order)
}

export function buildLessonJourney(lesson) {
  const sections = sorted(lesson.sections)
  const exercises = sorted(lesson.exercises)
  const journey = [{
    id: `orientation-${lesson.id}`,
    kind: 'orientation',
    stage: 'Prepárate',
    title: 'Tu misión',
    lesson,
  }]
  const usedSections = new Set()
  const usedExercises = new Set()

  function addSection(type) {
    const section = sections.find((item) => item.section_type === type && !usedSections.has(item.id))
    if (!section) return
    usedSections.add(section.id)
    journey.push({
      id: `section-${section.id}`,
      kind: 'section',
      stage: sectionStage[type] ?? 'Aprende',
      title: section.title,
      section,
    })
  }

  function addExercises(predicate) {
    exercises.filter((exercise) => !usedExercises.has(exercise.id) && predicate(exercise)).forEach((exercise) => {
      usedExercises.add(exercise.id)
      journey.push({
        id: `exercise-${exercise.id}`,
        kind: 'exercise',
        stage: skillStage[exercise.skill] ?? 'Practica',
        title: exercise.instruction || exercise.prompt,
        exercise,
      })
    })
  }

  addExercises((exercise) => exercise.exercise_type.includes('prediction'))
  addSection('explanation')
  addSection('examples')
  addExercises((exercise) => ['vocabulary', 'grammar'].includes(exercise.skill))
  addSection('listening')
  addExercises((exercise) => exercise.skill === 'listening')
  addExercises((exercise) => exercise.skill === 'interaction')
  addSection('pronunciation')
  addExercises((exercise) => exercise.skill === 'pronunciation')
  addSection('reading')
  addExercises((exercise) => exercise.skill === 'reading')
  addSection('writing')
  addExercises((exercise) => exercise.skill === 'writing')
  addSection('conversation')
  addExercises((exercise) => ['conversation', 'integrated'].includes(exercise.skill))
  addSection('review')
  addExercises((exercise) => exercise.skill === 'review')

  sections.filter((section) => !usedSections.has(section.id)).forEach((section) => {
    journey.push({
      id: `section-${section.id}`,
      kind: 'section',
      stage: sectionStage[section.section_type] ?? 'Aprende',
      title: section.title,
      section,
    })
  })

  addExercises(() => true)
  return journey
}

export function calculateLessonScore(results) {
  const graded = results.filter((result) => result.evaluationStatus === 'graded')
  if (graded.length === 0) return null
  const correct = graded.filter((result) => result.isCorrect).length
  return Math.round((correct / graded.length) * 100)
}

export function getJourneyProgress(index, total) {
  if (!total) return 0
  return Math.max(0, Math.min(100, Math.round((index / total) * 100)))
}
