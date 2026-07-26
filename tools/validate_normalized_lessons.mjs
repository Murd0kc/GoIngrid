import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const inputDir = path.join(root, 'content', 'normalized', 'A1')
const reportPath = path.join(root, 'content', 'normalized', 'VALIDATION_REPORT.json')
const lessonRequired = ['id', 'level', 'module_code', 'topic_code', 'title', 'estimated_seconds', 'communication_goal', 'situation', 'vocabulary', 'context', 'reading', 'pronunciation', 'activities', 'mastery_criteria']
const activityRequired = ['id', 'type', 'skill', 'instruction', 'estimated_seconds', 'evaluation']
const allowedStatuses = new Set(['auto_check_candidate', 'structured_check_required', 'pending_rubric'])

const report = { generated_at: new Date().toISOString(), files: [], errors: [], summary: {} }
const ids = new Set()
const files = (await fs.readdir(inputDir)).filter((name) => name.endsWith('.json')).sort()

for (const name of files) {
  const file = path.join(inputDir, name)
  const errors = []
  let lesson
  try { lesson = JSON.parse(await fs.readFile(file, 'utf8')) } catch (error) {
    errors.push(`invalid_json: ${error.message}`)
  }
  if (lesson) {
    for (const field of lessonRequired) if (lesson[field] === undefined || lesson[field] === null) errors.push(`missing_lesson_field:${field}`)
    if (lesson.level !== 'A1') errors.push('invalid_level:A1_expected')
    if (!Array.isArray(lesson.activities) || lesson.activities.length !== 10) errors.push('activities_count:10_expected')
    for (const activity of lesson.activities ?? []) {
      for (const field of activityRequired) if (activity[field] === undefined || activity[field] === null) errors.push(`missing_activity_field:${activity.id ?? 'unknown'}:${field}`)
      const scopedId = `${lesson.id}:${activity.id}`
      if (ids.has(scopedId)) errors.push(`duplicate_activity_id:${scopedId}`)
      ids.add(scopedId)
      if (!allowedStatuses.has(activity.evaluation?.status)) errors.push(`invalid_evaluation_status:${activity.id}`)
      if (!Array.isArray(activity.evaluation?.accepted_answers)) errors.push(`accepted_answers_not_array:${activity.id}`)
      if (typeof activity.estimated_seconds !== 'number' || activity.estimated_seconds <= 0) errors.push(`invalid_activity_seconds:${activity.id}`)
    }
  }
  report.files.push({ file: name, errors })
  report.errors.push(...errors.map((error) => ({ file: name, error })))
}

report.summary = { input_files: files.length, valid_files: report.files.filter((file) => file.errors.length === 0).length, invalid_files: report.files.filter((file) => file.errors.length > 0).length, errors: report.errors.length, unique_activity_ids: ids.size }
report.status = report.errors.length === 0 ? 'passed' : 'failed'
await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`ValidaciÃ³n: ${report.status}; archivos vÃ¡lidos ${report.summary.valid_files}/${report.summary.input_files}; errores ${report.summary.errors}.`)
