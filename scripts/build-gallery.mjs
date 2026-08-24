// scripts/build-gallery.mjs
// Generate the walkable gallery: public/data/gallery.json and the thumbnail atlases.
//
// The layout is decided here, once, rather than in the browser, so it can be tested
// (scripts/gallery-lib.test.mjs) and so the client ships ~40 KB of positions instead
// of layout code plus the 17 MB catalog it would need to run it. The atlases pack
// every archived project's preview into two 4096² images — 225 tiles each — so all
// the paintings in the building draw in two calls; a half-size pair serves phones.
//
// Rerun after any change to the archived set, exactly like `npm run summary`.
//
// Usage: node scripts/build-gallery.mjs

import { mkdir, writeFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'
import { buildGallery, tileRect, ATLAS, ATLAS_SMALL, TILES_PER_ATLAS } from './gallery-lib.mjs'
import { readArchiveInputs } from './gallery-inputs.mjs'

const DATA = 'public/data'
const OUT_DIR = join(DATA, 'gallery')
const QUALITY = 82   // matches compress-thumbnails.mjs

/**
 * One tile, gutter included. The preview is fitted on black like the grid does
 * (`object-fit: contain` on #000), alpha flattened the same way. The gutter is the
 * tile's own edge pixels copied outward, so when the GPU samples a distant mipmap
 * it blends a painting with itself and not with its neighbour.
 */
async function tileImage(path, atlas) {
  const base = path
    ? sharp(path).resize(atlas.tile, atlas.tile, { fit: 'contain', background: '#000' }).flatten({ background: '#000' })
    : sharp({ create: { width: atlas.tile, height: atlas.tile, channels: 3, background: '#222' } })
  return base
    .extend({ top: atlas.gutter, bottom: atlas.gutter, left: atlas.gutter, right: atlas.gutter, extendWith: 'copy' })
    .png()
    .toBuffer()
}

async function writeAtlas(file, paintings, thumbs, atlas) {
  const composites = []
  for (const p of paintings) {
    const r = tileRect(p.tile, atlas)
    composites.push({
      input: await tileImage(thumbs[p.project] ?? null, atlas),
      left: r.x - atlas.gutter,
      top: r.y - atlas.gutter,
    })
  }
  await sharp({ create: { width: atlas.size, height: atlas.size, channels: 3, background: '#000' } })
    .composite(composites)
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(file)
  return (await stat(file)).size
}

async function main() {
  const { tokens, collaborations, thumbs } = await readArchiveInputs(DATA)
  const gallery = buildGallery({ tokens, collaborations, generatedAt: new Date().toISOString() })

  for (const p of gallery.paintings) {
    if (!thumbs[p.project]) console.warn(`no thumbnail for ${p.project} (${p.name}); hanging a blank tile`)
  }

  await mkdir(OUT_DIR, { recursive: true })
  let bytes = 0
  for (let f = 0; f < gallery.atlas.files.length; f++) {
    const mine = gallery.paintings.filter((p) => Math.floor(p.tile / TILES_PER_ATLAS) === f)
    const large = join(DATA, gallery.atlas.files[f])
    const small = join(DATA, gallery.atlas.small[f])
    bytes += await writeAtlas(large, mine, thumbs, ATLAS)
    bytes += await writeAtlas(small, mine, thumbs, ATLAS_SMALL)
    console.log(`${large}: ${mine.length} tiles`)
  }

  const json = JSON.stringify(gallery)
  await writeFile(join(DATA, 'gallery.json'), json)
  bytes += Buffer.byteLength(json)

  // ArtistPage only needs to know whether *an* artist has a solo room — not the
  // 40 KB building it lives in — so that one boolean gets its own tiny file rather
  // than making every artist-page visit fetch the whole gallery.json for it.
  const soloIds = gallery.rooms.filter((r) => r.kind === 'solo').map((r) => r.id).sort()
  const roomsJson = JSON.stringify({ solo: soloIds })
  await writeFile(join(OUT_DIR, 'rooms.json'), roomsJson)
  bytes += Buffer.byteLength(roomsJson)

  const halls = gallery.rooms.filter((r) => r.kind === 'hall')
  console.log(
    `${gallery.counts.paintings} paintings, ${gallery.counts.soloRooms} solo rooms, ` +
      `${halls.length} halls (longest ${Math.max(...halls.map((h) => h.rect.d))} m), ` +
      `${gallery.walls.length} wall segments, ${gallery.signs.length} signs`,
  )
  console.log(`wrote ${(bytes / 1048576).toFixed(1)} MiB: ${DATA}/gallery.json + ${OUT_DIR}/`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
