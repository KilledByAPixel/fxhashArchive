// Check the release asset is what it claims to be, before anybody downloads it.
//
// A broken archive is worse than a broken site. A site can be fixed in a minute
// and nobody keeps a copy of it; this is the copy people keep, and they find out
// it is wrong long after we could do anything about it. So the zip is opened,
// listed, and read back before it is attached to anything.
//
// Usage:
//   node scripts/verify-release.mjs [path/to.zip]

import { execFileSync } from 'node:child_process'
import { statSync, readFileSync, existsSync, readdirSync } from 'node:fs'

const zip =
  process.argv[2] ??
  (() => {
    const found = existsSync('release') && readdirSync('release').find((f) => f.endsWith('.zip'))
    if (!found) throw new Error('no zip in release/ — run npm run build:release first')
    return `release/${found}`
  })()

const root = zip.split(/[\\/]/).pop().replace(/\.zip$/, '')
if (!existsSync(zip)) throw new Error(`no such file: ${zip}`)

/**
 * A zip reader that exists here. Runners have `unzip`; Windows has bsdtar as
 * tar.exe and no unzip at all. Both can list and both can stream one member to
 * stdout, which is everything this needs.
 */
const readers = [
  { cmd: 'C:/Windows/System32/tar.exe', list: (z) => ['-tf', z], cat: (z, m) => ['-xOf', z, m] },
  { cmd: 'bsdtar', list: (z) => ['-tf', z], cat: (z, m) => ['-xOf', z, m] },
  { cmd: 'unzip', list: (z) => ['-Z1', z], cat: (z, m) => ['-p', z, m] },
]
const reader = readers.find((r) => {
  try {
    execFileSync(r.cmd, r.list(zip), { stdio: 'ignore', maxBuffer: 1 << 28 })
    return true
  } catch (err) {
    return err.code !== 'ENOENT'
  }
})
if (!reader) throw new Error('no zip reader found (tried Windows tar.exe, bsdtar, unzip)')

const run = (args, opts = {}) => execFileSync(reader.cmd, args, { maxBuffer: 1 << 28, ...opts })
const cat = (member, encoding) => run(reader.cat(zip, `${root}/${member}`), { encoding })

let failed = false
const check = (ok, label, detail) => {
  if (!ok) failed = true
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${label}${detail ? `  ${detail}` : ''}`)
}

console.log(`${zip}  ${(statSync(zip).size / 1e6).toFixed(0)} MB  (via ${reader.cmd})\n`)

// Windows tar.exe emits CRLF, so entries arrive with a trailing carriage return.
// Comparing those against clean strings fails every exact match while the files
// are perfectly present, which is exactly what it did the first time this ran.
const entries = run(reader.list(zip), { encoding: 'utf8' })
  .split('\n')
  .map((e) => e.replace(/\r$/, ''))
  .filter(Boolean)
const set = new Set(entries)
console.log(`${entries.length.toLocaleString()} entries`)

// One folder, or unzipping sprays thousands of files into whatever directory
// somebody happened to be standing in.
const strays = entries.filter((e) => !e.startsWith(`${root}/`))
check(strays.length === 0, `single top-level folder: ${root}/`, strays.slice(0, 3).join(' '))

for (const f of [
  'README.txt',
  'index.html',
  'favicon.png',
  'social.jpg',
  'live.html',
  'sandbox-check.html',
  'sandbox-check-frame.html',
  'data/summary.json',
  'data/generators/manifest.json',
  'data/collaborations.json',
  'data/users.json',
  'data/gallery.json',
  'data/gallery/rooms.json',
]) {
  check(set.has(`${root}/${f}`), f)
}

console.log()
const dirs = [
  'assets/',
  'data/generators/',
  'data/seeds/',
  'data/tokens/',
  'data/iterations/',
  'data/thumbs/',
  'data/descriptions/',
  'data/market/',
  'data/artists/',
  'data/gallery/',
]
for (const d of dirs) {
  const n = entries.filter((e) => e.startsWith(`${root}/${d}`)).length
  check(n > 0, d.padEnd(20), `${n.toLocaleString()} entries`)
}

// A listing proves the index, not the payload. Pull real bytes back out.
console.log()
for (const [inZip, onDisk] of [
  ['data/generators/manifest.json', 'public/data/generators/manifest.json'],
  ['data/summary.json', 'public/data/summary.json'],
  ['data/gallery.json', 'public/data/gallery.json'],
]) {
  if (!existsSync(onDisk)) {
    console.log(`skip  ${inZip} (no local copy to compare)`)
    continue
  }
  const a = cat(inZip)
  check(a.equals(readFileSync(onDisk)), `${inZip} round-trips`, `${a.length.toLocaleString()} bytes`)
}

// Not compared against dist/: the bundle name is content-hashed, so any source
// change makes the two differ while both are valid. What matters is that the HTML
// in the zip points at files that are also in the zip.
const html = cat('index.html', 'utf8')
const refs = [...html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)].map((m) => m[1])
const dangling = refs.filter((r) => !set.has(`${root}/${r}`))
check(dangling.length === 0, `index.html's ${refs.length} local references resolve`, dangling.join(' '))

// The one line that stops an intact archive looking broken.
check(cat('README.txt', 'utf8').includes('Do not open index.html directly'), 'README warns about file://')

console.log(failed ? '\nFAILED' : '\nall checks passed')
process.exit(failed ? 1 : 0)
