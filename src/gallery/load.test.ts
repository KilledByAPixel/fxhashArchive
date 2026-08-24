// src/gallery/load.test.ts
import { test, expect } from 'vitest'
import { chooseSmall, atlasUrl, chooseQuality } from './load'

test('phones and small-texture GPUs get the half-size atlases', () => {
  expect(chooseSmall(4096, 1080)).toBe(false)
  expect(chooseSmall(2048, 1080)).toBe(true)
  expect(chooseSmall(4096, 390)).toBe(true)
  expect(chooseSmall(8192, 800)).toBe(false)
})

test('atlas files are addressed under data/, like every other file the site loads', () => {
  expect(atlasUrl('gallery/atlas-0.webp').endsWith('data/gallery/atlas-0.webp')).toBe(true)
})

test('quality: phones and small GPUs get the plain renderer; desktops get post-processing', () => {
  expect(chooseQuality(true, 8192)).toBe('low')
  expect(chooseQuality(false, 2048)).toBe('low')
  expect(chooseQuality(false, 8192)).toBe('high')
})
