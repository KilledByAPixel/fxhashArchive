// Turning a hue derived from the art into a colour something can be painted.
//
// Two places need this and they want it at very different strengths. A wall is a
// background and takes a wash you would struggle to name; a vase is an object and
// can be properly coloured. Both are the same operation — keep the base colour's
// brightness, add the art's hue as saturation — so it lives here rather than
// being written out twice with two chances to drift.

import { Color } from 'three'
import type { Rgb } from './geometry'

/** A tint as the build derives it: scripts/gallery-tint.mjs. */
export interface Tint { hue: number; strength: number }

/**
 * A packed sRGB colour as three.js wants a vertex colour: linear, not sRGB.
 * `new Color(hex)` converts on the way in, and a `color` attribute is consumed
 * in the working space, so its channels are already the right ones to write.
 */
export const linear = (hex: number): Rgb => {
  const c = new Color(hex)
  return [c.r, c.g, c.b]
}

/** A colour's HSV value: its brightest channel, whichever that turns out to be. */
export const valueOf = (hex: number) => Math.max((hex >> 16) & 0xff, (hex >> 8) & 0xff, hex & 0xff) / 255

export function hsvToRgb255(h: number, s: number, v: number): [number, number, number] {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  const [r, g, b] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] :
    h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x]
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)]
}

/**
 * `base`, pushed toward `tint`'s hue by `sat` scaled down by how strongly the art
 * agreed on that hue. Keeps the base's own value, so what is painted gains a
 * colour and not a light level — a tinted wall must not read as brighter than a
 * white one standing next to it. No tint, or `sat` of 0, returns the base.
 */
export function washed(base: number, tint: Tint | undefined, sat: number): Rgb {
  if (!tint || sat <= 0) return linear(base)
  const [r, g, b] = hsvToRgb255(tint.hue, Math.min(1, tint.strength * sat), valueOf(base))
  return linear((r << 16) | (g << 8) | b)
}
