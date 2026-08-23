import { test, expect } from 'vitest'
import { parseGalleryQuery } from './query'

test('reads a project id', () => {
  expect(parseGalleryQuery('?project=2969')).toEqual({ project: 2969 })
})

test('reads a room id, which may be an era or a tz address', () => {
  expect(parseGalleryQuery('?room=2022-q2')).toEqual({ room: '2022-q2' })
  expect(parseGalleryQuery('?room=tz1abc')).toEqual({ room: 'tz1abc' })
})

test('ignores garbage and empties rather than throwing', () => {
  expect(parseGalleryQuery('')).toEqual({})
  expect(parseGalleryQuery('?project=abc')).toEqual({})
  expect(parseGalleryQuery('?project=')).toEqual({})
  expect(parseGalleryQuery('?room=')).toEqual({})
  expect(parseGalleryQuery('?project=12&room=x')).toEqual({ project: 12, room: 'x' })
})
