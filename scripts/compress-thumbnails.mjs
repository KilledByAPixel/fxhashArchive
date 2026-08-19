// Recompress the stored preview images.
//
// The previews are 300x300, but 380 of the 420 arrived as PNG — a lossless format
// carrying photographic and noisy generative imagery, which is the worst case for
// it. They averaged 135 KB each and came to 52 MiB, on a site with a 1 GB ceiling
// that has already started shaping what can be archived.
//
// These are a convenience, not the preservation artifact: for an archived project
// the generator and its seed reproduce the image at any resolution, exactly. What
// they buy is a grid that still shows something when IPFS is unreachable. So they
// are worth keeping and not worth 52 MiB.
//
// WebP at quality 82, alpha preserved. A file is only replaced when the new one is
// actually smaller, so an already-efficient JPEG is left alone.
//
// Usage:
//   node scripts/compress-thumbnails.mjs [--quality N] [--dry-run]

import { readdir, readFile, writeFile, unlink, stat } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'
import sharp from 'sharp'

const DIR = 'public/data/thumbs'
const args = process.argv.slice(2)
const QUALITY = Number(args[args.indexOf('--quality') + 1]) || 82
const DRY = args.includes('--dry-run')

const files = (await readdir(DIR)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
console.log(`${files.length} previews in ${DIR}, target quality ${QUALITY}${DRY ? ' (dry run)' : ''}\n`)

let before = 0
let after = 0
let converted = 0
let kept = 0
let failed = 0

for (const f of files) {
  const path = join(DIR, f)
  const originalSize = (await stat(path)).size
  before += originalSize

  if (extname(f).toLowerCase() === '.webp') {
    after += originalSize
    kept++
    continue
  }

  let out
  try {
    out = await sharp(await readFile(path))
      // Alpha survives: some generators render on transparency, and flattening
      // them onto an assumed background would change the artwork's appearance.
      .webp({ quality: QUALITY, effort: 5 })
      .toBuffer()
  } catch (err) {
    console.log(`  fail  ${f}: ${err.message}`)
    after += originalSize
    failed++
    continue
  }

  // Only if it actually helps. A few of these are already tight JPEGs, and
  // re-encoding one of those would cost quality for nothing.
  if (out.length >= originalSize) {
    after += originalSize
    kept++
    continue
  }

  after += out.length
  converted++
  if (!DRY) {
    await writeFile(join(DIR, `${basename(f, extname(f))}.webp`), out)
    await unlink(path)
  }
}

const mb = (n) => (n / 1048576).toFixed(1)
console.log(`converted ${converted}, left alone ${kept}${failed ? `, failed ${failed}` : ''}`)
console.log(`${mb(before)} MiB -> ${mb(after)} MiB (saves ${mb(before - after)} MiB, ${(((before - after) / before) * 100).toFixed(0)}%)`)
if (!DRY) console.log('\nRe-run scripts/build-summary.mjs so summary.json points at the new filenames.')
