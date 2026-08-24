import { test, expect } from 'vitest'
import { makePoolTexture, POOL_W, POOL_H } from './pools'

test('the pool texture is a soft radial falloff: opaque centre, transparent edge', () => {
  const t = makePoolTexture(64)
  expect(t.image.width).toBe(64)
  expect(t.image.height).toBe(64)
  const data = t.image.data as Uint8Array
  const alpha = (x: number, y: number) => data[(y * 64 + x) * 4 + 3]
  expect(alpha(32, 32)).toBe(255)
  expect(alpha(0, 0)).toBe(0)
  expect(alpha(63, 32)).toBe(0)
  // Falls off monotonically from the centre outward.
  for (let x = 32; x < 63; x++) expect(alpha(x + 1, 32)).toBeLessThanOrEqual(alpha(x, 32))
})

test('a pool is wider and taller than the frame it lights', () => {
  const frame = 1.2 + 2 * 0.06
  expect(POOL_W).toBeGreaterThan(frame)
  expect(POOL_H).toBeGreaterThan(frame)
})
