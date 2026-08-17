/**
 * Legacy (gentk v1 / "beta") artifacts seed their PRNG with a snippet inlined at the
 * top of the document:
 *
 *   let b58dec = (str) => str.split('').reduce(
 *     (p,c,i) => p + alphabet.indexOf(c) * (Math.pow(alphabet.length, str.length-i-1)), 0)
 *
 * With a 12-character chunk the top term is `Math.pow(58, 11)`. Its true value,
 * 24986644000165537792, is not representable as a double, and `Math.pow` is
 * explicitly implementation-approximated in the ECMAScript spec — engines may round
 * differently. One ULP of difference changes three of the four int32-coerced sfc32
 * seeds, so the piece renders as *completely different art* while looking perfectly
 * healthy. fxhash's remedy is to pin the exponentiation to the value the archive was
 * minted against, before the snippet parses.
 *
 * The patch is a no-op on engines that already return that value (V8 does today), so
 * it is safe everywhere and also guards against future engine drift.
 *
 * This module is deliberately pure — no DOM, no fetch — so the splice logic is
 * testable without a browser. Applying it is `IterationPage`'s job, and only for the
 * v1 contract: a v2 piece reads its seed from `window.location.search`, which a
 * `srcdoc` document does not have.
 */

/** Exactly fxhash's recommended legacy patch. */
export const LEGACY_PATCH_SCRIPT =
  '<script id="fxhash-legacy-patch">(function(){Math.pow = (a,b) => (a===58 && b===11) ? 24986644000165536000 : a**b;})();</script>'

/**
 * The v1 b58dec, tolerant of minification. v2's b58dec was rewritten to fold
 * iteratively (`p * alphabet.length + …`) and uses no `Math.pow` at all, so this is
 * exactly the fingerprint of a document with the bug — and specific enough that
 * ordinary `Math.pow(x, 2)` in artwork code does not trip it.
 */
const V1_SEED_POW = /Math\s*\.\s*pow\s*\(\s*alphabet\s*\.\s*length\s*,/

/** Opening `<head>` tag, with or without attributes, any casing. */
const HEAD_OPEN = /<head(\s[^>]*)?>/i

/** True only for a document carrying the buggy v1 fxhash seeding snippet. */
export function needsLegacyPatch(html: string): boolean {
  return V1_SEED_POW.test(html) && /\bfxhash\b/.test(html)
}

/** Attribute-context escaping. Artifact URIs come from attacker-influenceable metadata. */
function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Directory URL to use as the artifact's `<base href>`.
 *
 * Legacy artifacts are mostly *not* self-contained — they pull `./p5.min.js`,
 * `./sketch.js`, `./style.css`. Served from a string those relative URLs resolve
 * against nothing and the piece renders blank, so the base has to point back at the
 * gateway directory the document came from. Returns null for an unparseable URL.
 */
export function artifactBaseHref(url: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  let path = parsed.pathname
  if (!path.endsWith('/')) {
    const last = path.slice(path.lastIndexOf('/') + 1)
    // A trailing segment with a dot is a file (index.html); anything else is the
    // directory itself, which the gateway would have redirected to with a slash.
    path = last.includes('.') ? path.slice(0, path.lastIndexOf('/') + 1) : path + '/'
  }
  return parsed.origin + path
}

/**
 * Splice `<base>` and the legacy patch in immediately after the opening `<head>` tag.
 *
 * Position is the entire point: the seed is computed *during parsing*, long before
 * `DOMContentLoaded`, so the patch has to sit ahead of the snippet in the byte stream.
 * The rest of the document is preserved byte-for-byte. Returns null when there is no
 * `<head>` to splice after — the caller's signal to fall back to the direct URL.
 */
export function injectLegacyPatch(html: string, baseHref: string): string | null {
  const match = HEAD_OPEN.exec(html)
  if (!match) return null
  const at = match.index + match[0].length
  const injected = `<base href="${escapeAttr(baseHref)}">${LEGACY_PATCH_SCRIPT}`
  return html.slice(0, at) + injected + html.slice(at)
}
