import { test, expect } from 'vitest'
import { packLabels, type PixelRect } from './labels'
import type { Sign } from './types'

const sign = (kind: Sign['kind'], w: number, h: number, i: number): Sign =>
  ({ text: `${kind} ${i}`, kind, x: 0, y: 1, z: 0, yaw: 0, w, h })

/**
 * The real mix, at the sizes the build actually emits: 550 signs, of which the
 * 420 plaques are the bulk of the atlas.
 *
 * Room names deliberately repeat — each hangs above its door and again inside the
 * room — because packLabels draws identical signs once, and a fixture with 102
 * distinct names would ask the packer for twice the room the building needs.
 */
const realistic = [
  sign('title', 4, 0.8, 0),
  sign('title', 4, 0.25, 1),
  ...Array.from({ length: 3 }, (_, i) => sign('title', 4, 0.4, i + 2)),
  ...Array.from({ length: 2 }, (_, i) => sign('title', 3.6, 0.4, i + 5)),
  ...Array.from({ length: 8 }, (_, i) => sign('panel', 7, 0.28, i)),
  // Seven era names on the wide lintels and one on a narrow pier — counted off
  // the built gallery rather than guessed, because five extra 5 m signs is enough
  // on its own to push the atlas into its retry and make this fixture lie.
  ...Array.from({ length: 7 }, (_, i) => sign('era', 5, 0.8, i)),
  sign('era', 1.8, 0.8, 7),
  ...Array.from({ length: 102 }, (_, i) => sign('room', 4.8, 0.8, i % 51)),
  ...Array.from({ length: 420 }, (_, i) => sign('plaque', 0.75, 0.18, i)),
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
      // Aspect preserved. Checked as a proportion, not an absolute difference:
      // rects are whole pixels, so on a 7 x 0.28 panel — a ratio of 25 — a single
      // pixel of rounding shifts it by 0.11, and an absolute tolerance of 0.05
      // could never hold however right the packer was.
      // Compared as a proportion, not an absolute difference: rects are whole
      // pixels, so on a 7 x 0.28 panel — a ratio of 25 — one pixel of rounding
      // moves it by 0.11, and an absolute tolerance of 0.05 could never hold.
      //
      // 5% is measured, not picked: the worst case in this fixture is 3.45%, and
      // it is that panel at the 2048 atlas. 0.28 * 100 comes to 28.000000000000004
      // in binary floating point, so Math.ceil in shelfPack yields 29 rather than
      // 28 and the rect is a pixel taller than it needs to be. Harmless — it costs
      // one row of atlas — but it is why the number here is not tighter.
      const want = realistic[i].w / realistic[i].h
      expect(Math.abs(r.w / r.h - want) / want).toBeLessThan(0.05)
    })
    // Two signs that read the same are drawn once and point at the same rect, so
    // an identical pair is a shared drawing rather than a collision. Every room
    // name in the building is one — it hangs above the door and again inside —
    // and the fixture has them, which the old one did not.
    let overlapping = 0
    let shared = 0
    const same = (a: PixelRect, b: PixelRect) => a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h
    for (let i = 0; i < rects.length; i++)
      for (let j = i + 1; j < rects.length; j++) {
        if (same(rects[i], rects[j])) { shared++; continue }
        if (overlaps(rects[i], rects[j])) overlapping++
      }
    expect(overlapping).toBe(0)
    expect(shared).toBe(51)   // the 51 room names, each hung twice
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

test('plaques are drawn at more than the scale of the big signs, so small text stays sharp', () => {
  // This was 2, when a plaque was 0.5 m wide and its text came out near 3 cm. The
  // plaques are half again as big now and the multiplier came down to match, so
  // what is worth pinning is that they still get *extra* density — the absolute
  // pixel count is checked separately, against the 48 px they used to have.
  const { rects } = packLabels([sign('room', 4.8, 0.8, 0), sign('plaque', 0.75, 0.18, 0)], 4096)
  const roomPxPerM = rects[0].h / 0.8
  const plaquePxPerM = rects[1].h / 0.18
  // Deliberately a band rather than the constant restated: what matters is that a
  // plaque still gets more texture per metre than a door sign, and no longer the
  // full 2x it needed when it was half the size.
  expect(plaquePxPerM / roomPxPerM).toBeGreaterThan(1)
  expect(plaquePxPerM / roomPxPerM).toBeLessThan(2)
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

// Frank: the plaques and the lobby title were too small to read. Both grew by
// half, which is most of the atlas's remaining room — the plaques are 420 of the
// 550 signs — so what used to be slack is now the thing to watch.

test('the real mix packs at full resolution, at both atlas sizes', () => {
  // packLabels silently retries a fifth smaller when it cannot fit, so an overflow
  // does not fail anything — it just quietly makes every sign in the building
  // blurrier. That is the regression this pins.
  for (const size of [4096, 2048]) {
    const { pxPerM, rects } = packLabels(realistic, size)
    expect(pxPerM).toBe((200 * size) / 4096)          // no retry happened
    const used = Math.max(...rects.map((r) => r.y + r.h))
    expect(used).toBeLessThanOrEqual(size)
  }
})

test('a plaque still gets more texture than its box would give it unaided', () => {
  // Plaques are read from closer than anything else, so they are drawn at extra
  // density. That density came down from 2 when they grew, and the check that it
  // did not come down too far is the pixel count, not the multiplier: a plaque's
  // box must still be worth at least the 48 px it had when it was 0.12 m at 2x.
  const { rects, pxPerM } = packLabels(realistic, 4096)
  const plaque = realistic.findIndex((s) => s.kind === 'plaque')
  expect(pxPerM).toBe(200)
  expect(rects[plaque].h).toBeGreaterThanOrEqual(48)
})
