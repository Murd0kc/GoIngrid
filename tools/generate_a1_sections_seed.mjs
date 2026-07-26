import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const inputDir = path.join(root, 'content', 'normalized', 'A1')
const output = path.join(root, 'supabase', 'seeds', '102_import_a1_lesson_sections.sql')
const text = (value) => `'${String(value).replaceAll("'", "''")}'`
const sql = (value) => `'${JSON.stringify(value ?? null).replaceAll("'", "''")}'::jsonb`
const files = (await fs.readdir(inputDir)).filter((name) => name.endsWith('.json')).sort()
const out = [
  '-- GoIngrid A1 lesson theory and learning sections.',
  '-- Regenerated from content/normalized/A1; safe to rerun.',
  'begin;',
  'do $$ declare v_level_id uuid; v_module_id uuid; v_topic_id uuid; v_lesson_id uuid; begin',
  "select l.id into v_level_id from public.levels l where l.code='A1';",
]

for (const name of files) {
  const lesson = JSON.parse(await fs.readFile(path.join(inputDir, name), 'utf8'))
  const [, moduleCode, topicCode, lessonCode] = lesson.id.split('-')
  const moduleOrder = Number(moduleCode.slice(1))
  const topicOrder = Number(topicCode.slice(1))
  const lessonOrder = Number(lessonCode.slice(1))
  const dialogue = lesson.context?.dialogue ?? []
  const examples = (lesson.vocabulary ?? []).filter((item) => item.example).map((item) => ({ english: item.example, word: item.word, meaning_es: item.meaning_es }))
  const sections = [
    ['explanation', 'Entiende la idea', { explanation_es: lesson.explanation_es ?? '', communication_goal: lesson.communication_goal, language_focus: lesson.language_focus ?? null }],
    ['examples', 'Mira ejemplos', { examples, dialogue }],
    ['pronunciation', 'Escucha y pronuncia', lesson.pronunciation ?? {}],
    ['listening', 'Comprende al escuchar', { dialogue, audio_text: lesson.context?.audio_text ?? null }],
    ['reading', 'Lee con contexto', lesson.reading ?? {}],
    ['conversation', 'Usa lo aprendido', { situation: lesson.situation, communication_goal: lesson.communication_goal, activities: (lesson.activities ?? []).filter((a) => ['ai_roleplay', 'transfer_mission', 'conversation'].includes(a.type)) }],
    ['review', 'Repasa y demuestra', { mastery_criteria: lesson.mastery_criteria, review: lesson.review ?? null }],
  ]
  out.push(`select m.id into v_module_id from public.modules m where m.level_id=v_level_id and m.sort_order=${moduleOrder};`)
  out.push(`select t.id into v_topic_id from public.topics t where t.module_id=v_module_id and t.sort_order=${topicOrder};`)
  out.push(`select l.id into v_lesson_id from public.lessons l where l.topic_id=v_topic_id and l.sort_order=${lessonOrder};`)
  out.push('delete from public.lesson_sections ls where ls.lesson_id=v_lesson_id;')
  sections.forEach(([type, title, content], index) => {
    out.push(`insert into public.lesson_sections(lesson_id,section_type,title,content,sort_order) values(v_lesson_id,${text(type)},${text(title)},${sql(content)},${index + 1});`)
  })
}
out.push('end $$;', 'commit;')
await fs.mkdir(path.dirname(output), { recursive: true })
await fs.writeFile(output, `${out.join('\n')}\n`, 'utf8')
console.log(`Seed de secciones generado: ${files.length} lecciones, ${files.length * 7} secciones.`)
