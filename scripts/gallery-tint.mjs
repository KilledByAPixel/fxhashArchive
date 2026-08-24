// What colour is a room's art, as one hue and a strength?
//
// A room's walls take a wash of the colour of the work hung in it — zancan's
// room green, Kim Asendorf's blue — and this is where that colour is decided.
// The build does it because only the build has the thumbnails; how far the wash
// is actually pushed is the client's call (see TINT_SOLO in src/gallery/scene.ts),
// so a palette tweak never costs an atlas rebuild.
//
// The naive method does not work. Averaging the pixels of a generative piece
// gives mud: measured over the real archive, zancan's mean is #b3bab0 — a grey
// that happens to lean green — and ertdfgcvb's is #555555, dead neutral. Fifty
// rooms of mud is not a palette.
//
// So hue is taken as a *circular* mean weighted by how much colour each pixel
// carries, which throws away the paper-white grounds and near-blacks that drag
// every average toward beige. That gives a second number for free: the length of
// the mean vector, which says how UNANIMOUS the hue is. One dominant colour
// scores near 1, a rainbow cancels out near 0. Strength follows it, so a room
// whose art has no agreed colour stays white without anyone special-casing it —
// which is how KilledByAPixel's 31 unrelated works score 0.11 and stay white.
//
// Coherence alone is not enough, though: work that is 99% greyscale with a few
// stray coloured pixels scores a perfect 1.0 on the handful that vote. That is
// ertdfgcvb exactly. Chroma — how much colour is present at all — gates it. A
// gate, not a dimmer: scaling linearly by chroma punished pale-but-definitely-
// green work (zancan, chroma 0.039) as hard as work with no colour in it at all
// (ertdfgcvb, chroma 0.000), so only the genuinely achromatic are silenced.

/** Below this chroma a room has no colour worth using and stays neutral. */
export const CHROMA_OFF = 0.01
/** At or above this chroma a room's hue counts at its full coherence. */
export const CHROMA_FULL = 0.06

/** Value channel only; hue and saturation as HSV. */
export function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d > 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return { h, s: max === 0 ? 0 : d / max, v: max }
}

export const newTintAcc = () => ({ cx: 0, cy: 0, w: 0, chroma: 0, n: 0 })

/**
 * Fold one image's pixels into an accumulator. `rgb` is raw, three bytes per
 * pixel, as sharp's `.raw()` hands it over with the alpha removed.
 */
export function addPixels(acc, rgb) {
  for (let i = 0; i + 2 < rgb.length; i += 3) {
    const { h, s, v } = rgbToHsv(rgb[i], rgb[i + 1], rgb[i + 2])
    // s² so a wash of pale colour cannot outvote a small area of real colour,
    // and × v so what is nearly black keeps quiet whatever its nominal hue.
    const w = s * s * v
    const rad = (h * Math.PI) / 180
    acc.cx += w * Math.cos(rad)
    acc.cy += w * Math.sin(rad)
    acc.w += w
    acc.chroma += s * v
    acc.n++
  }
}

const smoothstep = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/**
 * The room's colour: a hue in degrees and a strength in [0, 1], or null when
 * there is nothing to say — no pixels, or no colour in them. Null means "leave
 * this room the building's own white", which is a real answer and not a failure.
 */
export function tintOf(acc) {
  if (!acc.n || acc.w <= 0) return null
  let hue = (Math.atan2(acc.cy, acc.cx) * 180) / Math.PI
  if (hue < 0) hue += 360
  const coherence = Math.hypot(acc.cx, acc.cy) / acc.w
  // Round before the test, not after. Hues that cancel exactly leave a residue
  // of about 1e-17 — sin(π) is not 0 in floating point — which is greater than
  // zero, survives the guard, and then rounds to a strength of 0 anyway. The
  // room renders white either way, but it would be carrying a meaningless hue.
  const strength = Math.round(coherence * smoothstep(CHROMA_OFF, CHROMA_FULL, acc.chroma / acc.n) * 1000) / 1000
  if (strength <= 0) return null
  return { hue: Math.round(hue * 10) / 10, strength }
}
