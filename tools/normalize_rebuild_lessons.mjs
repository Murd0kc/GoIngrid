import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const inputDir = path.join(root, 'content', 'rebuild')
const outputDir = path.join(root, 'content', 'normalized', 'A1')
const reportPath = path.join(root, 'content', 'normalized', 'NORMALIZATION_REPORT.json')

const answerKeys = ['correct_answer', 'correct_answers', 'correct', 'answer', 'answers']

function asArray(value) {
  if (value === undefined || value === null) return []
  return Array.isArray(value) ? value : [value]
}

function extractAnswers(activity) {
  for (const key of answerKeys) {
    if (activity[key] !== undefined) return asArray(activity[key])
  }
  return []
}

function extractStructuredAnswers(activity) {
  if (Array.isArray(activity.items)) {
    const itemAnswers = activity.items.flatMap((item) => {
      if (item.answer !== undefined) return [item.answer]
      const label = item.question ?? item.text ?? item.prompt ?? item.term ?? item.person ?? 'item'
      if (item.category !== undefined) return [`${label}=${item.category}`]
      if (item.negative !== undefined) return [`${label}=${item.negative}`]
      for (const key of ['article', 'habit', 'meaning', 'status', 'included']) {
        if (item[key] !== undefined) return [`${label}=${item[key]}`]
      }
      return []
    }).filter(Boolean)
    if (itemAnswers.length > 0) return itemAnswers
  }
  if (Array.isArray(activity.fields)) return activity.fields.map((field) => field.answer).filter(Boolean)
  if (Array.isArray(activity.pairs)) return activity.pairs.map((pair) => {
    const values = Object.entries(pair).filter(([key, value]) => !['answer', 'category', 'negative'].includes(key) && value !== undefined).map(([, value]) => value)
    return values.length >= 2 ? `${values[0]}=${values[1]}` : null
  }).filter(Boolean)
  if (Array.isArray(activity.rounds)) return activity.rounds.map((round) => round.answer).filter(Boolean)
  if (Array.isArray(activity.sequence)) return [activity.sequence.join(' > ')]
  if (Array.isArray(activity.sets)) return activity.sets.map((set) => `${set.subject} ${set.verb} ${set.complement}`)
  return []
}

function defaultSeconds(type, skill) {
  const byType = {
    meaning_match: 45,
    listening_identification: 45,
    context_choice: 35,
    dialogue_ordering: 45,
    multiple_choice: 35,
    fill_blank: 40,
    translation: 50,
    reading_comprehension: 90,
    pronunciation_recording: 60,
    ai_roleplay: 180,
    transfer_mission: 120,
    mastery_assessment: 120
  }
  return byType[type] ?? (skill === 'speaking' ? 90 : 45)
}

function normalizeActivity(activity, lessonId) {
  const answers = extractAnswers(activity)
  const structuredAnswers = extractStructuredAnswers(activity)
  const open = ['ai_roleplay', 'pronunciation_recording', 'transfer_mission', 'mastery_assessment'].includes(activity.type)
  const structured = Array.isArray(activity.pairs) && activity.pairs.length > 0
  const estimatedSeconds = activity.estimated_seconds ?? defaultSeconds(activity.type, activity.skill)
  return {
    ...activity,
    prompt: activity.prompt ?? activity.target ?? activity.instruction,
    difficulty: activity.difficulty ?? null,
    estimated_seconds: estimatedSeconds,
    target_error: activity.target_error ?? null,
    evaluation: {
      ...((activity.evaluation && typeof activity.evaluation === 'object') ? activity.evaluation : {}),
      accepted_answers: answers.length > 0 ? answers : structuredAnswers,
      expected_pairs: structured ? activity.pairs : undefined,
      open_response: open,
      status: open ? 'pending_rubric' : (structured ? 'structured_check_required' : ((answers.length > 0 || structuredAnswers.length > 0) ? 'auto_check_candidate' : 'manual_review_required'))
    },
    feedback_correct: activity.feedback_correct ?? activity.feedback ?? null,
    feedback_incorrect: activity.feedback_incorrect ?? null,
    hint: activity.hint ?? null,
    source_lesson_id: lessonId
  }
}

const files = (await fs.readdir(inputDir)).filter((name) => name.endsWith('.json')).sort()
const report = { generated_at: new Date().toISOString(), input: 'content/rebuild', output: 'content/normalized/A1', status: 'needs_review', files: [], errors: [], repaired_legacy_json: [] }
await fs.mkdir(outputDir, { recursive: true })

for (const name of files) {
  const source = path.join(inputDir, name)
  let lesson
  try {
    const raw = await fs.readFile(source, 'utf8')
    lesson = JSON.parse(raw)
  } catch (error) {
    // Salvage the known legacy export defect: one explanation string was
    // wrapped onto a physical line before the next property. Do not silently
    // repair arbitrary JSON; keep the exception explicit and report it.
    if (name === 'A1-M3-T05-L03.json') {
      const raw = await fs.readFile(source, 'utf8')
      const repaired = raw.replace(/(Can we have the bill, please\?\.)\s+","spanish_speaker_notes"/, '$1",\n  "spanish_speaker_notes"')
      try {
        lesson = JSON.parse(repaired)
        report.repaired_legacy_json.push(name)
      } catch (repairError) {
        report.errors.push({ file: name, error: `invalid_json: ${repairError.message}` })
        continue
      }
    } else {
      report.errors.push({ file: name, error: `invalid_json: ${error.message}` })
      continue
    }
  }

  const explanation = lesson.explanation_es ?? `Esta lección practica ${lesson.title ?? 'el tema'} mediante ejemplos, comprensión y producción guiada.`
  const activities = asArray(lesson.activities).map((activity) => normalizeActivity(activity, lesson.id))
  const missing = []
  for (const field of ['explanation_es', 'estimated_seconds', 'communication_goal', 'situation', 'reading', 'pronunciation', 'mastery_criteria']) {
    if (field !== 'explanation_es' && (lesson[field] === undefined || lesson[field] === null || lesson[field] === '')) missing.push(field)
  }
  if (activities.some((activity) => activity.estimated_seconds === null)) missing.push('activity.estimated_seconds')
  if (activities.some((activity) => activity.evaluation.status === 'manual_review_required')) missing.push('activity.accepted_answers')

  const normalized = {
    ...lesson,
    explanation_es: explanation,
    status: 'needs_review',
    source_file: `content/rebuild/${name}`,
    contract_version: 'lesson-v1',
    review_flags: [...new Set(missing)],
    activities
  }
  await fs.writeFile(path.join(outputDir, name), `${JSON.stringify(normalized, null, 2)}\n`, 'utf8')
  report.files.push({ file: name, id: lesson.id, activity_count: activities.length, review_flags: [...new Set(missing)] })
}

report.summary = { input_files: files.length, normalized_files: report.files.length, errors: report.errors.length, needs_review: report.files.filter((file) => file.review_flags.length > 0).length }
await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`Normalizados ${report.summary.normalized_files} archivos; errores ${report.summary.errors}; requieren revisión ${report.summary.needs_review}.`)
