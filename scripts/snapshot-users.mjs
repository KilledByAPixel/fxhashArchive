// Capture every fxhash username from the on-chain user registry.
//
// fxhash's own API is gone, so the only names this repo held came from the artists
// index — 5,407 people, all of whom happened to mint a project. Everyone else is a
// bare tz1 address: collaborators on a shared piece who never minted solo, and the
// minter shown on every iteration page.
//
// Those names were never only in fxhash's database. The "FXHASH User Registery"
// contract holds a `users_name` bigmap, address -> hex-encoded UTF-8 name, 19,112
// entries. It is on chain, so it cannot be lost — but it can stop being *reachable*
// the day TzKT goes, and one 1 MB file here removes that dependency for good.
//
// Usage:
//   node scripts/snapshot-users.mjs [--out FILE]

import { writeFile } from 'node:fs/promises'

const TZKT = 'https://api.tzkt.io/v1'
/** FXHASH User Registery. `users_name` is its address -> name bigmap. */
const USER_REGISTRY = 'KT1Ezht4PDKZri7aVppVGT4Jkw39sesaFnww'
const NAME_MAP_PATH = 'users_name'
const OUT_FILE = 'public/data/users.json'
const PAGE = 1000

const getArg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : def
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function getJson(url, attempts = 4) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { headers: { accept: 'application/json' } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (err) {
      if (i === attempts - 1) throw err
      await sleep(500 * (i + 1))
    }
  }
}

/**
 * Names are stored as raw bytes, so a hex string is what comes back. Anything that
 * does not decode to valid, printable UTF-8 is dropped rather than guessed at — a
 * mangled name is worse than an address, because an address is at least correct.
 */
function decodeName(hex) {
  if (typeof hex !== 'string' || !/^[0-9a-fA-F]*$/.test(hex) || hex.length % 2) return null
  const buf = Buffer.from(hex, 'hex')
  const text = buf.toString('utf8')
  if (Buffer.from(text, 'utf8').compare(buf) !== 0) return null
  const trimmed = text.trim()
  // Reject control characters (a mojibake artefact), but nothing else: fxhash names
  // legitimately contain spaces, punctuation, emoji and non-Latin scripts.
  const control = (ch) => { const c = ch.codePointAt(0); return c < 0x20 || c === 0x7f }
  if (!trimmed || [...trimmed].some(control)) return null
  return trimmed
}

const maps = await getJson(`${TZKT}/contracts/${USER_REGISTRY}/bigmaps`)
const nameMap = maps.find((m) => m.path === NAME_MAP_PATH)
if (!nameMap) throw new Error(`no ${NAME_MAP_PATH} bigmap on ${USER_REGISTRY}`)
console.log(`${NAME_MAP_PATH} bigmap ${nameMap.ptr}: ${nameMap.activeKeys} active keys`)

const names = {}
let offset = 0
let undecodable = 0
for (;;) {
  const page = await getJson(
    `${TZKT}/bigmaps/${nameMap.ptr}/keys?active=true&limit=${PAGE}&offset=${offset}&select=key,value`,
  )
  if (!page.length) break
  for (const row of page) {
    const name = decodeName(row.value)
    if (name) names[row.key] = name
    else undecodable++
  }
  offset += page.length
  console.log(`  ${offset}/${nameMap.activeKeys}…`)
  if (page.length < PAGE) break
  await sleep(120)
}

const count = Object.keys(names).length
await writeFile(
  getArg('out', OUT_FILE),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      note:
        'fxhash usernames, read from the on-chain FXHASH User Registery ' +
        `(${USER_REGISTRY}, ${NAME_MAP_PATH} bigmap) via TzKT. Address -> display name.`,
      count,
      names,
    },
    null,
    2,
  ) + '\n',
)
console.log(`\n${count} names -> ${getArg('out', OUT_FILE)}`)
if (undecodable) console.log(`${undecodable} entries dropped: not decodable as printable UTF-8`)
