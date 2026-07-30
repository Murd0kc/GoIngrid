import { supabase } from '../../lib/supabase'

function throwIfError(error) {
  if (error) throw error
}

export async function fetchA1Modules() {
  const { data, error } = await supabase
    .from('modules')
    .select('id, title, description, sort_order, levels!inner(code, name)')
    .eq('levels.code', 'A1')
    .order('sort_order')

  throwIfError(error)
  return data ?? []
}

export async function fetchTopics(moduleId) {
  const { data, error } = await supabase
    .from('topics')
    .select('id, title, description, sort_order, learning_overview')
    .eq('module_id', moduleId)
    .order('sort_order')

  throwIfError(error)
  return data ?? []
}

export async function fetchTopicLessons(topicId, userId) {
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, title, objective, estimated_minutes, estimated_seconds, sort_order')
    .eq('topic_id', topicId)
    .eq('is_published', true)
    .order('sort_order')

  throwIfError(error)

  const lessonIds = (lessons ?? []).map((lesson) => lesson.id)
  if (lessonIds.length === 0) return []

  const { data: progress, error: progressError } = await supabase
    .from('user_progress')
    .select('lesson_id, status, completion_percent, last_score, time_spent_seconds')
    .eq('user_id', userId)
    .in('lesson_id', lessonIds)

  throwIfError(progressError)
  const progressByLesson = new Map((progress ?? []).map((item) => [item.lesson_id, item]))

  return lessons.map((lesson) => ({
    ...lesson,
    progress: progressByLesson.get(lesson.id) ?? null,
  }))
}
