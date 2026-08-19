// Archive generator code into the repo so selected projects keep working with
// no IPFS, no Tezos and no internet at all.
//
// WHY THIS EXISTS
// ---------------
// A generator plus a seed regenerates an artwork. Seeds for all 1,802,387
// iterations are already committed (see snapshot-seeds.mjs); the generators
// are not, because the full catalog is 80-150 GB of code living on IPFS. So
// the archive has to be selective, and this script is what makes the
// selection concrete.
//
// Projects are archived in priority order until a byte budget is reached:
//   1. explicit entries in data/preserve.json (accepted preservation requests)
//   2. every project by the artists listed there
//   3. the highest-volume projects, ranked from public/data/market
// Volume is the ranking signal because engagement is extremely concentrated:
// the top 1% of projects account for ~73% of all money that moved on fxhash.
//
// Generators are fetched as a tar from an IPFS gateway and unpacked into
// public/data/generators/<projectId>/, so the files are directly servable and
// runnable — the viewer loads index.html?fxhash=<seed> in an iframe, which is
// exactly how fxhash itself drove a generator. No CAR parsing, no IPFS client,
// no runtime dependency of any kind.
//
// Usage:
//   node scripts/archive-generators.mjs [--budget MB] [--limit N] [--dry-run] [--commit]
//
//   --budget MB   stop once the archive reaches this size (default 600).
//                  GitHub Pages caps a published site at 1 GB and the rest of
//                  public/ already uses ~370 MB.
//   --limit N     archive at most N projects this run
//
//   Entries in preserve.json's "projects" list are exempt from maxProjectSizeMB:
//   the cap is there to keep automatic selection away from a few large outliers,
//   not to quietly refuse work somebody asked us to keep.
//   --dry-run     print the priority list and stop; downloads nothing
//   --commit      git commit every COMMIT_EVERY projects
//
// Resumable: a project already unpacked is skipped, and its size still counts
// against the budget.
//
// NOT HANDLED: onchfs:// projects (372 of them). Their code is stored on-chain
// and cannot be lost, so they are the least urgent to archive, and they need a
// different fetch path than an IPFS gateway. They are reported and skipped.

import { readFile, writeFile, rename, unlink, mkdir, readdir, rm, stat, cp } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { execFileSync } from 'node:child_process'
import { extractRefs, resolveRef, GATEWAY_ORIGINS } from './archive-lib.mjs'

const GATEWAYS = GATEWAY_ORIGINS
const TOKENS_DIR = 'public/data/tokens'
const MARKET_DIR = 'public/data/market'
const PRESERVE_FILE = 'data/preserve.json'
const COLLAB_FILE = 'public/data/collaborations.json'
const OUT = 'public/data/generators'
const COMMIT_EVERY = 25
const DELAY_MS = 150

function getArg(name, def) {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : def
}
const hasFlag = (name) => process.argv.includes(`--${name}`)

const BUDGET_BYTES = Number(getArg('budget', 600)) * 1024 * 1024
const FETCH_TIMEOUT_MS = Number(getArg('timeout', 900)) * 1000
const LIMIT = Number(getArg('limit', Infinity))
const DRY_RUN = hasFlag('dry-run')
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
  try {
    await rename(tmp, path)
  } catch {
    await writeFile(path, data)
    await unlink(tmp).catch(() => {})
  }
}

async function dirSize(dir) {
  let total = 0
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    total += e.isDirectory() ? await dirSize(p) : (await stat(p)).size
  }
  return total
}

// ---------------------------------------------------------------- selection

/**
 * fxhash's own moderation flags. The viewer hides these projects from every grid
 * and refuses to resolve their slug, and the README promises as much.
 *
 * Mirrors HIDDEN_FLAGS in src/lib/data.ts.
 */
const HIDDEN_FLAGS = new Set(['MALICIOUS', 'HIDDEN', 'REPORTED', 'AUTO_DETECT_COPY'])

async function loadCatalog() {
  const projects = []
  let moderated = 0
  for (const f of (await readdir(TOKENS_DIR)).filter((f) => /^index-\d+\.json$/.test(f)).sort()) {
    for (const p of await loadJson(join(TOKENS_DIR, f), [])) {
      // Filtered here rather than inside the selection rules, so that no rule —
      // not a volume ranking, not a named artist, not an accepted request — can
      // reach one. "Moderation is honored" has to mean we do not store and serve
      // the code either, or it is only honored where it is easy to look.
      if (HIDDEN_FLAGS.has(p.flag)) { moderated++; continue }
      projects.push(p)
    }
  }
  if (moderated) console.log(`skipping ${moderated} projects flagged by fxhash moderation`)
  return projects
}

async function loadVolumes() {
  const vol = new Map()
  let shards = []
  try {
    shards = (await readdir(MARKET_DIR)).filter((f) => /^stats-\d+\.json$/.test(f))
  } catch {
    return vol
  }
  for (const f of shards) {
    const stats = await loadJson(join(MARKET_DIR, f), {})
    for (const [id, s] of Object.entries(stats)) {
      if (s) vol.set(Number(id), (s.pv ?? 0) + (s.sv ?? 0))
    }
  }
  return vol
}

function buildPriorityList(projects, volumes, rules, explicit, collaborations = {}) {
  const byId = new Map(projects.map((p) => [p.id, p]))
  const picked = new Map() // id -> reason, insertion order = priority
  /**
   * Projects somebody actually asked for, which the per-project size cap does not
   * apply to.
   *
   * The cap exists so that a handful of 30 MB outliers cannot eat the budget while
   * nobody has asked for them — it is a tie-breaker for automatic selection. Letting
   * it also veto an accepted request turns "we will preserve your work" into "we will
   * preserve your work if it is small", silently, which is the wrong promise to make
   * quietly. A request that is too big to accept should be declined out loud.
   */
  const uncapped = new Set()

  const add = (id, reason) => {
    if (id == null || picked.has(id) || !byId.has(id)) return
    picked.set(id, reason)
  }

  // 1. accepted requests, by id or slug
  for (const entry of explicit) {
    const id = entry.id ?? projects.find((p) => p.slug === entry.slug)?.id
    add(id, `request${entry.reason ? ` (${entry.reason})` : ''}`)
    if (id != null && byId.has(id)) uncapped.add(id)
  }

  // 2. named artists, whole body of work
  //
  // "Whole body of work" has to include collaborations. A project minted through a
  // shared contract records that contract as its author, so matching on the author
  // field alone silently skipped every collaborative piece by the very artists this
  // rule exists to cover — 553 projects across the catalog. The people behind those
  // contracts are read from chain by scripts/snapshot-collaborators.mjs.
  const artists = (rules.artists ?? []).map((a) => a.toLowerCase())
  if (artists.length) {
    const matches = (name, id) => {
      const who = `${name ?? ''} ${id ?? ''}`.toLowerCase()
      return artists.some((a) => who.includes(a))
    }
    for (const p of projects) {
      if (matches(p.author?.name, p.author?.id)) add(p.id, `artist: ${p.author?.name ?? p.author?.id}`)
    }
    for (const [projectId, entry] of Object.entries(collaborations)) {
      const who = entry.collaborators.find((c) => matches(c.name, c.id))
      if (who) add(Number(projectId), `collaborator: ${who.name ?? who.id}`)
    }
  }

  // 3. highest volume first
  const ranked = projects
    .map((p) => ({ p, v: volumes.get(p.id) ?? 0 }))
    .filter((r) => r.v > 0)
    .sort((a, b) => b.v - a.v)
  const topN = rules.topProjectsByVolume ?? 0
  for (const r of ranked.slice(0, topN)) add(r.p.id, `top volume (${Math.round(r.v / 1e6).toLocaleString()} tez)`)

  return [...picked].map(([id, reason]) => ({
    project: byId.get(id),
    reason,
    volume: volumes.get(id) ?? 0,
    uncapped: uncapped.has(id),
  }))
}

// ------------------------------------------------------------------- fetch

async function fetchTar(cid, maxBytes) {
  let lastErr
  let tooBig = false
  let received = 0
  for (let attempt = 0; attempt < GATEWAYS.length * 2; attempt++) {
    received = 0
    const gateway = GATEWAYS[attempt % GATEWAYS.length]
    const ac = new AbortController()
    // Generous, because the tail of the size distribution is what times out:
    // a 20 MB generator pulled cold through a public gateway can take many
    // minutes, and those large projects are exactly the ones no other copy is
    // likely to exist for. Waiting is cheaper than losing them.
    const timer = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS)
    try {
      const res = await fetch(`${gateway}/ipfs/${cid}?format=tar`, {
        headers: { accept: 'application/x-tar' },
        signal: ac.signal,
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const chunks = []
      for await (const c of res.body) {
        received += c.length
        if (received > maxBytes) {
          // Breaking cancels the stream on its own. Calling ac.abort() here
          // instead makes the loop's own cleanup reject with AbortError, which
          // then reads as a network failure — that is what made oversized
          // projects report as FAIL and burn a retry on every gateway, rather
          // than being skipped once and cheaply.
          tooBig = true
          break
        }
        chunks.push(c)
      }
      if (tooBig) return { tooBig: true, bytes: received }
      return { buffer: Buffer.concat(chunks), bytes: received }
    } catch (err) {
      // A cancelled stream can still surface as a rejection after the break.
      if (tooBig) return { tooBig: true, bytes: received }
      lastErr = err
      if (attempt < GATEWAYS.length * 2 - 1) await sleep(1000 * (attempt + 1))
    } finally {
      clearTimeout(timer)
    }
  }
  throw lastErr ?? new Error('all gateways failed')
}

// Unpacking archives fetched from a public gateway means treating their
// contents as hostile: a crafted tar could carry absolute paths or ".."
// segments and write outside the destination. List the members first and
// refuse anything that is not a plain relative path.
function assertSafeTar(tarPath) {
  const listing = execFileSync('tar', ['--force-local', '-tf', tarPath], { encoding: 'utf8' })
  const entries = listing.split('\n').map((l) => l.trim()).filter(Boolean)
  if (entries.length === 0) throw new Error('tar is empty')
  for (const e of entries) {
    if (e.startsWith('/') || e.startsWith('\\') || /^[a-zA-Z]:/.test(e)) throw new Error(`absolute path in tar: ${e}`)
    if (e.split(/[/\\]/).includes('..')) throw new Error(`path traversal in tar: ${e}`)
  }
  return entries
}

// Some generators were published with the artist's own version-control
// metadata still inside. A nested .git directory is catastrophic here: git
// records the folder as a gitlink (mode 160000) pointing at a commit that
// exists in no remote, so the generator's real files are never committed and
// a fresh clone of this repo is left with a broken submodule reference. Strip
// VCS metadata before the files go anywhere near the index.
async function stripVcsMetadata(dir) {
  let removed = 0
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue
    if (e.name === '.git' || e.name === '.svn' || e.name === '.hg') {
      await rm(join(dir, e.name), { recursive: true, force: true })
      removed++
    } else {
      removed += await stripVcsMetadata(join(dir, e.name))
    }
  }
  return removed
}

async function findEntryPoint(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isFile() && e.name.toLowerCase() === 'index.html') return e.name
  }
  // Single-file generators are stored as one HTML file named by CID.
  const files = (await readdir(dir, { withFileTypes: true })).filter((e) => e.isFile())
  const html = files.find((e) => /\.html?$/i.test(e.name))
  return html ? html.name : files.length === 1 ? files[0].name : null
}


// ---------------------------------------------------------------- onchfs

/**
 * fxhash's on-chain filesystem. 372 projects store their code there instead of on
 * IPFS, and the archiver used to skip all of them.
 *
 * Their code is on chain, so it cannot be lost — which made them the least urgent
 * to archive, but not unimportant: a copy here is what lets a project run with no
 * network at all, and that is the whole point of the archive. Entangled (85,193 tez)
 * is one of these, and so is every fx(params) piece by an artist we were told to
 * keep whole.
 *
 * There is no tar export, so the tree is walked from the entry point: fetch
 * index.html, take every same-origin reference out of it, fetch those, and follow
 * references out of any CSS that turns up. That is a static walk, so an asset a
 * generator builds at runtime — a path assembled in JavaScript — is not found. The
 * fetched set is reported so a project that came back suspiciously thin can be
 * checked by hand rather than quietly shipped broken.
 */
const ONCHFS_GATEWAY = 'https://onchfs.fxhash2.xyz'
/** Entry points are HTML, so give up if a walk somehow finds none. */
const ONCHFS_MAX_FILES = 400

async function fetchOnchfs(hash, staging, maxBytes) {
  const root = `${ONCHFS_GATEWAY}/${hash}/`
  const queue = ['index.html']
  const seen = new Set(queue)
  const written = []
  let total = 0

  while (queue.length) {
    if (written.length >= ONCHFS_MAX_FILES) return { tooBig: true }
    const path = queue.shift()
    let res
    try {
      res = await fetch(root + path)
    } catch {
      continue
    }
    // A missed reference is normal — generators name files they never ship — so a
    // 404 on anything but the entry point is not fatal.
    if (!res.ok) {
      if (path === 'index.html') throw new Error(`onchfs entry point: HTTP ${res.status}`)
      continue
    }
    const body = Buffer.from(await res.arrayBuffer())
    total += body.length
    if (total > maxBytes) return { tooBig: true }

    const dest = join(staging, path)
    await mkdir(dirname(dest), { recursive: true })
    await writeFile(dest, body)
    written.push(path)

    const type = res.headers.get('content-type') ?? ''
    const isHtml = /html/i.test(type) || /\.html?$/i.test(path)
    const isCss = /css/i.test(type) || /\.css$/i.test(path)
    if (!isHtml && !isCss) continue
    for (const ref of extractRefs(body.toString('utf8'), isCss)) {
      const next = resolveRef(path, ref)
      if (next && !seen.has(next)) { seen.add(next); queue.push(next) }
    }
  }
  return { files: written, bytes: total }
}

async function archiveProject(project, tmpRoot, maxBytes) {
  const uri = String(project.generativeUri ?? '')
  if (uri.startsWith('onchfs://')) return archiveOnchfsProject(project, tmpRoot, maxBytes)
  if (!uri.startsWith('ipfs://')) return { skipped: `unsupported scheme: ${uri.split(':')[0]}` }
  const cid = uri.slice(7).split('/')[0]

  const got = await fetchTar(cid, maxBytes)
  if (got.tooBig) return { skipped: `over size cap (>${(maxBytes / 1024 / 1024).toFixed(0)} MB)` }

  const staging = join(tmpRoot, `p${project.id}`)
  await rm(staging, { recursive: true, force: true })
  await mkdir(staging, { recursive: true })
  const tarPath = join(staging, 'g.tar')
  await writeFile(tarPath, got.buffer)

  assertSafeTar(tarPath)
  execFileSync('tar', ['--force-local', '-xf', tarPath, '-C', staging], { stdio: 'ignore' })
  await unlink(tarPath)

  // A directory generator unpacks to a single folder named by its CID; lift
  // its contents up so paths are stable and do not embed the CID.
  const top = await readdir(staging, { withFileTypes: true })
  let source = staging
  if (top.length === 1 && top[0].isDirectory()) source = join(staging, top[0].name)

  const strippedVcs = await stripVcsMetadata(source)

  const entry = await findEntryPoint(source)
  if (!entry) return { skipped: 'no HTML entry point found' }

  const dest = join(OUT, String(project.id))
  await rm(dest, { recursive: true, force: true })
  await mkdir(dest, { recursive: true })
  await cp(source, dest, { recursive: true })
  await rm(staging, { recursive: true, force: true })

  return { cid, entry, bytes: await dirSize(dest), strippedVcs }
}

async function archiveOnchfsProject(project, tmpRoot, maxBytes) {
  const hash = String(project.generativeUri).slice('onchfs://'.length).split('/')[0]
  if (!/^[0-9a-f]{64}$/i.test(hash)) return { skipped: `malformed onchfs hash: ${hash}` }

  const staging = join(tmpRoot, `p${project.id}`)
  await rm(staging, { recursive: true, force: true })
  await mkdir(staging, { recursive: true })

  const got = await fetchOnchfs(hash, staging, maxBytes)
  if (got.tooBig) {
    await rm(staging, { recursive: true, force: true })
    return { skipped: `over size cap (>${(maxBytes / 1024 / 1024).toFixed(0)} MB)` }
  }

  const strippedVcs = await stripVcsMetadata(staging)
  const dest = join(OUT, String(project.id))
  await rm(dest, { recursive: true, force: true })
  await mkdir(dest, { recursive: true })
  await cp(staging, dest, { recursive: true })
  await rm(staging, { recursive: true, force: true })

  return { cid: hash, entry: 'index.html', bytes: await dirSize(dest), strippedVcs, files: got.files.length }
}

// -------------------------------------------------------------------- main

function commitProgress(label) {
  try {
    execFileSync('git', ['add', OUT], { stdio: 'ignore' })
    const staged = execFileSync('git', ['diff', '--cached', '--name-only']).toString().trim()
    if (!staged) return
    execFileSync('git', ['commit', '-m', `data: archive generator code (${label})\n\nCo-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`], { stdio: 'ignore' })
    console.log(`[git] ${label}: committed`)
  } catch (err) {
    console.error(`[git] ${label}: commit FAILED: ${err.message}`)
  }
}

const mb = (b) => `${(b / 1024 / 1024).toFixed(1)} MB`

async function main() {
  const preserve = await loadJson(PRESERVE_FILE, null)
  if (!preserve) throw new Error(`${PRESERVE_FILE} missing`)
  const rules = preserve.rules ?? {}
  const maxProjectBytes = (rules.maxProjectSizeMB || 0) > 0 ? rules.maxProjectSizeMB * 1024 * 1024 : Infinity

  const projects = await loadCatalog()
  const volumes = await loadVolumes()
  if (volumes.size === 0) {
    console.warn('WARNING: no market data found — run snapshot-market.mjs first, or only requests and artists will be archived.')
  }
  // Optional: without it the artist rule still works, it just cannot see through a
  // collaboration contract to the people who made the piece.
  const collaborations = (await loadJson(COLLAB_FILE, null))?.byProject ?? {}
  if (!Object.keys(collaborations).length) {
    console.warn(`no ${COLLAB_FILE} — collaborative work by named artists will be skipped; run snapshot-collaborators.mjs`)
  }
  const list = buildPriorityList(projects, volumes, rules, preserve.projects ?? [], collaborations)

  console.log(`archive-generators: ${projects.length} projects in catalog, ${volumes.size} with market data`)
  console.log(`priority list: ${list.length} projects | budget ${mb(BUDGET_BYTES)} | per-project cap ${maxProjectBytes === Infinity ? 'none' : mb(maxProjectBytes)}\n`)

  if (DRY_RUN) {
    const onchfs = list.filter((x) => String(x.project.generativeUri).startsWith('onchfs://')).length
    for (const [i, x] of list.slice(0, 40).entries()) {
      console.log(`  ${String(i + 1).padStart(4)}. ${String(x.project.name).slice(0, 42).padEnd(42)} ${x.reason}`)
    }
    if (list.length > 40) console.log(`  … and ${list.length - 40} more`)
    console.log(`\n${onchfs} of these are onchfs:// (on-chain, skipped by this script)`)
    console.log('dry run — nothing downloaded')
    return
  }

  await mkdir(OUT, { recursive: true })
  const tmpRoot = join(OUT, '.staging')
  await mkdir(tmpRoot, { recursive: true })

  const manifestPath = join(OUT, 'manifest.json')
  const manifest = await loadJson(manifestPath, {})

  let used = 0
  for (const key of Object.keys(manifest)) used += manifest[key].bytes ?? 0

  const startTime = Date.now()
  let archived = 0
  let skipped = 0
  let failed = 0
  let sinceCommit = 0
  let budgetHit = false

  for (const { project, reason, uncapped } of list) {
    if (archived >= LIMIT) break
    if (Object.prototype.hasOwnProperty.call(manifest, String(project.id))) continue
    if (used >= BUDGET_BYTES) {
      budgetHit = true
      break
    }

    try {
      const result = await archiveProject(project, tmpRoot, uncapped ? Infinity : maxProjectBytes)
      if (result.skipped) {
        skipped++
        console.log(`  skip  ${String(project.name).slice(0, 38).padEnd(38)} ${result.skipped}`)
      } else {
        manifest[String(project.id)] = {
          slug: project.slug,
          name: project.name,
          cid: result.cid,
          entry: result.entry,
          bytes: result.bytes,
          reason,
        }
        used += result.bytes
        archived++
        sinceCommit++
        await atomicWrite(manifestPath, JSON.stringify(manifest, null, 2))
        const note = result.strippedVcs ? `  (stripped ${result.strippedVcs} VCS dir${result.strippedVcs > 1 ? 's' : ''})` : ''
        console.log(`  ok    ${String(project.name).slice(0, 38).padEnd(38)} ${String((result.bytes / 1024).toFixed(0) + ' KB').padStart(9)}  total ${mb(used)}${note}`)
      }
    } catch (err) {
      failed++
      console.error(`  FAIL  ${String(project.name).slice(0, 38).padEnd(38)} ${err.message}`)
    }

    if (DO_COMMIT && sinceCommit >= COMMIT_EVERY) {
      commitProgress(`${archived} projects, ${mb(used)}`)
      sinceCommit = 0
    }
    await sleep(DELAY_MS)
  }

  await rm(tmpRoot, { recursive: true, force: true })
  await atomicWrite(manifestPath, JSON.stringify(manifest, null, 2))

  const elapsed = Math.round((Date.now() - startTime) / 1000)
  console.log(`\n[FINAL] ${archived} archived, ${skipped} skipped, ${failed} failed | ${mb(used)} of ${mb(BUDGET_BYTES)} | ${elapsed}s`)
  console.log(`manifest: ${Object.keys(manifest).length} projects playable offline`)
  if (budgetHit) console.log('stopped: budget reached (raise with --budget MB)')
  if (DO_COMMIT && sinceCommit > 0) commitProgress(`final ${archived} projects, ${mb(used)}`)
}

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION (continuing):', err)
})

main().catch((err) => {
  console.error('FATAL:', err)
  process.exitCode = 1
})
