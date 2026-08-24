// The pool of light a museum lamp throws on the wall around a picture.
//
// A real spotlight per painting would be four hundred lights, and every one of
// them a set of uniforms in every wall shader — three.js forward-renders, so that
// is the shader melting, not a stylistic choice. What a visitor actually sees of
// a picture light is the soft bright patch on the wall behind the frame, and
// that is a texture: one radial falloff, drawn once, stamped behind every
// painting as an additive quad, all of them one mesh and one draw call.
//
// The texture is computed rather than drawn on a canvas so it exists wherever
// three does — including jsdom, where there is no 2-D context and the labels
// therefore go missing.

import { DataTexture, LinearFilter, RGBAFormat, SRGBColorSpace } from 'three'

/** Wider and taller than the 1.32 m frame, so the frame sits inside the light. */
export const POOL_W = 2.4
export const POOL_H = 3.0
/** Bright enough to read as a lamp on a white wall; Frank found 0.35 dim. */
export const POOL_OPACITY = 0.85
/** Warm — tungsten, not daylight. */
export const POOL_COLOR = 0xffe9c8
/** How far behind the painting plane the pool sits: past the frame, short of the wall. */
export const POOL_BACK = 0.015
/** Inside this fraction of the radius the pool is fully bright. */
const CORE = 0.1

/** White with a radial alpha: opaque at the centre, gone at the edge. */
export function makePoolTexture(size = 64): DataTexture {
  const data = new Uint8Array(size * size * 4)
  const c = (size - 1) / 2
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const r = Math.min(1, Math.hypot((x - c) / c, (y - c) / c))
      const a = Math.max(0, Math.min(1, (1 - r) / (1 - CORE))) ** 2
      const i = (y * size + x) * 4
      data[i] = 255
      data[i + 1] = 255
      data[i + 2] = 255
      data[i + 3] = Math.round(a * 255)
    }
  }
  const texture = new DataTexture(data, size, size, RGBAFormat)
  texture.magFilter = LinearFilter
  texture.minFilter = LinearFilter
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true
  return texture
}
