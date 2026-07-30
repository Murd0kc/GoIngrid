import React from 'react'
import { ChoiceExercise } from './exercises/ChoiceExercise'
import { ListeningExercise } from './exercises/ListeningExercise'
import { MatchingExercise } from './exercises/MatchingExercise'
import { MultiInputExercise } from './exercises/MultiInputExercise'
import { OpenResponseExercise } from './exercises/OpenResponseExercise'
import { OrderingExercise } from './exercises/OrderingExercise'
import { PronunciationExercise } from './exercises/PronunciationExercise'
import { ReadingExercise } from './exercises/ReadingExercise'

const matchingTypes = /(match|sort|map|reconstruct)/
const orderingTypes = /(ordering|sentence_builder)/

export function ExerciseRenderer({ exercise, onSubmit, disabled }) {
  const props = { exercise, onSubmit, disabled }

  if (exercise.skill === 'listening') return <ListeningExercise {...props} />
  if (exercise.skill === 'pronunciation' || exercise.exercise_type === 'pronunciation_recording') return <PronunciationExercise {...props} />
  if (exercise.exercise_type === 'interactive_reading' && exercise.content?.reading?.questions?.length) return <ReadingExercise {...props} />
  if (orderingTypes.test(exercise.exercise_type) && exercise.content?.tokens?.length) return <OrderingExercise {...props} />
  if (matchingTypes.test(exercise.exercise_type) && (exercise.content?.pairs?.length || exercise.content?.items?.length)) return <MatchingExercise {...props} />
  if (exercise.content?.prompts?.length) return <MultiInputExercise {...props} />
  if (exercise.options?.length > 0) return <ChoiceExercise {...props} />
  return <OpenResponseExercise {...props} />
}
