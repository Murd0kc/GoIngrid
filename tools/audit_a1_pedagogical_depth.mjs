import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const topicDir = path.join(root, 'content', 'canonical', 'topics')
const canonicalLessonDir = path.join(root, 'content', 'canonical', 'lessons', 'A1')
const preliminaryLessonDir = path.join(root, 'content', 'normalized', 'A1')
const output = path.join(root, 'content', 'A1_PEDAGOGICAL_AUDIT.json')

async function exists(file) {
  try {
    await fs.access(file)
    return true
  } catch {
    return false
  }
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'))
}

const files = (await fs.readdir(topicDir))
  .filter((name) => /^A1-M\d+-T\d+\.json$/.test(name))
  .sort()

const report = {
  generated_at: new Date().toISOString(),
  standard: 'GOINGRID_LEARNING_AND_CONTENT_STANDARD.md',
  source_of_truth: 'content/canonical',
  topics: [],
  summary: {},
}

for (const file of files) {
  const topic = await readJson(path.join(topicDir, file))
  const lessonReferences = topic.lessons ?? []
  const canonicalLessons = []
  const preliminaryLessons = []

  for (const reference of lessonReferences) {
    const canonicalFile = path.join(canonicalLessonDir, `${reference.id}.json`)
    const preliminaryFile = path.join(preliminaryLessonDir, `${reference.id}.json`)
    if (await exists(canonicalFile)) canonicalLessons.push(await readJson(canonicalFile))
    if (await exists(preliminaryFile)) preliminaryLessons.push(await readJson(preliminaryFile))
  }

  const diagnosticLessons = canonicalLessons.length > 0 ? canonicalLessons : preliminaryLessons
  const activities = diagnosticLessons.flatMap((lesson) => lesson.activities ?? [])
  const types = new Set(activities.map((activity) => activity.type))
  const skills = new Set(activities.map((activity) => activity.skill))
  const concerns = []

  if (!topic.explanation_es) concerns.push('missing_topic_explanation')
  if (!Array.isArray(topic.learning_outcomes) || topic.learning_outcomes.length < 3) concerns.push('insufficient_learning_outcomes')
  if (!Array.isArray(topic.key_language) || topic.key_language.length < 3) concerns.push('insufficient_key_language')
  if (!Array.isArray(topic.vocabulary) || topic.vocabulary.length < 5) concerns.push('insufficient_topic_vocabulary')

  const pronunciationTargets = topic.pronunciation_targets ?? topic.letters ?? []
  if (pronunciationTargets.length === 0) concerns.push('missing_topic_pronunciation')
  if (lessonReferences.length < 3) concerns.push('insufficient_lesson_plan')
  if (canonicalLessons.length !== lessonReferences.length) {
    concerns.push(`canonical_lessons_${canonicalLessons.length}_of_${lessonReferences.length}`)
  }
  const approvedCanonicalLessons = canonicalLessons.filter((lesson) => (
    ['approved', 'imported', 'published'].includes(lesson.status)
  )).length
  if (canonicalLessons.length > 0 && approvedCanonicalLessons !== canonicalLessons.length) {
    concerns.push(`canonical_lessons_approved_${approvedCanonicalLessons}_of_${canonicalLessons.length}`)
  }

  const isAlphabet = topic.title.toLowerCase().includes('alfabeto')
  if (isAlphabet) {
    const letters = new Set((topic.letters ?? []).map((item) => item.letter).filter((letter) => /^[a-z]$/i.test(letter)))
    if (letters.size < 26) concerns.push(`alphabet_coverage_${letters.size}_of_26`)
  }

  if (activities.length > 0) {
    if (!skills.has('listening')) concerns.push('missing_listening')
    if (!skills.has('reading')) concerns.push('missing_reading')
    if (!skills.has('pronunciation')) concerns.push('missing_pronunciation_practice')
    if (![...types].some((type) => ['roleplay', 'ai_roleplay', 'conversation'].includes(type))) concerns.push('missing_conversation')
    if (![...types].some((type) => ['transfer', 'transfer_mission'].includes(type))) concerns.push('missing_transfer')
    if (![...types].some((type) => ['review', 'spaced_retrieval', 'mastery_assessment'].includes(type))) concerns.push('missing_mastery_check')
  }

  report.topics.push({
    file,
    id: topic.id,
    title: topic.title,
    planned_lessons: lessonReferences.length,
    canonical_lessons: canonicalLessons.length,
    approved_canonical_lessons: approvedCanonicalLessons,
    preliminary_lessons_used_for_diagnostics: preliminaryLessons.length,
    diagnostic_activity_count: activities.length,
    skills: [...skills].sort(),
    activity_types: [...types].sort(),
    concerns,
  })
}

report.summary = {
  canonical_topic_files: report.topics.length,
  topics_with_concerns: report.topics.filter((topic) => topic.concerns.length > 0).length,
  total_concerns: report.topics.reduce((sum, topic) => sum + topic.concerns.length, 0),
  topics_without_concerns: report.topics.filter((topic) => topic.concerns.length === 0).length,
  canonical_lessons: report.topics.reduce((sum, topic) => sum + topic.canonical_lessons, 0),
}
report.status = report.summary.total_concerns === 0 ? 'passed' : 'needs_work'

await fs.writeFile(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(
  `Auditoría A1 canónica: ${report.summary.canonical_topic_files} temas; `
  + `${report.summary.canonical_lessons} lecciones canónicas; `
  + `${report.summary.total_concerns} observaciones.`,
)
