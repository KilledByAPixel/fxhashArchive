import { test, expect } from 'vitest'
import { ERAS, eraOf, isCollab, creditOf, assignRooms, SOLO_MIN } from './gallery-lib.mjs'

const tok = (id, createdAt, author = { id: 'tz1a', name: 'Alice' }, extra = {}) => ({
  id, slug: `p${id}`, name: `P${id}`, flag: 'NONE', createdAt, author, ...extra,
})

test('eraOf buckets by year and quarter, sweeping the ends', () => {
  expect(eraOf('2021-11-03T12:26:02.000Z')).toBe('2021')
  expect(eraOf('2020-01-01T00:00:00.000Z')).toBe('2021')
  expect(eraOf('2022-01-01T00:00:00.000Z')).toBe('2022-q1')
  expect(eraOf('2022-03-31T23:59:59.000Z')).toBe('2022-q1')
  expect(eraOf('2022-04-01T00:00:00.000Z')).toBe('2022-q2')
  expect(eraOf('2022-12-31T00:00:00.000Z')).toBe('2022-q4')
  expect(eraOf('2023-03-31T00:00:00.000Z')).toBe('2023-q1')
  expect(eraOf('2023-04-01T00:00:00.000Z')).toBe('2023-on')
  expect(eraOf('2024-06-20T08:14:15.000Z')).toBe('2023-on')
})

test('every era id is one of the seven, in spine order', () => {
  expect(ERAS.map((e) => e.id)).toEqual([
    '2021', '2022-q1', '2022-q2', '2022-q3', '2022-q4', '2023-q1', '2023-on',
  ])
})

test('a KT1 author is a collaboration and is credited to every member', () => {
  const t = tok(7, '2022-05-01T00:00:00.000Z', { id: 'KT1abc', name: null })
  expect(isCollab(t)).toBe(true)
  expect(isCollab(tok(8, '2022-05-01T00:00:00.000Z'))).toBe(false)
  const collaborations = { '7': { collaborators: [{ id: 'tz1a', name: 'Alice' }, { id: 'tz1b', name: 'Bob' }] } }
  expect(creditOf(t, collaborations)).toBe('Alice and Bob')
  expect(creditOf(tok(8, '2022-05-01T00:00:00.000Z'), {})).toBe('Alice')
})

test('assignRooms gives a solo room at SOLO_MIN, halls to the rest, in date order', () => {
  const alice = { id: 'tz1a', name: 'Alice' }
  const charlie = { id: 'tz1c', name: 'Charlie' }
  const bob = { id: 'tz1b', name: 'Bob' }
  const tokens = [
    ...Array.from({ length: SOLO_MIN }, (_, i) => tok(10 + i, `2021-11-${String(10 + i).padStart(2, '0')}T00:00:00.000Z`, alice)),
    ...Array.from({ length: SOLO_MIN - 1 }, (_, i) => tok(20 + i, `2022-02-0${1 + i}T00:00:00.000Z`, charlie)),
    tok(30, '2021-12-01T00:00:00.000Z', { id: 'KT1abc', name: null }),
  ]
  const collaborations = { '30': { collaborators: [alice, bob] } }
  const { solo, halls, artistCount } = assignRooms(tokens, collaborations)
  expect(solo.map((a) => a.id)).toEqual(['tz1a'])
  expect(solo[0].projects.map((t) => t.id)).toEqual([10, 11, 12, 13, 14])
  expect(halls.get('2021').map((t) => t.id)).toEqual([30])          // the collab, never solo
  expect(halls.get('2022-q1').map((t) => t.id)).toEqual([20, 21, 22, 23])
  expect(halls.get('2022-q3')).toEqual([])                            // every era exists
  expect(artistCount).toBe(3)                                          // alice, bob (in collab), charlie
})

test('assignRooms orders solo artists by their earliest piece, ties by id', () => {
  const tokens = [
    ...[5, 6, 7, 8, 9].map((i) => tok(i, `2022-01-0${i - 4}T00:00:00.000Z`, { id: 'tz1late', name: 'Late' })),
    ...[1, 2, 3, 4, 10].map((i) => tok(i, '2021-11-20T00:00:00.000Z', { id: 'tz1early', name: 'Early' })),
  ]
  const { solo } = assignRooms(tokens, {})
  expect(solo.map((a) => a.id)).toEqual(['tz1early', 'tz1late'])
  expect(solo[0].projects.map((t) => t.id)).toEqual([1, 2, 3, 4, 10])
})

test('an artist with 5+ projects spanning multiple eras still gets a solo room with all projects', () => {
  const crossera = { id: 'tz1cross', name: 'CrossEra' }
  const tokens = [
    tok(1, '2021-11-15T00:00:00.000Z', crossera),
    tok(2, '2021-12-20T00:00:00.000Z', crossera),
    tok(3, '2022-02-10T00:00:00.000Z', crossera),
    tok(4, '2022-03-05T00:00:00.000Z', crossera),
    tok(5, '2023-08-01T00:00:00.000Z', crossera),
  ]
  const { solo, halls } = assignRooms(tokens, {})
  expect(solo.map((a) => a.id)).toEqual(['tz1cross'])
  expect(solo[0].projects.map((t) => t.id)).toEqual([1, 2, 3, 4, 5])
  // None of the projects appear in any hall
  expect(halls.get('2021').length).toBe(0)
  expect(halls.get('2022-q1').length).toBe(0)
  expect(halls.get('2022-q2').length).toBe(0)
  expect(halls.get('2023-on').length).toBe(0)
})
