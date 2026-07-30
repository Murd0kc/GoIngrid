import { supabase } from '../../lib/supabase'

function throwIfError(error) {
  if (error) throw error
}

export async function fetchLessonPlayerContent(lessonId) {
  const { data, error } = await supabase.rpc('get_lesson_player_content', {
    p_lesson_id: lessonId,
  })

  throwIfError(error)
  if (!data) throw new Error('La lección no está disponible o no tienes acceso.')
  return data
}

export async function submitExerciseAttempt(exerciseId, answer, responseTimeMs) {
  const { data, error } = await supabase.rpc('submit_exercise_attempt', {
    p_exercise_id: exerciseId,
    p_answer: answer,
    p_response_time_ms: responseTimeMs,
  })

  throwIfError(error)
  const result = data?.[0]
  if (!result) throw new Error('No se pudo evaluar el intento.')
  return result
}

export async function saveLessonProgress({
  userId,
  lessonId,
  status,
  completionPercent,
  score,
  timeSpentSeconds,
}) {
  const { error } = await supabase.from('user_progress').upsert({
    user_id: userId,
    lesson_id: lessonId,
    status,
    completion_percent: completionPercent,
    last_score: score,
    time_spent_seconds: timeSpentSeconds,
    last_activity_at: new Date().toISOString(),
  }, { onConflict: 'user_id,lesson_id' })

  throwIfError(error)
}
