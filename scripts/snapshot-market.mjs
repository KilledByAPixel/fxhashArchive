// Capture per-project market statistics (primary + secondary volume, floor,
// median, high/low sale) for every project from fxhash's GraphQL API.
//
// WHY THIS EXISTS
// ---------------
// Two reasons, and the first is urgent.
//
// 1. This data exists only on fxhash's API. The trades happened on-chain, but
//    reconstructing per-project volume from raw operations means replaying
//    every marketplace contract across four years and several marketplace
//    versions. fxhash already did that work; the result lives in a database
//    behind an API belonging to a company that has shut down. When it goes,
//    the aggregate goes, even though the underlying operations survive.
//
// 2. The generator archive has to be selective — the full catalog is 80-150 GB
//    of code. Volume is the signal that says which projects people actually
//    engaged with: a 600-project sample showed the top 1% of projects
//    accounting for 73.2% of all money that moved. Mints are a poor substitute
//    (top 1% = only 17.4%) because a large free edition is not the same as
//    interest. Without this data there is no principled way to choose.
//
// Output mirrors the tokens shards so a project's stats sit in the shard its
// metadata already lives in: public/data/market/stats-NNN.json, keyed by
// project id. Volumes are stored in mutez (integer) exactly as returned, not
// converted to tez, to avoid introducing float error into archived data.
//
// Usage:
//   node scripts/snapshot-market.mjs [--out DIR] [--limit N] [--concurrency N] [--commit]
//
// Resumable: a project already present in its shard file is skipped. A project
// is written only after a successful fetch, so failures are retried on the
// next run rather than being recorded as zero — a fabricated zero would look
// exactly like a project nobody ever bought, which is the one thing this data
// is used to distinguish.

import { readFile, writeFile, rename, unlink, mkdir, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

const ENDPOINT = 'https://api.fxhash.xyz/graphql'
const DELAY_MS = 60
const TOKENS_DIR = 'public/data/tokens'
const COMMIT_EVERY = 4000
const CONSECUTIVE_FAILURE_LIMIT = 15

const QUERY = `query ($id: Float!) {
  generativeToken(id: $id) {
    marketStats {
      primVolumeTz primVolumeNb secVolumeTz secVolumeNb
      floor median highestSold lowestSold listed
    }
  }
}`

function getArg(name, def) {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : def
}
const hasFlag = (name) => process.argv.includes(`--${name}`)

const OUT = getArg('out', 'public/data/market')
const LIMIT = Number(getArg('limit', Infinity))
const CONCURRENCY = Math.max(1, Math.min(6, Number(getArg('concurrency', 5))))
const DO_COMMIT = hasFlag('commit')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function loadJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return fallback
  }
}

async function atomicWrite(path, data) {
  const tmp = `${path}.tmp-${process.pid}`
  await writeFile(tmp, data)
  let lastErr
  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      await rename(tmp, path)
      return
    } catch (err) {
      lastErr = err
      // Windows transiently locks freshly-written files (AV/indexer) causing
      // EPERM/EBUSY on rename. Retry with backoff before giving up.
      if (err.code !== 'EPERM' && err.code !== 'EBUSY') break
      await sleep(50 * attempt)
    }
  }
  try {
    await writeFile(path, data)
    await unlink(tmp).catch(() => {})
  } catch {
    throw lastErr
  }
}

async function fetchStats(projectId, attempt = 1) {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { id: projectId } }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    if (json.errors) throw new Error(JSON.stringify(json.errors).slice(0, 200))
    const gt = json.data && json.data.generativeToken
    if (!gt) throw new Error('generativeToken null')
    const m = gt.marketStats
    // A project that genuinely never traded returns null marketStats. That is
    // a real answer, not a failure, and is recorded as an explicit null so it
    // is never re-fetched and never confused with a missing entry.
    if (!m) return null
    return {
      pv: m.primVolumeTz ?? 0,
      pn: m.primVolumeNb ?? 0,
      sv: m.secVolumeTz ?? 0,
      sn: m.secVolumeNb ?? 0,
      floor: m.floor ?? null,
      med: m.median ?? null,
      hi: m.highestSold ?? null,
      lo: m.lowestSold ?? null,
      listed: m.listed ?? 0,
    }
  } catch (err) {
    if (attempt >= 4) throw err
    await sleep(1000 * 2 ** attempt)
    return fetchStats(projectId, attempt + 1)
  }
}

async function runPool(items, worker, concurrency) {
  let idx = 0
  async function runner() {
    while (idx < items.length) await worker(items[idx++])
  }
  const n = items.length === 0 ? 0 : Math.min(concurrency, items.length)
  await Promise.all(Array.from({ length: n }, runner))
}

function commitProgress(label) {
  try {
    execFileSync('git', ['add', OUT], { stdio: 'ignore' })
    const staged = execFileSync('git', ['diff', '--cached', '--name-only']).toString().trim()
    if (!staged) return
    const message = `data: capture market stats (${label})\n\nCo-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`
    execFileSync('git', ['commit', '-m', message], { stdio: 'ignore' })
    console.log(`[git] ${label}: committed`)
  } catch (err) {
    console.error(`[git] ${label}: commit FAILED: ${err.message}`)
  }
}

function fmtElapsed(ms) {
  const s = Math.floor(ms / 1000)
  return `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const shardFiles = (await readdir(TOKENS_DIR)).filter((f) => /^index-\d+\.json$/.test(f)).sort()

  const shards = []
  let total = 0
  let already = 0
  for (const f of shardFiles) {
    const label = f.match(/^index-(\d+)\.json$/)[1]
    const projects = await loadJson(join(TOKENS_DIR, f), [])
    const path = join(OUT, `stats-${label}.json`)
    const stats = await loadJson(path, {})
    total += projects.length
    for (const p of projects) if (Object.prototype.hasOwnProperty.call(stats, String(p.id))) already++
    shards.push({ label, projects, path, stats })
  }

  console.log(
    `snapshot-market: ${total} projects, ${already} already captured (resume), ` +
      `${Math.min(total - already, LIMIT)} to fetch this run`,
  )
  console.log(`endpoint=${ENDPOINT} concurrency=${CONCURRENCY} commit=${DO_COMMIT} out=${OUT}`)

  const startTime = Date.now()
  let budget = LIMIT
  let done = 0
  let failed = 0
  let traded = 0
  let consecutiveFailures = 0
  let sinceCommit = 0
  let aborted = false

  for (const shard of shards) {
    if (budget <= 0 || aborted) break
    const todo = []
    for (const p of shard.projects) {
      if (budget <= 0) break
      if (Object.prototype.hasOwnProperty.call(shard.stats, String(p.id))) continue
      todo.push(p)
      budget--
    }
    if (todo.length === 0) continue

    let writeChain = Promise.resolve()
    const persist = () => {
      const sorted = {}
      for (const k of Object.keys(shard.stats).sort((a, b) => Number(a) - Number(b))) sorted[k] = shard.stats[k]
      const data = JSON.stringify(sorted)
      writeChain = writeChain.then(() =>
        atomicWrite(shard.path, data).catch((err) => {
          console.error(`  WARN: persist ${shard.path} failed: ${err.message} (retried on next write)`)
        }),
      )
      return writeChain
    }

    await runPool(
      todo,
      async (project) => {
        if (aborted) return
        try {
          const stats = await fetchStats(project.id)
          shard.stats[String(project.id)] = stats
          if (stats && (stats.pv > 0 || stats.sv > 0)) traded++
          consecutiveFailures = 0
          persist()
        } catch (err) {
          failed++
          consecutiveFailures++
          console.error(`FAILED id=${project.id} slug=${project.slug}: ${err.message}`)
          if (consecutiveFailures >= CONSECUTIVE_FAILURE_LIMIT) {
            aborted = true
            console.error(`\nFATAL: ${consecutiveFailures} consecutive failures — the fxhash API appears to be down. Stopping; re-run to resume.`)
          }
        }
        done++
        sinceCommit++
        if (done % 500 === 0) {
          console.log(`[progress] ${done} done (${failed} failed, ${traded} with volume) | elapsed ${fmtElapsed(Date.now() - startTime)}`)
        }
        if (DO_COMMIT && sinceCommit >= COMMIT_EVERY) {
          await writeChain
          commitProgress(`${done} projects`)
          sinceCommit = 0
        }
        await sleep(DELAY_MS)
      },
      CONCURRENCY,
    )
    await writeChain
    await persist()
    console.log(`shard ${shard.label}: done`)
  }

  console.log(`\n[FINAL] ${done} fetched (${failed} failed, ${traded} with non-zero volume) | elapsed ${fmtElapsed(Date.now() - startTime)}`)
  if (DO_COMMIT && sinceCommit > 0) commitProgress(`final ${done} projects`)
  if (aborted) {
    process.exitCode = 2
    return
  }
  console.log(failed > 0 ? 'INCOMPLETE - re-run to retry failures' : 'DONE')
  if (failed > 0) process.exitCode = 1
}

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION (continuing):', err)
})

main().catch((err) => {
  console.error('FATAL:', err)
  process.exitCode = 1
})
