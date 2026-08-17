import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test, expect } from 'vitest'

/**
 * Conformance checks against the *real* committed snapshot in `public/data/`.
 *
 * Every other test in this project mocks the data layer, so until now nothing looked
 * at the bytes the site actually ships - bytes a bot regenerates every Monday. The
 * assertions are deliberately shape- and relation-based, never exact counts: a test
 * that fails on every legitimate refresh is a test that gets deleted.
 *
 * It lives in scripts/ rather than src/ because it reads the filesystem, and src/ is
 * typechecked without @types/node. Checks over the whole catalog collect violations
 * in plain JS and assert once at the end: a per-record `expect` across 1.8 M ids costs
 * more than reading the files does.
 */

const DATA = join(process.cwd(), 'public', 'data')

const read = (...parts) => JSON.parse(readFileSync(join(DATA, ...parts), 'utf8'))
const listing = (dir, re) => readdirSync(join(DATA, dir)).filter((f) => re.test(f)).sort()

const shardFiles = listing('tokens', /^index-\d{3}\.json$/)
const mapFiles = listing('iterations', /^map-\d{3}\.json$/)
const meta = read('meta.json')

/** First, middle and last - enough to catch a systemic defect without parsing 42 MB. */
const sampleOf = (xs) => [xs[0], xs[Math.floor(xs.length / 2)], xs[xs.length - 1]]

/** Only the first few violations are reported; the rest would just be noise. */
const firstFew = (xs) => xs.slice(0, 5)

/** Exactly the fields of LeanToken in src/lib/types.ts, sorted. */
const LEAN_TOKEN_KEYS = [
  'author', 'createdAt', 'displayUri', 'flag', 'generativeUri', 'id', 'iterationsCount',
  'mintOpensAt', 'name', 'slug', 'supply', 'tags', 'thumbnailUri',
].join(',')
const AUTHOR_KEYS = 'avatarUri,id,name'
const OBJKT_ID = /^FX\d-\d+$/

const keysOf = (o) => Object.keys(o).sort().join(',')
const isNullOr = (v, t) => v === null || typeof v === t

/** Everything wrong with one record, as readable strings. */
function tokenProblems(t) {
  const bad = []
  if (keysOf(t) !== LEAN_TOKEN_KEYS) bad.push(`keys are [${keysOf(t)}]`)
  if (typeof t.id !== 'number') bad.push('id is not a number')
  // Slug is not required to be non-empty: exactly one legacy project (id 358) really
  // does carry an empty slug in fxhash's own data, which only makes it unreachable at
  // /token/ - a curiosity of the archive, not something this viewer introduced.
  if (typeof t.slug !== 'string') bad.push('slug is not a string')
  if (typeof t.name !== 'string') bad.push('name is not a string')
  if (typeof t.flag !== 'string') bad.push('flag is not a string') // isVisible() reads this
  if (typeof t.supply !== 'number') bad.push('supply is not a number')
  if (typeof t.iterationsCount !== 'number') bad.push('iterationsCount is not a number')
  for (const f of ['createdAt', 'mintOpensAt', 'thumbnailUri', 'displayUri', 'generativeUri']) {
    if (!isNullOr(t[f], 'string')) bad.push(`${f} is neither string nor null`)
  }
  if (!Array.isArray(t.tags)) bad.push('tags is not an array')
  if (t.author !== null && keysOf(t.author) !== AUTHOR_KEYS) {
    bad.push(`author shape is [${keysOf(t.author)}]`)
  }
  return bad.map((b) => `${t.slug || `id ${t.id}`}: ${b}`)
}

test('meta.json carries exactly the four documented fields', () => {
  expect(Object.keys(meta).sort()).toEqual(['generatedAt', 'shardCount', 'shardSize', 'tokenCount'])
  expect(Number.isNaN(Date.parse(meta.generatedAt))).toBe(false)
  for (const n of [meta.tokenCount, meta.shardCount, meta.shardSize]) {
    expect(Number.isInteger(n)).toBe(true)
    expect(n).toBeGreaterThan(0)
  }
  expect(meta.shardCount).toBe(Math.ceil(meta.tokenCount / meta.shardSize))
})

test('shardCount agrees with the files on disk, and the iteration map mirrors them', () => {
  expect(shardFiles).toHaveLength(meta.shardCount)
  expect(shardFiles[0]).toBe('index-000.json') // zero-padded, zero-based, contiguous
  expect(shardFiles.at(-1)).toBe(`index-${String(meta.shardCount - 1).padStart(3, '0')}.json`)
  // loadIterationIds addresses an iteration map shard with the token shard's index.
  // NOTE: the weekly cron (snapshot.yml) only runs snapshot.mjs, never
  // snapshot-iterations.mjs, so shardCount can drift past a 1,000-token shard
  // boundary without map-*.json being regenerated to match. If this goes red after
  // an automated refresh, the fix is to run `npm run snapshot:iterations` by hand.
  expect(mapFiles).toHaveLength(meta.shardCount)
})

test('sampled shards hold LeanToken records and nothing else', () => {
  const problems = []
  for (const file of sampleOf(shardFiles)) {
    const shard = read('tokens', file)
    expect(Array.isArray(shard)).toBe(true)
    expect(shard.length).toBeGreaterThan(0)
    expect(shard.length).toBeLessThanOrEqual(meta.shardSize)
    for (const t of shard) problems.push(...tokenProblems(t).map((p) => `${file} ${p}`))
  }
  expect(firstFew(problems)).toEqual([])
})

test('every slug-index entry points at a shard that exists, and the right one', () => {
  const index = read('tokens', 'slug-index.json')
  const entries = Object.entries(index)
  expect(entries.length).toBeGreaterThan(0)

  const outOfRange = entries.filter(
    ([, i]) => !Number.isInteger(i) || i < 0 || i >= meta.shardCount,
  )
  expect(firstFew(outOfRange)).toEqual([])

  // findTokenBySlug loads only the shard named here, so a wrong index is a 404.
  const misfiled = []
  for (const file of sampleOf(shardFiles)) {
    const expected = Number(/index-(\d{3})\.json/.exec(file)[1])
    for (const t of read('tokens', file)) {
      if (index[t.slug] !== expected) misfiled.push(`${t.slug} -> ${index[t.slug]}, expected ${expected}`)
    }
  }
  expect(firstFew(misfiled)).toEqual([])
})

test('sampled iteration maps hold project ids mapped to FX-prefixed objkt ids', () => {
  const problems = []
  let sawSomeIds = false
  for (const file of sampleOf(mapFiles)) {
    const map = read('iterations', file)
    const entries = Object.entries(map)
    expect(entries.length).toBeGreaterThan(0)
    for (const [projectId, ids] of entries) {
      // Keyed by numeric project id as a string; values parsed by fetchIterationsByIds.
      if (!/^\d+$/.test(projectId)) problems.push(`${file}: key ${projectId} is not a project id`)
      if (!Array.isArray(ids)) { problems.push(`${file}: ${projectId} is not an array`); continue }
      for (const id of ids) if (!OBJKT_ID.test(id)) problems.push(`${file}: ${projectId} has id ${id}`)
      if (ids.length > 0) sawSomeIds = true
    }
  }
  expect(firstFew(problems)).toEqual([])
  expect(sawSomeIds).toBe(true)
})

test('tokens are ordered by mintOpensAt ascending across the whole catalog', () => {
  // BrowsePage's "Newest" sort is a plain .reverse() of this order - an invariant that
  // spans 28 files and lives nowhere in the code. Break it and the grid silently lies.
  const outOfOrder = []
  let previous = null
  let total = 0
  for (const file of shardFiles) {
    for (const t of read('tokens', file)) {
      total += 1
      if (t.mintOpensAt === null) continue
      if (previous !== null && t.mintOpensAt < previous) {
        outOfOrder.push(`${file}: ${t.slug} (${t.mintOpensAt}) sorts before its predecessor (${previous})`)
      }
      previous = t.mintOpensAt
    }
  }
  expect(firstFew(outOfOrder)).toEqual([])
  expect(total).toBe(meta.tokenCount)
})
