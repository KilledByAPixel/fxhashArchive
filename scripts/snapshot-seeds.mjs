// Capture the per-iteration SEED (metadata.iterationHash) for every fxhash
// gentk token on Tezos.
//
// WHY THIS EXISTS
// ---------------
// The seed is NOT stored on-chain. Verified against gentk contract
// KT1KEa8z6vWXDJrVqtMrAeDVzsvxat3kHaCE at every layer:
//   - token_data bigmap      -> {assigned, issuer_id, iteration, royalties}
//   - token_metadata bigmap  -> an ipfs:// URI, nothing else
//   - the mint operation     -> an ipfs:// URI, nothing else
//   - the assign_metadata op -> an ipfs:// URI, nothing else
// Tezos only ever stores a pointer. The seed exists solely inside the JSON
// document that pointer names, which lives on IPFS. If those pins lapse the
// seed is unrecoverable by any means, because nothing else derives it.
// Ownership and provenance survive on-chain; *which artwork you own* does not.
//
// The seed is therefore both the most irreplaceable and the smallest piece of
// the archive: ~51 bytes each, and without it a generator can never be re-run
// to reproduce a specific piece.
//
// We source it from TzKT, which cached the IPFS metadata when each token was
// indexed. That cache is currently the only copy outside IPFS itself.
//
// Usage:
//   node scripts/snapshot-seeds.mjs [--out DIR] [--limit N] [--commit] [--verify]
//
//   --out DIR    output directory (default: public/data/seeds)
//   --limit N    stop after N chunks have been fetched this run (trial runs)
//   --commit     git add + git commit every COMMIT_EVERY chunks
//   --verify     re-fetch chunks that already exist and compare (no writes)
//
// Resumable: a chunk file that exists and covers the expected range is
// skipped. A chunk is only written after its fetch fully succeeds, so an
// interrupted run never leaves a partial chunk behind.

import { readFile, writeFile, rename, unlink, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { execFileSync } from 'node:child_process'

const TZKT = 'https://api.tzkt.io/v1'
const CHUNK = 10000 // tokenIds per request/file; TzKT max page size
const DELAY_MS = 120
const COMMIT_EVERY = 20
const CONSECUTIVE_FAILURE_LIMIT = 10
const CONTRACTS_FILE = 'public/data/iterations/contracts.json'

// Fields pulled per token. iterationHash is the seed, the reason for this
// script. artifactUri is captured alongside it because it lives in the *same*
// IPFS document and is therefore lost at the same moment: it is the content
// address of the runnable artifact, and a CID lets a future archivist locate
// a copy on any node that still holds one. Add 'metadata.displayUri' here to
// capture preview-image CIDs too (~+90 MB).
const FIELDS = [
  ['metadata.iterationHash', 'seeds'],
  ['metadata.artifactUri', 'artifacts'],
]

function getArg(name, def) {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : def
}
const hasFlag = (name) => process.argv.includes(`--${name}`)

const OUT = getArg('out', 'public/data/seeds')
const LIMIT = Number(getArg('limit', Infinity))
const DO_COMMIT = hasFlag('commit')
const VERIFY = hasFlag('verify')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function loadJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return fallback
  }
}

async function atomicWrite(path, data) {
  await mkdir(dirname(path), { recursive: true })
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
  // update or crashing a long run.
  try {
    await writeFile(path, data)
    await unlink(tmp).catch(() => {})
  } catch {
    throw lastErr
  }
}

async function tzkt(path, attempt = 1) {
  try {
    const res = await fetch(`${TZKT}${path}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    if (attempt >= 5) throw err
    console.warn(`  ${path.slice(0, 90)} attempt ${attempt} failed (${err.message}); retrying`)
    await sleep(1000 * 2 ** attempt)
    return tzkt(path, attempt + 1)
  }
}

// Discover each contract tokenId range from TzKT rather than hardcoding it,
// so the script stays correct if a contract is ever extended.
async function describeContract(address) {
  const select = FIELDS.map(([f]) => f).join(',')
  const count = Number(await tzkt(`/tokens/count?contract=${address}`))
  if (count === 0) return { address, count, min: 0, max: -1, select }
  const [min] = await tzkt(`/tokens?contract=${address}&select=tokenId&sort.asc=tokenId&limit=1`)
  const [max] = await tzkt(`/tokens?contract=${address}&select=tokenId&sort.desc=tokenId&limit=1`)
  return { address, count, min: Number(min), max: Number(max), select }
}

async function fetchChunk(contract, from, size) {
  const rows = await tzkt(
    `/tokens?contract=${contract.address}&select=tokenId,${contract.select}` +
      `&tokenId.ge=${from}&tokenId.lt=${from + size}&sort.asc=tokenId&limit=${size}`,
  )
  if (!Array.isArray(rows)) throw new Error('expected an array of rows')
  if (rows.length > size) throw new Error(`got ${rows.length} rows for a ${size}-wide range`)

  const cols = {}
  for (const [, key] of FIELDS) cols[key] = new Array(size).fill(null)
  let present = 0
  for (const row of rows) {
    // Index by tokenId, never by array position. A token missing from the
    // middle of the range would otherwise shift every later seed by one and
    // silently mis-attribute them to the wrong artwork.
    const i = Number(row.tokenId) - from
    if (!Number.isInteger(i) || i < 0 || i >= size) {
      throw new Error(`row tokenId ${row.tokenId} outside requested range [${from}, ${from + size})`)
    }
    for (const [field, key] of FIELDS) cols[key][i] = row[field] ?? null
    present++
  }
  return { from, size, present, cols }
}

function chunkPath(contractIndex, aligned) {
  return join(OUT, String(contractIndex), `${String(aligned / CHUNK).padStart(4, '0')}.json`)
}

function commitProgress(label) {
  try {
    execFileSync('git', ['add', OUT], { stdio: 'ignore' })
    const staged = execFileSync('git', ['diff', '--cached', '--name-only']).toString().trim()
    if (!staged) {
      console.log(`[git] ${label}: nothing new to commit`)
      return
    }
    const message = `data: capture iteration seeds (${label})\n\nCo-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`
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
  return `${h}:${m}:${String(s % 60).padStart(2, '0')}`
}

async function main() {
  // Contract order must match contracts.json so the viewer can map a
  // project -> contract index -> seed directory without a second lookup.
  const contractsFile = await loadJson(CONTRACTS_FILE, null)
  if (!contractsFile || !Array.isArray(contractsFile.contracts)) {
    throw new Error(`${CONTRACTS_FILE} missing or malformed - run snapshot-contracts.mjs first`)
  }
  const addresses = contractsFile.contracts

  console.log(`snapshot-seeds: ${addresses.length} gentk contracts, chunk=${CHUNK}, out=${OUT}`)
  const contracts = []
  for (const address of addresses) {
    const c = await describeContract(address)
    const dense = c.max - c.min + 1 === c.count
    console.log(`  ${address}  count=${c.count}  tokenId ${c.min}..${c.max}  ${dense ? 'dense' : 'SPARSE'}`)
    contracts.push(c)
  }

  // Full work list: every chunk of every contract, oldest first.
  //
  // Chunk *files* are named on a fixed CHUNK-aligned grid, but the range a
  // chunk actually covers is clamped to the contract real [min, max]. A
  // contract whose tokenIds do not start on a grid boundary (KT1U6E… starts
  // at 589146) would otherwise pad its first chunk with thousands of tokenIds
  // that do not exist, which then get miscounted as missing seeds.
  const work = []
  for (let ci = 0; ci < contracts.length; ci++) {
    const c = contracts[ci]
    if (c.count === 0) continue
    const start = Math.floor(c.min / CHUNK) * CHUNK
    for (let aligned = start; aligned <= c.max; aligned += CHUNK) {
      const from = Math.max(aligned, c.min)
      const size = Math.min(aligned + CHUNK, c.max + 1) - from
      work.push({ ci, c, aligned, from, size })
    }
  }
  const totalTokens = contracts.reduce((n, c) => n + c.count, 0)
  console.log(`total: ${totalTokens} tokens across ${work.length} chunks\n`)

  const startTime = Date.now()
  let done = 0
  let fetched = 0
  let skipped = 0
  let failed = 0
  let mismatches = 0
  let consecutiveFailures = 0
  let sinceLastCommit = 0
  let capturedSeeds = 0
  let missingSeeds = 0
  let budget = LIMIT

  for (const { ci, c, aligned, from, size } of work) {
    if (budget <= 0) break
    const path = chunkPath(ci, aligned)
    const existing = await loadJson(path, null)

    if (existing && existing.from === from && existing.size === size && !VERIFY) {
      skipped++
      done++
      const got = existing.seeds.filter(Boolean).length
      capturedSeeds += got
      missingSeeds += existing.seeds.length - got
      continue
    }

    try {
      const chunk = await fetchChunk(c, from, size)
      budget--

      if (VERIFY) {
        // Never write in verify mode, even when the chunk is absent. Writing
        // here would turn a read-only audit into a silent repair, and would
        // race destructively with anything else touching the tree (a git
        // checkout mid-audit would see files reappear under it).
        if (!existing) {
          mismatches++
          console.error(`MISSING contract ${ci} chunk ${from}: no file on disk (re-run without --verify)`)
        } else if (JSON.stringify(existing.seeds) !== JSON.stringify(chunk.cols.seeds)) {
          mismatches++
          console.error(`MISMATCH contract ${ci} chunk ${from}: on-disk seeds differ from TzKT`)
        }
      } else {
        const record = { contract: ci, address: c.address, from, size: chunk.size, present: chunk.present }
        for (const [, key] of FIELDS) record[key] = chunk.cols[key]
        await atomicWrite(path, JSON.stringify(record))
        fetched++
        sinceLastCommit++
      }

      const got = chunk.cols.seeds.filter(Boolean).length
      capturedSeeds += got
      missingSeeds += chunk.size - got
      consecutiveFailures = 0
    } catch (err) {
      failed++
      consecutiveFailures++
      console.error(`FAILED contract ${ci} chunk from=${from}: ${err.message}`)
      if (consecutiveFailures >= CONSECUTIVE_FAILURE_LIMIT) {
        console.error(
          `\nFATAL: ${consecutiveFailures} consecutive failures - TzKT appears to be down. ` +
            `Stopping. Re-run to resume; completed chunks are kept.`,
        )
        break
      }
    }

    done++
    if (done % 10 === 0) {
      console.log(
        `[progress] ${done}/${work.length} chunks (${fetched} fetched, ${skipped} resumed, ${failed} failed) | ` +
          `${capturedSeeds} seeds | elapsed ${fmtElapsed(Date.now() - startTime)}`,
      )
    }
    if (DO_COMMIT && sinceLastCommit >= COMMIT_EVERY) {
      commitProgress(`${done}/${work.length} chunks`)
      sinceLastCommit = 0
    }
    await sleep(DELAY_MS)
  }

  const meta = {
    generatedAt: new Date().toISOString(),
    source: 'TzKT (cached IPFS token metadata)',
    chunkSize: CHUNK,
    contracts: contracts.map((c, i) => ({ index: i, address: c.address, count: c.count, min: c.min, max: c.max })),
    chunksTotal: work.length,
    chunksComplete: done - failed,
    seedsCaptured: capturedSeeds,
    // Tokens carrying no seed are fxhash "[WAITING TO BE SIGNED]" mints: minted
    // on-chain but never signed by the fxhash signer, so no seed was ever
    // assigned and no artwork was ever generated. Verified exhaustively via
    // TzKT counts — every seedless token on all three contracts is one of
    // these, zero unexplained. They are not a preservation gap.
    seedsMissing: missingSeeds,
    seedsMissingReason: 'unsigned mints ([WAITING TO BE SIGNED]) — no seed ever existed',
  }
  // Verify is strictly read-only; not even meta.json is touched.
  if (!VERIFY) await atomicWrite(join(OUT, 'meta.json'), JSON.stringify(meta, null, 2))

  console.log(
    `\n[FINAL] ${done}/${work.length} chunks (${fetched} fetched, ${skipped} resumed, ${failed} failed) | ` +
      `elapsed ${fmtElapsed(Date.now() - startTime)}`,
  )
  console.log(`seeds captured: ${capturedSeeds} | tokens with no seed: ${missingSeeds}`)
  if (VERIFY) console.log(`verify: ${mismatches} mismatched chunks`)
  if (DO_COMMIT && sinceLastCommit > 0) commitProgress(`final ${done}/${work.length} chunks`)
  console.log(failed > 0 ? 'INCOMPLETE - re-run to retry failed chunks' : 'DONE')
  if (failed > 0) process.exitCode = 1
}

// Defensive backstop: log and keep the process alive rather than let a stray
// unhandled rejection kill a long run outright.
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION (continuing):', err)
})

main().catch((err) => {
  console.error('FATAL:', err)
  process.exitCode = 1
})
