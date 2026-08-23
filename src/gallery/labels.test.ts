import { test, expect } from 'vitest'
import { packLabels } from './labels'
import type { Sign } from './types'

const sign = (kind: Sign['kind'], w: number, h: number, i: number): Sign =>
  ({ text: `${kind} ${i}`, kind, x: 0, y: 1, z: 0, yaw: 0, w, h })

/** Roughly the real mix: 420 plaques, 38 room signs, 7 era signs, 2 title lines. */
const realistic = [
  ...Array.from({ length: 2 }, (_, i) => sign('title', 3, i ? 0.25 : 0.5, i)),
  ...Array.from({ length: 7 }, (_, i) => sign('era', 1.8, 0.5, i)),
  ...Array.from({ length: 38 }, (_, i) => sign('room', 2.4, 0.4, i)),
  ...Array.from({ length: 420 }, (_, i) => sign('plaque', 0.5, 0.12, i)),
]

const overlaps = (a: { x: number; y: number; w: number; h: number }, b: typeof a) =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h

test('every sign gets a rect inside the atlas, none overlapping, in input order', () => {
  for (const size of [4096, 2048]) {
    const { rects, uvs } = packLabels(realistic, size)
    expect(rects.length).toBe(realistic.length)
    rects.forEach((r, i) => {
      expect(r.x).toBeGreaterThanOrEqual(0)
      expect(r.y).toBeGreaterThanOrEqual(0)
      expect(r.x + r.w).toBeLessThanOrEqual(size)
      expect(r.y + r.h).toBeLessThanOrEqual(size)
      // aspect preserved: a 0.5 × 0.12 plaque is a 25:6 rect
      expect(r.w / r.h).toBeCloseTo(realistic[i].w / realistic[i].h, 1)
    })
    for (let i = 0; i < rects.length; i++)
      for (let j = i + 1; j < rects.length; j++) expect(overlaps(rects[i], rects[j])).toBe(false)
    // uvs address the same pixels, top row at v = 1
    expect(uvs[0]).toEqual({
      u0: rects[0].x / size, u1: (rects[0].x + rects[0].w) / size,
      v1: 1 - rects[0].y / size, v0: 1 - (rects[0].y + rects[0].h) / size,
    })
  }
})

test('a plaque is drawn with enough pixels to read', () => {
  const { rects } = packLabels(realistic, 4096)
  const plaque = rects[realistic.findIndex((s) => s.kind === 'plaque')]
  expect(plaque.h).toBeGreaterThanOrEqual(32)
})

test('an impossible load shrinks rather than overflowing', () => {
  const many = Array.from({ length: 5000 }, (_, i) => sign('plaque', 0.5, 0.12, i))
  const { rects, pxPerM } = packLabels(many, 2048)
  expect(rects.length).toBe(5000)
  for (const r of rects) expect(r.y + r.h).toBeLessThanOrEqual(2048)
  expect(pxPerM).toBeLessThan(200)
})
