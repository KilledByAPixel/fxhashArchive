// Task — capture the authoritative project -> gentk contract mapping from
// fxhash's GraphQL API. See:
//   .superpowers/sdd/2026-08-17-fxhash-viewer/contracts-capture-report.md
//
// The viewer previously assumed FX{n} (issuer version) determined the gentk
// contract address, but FX0 maps to *two different* gentk contracts
// depending on the project. Every project's iterations live on exactly one
// of three known contracts, confirmed by sampling objkts from the start,
// middle and end of five projects' mint ranges across eras. So a
// project -> contract index is sufficient; no per-iteration capture needed.
//
// Mirrors the fetch-with-retry / concurrency / resumability / incremental
// write patterns of scripts/snapshot-iterations.mjs, adapted for a single
// flat output file (public/data/iterations/contracts.json) instead of
// per-shard maps.
//
// Optimization: public/data/iterations/map-NNN.json (already fully and
// successfully captured for all 27,430 projects — see meta.json,
// projectsFailed: 0) is authoritative ground truth for which projects have
// zero iterations. Projects with zero iterations have no objkt to query a
// contract from, so they are skipped entirely rather than sent to the API,
// and are omitted from contracts.json's byProject (per spec: a missing
// entry means "no iterations").
//
// Usage:
//   node scripts/snapshot-contracts.mjs [--out DIR] [--limit N] [--concurrency N] [--commit]
//
//   --out DIR          output directory (default: public/data/iterations);
//                       writes DIR/contracts.json
//   --limit N          stop after N projects have been *attempted* this run
//                       (oldest-first) — for trial runs
//   --concurrency N    max concurrent requests in flight (default: 3, cap: 3)
//   --commit           git add + git commit every 2000 projects captured
//                       this run (off by default; the real full run passes this)
//
// Resumable: which projects need a contract lookup is recomputed from the
// map-NNN.json ground truth on every run (not from our own prior progress),
// so a project already present as a key in contracts.json's byProject is
// skipped; everything else (never attempted, or attempted-and-failed on a
// prior run) is retried automatically. A project is only ever written to
// byProject once its contract has been fetched successfully — a failed
// project is never given a fallback/guessed value.

import { readFile, writeFile, rename, unlink, mkdir, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

const ENDPOINT = 'https://api.fxhash.xyz/graphql'
const DELAY_MS = 100
const TOKENS_DIR = 'public/data/tokens'
const ITER_DIR = 'public/data/iterations' // source of ground-truth map-NNN.json

const KNOWN_CONTRACTS = [
  'KT1KEa8z6vWXDJrVqtMrAeDVzsvxat3kHaCE',
  'KT1U6EHmNxJTkvaWJ4ThczG4FSDaHC21ssvi',
  'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr',
]

const QUERY = `query ($id: Float!) { generativeToken(id: $id) { objkts(take: 1) { gentkContractAddress } } }`

// Circuit breaker: if the API starts erroring persistently, stop the whole
// run rather than grinding through thousands of doomed requests. A handful
// of scattered failures (transient network blips) is normal and does not
// trip this.
const CONSECUTIVE_FAILURE_LIMIT = 15

function getArg(name, def) {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : def
}
const hasFlag = (name) => process.argv.includes(`--${name}`)

const OUT = getArg('out', ITER_DIR)
const LIMIT = Number(getArg('limit', Infinity))
const CONCURRENCY = Math.max(1, Math.min(3, Number(getArg('concurrency', 3))))
const DO_COMMIT = hasFlag('commit')
const OUT_FILE = join(OUT, 'contracts.json')

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

class ApiDownError extends Error {}

async function fetchProjectContract(projectId, attempt = 1) {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { id: projectId } }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    if (json.errors) throw new Error(JSON.stringify(json.errors).slice(0, 300))
    const gt = json.data && json.data.generativeToken
    if (!gt) throw new Error('generativeToken null')
    const objkts = gt.objkts || []
    if (objkts.length === 0) {
      // Ground truth said this project has iterations; the live API
      // disagrees (e.g. state drift since the iterations snapshot). Do not
      // guess — surface loudly as a failure so it's reported and retried.
      throw new Error('ground truth expected iterations but objkts(take:1) returned none')
    }
    const addr = objkts[0].gentkContractAddress
    if (!addr) throw new Error('objkt returned with no gentkContractAddress')
    return addr
  } catch (err) {
    if (attempt >= 4) throw err
    console.warn(`  project ${projectId} attempt ${attempt} failed (${err.message}); retrying`)
    await sleep(1000 * 2 ** attempt)
    return fetchProjectContract(projectId, attempt + 1)
  }
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

function commitProgress(outFile, label) {
  try {
    execFileSync('git', ['add', outFile], { stdio: 'ignore' })
    const staged = execFileSync('git', ['diff', '--cached', '--name-only']).toString().trim()
    if (!staged) {
      console.log(`[git] ${label}: nothing new to commit`)
      return
    }
    const message = `data: capture gentk contract mapping (${label})\n\nCo-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`
    execFileSync('git', ['commit', '-m', message], { stdio: 'ignore' })
    console.log(`[git] ${label}: committed`)
  } catch (err) {
    console.error(`[git] ${label}: commit FAILED: ${err.message}`)
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

  // Ground truth: which projects have >0 iterations (need a contract
  // lookup) vs 0 (omit from output entirely, never query).
  let totalProjects = 0
  let zeroIterationProjects = 0
  const needsContract = [] // [{ id, slug }]
  for (let i = 0; i < shardFiles.length; i++) {
    const label = shardLabels[i]
    const projects = await loadJson(join(TOKENS_DIR, shardFiles[i]), [])
    const iterMap = await loadJson(join(ITER_DIR, `map-${label}.json`), {})
    totalProjects += projects.length
    for (const p of projects) {
      const ids = iterMap[String(p.id)]
      if (Array.isArray(ids) && ids.length > 0) {
        needsContract.push(p)
      } else {
        zeroIterationProjects++
      }
    }
  }
  needsContract.sort((a, b) => a.id - b.id)

  // Existing output (resume support).
  const existing = await loadJson(OUT_FILE, null)
  const contracts = existing ? existing.contracts.slice() : KNOWN_CONTRACTS.slice()
  const byProject = existing ? { ...existing.byProject } : {}

  function contractIndex(address) {
    let idx = contracts.indexOf(address)
    if (idx === -1) {
      idx = contracts.length
      contracts.push(address)
      console.warn(`*** NEW CONTRACT DISCOVERED (not in known list): ${address} -> index ${idx} ***`)
    }
    return idx
  }

  const alreadyCaptured = needsContract.filter((p) =>
    Object.prototype.hasOwnProperty.call(byProject, String(p.id)),
  ).length

  const todo = []
  let budget = LIMIT
  for (const p of needsContract) {
    if (budget <= 0) break
    if (Object.prototype.hasOwnProperty.call(byProject, String(p.id))) continue
    todo.push(p)
    budget--
  }

  console.log(
    `snapshot-contracts: ${totalProjects} projects total (${shardFiles.length} shards), ` +
      `${zeroIterationProjects} with zero iterations (skipped, no query needed), ` +
      `${needsContract.length} need a contract lookup, ${alreadyCaptured} already captured (resume), ` +
      `${todo.length} to fetch this run` + (LIMIT < Infinity ? ` (--limit ${LIMIT})` : ''),
  )
  console.log(`endpoint=${ENDPOINT} concurrency=${CONCURRENCY} commit=${DO_COMMIT} out=${OUT_FILE}`)
  console.log(`known contracts: ${contracts.join(', ')}`)

  const startTime = Date.now()
  let done = 0
  let failed = 0
  let consecutiveFailures = 0
  let sinceLastCommit = 0
  const failedProjectIds = []

  let writeChain = Promise.resolve()
  function persist() {
    const sortedByProject = {}
    for (const k of Object.keys(byProject).sort((a, b) => Number(a) - Number(b))) {
      sortedByProject[k] = byProject[k]
    }
    const data = JSON.stringify({ contracts, byProject: sortedByProject })
    writeChain = writeChain.then(() =>
      atomicWrite(OUT_FILE, data).catch((err) => {
        console.error(`  WARN: failed to persist ${OUT_FILE}: ${err.message} (will retry on next write)`)
      }),
    )
    return writeChain
  }

  function logProgress(final = false) {
    const elapsed = fmtElapsed(Date.now() - startTime)
    console.log(
      `${final ? '[FINAL]' : '[progress]'} ${done}/${todo.length} projects done ` +
        `(${failed} failed) | elapsed ${elapsed}`,
    )
  }

  let aborted = false
  await runPool(
    todo,
    async (project) => {
      if (aborted) return
      try {
        const addr = await fetchProjectContract(project.id)
        byProject[String(project.id)] = contractIndex(addr)
        consecutiveFailures = 0
        persist() // fire-and-forget; chained/serialized internally
      } catch (err) {
        failed++
        consecutiveFailures++
        failedProjectIds.push(project.id)
        console.error(`FAILED project id=${project.id} slug=${project.slug}: ${err.message}`)
        if (consecutiveFailures >= CONSECUTIVE_FAILURE_LIMIT) {
          aborted = true
          console.error(
            `\nFATAL: ${consecutiveFailures} consecutive failures — the fxhash API appears to be ` +
              `erroring persistently. Last error: ${err.message}\n` +
              `Captured so far this run: ${done - failed} succeeded, ${failed} failed. Stopping now.`,
          )
        }
      }
      done++
      sinceLastCommit++
      if (done % 25 === 0) logProgress()
      if (DO_COMMIT && sinceLastCommit >= 2000) {
        await writeChain
        commitProgress(OUT_FILE, `${done}/${todo.length} this run`)
        sinceLastCommit = 0
      }
      await sleep(DELAY_MS)
    },
    CONCURRENCY,
  )
  await writeChain
  await persist() // final flush

  logProgress(true)

  if (DO_COMMIT && sinceLastCommit > 0) {
    commitProgress(OUT_FILE, `final ${done}/${todo.length} this run`)
  }

  console.log(`contracts known: ${contracts.length} -> ${contracts.join(', ')}`)
  console.log(
    `byProject coverage: ${Object.keys(byProject).length}/${needsContract.length} of projects needing a contract`,
  )
  if (failedProjectIds.length > 0) {
    console.log(`failed this run (${failedProjectIds.length}): ${failedProjectIds.slice(0, 50).join(', ')}${failedProjectIds.length > 50 ? ', ...' : ''}`)
  }

  if (aborted) {
    console.error('ABORTED (API_DOWN)')
    process.exitCode = 2
    return
  }

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
