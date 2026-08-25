// scripts/gallery-inputs.mjs
// The I/O half of the gallery build: what buildGallery needs, read off disk. Separate
// from build-gallery.mjs so a test can run the layout over the real archive without
// importing a script whose top level does work.

import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Every catalog entry for an archived project, the collaboration credits, and a
 * map of project id → thumbnail path. The archived set is the manifest's keys —
 * the same source build-summary.mjs uses — so the gallery cannot disagree with the
 * grid's badges about what is archived.
 */
/** Kept in step with isVisible in src/lib/data.ts, which is what the browse grid uses. */
const HIDDEN_FLAGS = new Set(['MALICIOUS', 'HIDDEN', 'REPORTED', 'AUTO_DETECT_COPY'])

export async function readArchiveInputs(dataDir = 'public/data') {
  const manifest = JSON.parse(await readFile(join(dataDir, 'generators', 'manifest.json'), 'utf8'))
  const archived = new Set(Object.keys(manifest).map(Number))

  const shards = (await readdir(join(dataDir, 'tokens')))
    .filter((f) => /^index-\d+\.json$/.test(f))
    .sort()
  const tokens = []
  // What the archive covers as a whole, tallied as the shards go past.
  //
  // The gallery hangs the 420 projects whose code is archived, and every year it
  // quoted came from those 420 — which made the lobby read as though fxhash
  // stopped in 2024. It did not: it ran to July 2025, and the catalogue records
  // all of it. Counted the way the browse grid counts, flagged projects excluded,
  // so a visitor cannot read one number on the wall and a different one on the
  // site. This loop already visits every token, so it costs nothing.
  let catalogCount = 0
  let lo = Infinity
  let hi = -Infinity
  for (const f of shards) {
    for (const t of JSON.parse(await readFile(join(dataDir, 'tokens', f), 'utf8'))) {
      if (!HIDDEN_FLAGS.has(t.flag)) {
        catalogCount++
        const year = Number(String(t.createdAt ?? '').slice(0, 4))
        if (Number.isFinite(year) && year > 0) { lo = Math.min(lo, year); hi = Math.max(hi, year) }
      }
      if (archived.has(t.id)) tokens.push(t)
    }
  }
  const catalog = catalogCount && Number.isFinite(lo) ? { count: catalogCount, span: [lo, hi] } : null

  // The manifest and the catalog are captured separately, so a manifest id with no
  // matching token is possible (a project removed from the catalog after it was
  // archived, say) — silently dropping it means the gallery and the archived count
  // it feeds (scripts/build-summary.mjs) quietly disagree about what "archived" means.
  const found = new Set(tokens.map((t) => t.id))
  for (const id of archived) if (!found.has(id)) console.warn(`gallery: manifest has ${id} but no catalog entry for it; skipping`)

  const collaborations = await readFile(join(dataDir, 'collaborations.json'), 'utf8')
    .then((s) => JSON.parse(s).byProject ?? {})
    .catch(() => ({}))

  const thumbs = {}
  for (const f of await readdir(join(dataDir, 'thumbs')).catch(() => [])) {
    const m = f.match(/^(\d+)\.\w+$/)
    if (m) thumbs[m[1]] = join(dataDir, 'thumbs', f)
  }

  // Sales volume per project in tez, primary plus secondary, the same figure
  // build-summary ranks by. It decides which two-piece artists get a room.
  const volumes = new Map()
  for (const f of (await readdir(join(dataDir, 'market')).catch(() => [])).filter((f) => /^stats-\d+\.json$/.test(f))) {
    const stats = JSON.parse(await readFile(join(dataDir, 'market', f), 'utf8'))
    for (const [id, st] of Object.entries(stats)) volumes.set(Number(id), st ? ((st.pv ?? 0) + (st.sv ?? 0)) / 1e6 : 0)
  }

  // Each preview's pixel size, as archive-previews.mjs recorded it when it saved
  // the file. A thumbnail that script never replaced is fxhash's square crop, and
  // an absent entry means exactly that: hang it square.
  const log = await readFile(join(dataDir, 'thumbs', 'previews.json'), 'utf8').then(JSON.parse).catch(() => ({}))
  const sizes = new Map(Object.entries(log).map(([id, v]) => [Number(id), { w: v.w, h: v.h }]))

  // What fxhash ran each project's preview with, as snapshot-previews.mjs captured
  // it — the query the gallery opens a painting on, so the piece matches the wall.
  // Only the archived projects are looked up; a project the capture has nothing
  // for (the first metadata format) is simply absent.
  const previews = new Map()
  for (const f of (await readdir(join(dataDir, 'previews')).catch(() => [])).filter((f) => /^\d{4}\.json$/.test(f))) {
    const rows = JSON.parse(await readFile(join(dataDir, 'previews', f), 'utf8'))
    for (const [id, q] of Object.entries(rows)) if (found.has(Number(id)) && typeof q === 'string' && q) previews.set(Number(id), q)
  }

  return { tokens, collaborations, thumbs, volumes, sizes, previews, catalog }
}
