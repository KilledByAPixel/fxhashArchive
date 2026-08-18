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
  } catch (err) {
    // A missing file and a malformed one both fall back silently otherwise,
    // which would let a corrupt JSON shard produce a wrong (but plausible-looking)
    // count in committed data with no trace of why.
    console.warn(`build-summary: could not load ${path}, using fallback: ${err.message}`)
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

  // Kept in step with HIDDEN_FLAGS in src/lib/data.ts. Featured cards are shipped
  // to the landing page directly, so a flagged project must be excluded here as
  // well as at render time — otherwise moderation would depend on the client
  // remembering to re-check data we handed it.
  const HIDDEN_FLAGS = new Set(['MALICIOUS', 'HIDDEN', 'REPORTED', 'AUTO_DETECT_COPY'])

  let projectCount = 0
  const visibleTokens = []
  for (const label of tokenLabels) {
    const shard = await loadJson(join(DATA, 'tokens', `index-${label}.json`), [])
    projectCount += shard.length
    for (const t of shard) if (!HIDDEN_FLAGS.has(t.flag)) visibleTokens.push(t)
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
    visibleTokens,
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
