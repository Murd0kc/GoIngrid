import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const inputDir = path.join(root, 'content', 'normalized', 'A1')
const output = path.join(root, 'supabase', 'seeds', 'A1_CONTENT_SEED.sql')

const sql = (value) => value === null || value === undefined ? 'NULL' : `'${String(value).replaceAll("'", "''")}'`
const json = (value) => `${sql(JSON.stringify(value ?? null))}::jsonb`
const files = (await fs.readdir(inputDir)).filter((name) => name.endsWith('.json')).sort()
const out = [
  '-- GoIngrid A1 content seed generated from content/normalized/A1.',
  '-- Idempotent by topic_id + sort_order and lesson_id + sort_order.',
  'begin;',
  "insert into public.levels (code, name, description, sort_order) values ('A1','Principiante','Bases para comprender y comunicarse en situaciones cotidianas.',1) on conflict (code) do nothing;",
  "do $$ declare v_level_id uuid; v_module_id uuid; v_topic_id uuid; v_lesson_id uuid; v_exercise_id uuid; begin",
  "select l.id into v_level_id from public.levels l where l.code='A1';",
]

let currentModule = ''
let currentTopic = ''
for (const name of files) {
  const lesson = JSON.parse(await fs.readFile(path.join(inputDir, name), 'utf8'))
  const [level, moduleCode, topicCode, lessonCode] = lesson.id.split('-')
  const moduleOrder = Number(moduleCode.slice(1))
  const topicOrder = Number(topicCode.slice(1))
  const lessonOrder = Number(lessonCode.slice(1))
  const moduleTitle = lesson.module_title ?? `Módulo ${moduleOrder}`
  const topicTitle = lesson.topic_title ?? lesson.topic ?? `Tema ${topicOrder}`
  if (moduleCode !== currentModule) {
    out.push(`select m.id into v_module_id from public.modules m where m.level_id=v_level_id and m.sort_order=${moduleOrder};`)
    out.push(`if v_module_id is null then insert into public.modules(level_id,title,description,sort_order) values(v_level_id,${sql(moduleTitle)},${sql('Contenido progresivo de nivel A1')},${moduleOrder}) returning id into v_module_id; end if;`)
    currentModule = moduleCode
    currentTopic = ''
  }
  if (topicCode !== currentTopic) {
    out.push(`select t.id into v_topic_id from public.topics t where t.module_id=v_module_id and t.sort_order=${topicOrder};`)
    out.push(`if v_topic_id is null then insert into public.topics(module_id,title,description,sort_order) values(v_module_id,${sql(topicTitle)},${sql(lesson.communication_goal)},${topicOrder}) returning id into v_topic_id; end if;`)
    currentTopic = topicCode
  }
  out.push(`select l.id into v_lesson_id from public.lessons l where l.topic_id=v_topic_id and l.sort_order=${lessonOrder};`)
    out.push(`if v_lesson_id is null then insert into public.lessons(topic_id,title,objective,estimated_minutes,estimated_seconds,is_published,sort_order,skill_focus,cefr_objectives) values(v_topic_id,${sql(lesson.title)},${sql(lesson.communication_goal)},${Math.max(1, Math.ceil(lesson.estimated_seconds/60))},${lesson.estimated_seconds},true,${lessonOrder},ARRAY[${sql(lesson.pronunciation?.targets ? 'pronunciation' : 'integrated')}],ARRAY[${sql('A1 objective')}]) returning id into v_lesson_id; else update public.lessons set title=${sql(lesson.title)},objective=${sql(lesson.communication_goal)},estimated_seconds=${lesson.estimated_seconds},estimated_minutes=${Math.max(1, Math.ceil(lesson.estimated_seconds/60))},is_published=true where public.lessons.id=v_lesson_id; end if;`)
  lesson.activities.forEach((activity, index) => {
    const correct = activity.evaluation?.accepted_answers ?? []
    out.push(`insert into public.exercises(lesson_id,exercise_type,skill,prompt,explanation,correct_answer,estimated_seconds,difficulty,sort_order,is_published) values(v_lesson_id,${sql(activity.type)},${sql(activity.skill)},${sql(activity.prompt ?? activity.instruction)},${sql(activity.feedback_correct ?? activity.feedback ?? '')},${json(correct)},${activity.estimated_seconds},${Math.min(5, Math.max(1, Number(activity.difficulty) || 1))},${index + 1},true) on conflict(lesson_id,sort_order) do update set exercise_type=excluded.exercise_type,skill=excluded.skill,prompt=excluded.prompt,explanation=excluded.explanation,correct_answer=excluded.correct_answer,estimated_seconds=excluded.estimated_seconds,is_published=true returning id into v_exercise_id;`)
    const options = Array.isArray(activity.options) ? activity.options : []
    if (options.length > 0) {
      out.push('delete from public.exercise_options eo where eo.exercise_id=v_exercise_id;')
      options.forEach((option, optionIndex) => {
        const text = typeof option === 'string' ? option : (option.text ?? option.option_text ?? option.label ?? '')
        const isCorrect = typeof option === 'object' && option.is_correct !== undefined
          ? option.is_correct
          : correct.map(String).includes(String(text))
        out.push(`insert into public.exercise_options(exercise_id,option_text,is_correct,sort_order) values(v_exercise_id,${sql(text)},${isCorrect},${optionIndex + 1});`)
      })
    }
  })
}
out.push('end $$;', 'commit;')
await fs.mkdir(path.dirname(output), { recursive: true })
await fs.writeFile(output, `${out.join('\n')}\n`, 'utf8')
console.log(`Seed generado: ${files.length} lecciones, ${files.length * 10} actividades.`)
