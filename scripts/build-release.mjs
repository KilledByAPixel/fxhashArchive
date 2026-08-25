// Build the downloadable archive: the whole thing in one file.
//
// The site is the front door, but a site can be taken down as easily as fxhash
// was. This is the same archive as a single artifact somebody can keep on a disk:
// the built viewer, the full catalog, every seed, and the generator code for the
// projects that were archived. Unzip it, serve the folder, and it works with no
// internet, no IPFS and no Tezos.
//
// Built straight into the release folder rather than copied out of dist/, because
// copying ~50,000 files and a gigabyte on Windows costs minutes while a fresh
// build costs seconds — vite has to copy public/ either way.
//
// Usage:
//   node scripts/build-release.mjs [--version 0.1.0] [--keep-folder]

import { writeFile, rm, stat, mkdir } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { build } from 'vite'

const args = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : fallback
}

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const version = arg('version', pkg.version).replace(/^v/, '')
const name = `fxhash-archive-v${version}`
const OUT = 'release'
const folder = join(OUT, name)
const zip = join(OUT, `${name}.zip`)

/**
 * A zip writer that exists on the machines this runs on.
 *
 * Git Bash ships GNU tar, which cannot write zip at all; Windows ships bsdtar,
 * which can. CI runners have `zip`. Rather than assume, try each and say which one
 * was used, so a failure here is legible instead of a cryptic exit code.
 */
function writeZip() {
  const candidates = [
    { cmd: 'zip', args: ['-r', '-9', '-q', `${name}.zip`, name], cwd: OUT },
    { cmd: 'C:/Windows/System32/tar.exe', args: ['-a', '-cf', `${name}.zip`, name], cwd: OUT },
    { cmd: 'bsdtar', args: ['-a', '-cf', `${name}.zip`, name], cwd: OUT },
  ]
  for (const { cmd, args: cmdArgs, cwd } of candidates) {
    try {
      execFileSync(cmd, cmdArgs, { cwd, stdio: 'inherit' })
      return cmd
    } catch (err) {
      if (err.code === 'ENOENT') continue
      throw err
    }
  }
  throw new Error('no zip writer found (tried zip, Windows tar.exe, bsdtar)')
}

/**
 * The note that stops the download looking broken.
 *
 * Everything on the site is loaded with fetch(), which browsers refuse to do from
 * a file:// URL. So double-clicking index.html renders the shell and fails every
 * request — the one predictable way for somebody to conclude the archive is
 * damaged when it is intact. Say so first, before anything else.
 */
const README = `fxhash archive — v${version}

An unofficial archive of the art from fxhash, on Tezos, with a viewer for it.
https://github.com/KilledByAPixel/fxhashArchive


HOW TO OPEN IT

Do not open index.html directly. The viewer loads its data with fetch(), which
every browser blocks on file:// URLs, so opening the file straight from disk shows
an empty page that looks broken but is not.

Serve this folder over HTTP instead. Any one of these, run from inside it:

    python3 -m http.server 8000
    npx serve .
    php -S localhost:8000

Then open http://localhost:8000

Nothing here contacts the internet. Once it is served, it runs with no network at
all — no fxhash, no IPFS, no Tezos — except for the parts noted below.


WHAT IS IN IT

    index.html, assets/     the viewer
    data/tokens/            the catalog: 27,430 projects
    data/artists/           4,130 artists, and 18,855 on-chain usernames
    data/seeds/             every seed: 1,802,387 of them, with artifact URIs
    data/iterations/        which iterations belong to which project
    data/descriptions/      what the artists wrote about their own work
    data/collaborations.json  553 projects recovered from contract storage
    data/market/            volume and price, which existed only on fxhash's API
    data/generators/        the actual programs behind 420 projects
    data/thumbs/            one preview image per archived project

A seed is what turns a generator into one specific artwork. For the 420 projects
under data/generators/ that is everything needed to redraw any edition exactly,
offline and forever. For the rest, this holds the records and the seeds, and the
artwork itself still streams from IPFS — so those pieces need a connection, and
they depend on somebody continuing to pin the files.


RIGHTS

The viewer's code is MIT. The artwork is not: data/generators/ holds programs
written by the artists behind those 420 projects, kept here to preserve them, not
to relicense them. Rights to all of the artwork remain with the artists who made
it. Nothing here is endorsed by fxhash or by any artist, and nothing is for sale.

Any artist can have their generator removed by opening an issue on the repository.
`

console.log(`building ${name}\n`)
await rm(folder, { recursive: true, force: true })
await rm(zip, { force: true })
await mkdir(OUT, { recursive: true })

await build({ build: { outDir: folder, emptyOutDir: true }, logLevel: 'warn' })
await writeFile(join(folder, 'README.txt'), README)

console.log('\ncompressing…')
const writer = writeZip()

const { size } = await stat(zip)
console.log(`\n${zip}  ${(size / 1e6).toFixed(0)} MB  (via ${writer})`)

if (!args.includes('--keep-folder')) {
  await rm(folder, { recursive: true, force: true })
  console.log(`removed ${folder} (pass --keep-folder to keep it)`)
}
