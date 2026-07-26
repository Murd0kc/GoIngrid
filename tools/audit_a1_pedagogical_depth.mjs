import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dir = path.join(root, 'content', 'lessons', 'A1')
const output = path.join(root, 'content', 'A1_PEDAGOGICAL_AUDIT.json')
const files = (await fs.readdir(dir)).filter((name) => /^A1-M\d+-T\d+\.json$/.test(name)).sort()
const report = { generated_at: new Date().toISOString(), standard: 'GOINGRID_PEDAGOGICAL_DEPTH_STANDARD.md', topics: [], summary: {} }

for (const file of files) {
  const topic = JSON.parse(await fs.readFile(path.join(dir, file), 'utf8'))
  const lessons = topic.lessons ?? []
  const activities = lessons.flatMap((lesson) => lesson.activities ?? [])
  const types = new Set(activities.map((activity) => activity.type))
  const skills = new Set(activities.map((activity) => activity.skill))
  const concerns = []
  if (!topic.explanation_es) concerns.push('missing_topic_explanation')
  if (!Array.isArray(topic.vocabulary) || topic.vocabulary.length < 5) concerns.push('insufficient_topic_vocabulary')
  if (!Array.isArray(topic.pronunciation_targets) || topic.pronunciation_targets.length === 0) concerns.push('missing_topic_pronunciation')
  if (lessons.length < 3) concerns.push('insufficient_lessons')
  if (!skills.has('listening')) concerns.push('missing_listening')
  if (!skills.has('reading')) concerns.push('missing_reading')
  if (!skills.has('writing')) concerns.push('missing_writing')
  if (!skills.has('pronunciation')) concerns.push('missing_pronunciation_practice')
  if (![...types].some((type) => ['roleplay', 'ai_roleplay', 'conversation'].includes(type))) concerns.push('missing_conversation')
  if (![...types].some((type) => ['transfer', 'transfer_mission'].includes(type))) concerns.push('missing_transfer')
  if (![...types].some((type) => ['review', 'mastery_assessment'].includes(type))) concerns.push('missing_mastery_check')
  const letters = topic.topic?.toLowerCase().includes('alfabeto') ? new Set((topic.vocabulary ?? []).map((item) => item.term).filter((term) => /^[a-z]$/i.test(term))) : null
  if (letters && letters.size < 26) concerns.push(`alphabet_coverage_${letters.size}_of_26`)
  report.topics.push({ file, id: topic.id, title: topic.topic ?? topic.title, lesson_count: lessons.length, activity_count: activities.length, skills: [...skills].sort(), activity_types: [...types].sort(), concerns })
}

report.summary = {
  topic_files: report.topics.length,
  topics_with_concerns: report.topics.filter((topic) => topic.concerns.length > 0).length,
  total_concerns: report.topics.reduce((sum, topic) => sum + topic.concerns.length, 0),
  topics_without_concerns: report.topics.filter((topic) => topic.concerns.length === 0).length
}
await fs.writeFile(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`Auditoría A1: ${report.summary.topic_files} temas; ${report.summary.topics_with_concerns} con observaciones; ${report.summary.total_concerns} observaciones.`)
