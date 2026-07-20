import { readdir, readFile } from 'node:fs/promises'
import { join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentFile = fileURLToPath(import.meta.url)
const projectRoot = join(currentFile, '..', '..')
const curriculumDir = join(projectRoot, 'content', 'curriculum')

const errors = []
const warnings = []

function error(message) {
  errors.push(message)
}

function warning(message) {
  warnings.push(message)
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function validateLevel(fileName, curriculum) {
  if (!isNonEmptyString(curriculum.level)) error(`${fileName}: falta level`)
  if (!isNonEmptyString(curriculum.title)) error(`${fileName}: falta title`)

  const hours = curriculum.target_guided_hours
  if (!hours || !Number.isFinite(hours.min) || !Number.isFinite(hours.max)) {
    error(`${fileName}: target_guided_hours debe tener min y max numéricos`)
  } else if (hours.min <= 0 || hours.max < hours.min) {
    error(`${fileName}: rango de horas guiadas inválido`)
  }

  if (!Array.isArray(curriculum.modules) || curriculum.modules.length === 0) {
    error(`${fileName}: modules debe ser un arreglo no vacío`)
    return
  }

  const moduleCodes = new Set()
  const moduleOrders = new Set()
  const moduleTitles = new Set()

  curriculum.modules.forEach((module, moduleIndex) => {
    const moduleLabel = `${fileName}: módulo ${moduleIndex + 1}`

    if (!isNonEmptyString(module.code)) error(`${moduleLabel}: falta code`)
    if (!isNonEmptyString(module.title)) error(`${moduleLabel}: falta title`)
    if (moduleCodes.has(module.code)) error(`${fileName}: código de módulo duplicado: ${module.code}`)
    if (moduleTitles.has(module.title)) error(`${fileName}: módulo duplicado: ${module.title}`)

    moduleCodes.add(module.code)
    moduleTitles.add(module.title)

    if (!Array.isArray(module.topics) || module.topics.length === 0) {
      error(`${moduleLabel}: topics debe ser un arreglo no vacío`)
      return
    }

    const topicTitles = new Set()
    module.topics.forEach((topic, topicIndex) => {
      if (!isNonEmptyString(topic)) error(`${moduleLabel}: tema ${topicIndex + 1} está vacío`)
      if (topicTitles.has(topic)) error(`${moduleLabel}: tema duplicado: ${topic}`)
      topicTitles.add(topic)
    })

    const expectedCode = `${curriculum.level}-M${moduleIndex + 1}`
    if (module.code !== expectedCode) {
      warning(`${fileName}: se esperaba código ${expectedCode} y se encontró ${module.code}`)
    }

    // Los archivos actuales no guardan sort_order; el orden del arreglo es la fuente.
    moduleOrders.add(moduleIndex + 1)
  })

  if (curriculum.production_rules) {
    const rules = curriculum.production_rules
    if (!rules.lessons_per_topic || !rules.activities_per_lesson) {
      error(`${fileName}: faltan reglas de producción`)
    }
    if (!Array.isArray(rules.include_skills) || rules.include_skills.length === 0) {
      error(`${fileName}: include_skills debe tener habilidades`)
    }
  }
}

const entries = (await readdir(curriculumDir, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))

if (entries.length === 0) {
  error('No se encontraron archivos JSON en content/curriculum')
}

for (const entry of entries) {
  const fileName = basename(entry.name)
  try {
    const raw = await readFile(join(curriculumDir, entry.name), 'utf8')
    const curriculum = JSON.parse(raw)
    validateLevel(fileName, curriculum)
  } catch (cause) {
    error(`${fileName}: JSON inválido o ilegible: ${cause.message}`)
  }
}

for (const message of warnings) console.warn(`WARN: ${message}`)
for (const message of errors) console.error(`ERROR: ${message}`)

if (errors.length > 0) {
  console.error(`\nValidación fallida: ${errors.length} error(es), ${warnings.length} advertencia(s).`)
  process.exit(1)
}

console.log(`Validación correcta: ${entries.length} archivo(s), ${warnings.length} advertencia(s).`)
