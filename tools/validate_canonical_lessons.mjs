import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const inputDir = path.join(root, 'content', 'canonical', 'lessons', 'A1')
const reportPath = path.join(root, 'content', 'CANONICAL_VALIDATION_REPORT.json')
const lessonRequired = [
  'id',
  'level',
  'module_code',
  'topic_code',
  'title',
  'estimated_seconds',
  'communication_goal',
  'situation',
  'vocabulary',
  'context',
  'reading',
  'pronunciation',
  'activities',
  'mastery_criteria',
  'status',
  'source_file',
]
const activityRequired = ['id', 'type', 'skill', 'instruction', 'estimated_seconds', 'evaluation']
const statuses = new Set([
  'planned',
  'writing',
  'structurally_validated',
  'linguistic_review',
  'pedagogical_review',
  'cefr_review',
  'approved',
  'imported',
  'published',
])

const files = (await fs.readdir(inputDir).catch(() => []))
  .filter((name) => name.endsWith('.json'))
  .sort()
const activityIds = new Set()
const report = {
  generated_at: new Date().toISOString(),
  source: 'content/canonical/lessons/A1',
  files: [],
  summary: {},
}

for (const name of files) {
  const errors = []
  const warnings = []
  let lesson

  try {
    lesson = JSON.parse(await fs.readFile(path.join(inputDir, name), 'utf8'))
  } catch (error) {
    errors.push(`invalid_json:${error.message}`)
  }

  if (lesson) {
    for (const field of lessonRequired) {
      if (lesson[field] === undefined || lesson[field] === null || lesson[field] === '') {
        errors.push(`missing_lesson_field:${field}`)
      }
    }

    if (`${lesson.id}.json` !== name) errors.push('filename_does_not_match_lesson_id')
    if (lesson.level !== 'A1') errors.push('invalid_level')
    if (!statuses.has(lesson.status)) errors.push('invalid_status')
    if (!Array.isArray(lesson.activities) || lesson.activities.length < 8 || lesson.activities.length > 16) {
      errors.push('activity_count_outside_8_to_16')
    }
    if (!Array.isArray(lesson.vocabulary) || lesson.vocabulary.length < 5) warnings.push('limited_vocabulary')
    if (!lesson.context?.dialogue?.length) warnings.push('missing_context_dialogue')
    if (!lesson.reading?.text || !lesson.reading?.questions?.length) warnings.push('incomplete_reading')
    if (!lesson.pronunciation?.target && !lesson.pronunciation?.models?.length) warnings.push('incomplete_pronunciation')

    for (const activity of lesson.activities ?? []) {
      for (const field of activityRequired) {
        if (activity[field] === undefined || activity[field] === null || activity[field] === '') {
          errors.push(`missing_activity_field:${activity.id ?? 'unknown'}:${field}`)
        }
      }

      if (activityIds.has(activity.id)) errors.push(`duplicate_activity_id:${activity.id}`)
      activityIds.add(activity.id)
      if (!activity.id?.startsWith(`${lesson.id}-E`)) errors.push(`activity_id_outside_lesson:${activity.id}`)
      if (typeof activity.estimated_seconds !== 'number' || activity.estimated_seconds < 1) {
        errors.push(`invalid_activity_seconds:${activity.id}`)
      }

      const pendingRubric = activity.evaluation?.status === 'pending_rubric'
      const accepted = activity.evaluation?.accepted_answers ?? []
      const hasStructuredAnswer = Boolean(
        activity.correct_answer
        || activity.correct_answers
        || accepted.length
        || activity.pairs?.length
        || activity.items?.length
        || activity.sequence?.length
      )
      if (!pendingRubric && !hasStructuredAnswer && activity.type !== 'interactive_reading') {
        errors.push(`deterministic_activity_without_answer:${activity.id}`)
      }

      if (Array.isArray(activity.options) && activity.options.length > 0) {
        const acceptedValues = new Set(accepted.map(String))
        const directAnswer = activity.correct_answer === undefined ? [] : [activity.correct_answer]
        const expectedValues = [...acceptedValues, ...directAnswer.map(String)]
        if (!expectedValues.some((answer) => activity.options.map(String).includes(answer))) {
          errors.push(`correct_option_not_found:${activity.id}`)
        }
      }
    }
  }

  report.files.push({
    file: name,
    lesson_id: lesson?.id ?? null,
    status: lesson?.status ?? null,
    errors,
    warnings,
  })
}

report.summary = {
  files: files.length,
  structurally_valid: report.files.filter((file) => file.errors.length === 0).length,
  invalid: report.files.filter((file) => file.errors.length > 0).length,
  errors: report.files.reduce((total, file) => total + file.errors.length, 0),
  warnings: report.files.reduce((total, file) => total + file.warnings.length, 0),
  unique_activity_ids: activityIds.size,
}
report.status = report.summary.errors === 0 ? 'passed' : 'failed'

await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(
  `Lecciones canónicas: ${report.status}; `
  + `${report.summary.structurally_valid}/${report.summary.files} válidas; `
  + `${report.summary.errors} errores; ${report.summary.warnings} avisos.`,
)

if (report.status === 'failed') process.exitCode = 1
