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
    let overlapping = 0
    for (let i = 0; i < rects.length; i++)
      for (let j = i + 1; j < rects.length; j++) if (overlaps(rects[i], rects[j])) overlapping++
    expect(overlapping).toBe(0)
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

test('identical signs share one rect, so a name above a door and inside its room costs one drawing', () => {
  const twice = [sign('room', 4.8, 0.8, 1), sign('room', 4.8, 0.8, 1), sign('room', 4.8, 0.8, 2)]
  const { rects } = packLabels(twice, 2048)
  expect(rects[0]).toEqual(rects[1])
  expect(rects[0]).not.toEqual(rects[2])
})

test('plaques are drawn at twice the scale of the big signs, so small text stays sharp', () => {
  const { rects } = packLabels([sign('room', 4.8, 0.8, 0), sign('plaque', 0.5, 0.12, 0)], 4096)
  const roomPxPerM = rects[0].h / 0.8
  const plaquePxPerM = rects[1].h / 0.12
  expect(plaquePxPerM / roomPxPerM).toBeCloseTo(2, 1)
})

// Frank, round six: "almost white on a white wall — basically unreadable". The
// text colour was chosen when the walls were near-black; the museum is now
// gallery-white, and a sign has to be read from across a corridor.
import { TEXT } from './labels'
import { WALL } from './scene'

/** WCAG relative luminance of a 0xRRGGBB colour. */
const luminance = (hex: number) => {
  const channel = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  const [r, g, b] = [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255].map((v) => channel(v / 255))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a: number, b: number) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (hi + 0.05) / (lo + 0.05)
}

test('sign text reads against the wall it hangs on', () => {
  // 4.5:1 is the AA threshold for body text; #d8d8d8 on this wall was 1.1:1.
  expect(contrast(TEXT, WALL)).toBeGreaterThanOrEqual(4.5)
  expect(luminance(TEXT)).toBeLessThan(luminance(WALL))   // dark on light, as a gallery prints its labels
})
