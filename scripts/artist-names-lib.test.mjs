import { test, expect } from 'vitest'
import { renameById } from './artist-names-lib.mjs'

const NAMES = { tz1alt: 'OGCrayon' }

test('renames an artist row', () => {
  const artists = [{ id: 'tz1alt', name: 'ALT null', tokenCount: 74 }, { id: 'tz1x', name: 'Bob', tokenCount: 1 }]
  expect(renameById(artists, NAMES)).toBe(1)
  expect(artists.map((a) => a.name)).toEqual(['OGCrayon', 'Bob'])
})

test('renames the author on a token without touching the project itself', () => {
  // A project has an `id` and a `name` too. Its id is a number and the map is keyed
  // by address, so a project called "ALT null" would still be safe.
  const tokens = [{ id: 12, name: 'ALT null', author: { id: 'tz1alt', name: 'ALT null' } }]
  expect(renameById(tokens, NAMES)).toBe(1)
  expect(tokens[0].name).toBe('ALT null')
  expect(tokens[0].author.name).toBe('OGCrayon')
})

test('renames a collaborator inside the collaborations record', () => {
  const collabs = {
    byProject: { 10971: { contract: 'KT1c', collaborators: [{ id: 'tz1alt', name: 'ALT null', share: 1 }] } },
    byArtist: { tz1alt: [10971] },
  }
  expect(renameById(collabs, NAMES)).toBe(1)
  expect(collabs.byProject[10971].collaborators[0].name).toBe('OGCrayon')
  // The credit itself is keyed by address and must survive untouched.
  expect(collabs.byArtist.tz1alt).toEqual([10971])
})

test('leaves every address it was not asked about alone', () => {
  const artists = [{ id: 'tz1x', name: 'Bob' }, { id: 'KT1c', name: null }]
  expect(renameById(artists, NAMES)).toBe(0)
  expect(artists).toEqual([{ id: 'tz1x', name: 'Bob' }, { id: 'KT1c', name: null }])
})

test('does not invent a name where the record carries none', () => {
  // byArtist entries and contract records have an id and no display name; adding one
  // would put a field there that no reader expects.
  const node = { id: 'tz1alt', share: 1 }
  expect(renameById(node, NAMES)).toBe(0)
  expect(node).toEqual({ id: 'tz1alt', share: 1 })
})

test('is idempotent: a second run changes nothing', () => {
  const artists = [{ id: 'tz1alt', name: 'ALT null' }]
  expect(renameById(artists, NAMES)).toBe(1)
  expect(renameById(artists, NAMES)).toBe(0)
})
