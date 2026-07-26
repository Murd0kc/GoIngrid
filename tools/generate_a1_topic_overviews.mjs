import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const inputDir = path.join(root, 'content', 'normalized', 'A1')
const topicDir = path.join(root, 'content', 'lessons', 'A1')
const canonicalTopicDir = path.join(root, 'content', 'canonical', 'topics')
const output = path.join(root, 'supabase', 'seeds', '103_import_a1_topic_overviews.sql')
const text = (value) => `'${String(value).replaceAll("'", "''")}'`
const json = (value) => `${text(JSON.stringify(value ?? null))}::jsonb`
const files = (await fs.readdir(inputDir)).filter((name) => name.endsWith('.json')).sort()
const groups = new Map()
for (const name of files) {
  const lesson = JSON.parse(await fs.readFile(path.join(inputDir, name), 'utf8'))
  const [, moduleCode, topicCode] = lesson.id.split('-')
  const key = `${moduleCode}-${topicCode}`
  if (!groups.has(key)) groups.set(key, { moduleCode, topicCode, lessons: [] })
  groups.get(key).lessons.push(lesson)
}
const out = ['-- GoIngrid A1 topic-level theory and learning overview.', 'begin;', 'do $$ declare v_level_id uuid; v_module_id uuid; v_topic_id uuid; begin', "select l.id into v_level_id from public.levels l where l.code='A1';"]
for (const group of groups.values()) {
  const first = group.lessons[0]
  let topicSource = {}
  for (const sourcePath of [path.join(canonicalTopicDir, `A1-${group.moduleCode}-${group.topicCode}.json`), path.join(topicDir, `A1-${group.moduleCode}-${group.topicCode}.json`)]) {
    try { topicSource = JSON.parse(await fs.readFile(sourcePath, 'utf8')); break } catch { /* try next source */ }
  }
  const moduleOrder = Number(group.moduleCode.slice(1))
  const topicOrder = Number(group.topicCode.slice(1))
  const vocabulary = topicSource.vocabulary ?? [...new Map(group.lessons.flatMap((lesson) => lesson.vocabulary ?? []).map((item) => [item.word, item])).values()].slice(0, 12)
  const focus = topicSource.key_language ?? [...new Set(group.lessons.flatMap((lesson) => lesson.language_focus?.grammar ?? []))].slice(0, 12)
  const targets = topicSource.pronunciation_targets ?? topicSource.letters ?? [...new Map(group.lessons.flatMap((lesson) => lesson.pronunciation?.targets ?? []).map((item) => [item.text, item])).values()].slice(0, 8)
  const topicTitle = topicSource.title ?? topicSource.topic ?? first.topic_title ?? first.topic ?? `Tema ${topicOrder}`
  const lessonOutcomes = [...new Set(group.lessons.map((lesson) => lesson.communication_goal).filter(Boolean))]
  const outcomes = topicSource.learning_outcomes ?? topicSource.cefr_objectives ?? lessonOutcomes
  const overview = { title: topicTitle, explanation_es: topicSource.explanation_es ?? `En este tema aprenderás sobre ${topicTitle.toLowerCase()}.`, learning_outcomes: [...outcomes, 'Comprender ejemplos y reconocer el lenguaje en contexto.', 'Usar lo aprendido en una situación comunicativa.'].slice(0, 8), key_language: focus, vocabulary, pronunciation_targets: targets, letters: topicSource.letters ?? [], spanish_speaker_notes: topicSource.spanish_speaker_notes ?? [], lesson_count: group.lessons.length, mastery_criteria: topicSource.mastery_criteria ?? null }
  out.push(`select m.id into v_module_id from public.modules m where m.level_id=v_level_id and m.sort_order=${moduleOrder};`)
  out.push(`select t.id into v_topic_id from public.topics t where t.module_id=v_module_id and t.sort_order=${topicOrder};`)
  out.push(`update public.topics set learning_overview=${json(overview)} where id=v_topic_id;`)
}
out.push('end $$;', 'commit;')
await fs.writeFile(output, `${out.join('\n')}\n`, 'utf8')
console.log(`Topic overviews generated: ${groups.size}`)
