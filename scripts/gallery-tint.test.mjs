import { test, expect } from 'vitest'
import { rgbToHsv, newTintAcc, addPixels, tintOf, CHROMA_OFF } from './gallery-tint.mjs'

/** A raw RGB buffer: each `[r, g, b]` repeated `n` times, concatenated. */
const pixels = (...runs) => Uint8Array.from(runs.flatMap(([rgb, n]) => Array.from({ length: n * 3 }, (_, i) => rgb[i % 3])))

const tint = (...runs) => {
  const acc = newTintAcc()
  addPixels(acc, pixels(...runs))
  return tintOf(acc)
}

const WHITE = [255, 255, 255]
const GREY = [128, 128, 128]
/** Pale green — the shape of zancan's work: mostly ground, a little green line. */
const PALE_GREEN = [180, 220, 180]

test('rgbToHsv puts the primaries where they belong', () => {
  expect(rgbToHsv(255, 0, 0)).toMatchObject({ h: 0, s: 1, v: 1 })
  expect(rgbToHsv(0, 255, 0).h).toBe(120)
  expect(rgbToHsv(0, 0, 255).h).toBe(240)
  expect(rgbToHsv(128, 128, 128)).toMatchObject({ h: 0, s: 0, v: expect.closeTo(0.502, 3) })
  expect(rgbToHsv(0, 0, 0)).toMatchObject({ s: 0, v: 0 })
})

test('one saturated hue reads as that hue, near-unanimous', () => {
  const green = tint([[0, 200, 0], 100])
  expect(green.hue).toBeCloseTo(120, 0)
  expect(green.strength).toBeCloseTo(1, 2)
})

test('a room with no colour in it at all stays white', () => {
  expect(tint([GREY, 100])).toBeNull()
  expect(tint([WHITE, 50], [[0, 0, 0], 50])).toBeNull()
  expect(tintOf(newTintAcc())).toBeNull()
})

test('hues that cancel around the wheel leave the room white', () => {
  // Red against cyan: both saturated, so chroma is high and the gate is not what
  // silences this — the circular mean is. This is what keeps a room of unrelated
  // work (KilledByAPixel, 31 pieces, measured coherence 0.11) from taking a colour.
  expect(tint([[255, 0, 0], 100], [[0, 255, 255], 100])).toBeNull()
})

test('pale but consistent colour survives — chroma gates, it does not dim', () => {
  // Three parts ground to one part pale green is chroma ≈ 0.039, which is what
  // zancan actually measures. Linear chroma scaling would have crushed him to
  // nearly nothing; the smoothstep gate leaves him clearly green.
  const zancanish = tint([WHITE, 300], [PALE_GREEN, 100])
  expect(zancanish.hue).toBeCloseTo(120, 0)
  expect(zancanish.strength).toBeGreaterThan(0.5)
})

test('a few stray pixels in achromatic work do not colour the room', () => {
  // ertdfgcvb: near-greyscale work whose handful of magenta pixels voted
  // unopposed and scored a perfect coherence of 1.000. Chroma is the check.
  const strays = tint([GREY, 999], [[255, 0, 255], 1])
  expect(strays).toBeNull()
})

test('the chroma gate opens between CHROMA_OFF and full', () => {
  // Just under the floor: silent. Well over it: speaking at close to full voice.
  const acc = newTintAcc()
  addPixels(acc, pixels([[0, 200, 0], 1], [GREY, 400]))
  expect(acc.chroma / acc.n).toBeLessThan(CHROMA_OFF)
  expect(tintOf(acc)).toBeNull()
  expect(tint([[0, 200, 0], 50], [GREY, 50]).strength).toBeGreaterThan(0.9)
})

test('hue and strength are rounded to something a JSON file can hold', () => {
  const t = tint([[0, 200, 0], 100])
  expect(t.hue).toBe(Math.round(t.hue * 10) / 10)
  expect(t.strength).toBe(Math.round(t.strength * 1000) / 1000)
  expect(t.strength).toBeLessThanOrEqual(1)
})
