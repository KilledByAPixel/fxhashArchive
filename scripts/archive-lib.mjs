// Pure helpers for the archiver, kept out of archive-generators.mjs so they can be
// tested. That script runs main() on import, so nothing inside it is reachable from
// a test — and resolveRef in particular decides what filenames a remote gateway can
// create on disk, which is not a thing to leave unexercised.

/**
 * The IPFS gateways the Node scripts fetch through.
 *
 * Kept here rather than in each script because they drifted: ipfs.io, dweb.link and
 * gateway.pinata.cloud went behind a Cloudflare challenge, the app and the generator
 * archiver were moved off them, and the thumbnail archiver was left pointing at all
 * three. It still worked — Node is not browser-shaped and gets a 200 where a visitor
 * gets 403 — which is exactly how a list rots without anyone noticing.
 *
 * `npm run check:gateways` probes this list and the app's together, and fails if the
 * two ever name different hosts.
 */
export const GATEWAY_ORIGINS = [
  'https://gateway.fxhash.xyz',
  'https://gateway.pinit.io',
  'https://ipfs.raribleuserdata.com',
]

/** The same gateways as path prefixes, for callers that just append a CID. */
export const GATEWAYS = GATEWAY_ORIGINS.map((o) => `${o}/ipfs/`)

/**
 * Every same-origin reference in an HTML or CSS document, as written.
 *
 * Attributes are read only from inside tags. Scanning the whole document for
 * `src=`/`href=` also matched assignments in inline scripts — a generator that
 * writes `window.location.href = …` had the archiver trying to fetch a fragment
 * of its own JavaScript as a filename.
 */
export function extractRefs(text, isCss = false) {
  const refs = new Set()
  const push = (r) => {
    const clean = r.trim().replace(/^['"]|['"]$/g, '').split('#')[0].split('?')[0]
    if (!clean || clean.length > 200) return
    // Absolute URLs, protocol-relative URLs and data: payloads are not ours to keep.
    if (/^[a-z][a-z0-9+.-]*:/i.test(clean) || clean.startsWith('//')) return
    refs.add(clean)
  }
  if (!isCss) {
    for (const tag of text.matchAll(/<[a-z][^>]*>/gi)) {
      for (const m of tag[0].matchAll(/(?:src|href)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi)) push(m[1])
    }
  }
  // `url(` only where it starts a word. Without the boundary this matched the tail
  // of `toDataURL("image/jpg")` in inline script and queued "image/jpg" as a file.
  for (const m of text.matchAll(/(?<![\w-])url\(([^)]*)\)/gi)) push(m[1])
  return [...refs]
}

/**
 * Resolve a reference against the file that contained it, or null if it is not a
 * relative path inside the generator's own directory.
 *
 * The gateway is not ours, and its responses decide filenames on disk here, so a
 * path must not be able to climb out: `../../../.ssh/authorized_keys` has to come
 * back null, not be fetched and written. Backslashes are refused outright rather
 * than normalised, because this runs on Windows too, where they are separators.
 */
export function resolveRef(fromPath, ref) {
  if (typeof ref !== 'string' || !ref || ref.startsWith('/')) return null
  const base = fromPath.includes('/') ? fromPath.slice(0, fromPath.lastIndexOf('/') + 1) : ''
  const parts = []
  for (const seg of (base + ref).split('/')) {
    if (!seg || seg === '.') continue
    if (seg === '..') {
      // Climbing above the root is refused, not clamped: clamping would silently
      // turn an escaping path into a plausible in-tree one and fetch that instead.
      if (!parts.length) return null
      parts.pop()
      continue
    }
    if (seg.includes('\\') || seg.includes('\0') || seg === '~') return null
    parts.push(seg)
  }
  return parts.length ? parts.join('/') : null
}
