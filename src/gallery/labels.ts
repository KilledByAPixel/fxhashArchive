// The signs — lobby title, era names, room names, and a plaque under every
// painting — are text, and text on a wall is a texture. There are about 470
// strings, so they are drawn once into one canvas at load and the signs become
// one quad mesh with UVs into it, the same trick as the painting atlases but
// built in the browser because the text is in the JSON and a font is here.

import { CanvasTexture, SRGBColorSpace } from 'three'
import type { Sign } from './types'
import type { TileUv } from './geometry'

export interface PixelRect { x: number; y: number; w: number; h: number }

/**
 * Pixels per metre of sign height at a 4096 atlas. The big signs — names over
 * doors, eras on lintels, 0.8 m tall — get 160 px, which is plenty from where
 * they are read; plaques are read from a foot away and get twice that.
 */
const BASE_PX_PER_M = 200
const scaleOf = (sign: Sign) => (sign.kind === 'plaque' ? 2 : 1)
const PAD = 2

/**
 * Shelf-pack the signs, tallest first, at the largest scale that fits. Rects
 * come back in the signs' own order. If even the first attempt would overflow —
 * it cannot with the real archive, but a future one is not this one — the scale
 * drops by a fifth and it tries again, so the worst outcome is smaller text.
 */
export function packLabels(signs: Sign[], size: number): { rects: PixelRect[]; uvs: TileUv[]; pxPerM: number } {
  // A name hangs above the door and again inside the room: identical signs
  // share one drawing, so the atlas holds half as many.
  const keyOf = (s: Sign) => `${s.kind}|${s.w}|${s.h}|${s.text}`
  const unique: Sign[] = []
  const slot = new Map<string, number>()
  const index = signs.map((s) => {
    const k = keyOf(s)
    if (!slot.has(k)) { slot.set(k, unique.length); unique.push(s) }
    return slot.get(k)!
  })
  let pxPerM = (BASE_PX_PER_M * size) / 4096
  for (;;) {
    const packed = shelfPack(unique, size, pxPerM)
    if (packed) {
      const rects = index.map((i) => packed[i])
      const uvs = rects.map((r) => ({
        u0: r.x / size, u1: (r.x + r.w) / size, v1: 1 - r.y / size, v0: 1 - (r.y + r.h) / size,
      }))
      return { rects, uvs, pxPerM }
    }
    pxPerM *= 0.8
  }
}

function shelfPack(signs: Sign[], size: number, pxPerM: number): PixelRect[] | null {
  const order = signs.map((s, i) => i).sort((a, b) => signs[b].h - signs[a].h || a - b)
  const rects: PixelRect[] = new Array(signs.length)
  let x = 0
  let y = 0
  let shelf = 0
  for (const i of order) {
    const h = Math.ceil(signs[i].h * pxPerM * scaleOf(signs[i]))
    const w = Math.ceil(signs[i].w * pxPerM * scaleOf(signs[i]))
    if (w + PAD > size) return null
    if (x + w + PAD > size) { x = 0; y += shelf + PAD; shelf = 0 }
    if (y + h + PAD > size) return null
    rects[i] = { x, y, w, h }
    x += w + PAD
    shelf = Math.max(shelf, h)
  }
  return rects
}

/**
 * Draw the text. Returns null where there is no 2-D context (jsdom, a blocked
 * canvas) — the building then simply has no signs, which is not a failure.
 */
export function drawLabels(signs: Sign[], rects: PixelRect[], size: number): HTMLCanvasElement | null {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.clearRect(0, 0, size, size)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#d8d8d8'
  signs.forEach((s, i) => {
    const r = rects[i]
    const weight = s.kind === 'plaque' ? 'normal' : '600'
    let px = r.h * 0.6
    ctx.font = `${weight} ${px}px system-ui, sans-serif`
    const measured = ctx.measureText(s.text).width
    const room = r.w - r.h * 0.4
    if (measured > room) {
      px *= room / measured
      ctx.font = `${weight} ${px}px system-ui, sans-serif`
    }
    ctx.fillText(s.text, r.x + r.w / 2, r.y + r.h / 2)
  })
  return canvas
}

export function makeLabelTexture(signs: Sign[], size: number): { texture: CanvasTexture; uvs: TileUv[] } | null {
  const { rects, uvs } = packLabels(signs, size)
  const canvas = drawLabels(signs, rects, size)
  if (!canvas) return null
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return { texture, uvs }
}
