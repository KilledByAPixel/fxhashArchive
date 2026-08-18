import { test, expect } from 'vitest'
import { seededShuffle } from './shuffle'

const items = Array.from({ length: 50 }, (_, i) => i)

test('same seed gives the same order', () => {
  expect(seededShuffle(items, 123)).toEqual(seededShuffle(items, 123))
})

test('different seeds give different orders', () => {
  expect(seededShuffle(items, 1)).not.toEqual(seededShuffle(items, 2))
})

test('shuffling keeps every item exactly once', () => {
  const out = seededShuffle(items, 7)
  expect(out.length).toBe(items.length)
  expect([...out].sort((a, b) => a - b)).toEqual(items)
})

test('the input array is not mutated', () => {
  const input = [1, 2, 3, 4, 5]
  seededShuffle(input, 9)
  expect(input).toEqual([1, 2, 3, 4, 5])
})

test('empty input is handled', () => {
  expect(seededShuffle([], 1)).toEqual([])
})
