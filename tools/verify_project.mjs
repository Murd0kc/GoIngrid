import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const npmCheck = (args, cwd) => (
  process.platform === 'win32'
    ? {
        command: process.env.ComSpec ?? 'cmd.exe',
        args: ['/d', '/s', '/c', `npm ${args.join(' ')}`],
        cwd,
      }
    : { command: 'npm', args, cwd }
)
const checks = [
  { command: process.execPath, args: ['tools/validate_curriculum.mjs'], cwd: root },
  { command: process.execPath, args: ['tools/validate_canonical_lessons.mjs'], cwd: root },
  { command: process.execPath, args: ['tools/validate_normalized_lessons.mjs'], cwd: root },
  { command: process.execPath, args: ['tools/audit_a1_pedagogical_depth.mjs'], cwd: root },
  npmCheck(['test'], path.join(root, 'frontend')),
  npmCheck(['run', 'build'], path.join(root, 'frontend')),
]

for (const check of checks) {
  const label = `${path.basename(check.command)} ${check.args.join(' ')}`
  console.log(`\n> ${label}`)
  const result = spawnSync(check.command, check.args, {
    cwd: check.cwd,
    stdio: 'inherit',
    shell: false,
  })
  if (result.status !== 0) {
    console.error(`Falló: ${label}`)
    process.exit(result.status ?? 1)
  }
}

console.log('\nVerificación completa: todas las puertas automáticas pasaron.')
