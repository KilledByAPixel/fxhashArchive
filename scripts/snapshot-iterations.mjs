// Task 3b — capture the authoritative project -> iteration (objkt) mapping from
// fxhash's GraphQL API before it disappears. See:
//   .superpowers/sdd/2026-08-17-fxhash-viewer/task-3b-report.md
//
// Mirrors the fetch-with-retry / paging / shard-writing patterns of
// scripts/snapshot.mjs, but queries per-project objkts (the only workable
// shape — see constraints below) instead of the top-level generativeTokens list.
//
// Usage:
//   node scripts/snapshot-iterations.mjs [--out DIR] [--limit N] [--concurrency N] [--commit]
//
//   --out DIR          output directory (default: public/data/iterations)
//   --limit N          stop after N projects have been *attempted* this run
//                       (across shards, oldest-first) — for trial runs
//   --concurrency N    max concurrent projects in flight (default: 3, cap: 3)
//   --commit           git add + git commit after each shard's map file is
//                       finalized (off by default; the real full run passes this)
//
// Resumable: on restart, any project id already present as a key in its
// shard's map-NNN.json is skipped. A project is only ever written once its
// full objkt list has been fetched successfully — a failed project is left
// OUT of the map entirely (never an empty-array placeholder), so it is
// retried automatically on the next invocation.

import { readFile, writeFile, rename, unlink, mkdir, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

const ENDPOINT = 'https://api.fxhash.xyz/graphql'
const TAKE = 50 // API hard cap, confirmed on both generativeTokens and objkts
const DELAY_MS = 100
const TOKENS_DIR = 'public/data/tokens'

const QUERY = `query ($id: Float!, $skip: Int!, $take: Int!) {
  generativeToken(id: $id) { objkts(skip: $skip, take: $take) { id } }
}`

function getArg(name, def) {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : def
}
const hasFlag = (name) => process.argv.includes(`--${name}`)

const OUT = getArg('out', 'public/data/iterations')
const LIMIT = Number(getArg('limit', Infinity))
const CONCURRENCY = Math.max(1, Math.min(3, Number(getArg('concurrency', 3))))
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
  // Fallback: rename kept failing. Write directly instead of losing the
  // update or crashing the whole multi-hour run.
  try {
    await writeFile(path, data)
    await unlink(tmp).catch(() => {})
  } catch {
    throw lastErr
  }
}

async function fetchObjktsPage(projectId, skip, attempt = 1) {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { id: projectId, skip, take: TAKE } }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    if (json.errors) throw new Error(JSON.stringify(json.errors).slice(0, 300))
    const gt = json.data && json.data.generativeToken
    if (!gt) throw new Error('generativeToken null')
    return gt.objkts
  } catch (err) {
    if (attempt >= 4) throw err
    console.warn(`  project ${projectId} skip=${skip} attempt ${attempt} failed (${err.message}); retrying`)
    await sleep(1000 * 2 ** attempt)
    return fetchObjktsPage(projectId, skip, attempt + 1)
  }
}

async function fetchProjectObjkts(projectId) {
  const ids = []
  for (let skip = 0; ; skip += TAKE) {
    const page = await fetchObjktsPage(projectId, skip)
    for (const o of page) ids.push(o.id)
    if (page.length < TAKE) break
    await sleep(DELAY_MS)
  }
  return ids
}

async function runPool(items, worker, concurrency) {
  let idx = 0
  async function runner() {
    while (idx < items.length) {
      const i = idx++
      await worker(items[i])
    }
  }
  const n = items.length === 0 ? 0 : Math.min(concurrency, items.length)
  await Promise.all(Array.from({ length: n }, runner))
}

async function computeMeta(outDir, shardLabels) {
  let projectsCaptured = 0
  let totalObjkts = 0
  const failedProjectIds = []
  for (const label of shardLabels) {
    const mapPath = join(outDir, `map-${label}.json`)
    const map = await loadJson(mapPath, null)
    if (map === null) continue // shard not started yet — not a failure, just not reached
    const projects = await loadJson(join(TOKENS_DIR, `index-${label}.json`), [])
    for (const p of projects) {
      const key = String(p.id)
      if (Object.prototype.hasOwnProperty.call(map, key)) {
        projectsCaptured++
        totalObjkts += map[key].length
      } else {
        failedProjectIds.push(p.id)
      }
    }
  }
  return {
    generatedAt: new Date().toISOString(),
    projectsCaptured,
    projectsFailed: failedProjectIds.length,
    totalObjkts,
    failedProjectIds,
  }
}

function commitShard(label, outDir) {
  const mapPath = join(outDir, `map-${label}.json`)
  const metaPath = join(outDir, 'meta.json')
  try {
    execFileSync('git', ['add', mapPath, metaPath], { stdio: 'ignore' })
    const staged = execFileSync('git', ['diff', '--cached', '--name-only']).toString().trim()
    if (!staged) {
      console.log(`[git] shard ${label}: nothing new to commit`)
      return
    }
    const message = `data: capture iteration mapping for shard ${label}\n\nCo-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`
    execFileSync('git', ['commit', '-m', message], { stdio: 'ignore' })
    console.log(`[git] shard ${label}: committed`)
  } catch (err) {
    console.error(`[git] shard ${label}: commit FAILED: ${err.message}`)
  }
}

function fmtElapsed(ms) {
  const s = Math.floor(ms / 1000)
  const h = String(Math.floor(s / 3600)).padStart(2, '0')
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const sec = String(s % 60).padStart(2, '0')
  return `${h}:${m}:${sec}`
}

async function main() {
  await mkdir(OUT, { recursive: true })

  const shardFiles = (await readdir(TOKENS_DIR))
    .filter((f) => /^index-\d+\.json$/.test(f))
    .sort()
  const shardLabels = shardFiles.map((f) => f.match(/^index-(\d+)\.json$/)[1])

  // Load all shards + existing maps once up front.
  const shards = []
  let totalProjects = 0
  let alreadyCaptured = 0
  for (let i = 0; i < shardFiles.length; i++) {
    const label = shardLabels[i]
    const projects = await loadJson(join(TOKENS_DIR, shardFiles[i]), [])
    const mapPath = join(OUT, `map-${label}.json`)
    const map = await loadJson(mapPath, {})
    totalProjects += projects.length
    for (const p of projects) if (Object.prototype.hasOwnProperty.call(map, String(p.id))) alreadyCaptured++
    shards.push({ label, projects, mapPath, map })
  }

  const toDoTotal = Math.min(totalProjects - alreadyCaptured, LIMIT)
  console.log(
    `snapshot-iterations: ${shardFiles.length} shards, ${totalProjects} projects total, ` +
      `${alreadyCaptured} already captured (resume), ${toDoTotal} to fetch this run` +
      (LIMIT < Infinity ? ` (--limit ${LIMIT})` : ''),
  )
  console.log(`endpoint=${ENDPOINT} concurrency=${CONCURRENCY} commit=${DO_COMMIT} out=${OUT}`)

  const startTime = Date.now()
  let globalBudget = LIMIT
  let globalDone = 0
  let globalFailed = 0
  let globalObjkts = 0

  function logProgress(final = false) {
    const elapsed = fmtElapsed(Date.now() - startTime)
    console.log(
      `${final ? '[FINAL]' : '[progress]'} ${globalDone}/${toDoTotal} projects done ` +
        `(${globalFailed} failed) | ${globalObjkts} objkts captured this run | elapsed ${elapsed}`,
    )
  }

  for (const shard of shards) {
    if (globalBudget <= 0) break
    const { label, projects, mapPath, map } = shard

    const todo = []
    for (const p of projects) {
      if (globalBudget <= 0) break
      if (Object.prototype.hasOwnProperty.call(map, String(p.id))) continue
      todo.push(p)
      globalBudget--
    }

    if (todo.length === 0) {
      console.log(`shard ${label}: already fully captured, skipping fetch`)
    } else {
      console.log(`shard ${label}: ${projects.length} projects, ${todo.length} to fetch`)
    }

    let writeChain = Promise.resolve()
    const persist = () => {
      const sorted = {}
      for (const k of Object.keys(map).sort((a, b) => Number(a) - Number(b))) sorted[k] = map[k]
      const data = JSON.stringify(sorted)
      // Never let a transient write failure become an unhandled rejection
      // that kills the whole run — the in-memory map is cumulative, so the
      // next successful persist() will include whatever this one missed.
      writeChain = writeChain.then(() =>
        atomicWrite(mapPath, data).catch((err) => {
          console.error(`  WARN: failed to persist ${mapPath}: ${err.message} (will retry on next write)`)
        }),
      )
      return writeChain
    }

    let shardFailed = 0
    await runPool(
      todo,
      async (project) => {
        try {
          const ids = await fetchProjectObjkts(project.id)
          map[String(project.id)] = ids
          globalObjkts += ids.length
          persist() // fire-and-forget; chained/serialized internally
        } catch (err) {
          shardFailed++
          globalFailed++
          console.error(`FAILED project id=${project.id} slug=${project.slug}: ${err.message}`)
        }
        globalDone++
        if (globalDone % 25 === 0) logProgress()
      },
      CONCURRENCY,
    )
    await writeChain
    await persist() // final flush (also handles todo.length === 0 case)

    console.log(
      `shard ${label} complete: ${todo.length - shardFailed}/${todo.length} captured this run, ${shardFailed} failed`,
    )

    const meta = await computeMeta(OUT, shardLabels)
    try {
      await atomicWrite(join(OUT, 'meta.json'), JSON.stringify(meta, null, 2))
    } catch (err) {
      console.error(`  WARN: failed to write meta.json: ${err.message} (will retry after next shard)`)
    }

    if (DO_COMMIT) commitShard(label, OUT)
  }

  logProgress(true)
  console.log('DONE')
}

// Defensive backstop: log and keep the process alive rather than let a
// stray unhandled rejection kill an hours-long run outright.
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION (continuing):', err)
})

main().catch((err) => {
  console.error('FATAL:', err)
  process.exitCode = 1
})
