import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentFile = fileURLToPath(import.meta.url)
const root = join(currentFile, '..', '..')
const lessonsRoot = join(root, 'content', 'lessons')
const errors = []
const requiredActivityFields = ['id', 'type', 'skill', 'instruction', 'prompt', 'difficulty', 'estimated_seconds']

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await walk(path))
    if (entry.isFile() && entry.name.endsWith('.json')) files.push(path)
  }
  return files
}

const files = await walk(lessonsRoot)
if (files.length === 0) errors.push('No hay archivos JSON de lecciones.')

for (const file of files) {
  const label = file.replace(root, '')
  let content
  try {
    content = JSON.parse(await readFile(file, 'utf8'))
  } catch (error) {
    errors.push(label + ': JSON invalido: ' + error.message)
    continue
  }

  for (const field of ['id', 'level', 'module_code', 'topic', 'title', 'lessons']) {
    if (content[field] === undefined || content[field] === '') errors.push(label + ': falta ' + field)
  }

  if (!Array.isArray(content.lessons) || content.lessons.length < 4 || content.lessons.length > 6) {
    errors.push(label + ': debe tener entre 4 y 6 lecciones')
    continue
  }

  const lessonIds = new Set()
  for (const lesson of content.lessons) {
    if (lessonIds.has(lesson.id)) errors.push(label + ': leccion duplicada ' + lesson.id)
    lessonIds.add(lesson.id)
    if (!Array.isArray(lesson.activities) || lesson.activities.length < 10 || lesson.activities.length > 15) {
      errors.push(label + ': ' + lesson.id + ' debe tener entre 10 y 15 actividades')
      continue
    }
    const activityIds = new Set()
    for (const activity of lesson.activities) {
      if (activityIds.has(activity.id)) errors.push(label + ': actividad duplicada ' + activity.id)
      activityIds.add(activity.id)
      for (const field of requiredActivityFields) {
        if (activity[field] === undefined || activity[field] === '') errors.push(label + ': ' + activity.id + ' falta ' + field)
      }
      if (activity.difficulty < 1 || activity.difficulty > 5) errors.push(label + ': ' + activity.id + ' dificultad fuera de 1-5')
      if (activity.estimated_seconds <= 0) errors.push(label + ': ' + activity.id + ' duracion invalida')
    }
  }
}

if (errors.length) {
  for (const error of errors) console.error('ERROR: ' + error)
  console.error('Validacion fallida: ' + errors.length + ' error(es).')
  process.exit(1)
}

console.log('Validacion correcta: ' + files.length + ' archivo(s) de lecciones.')
