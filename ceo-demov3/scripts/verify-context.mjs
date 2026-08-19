import { createHash } from 'node:crypto'
import { access, readFile, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const projectRoot = fileURLToPath(new URL('../', import.meta.url))
const requiredFiles = [
  '.agents/skills/ambitionbox-v3-workflow/SKILL.md',
  '.agents/skills/ambitionbox-v3-workflow/agents/openai.yaml',
  '.agents/skills/ambitionbox-v3-copywriting/SKILL.md',
  '.agents/skills/ambitionbox-v3-copywriting/agents/openai.yaml',
  '.agents/skills/ambitionbox-v3-copywriting/references/DANDAD_COPY_PRINCIPLES.md',
  'AGENTS.md',
  'CLAUDE.md',
  'context/START_HERE.md',
  'context/PRODUCT.md',
  'context/COPY.md',
  'context/UX.md',
  'context/UI.md',
  'context/JOURNEY.md',
  'context/STATUS.md',
  'context/FEEDBACK.md',
  'context/briefs/ONBOARDING-FIRST-OPEN.md',
  'context/briefs/ONBOARDING-EMAIL-UNIFIED.md',
  'context/screens/ONBOARDING.md',
  'context/screens/HOME.md',
  'references/CATALOG.md',
  'src/tokens.css',
  'src/Onboarding.jsx',
  'src/onboarding.css',
  'src/Home.jsx',
  'src/home.css',
]
const errors = []

for (const relativePath of requiredFiles) {
  try {
    await access(path.join(projectRoot, relativePath))
  } catch {
    errors.push(`Missing required file: ${relativePath}`)
  }
}

const statusPath = path.join(projectRoot, 'context/STATUS.md')
const statusText = await readFile(statusPath, 'utf8')
const ownerValues = new Set(['Codex', 'Claude', 'Shared'])
const lockValues = new Set(['draft', 'locked'])
const statusRows = statusText.split('\n').filter((line) => /^\|[^-].*\|$/.test(line) && !line.includes('Screen or state'))

if (!statusRows.length) errors.push('No screen status rows found in context/STATUS.md')
for (const row of statusRows) {
  const cells = row.split('|').slice(1, -1).map((cell) => cell.trim())
  if (cells.length !== 7) {
    errors.push(`Malformed status row: ${row}`)
    continue
  }
  const [screen, owner, ...layers] = cells
  if (!ownerValues.has(owner)) errors.push(`Invalid owner "${owner}" for ${screen}`)
  for (const [index, value] of layers.slice(0, 4).entries()) {
    if (!lockValues.has(value)) errors.push(`Invalid ${['Product', 'Copy', 'UX', 'UI'][index]} status "${value}" for ${screen}`)
  }
}

const cataloguePath = path.join(projectRoot, 'references/CATALOG.md')
const catalogueText = await readFile(cataloguePath, 'utf8')
const referencePattern = /^\|\s*([^|]+?)\s*\|\s*`([^`]+)`\s*\|\s*`([a-f0-9]{64})`\s*\|.*\|\s*(active|hold|rejected)\s*\|$/gm
const catalogueRows = [...catalogueText.matchAll(referencePattern)]

if (!catalogueRows.length) errors.push('No checksum-backed reference rows found in references/CATALOG.md')
for (const [, id, savedPath, expectedChecksum, status] of catalogueRows) {
  if (/(^|\/)(output|playwright|prototype)(\/|$)/i.test(savedPath) && status !== 'rejected') {
    errors.push(`${id.trim()} catalogues QA or prototype output as inspiration: ${savedPath}`)
  }
  const assetPath = path.join(projectRoot, 'references', savedPath)
  try {
    const bytes = await readFile(assetPath)
    const actualChecksum = createHash('sha256').update(bytes).digest('hex')
    if (actualChecksum !== expectedChecksum) errors.push(`${id.trim()} checksum mismatch for ${savedPath}`)
  } catch {
    errors.push(`${id.trim()} asset missing: ${savedPath}`)
  }
}

const inboxPath = path.join(projectRoot, 'references/inbox')
try {
  const inboxEntries = await readdir(inboxPath, { withFileTypes: true })
  const ignoredInboxFiles = new Set(['README.md', '.DS_Store'])
  const unprocessedReferences = inboxEntries.filter((entry) => !ignoredInboxFiles.has(entry.name))
  for (const entry of unprocessedReferences) {
    errors.push(`Unprocessed reference in references/inbox: ${entry.name}`)
  }
} catch {
  errors.push('Missing reference inbox: references/inbox')
}

for (const instructionPath of ['AGENTS.md', 'CLAUDE.md']) {
  const text = await readFile(path.join(projectRoot, instructionPath), 'utf8')
  if (!text.includes('ambitionbox-v3-workflow')) errors.push(`${instructionPath} does not require the project workflow skill`)
  if (!text.includes('ambitionbox-v3-copywriting')) errors.push(`${instructionPath} does not require the project copywriting skill`)
  if (!text.includes('context/START_HERE.md')) errors.push(`${instructionPath} does not point to context/START_HERE.md`)
}

for (const compatibilityPath of ['DEMO_CONTEXT.md', 'UX_PREFERENCES.md']) {
  const text = await readFile(path.join(projectRoot, compatibilityPath), 'utf8')
  if (!text.includes('context/START_HERE.md')) errors.push(`${compatibilityPath} is not a compatibility pointer to the shared context`)
}

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await markdownFiles(entryPath))
    else if (entry.name.endsWith('.md')) files.push(entryPath)
  }
  return files
}

const markdownRoots = ['context', 'references', '.agents/skills/ambitionbox-v3-workflow', '.agents/skills/ambitionbox-v3-copywriting']
const markdownPaths = [
  path.join(projectRoot, 'AGENTS.md'),
  path.join(projectRoot, 'CLAUDE.md'),
  path.join(projectRoot, 'DEMO_CONTEXT.md'),
  path.join(projectRoot, 'UX_PREFERENCES.md'),
]
for (const root of markdownRoots) markdownPaths.push(...await markdownFiles(path.join(projectRoot, root)))

for (const markdownPath of markdownPaths) {
  const markdown = await readFile(markdownPath, 'utf8')
  const links = [...markdown.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1].trim().replace(/^<|>$/g, ''))
  for (const link of links) {
    if (/^(https?:|mailto:|#)/.test(link)) continue
    const linkPath = link.split('#')[0]
    if (!linkPath) continue
    try {
      await access(path.resolve(path.dirname(markdownPath), linkPath))
    } catch {
      errors.push(`Broken internal link in ${path.relative(projectRoot, markdownPath)}: ${link}`)
    }
  }
}

if (errors.length) {
  console.error('Context integrity failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(`Context integrity passed: ${requiredFiles.length} required files, ${statusRows.length} status rows, ${catalogueRows.length} checksum-backed references, and ${markdownPaths.length} Markdown files.`)
}
