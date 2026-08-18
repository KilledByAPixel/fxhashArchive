// Generate public/data/summary.json — the one file the landing page and the
// artwork grid need. Rank order lives here so neither has to pull the 3 MB of
// market shards just to sort, and the archived id set lives here so a card can
// show its badge without a second fetch.
//
// Usage: node scripts/build-summary.mjs

import { readFile, writeFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { buildSummary } from './summary-lib.mjs'

const DATA = 'public/data'

const loadJson = async (path, fallback) => {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return fallback
  }
}

const shardLabels = async (dir, prefix) =>
  (await readdir(dir))
    .filter((f) => new RegExp(`^${prefix}-\\d+\\.json$`).test(f))
    .sort()
    .map((f) => f.match(/-(\d+)\.json$/)[1])

async function main() {
  const tokenLabels = await shardLabels(join(DATA, 'tokens'), 'index')

  let projectCount = 0
  for (const label of tokenLabels) {
    projectCount += (await loadJson(join(DATA, 'tokens', `index-${label}.json`), [])).length
  }

  const artists = await loadJson(join(DATA, 'artists', 'index.json'), [])

  let iterationCount = 0
  for (const label of tokenLabels) {
    const map = await loadJson(join(DATA, 'iterations', `map-${label}.json`), {})
    for (const ids of Object.values(map)) iterationCount += ids.length
  }

  const seedsMeta = await loadJson(join(DATA, 'seeds', 'meta.json'), { seedsCaptured: 0 })

  const volumes = new Map()
  for (const label of await shardLabels(join(DATA, 'market'), 'stats')) {
    const stats = await loadJson(join(DATA, 'market', `stats-${label}.json`), {})
    for (const [id, s] of Object.entries(stats)) {
      volumes.set(Number(id), s ? ((s.pv ?? 0) + (s.sv ?? 0)) / 1e6 : 0)
    }
  }

  const manifest = await loadJson(join(DATA, 'generators', 'manifest.json'), {})

  const summary = buildSummary({
    projectCount,
    artistCount: artists.length,
    iterationCount,
    seedCount: seedsMeta.seedsCaptured ?? 0,
    volumes,
    archivedIds: Object.keys(manifest).map(Number),
    generatedAt: new Date().toISOString(),
  })

  const out = join(DATA, 'summary.json')
  await writeFile(out, JSON.stringify(summary))
  const size = JSON.stringify(summary).length
  console.log(
    `${out}: ${(size / 1024).toFixed(0)} KB | ${summary.counts.projects} projects, ` +
      `${summary.ranked.length} ranked, ${summary.counts.archived} archived`,
  )
}

main().catch((err) => {
  console.error('FATAL:', err)
  process.exitCode = 1
})
