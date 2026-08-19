// Probe the configured IPFS gateways the way a *browser* reaches them.
//
// This exists because of a failure that every other check missed. ipfs.io,
// dweb.link and gateway.pinata.cloud all answered Node and curl with 200 while
// answering a real browser with a Cloudflare challenge — 403, carrying
// `X-Frame-Options: SAMEORIGIN` on the challenge page. Images degraded quietly to a
// placeholder; the live artwork iframe said "refused to connect". Nothing in the
// test suite or the snapshot scripts could see it, because none of them look like
// Chrome.
//
// So this sends what Chrome sends, and checks the three things that actually
// decide whether an artwork renders:
//   1. does it answer 200,
//   2. is the body the real content (compared against the other gateways),
//   3. will a browser let us put it in an <iframe> — no X-Frame-Options, no CSP
//      frame-ancestors.
//
// Usage:  node scripts/check-gateways.mjs [--cid <cid>]
// Exits non-zero if any configured gateway fails, so it can gate a deploy.

import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'

/** A directory CID from the catalog; any generator would do. */
const DEFAULT_CID = 'QmbVXKkiuqjHgDgzmMf6811VuUWL3k9RJhokR8vZv1Phw1'

/** Chrome's headers for a top-level navigation inside a frame. */
const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Sec-Fetch-Dest': 'iframe',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'cross-site',
}

const TIMEOUT_MS = 30_000

function getArg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : fallback
}

/**
 * Read the lists out of the source rather than restating them. A checker with its
 * own copy is a checker that passes while the app is broken.
 *
 * There are two: the app's, and the Node scripts'. They are checked against each
 * other as well as probed, because drift is how this went wrong the first time —
 * the thumbnail archiver kept fetching through gateways the site had already
 * abandoned, and never complained, because Node is not browser-shaped.
 */
async function loadList(path, name) {
  const src = await readFile(new URL(path, import.meta.url), 'utf8')
  const block = src.match(new RegExp(`export const ${name} = \\[([\\s\\S]*?)\\n\\]`))
  if (!block) throw new Error(`could not find ${name} in ${path}`)
  // Only quoted URLs, so an apostrophe in a comment inside the array ("fxhash's
  // own gateway") cannot be mistaken for a string delimiter.
  const found = [...block[1].matchAll(/'(https?:\/\/[^']+)'/g)].map((m) => m[1])
  if (!found.length) throw new Error(`${name} parsed as empty — check the format in ${path}`)
  return found
}

async function loadGateways() {
  const app = await loadList('../src/lib/ipfs.ts', 'GATEWAYS')
  const scripts = await loadList('../scripts/archive-lib.mjs', 'GATEWAY_ORIGINS')
  const host = (u) => new URL(u).host
  const appHosts = app.map(host).sort()
  const scriptHosts = scripts.map(host).sort()
  if (appHosts.join() !== scriptHosts.join()) {
    console.log('MISMATCH: the app and the scripts do not use the same gateways.')
    console.log(`  src/lib/ipfs.ts:          ${appHosts.join(', ')}`)
    console.log(`  scripts/archive-lib.mjs:  ${scriptHosts.join(', ')}\n`)
    process.exitCode = 1
  }
  return app
}

async function probe(gateway, cid) {
  const url = `${gateway}${cid}/`
  const ac = new AbortController()
  const timer = setTimeout(() => ac.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { headers: BROWSER_HEADERS, signal: ac.signal, redirect: 'follow' })
    const body = Buffer.from(await res.arrayBuffer())
    const csp = res.headers.get('content-security-policy') ?? ''
    return {
      gateway,
      status: res.status,
      // Both are ways a response refuses to be framed, and either one is fatal here.
      xFrameOptions: res.headers.get('x-frame-options'),
      frameAncestors: /frame-ancestors/i.test(csp) ? csp.match(/frame-ancestors[^;]*/i)[0] : null,
      cors: res.headers.get('access-control-allow-origin'),
      server: res.headers.get('server'),
      bytes: body.length,
      digest: createHash('md5').update(body).digest('hex').slice(0, 12),
    }
  } catch (err) {
    return { gateway, status: 0, error: err.name === 'AbortError' ? 'timeout' : String(err.message ?? err) }
  } finally {
    clearTimeout(timer)
  }
}

const cid = getArg('cid', DEFAULT_CID)
const gateways = await loadGateways()
console.log(`Probing ${gateways.length} gateways as a browser, CID ${cid}\n`)

const results = []
for (const g of gateways) results.push(await probe(g, cid))

// The majority digest is the best available stand-in for "the real content": a
// gateway serving an error page or a challenge disagrees with everyone else.
const tally = new Map()
for (const r of results) if (r.digest) tally.set(r.digest, (tally.get(r.digest) ?? 0) + 1)
const [consensus] = [...tally.entries()].sort((a, b) => b[1] - a[1])[0] ?? []

let failures = 0
for (const r of results) {
  const problems = []
  if (r.error) problems.push(r.error)
  else {
    if (r.status !== 200) problems.push(`HTTP ${r.status}`)
    if (r.xFrameOptions) problems.push(`X-Frame-Options: ${r.xFrameOptions} (cannot be framed)`)
    if (r.frameAncestors) problems.push(`CSP ${r.frameAncestors} (cannot be framed)`)
    if (r.cors !== '*') problems.push(`CORS: ${r.cors ?? 'absent'} (breaks the legacy-patch fetch)`)
    if (consensus && r.digest !== consensus) problems.push(`content differs from the other gateways (${r.bytes} bytes)`)
  }
  if (problems.length) failures++
  console.log(`${problems.length ? 'FAIL' : ' ok '}  ${r.gateway}`)
  if (!r.error) console.log(`        ${r.status} · ${r.bytes} bytes · md5 ${r.digest} · server ${r.server ?? '?'}`)
  for (const p of problems) console.log(`        - ${p}`)
}

// One surviving gateway still renders every artwork, but it is a single point of
// failure and the chain below it is decoration — worth saying out loud.
const healthy = results.length - failures
console.log(`\n${healthy}/${results.length} gateways usable from a browser.`)
if (failures) {
  console.log('Replace the failing entries in src/lib/ipfs.ts (and scripts/archive-generators.mjs).')
  process.exitCode = 1
} else if (healthy < 2) {
  console.log('Only one gateway left — find another before it goes too.')
}
