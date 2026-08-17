import { test, expect } from 'vitest'
import {
  LEGACY_PATCH_SCRIPT,
  needsLegacyPatch,
  injectLegacyPatch,
  artifactBaseHref,
} from './legacyPatch'

/**
 * Verbatim head of a real gentk v1 artifact
 * (ipfs://QmYgZFBi6xnqrp5c47pRTXUhTvwRjeyfcLbZwwpi8A1cT4 — Blobby #234), trimmed
 * to the parts that matter: the fxhash v1 snippet and the relative asset tags.
 */
const V1_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Blobbies</title>
    <script id="fxhash-snippet">
      let alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
      var fxhash = 'opE3kkASSt3cygnFRETvfCtR8MtxSYFkhKH98WojKnz1hQcneSv'
      let b58dec = (str) => str.split('').reduce((p,c,i) => p + alphabet.indexOf(c) * (Math.pow(alphabet.length, str.length-i-1)), 0)
      let fxhashTrunc = fxhash.slice(2)
      let regex = new RegExp(".{" + ((fxhash.length/4)|0) + "}", 'g')
      let hashes = fxhashTrunc.match(regex).map(h => b58dec(h))
      let sfc32 = (a, b, c, d) => { return () => { a |= 0; return (a >>> 0) / 4294967296 } }
      var fxrand = sfc32(...hashes)
</script>
       <script src="./p5.min.js"></script>
       <script src="./sketch.js"></script>
</head>
<body></body>
</html>`

/**
 * gentk v2. Its seed comes from the query string, and — the reason the whole bug
 * exists — its b58dec no longer uses Math.pow at all.
 */
const V2_HTML = `<!DOCTYPE html>
<html>
<head>
<script id="fxhash-snippet">
  let search = new URLSearchParams(window.location.search)
  let alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
  var fxhash = search.get("fxhash") || "oo" + Array(49).fill(0).map(_ => alphabet[(Math.random() * alphabet.length) | 0]).join('')
  let b58dec = (str) => [...str].reduce((p, c) => p * alphabet.length + alphabet.indexOf(c) | 0, 0)
</script>
</head>
<body></body>
</html>`

const BASE = 'https://ipfs.io/ipfs/QmYgZFBi6xnqrp5c47pRTXUhTvwRjeyfcLbZwwpi8A1cT4/'

// --- the patch script itself -------------------------------------------------

test('the patch pins Math.pow(58, 11) to the value legacy fxhash was minted against', () => {
  expect(LEGACY_PATCH_SCRIPT).toContain('24986644000165536000')
  expect(LEGACY_PATCH_SCRIPT).toContain('a===58 && b===11')
  // Must be inert on engines that already agree, i.e. every other exponent passes through.
  expect(LEGACY_PATCH_SCRIPT).toContain('a**b')
})

// --- needsLegacyPatch --------------------------------------------------------

test('needsLegacyPatch is true for a realistic v1 snippet', () => {
  expect(needsLegacyPatch(V1_HTML)).toBe(true)
})

test('needsLegacyPatch tolerates minified whitespace in the snippet', () => {
  expect(needsLegacyPatch('<html><head><script>var fxhash="oo1";let b58dec=(s)=>s.split("").reduce((p,c,i)=>p+alphabet.indexOf(c)*Math.pow(alphabet.length,s.length-i-1),0)</script></head></html>'))
    .toBe(true)
})

test('needsLegacyPatch is false for a v2 document — its b58dec has no Math.pow', () => {
  expect(needsLegacyPatch(V2_HTML)).toBe(false)
})

test('needsLegacyPatch is false for unrelated HTML, including generic Math.pow use', () => {
  expect(needsLegacyPatch('<html><head></head><body>hello</body></html>')).toBe(false)
  expect(needsLegacyPatch('<html><head><script>const d = Math.pow(x, 2) + Math.pow(y, 2)</script></head></html>'))
    .toBe(false)
})

// --- injectLegacyPatch -------------------------------------------------------

test('injects <base> and the patch after <head> and before the fxhash snippet', () => {
  const out = injectLegacyPatch(V1_HTML, BASE)!
  expect(out).not.toBeNull()

  const head = out.toLowerCase().indexOf('<head')
  const headEnd = out.toLowerCase().indexOf('>', head)
  const base = out.indexOf('<base')
  const patch = out.indexOf('fxhash-legacy-patch')
  const snippet = out.indexOf('Math.pow(alphabet.length')

  // The whole point: the seed is computed while parsing, so the patch has to be
  // sitting in the byte stream ahead of the snippet, not merely present somewhere.
  expect(head).toBeGreaterThanOrEqual(0)
  expect(base).toBeGreaterThan(headEnd)
  expect(patch).toBeGreaterThan(base)
  expect(snippet).toBeGreaterThan(patch)
})

test('the injected <base> points at the artifact directory so relative assets still resolve', () => {
  const out = injectLegacyPatch(V1_HTML, BASE)!
  expect(out).toContain(`<base href="${BASE}">`)
  // The relative tags themselves are left alone — <base> is what fixes them.
  expect(out).toContain('<script src="./p5.min.js"></script>')
})

test('handles <head> with attributes', () => {
  const html = '<html><head lang="en" data-x="1"><script>Math.pow(alphabet.length, 2)</script></head></html>'
  const out = injectLegacyPatch(html, BASE)!
  expect(out.startsWith('<html><head lang="en" data-x="1"><base ')).toBe(true)
  expect(out.indexOf('fxhash-legacy-patch')).toBeLessThan(out.indexOf('Math.pow(alphabet.length'))
})

test('handles uppercase <HEAD>', () => {
  const html = '<HTML><HEAD><SCRIPT>Math.pow(alphabet.length, 2)</SCRIPT></HEAD></HTML>'
  const out = injectLegacyPatch(html, BASE)!
  expect(out.startsWith('<HTML><HEAD><base ')).toBe(true)
  expect(out.indexOf('fxhash-legacy-patch')).toBeLessThan(out.indexOf('Math.pow(alphabet.length'))
})

test('returns null when there is no <head> to splice after', () => {
  expect(injectLegacyPatch('<html><body>no head here</body></html>', BASE)).toBeNull()
  // A <header> element is not a <head>.
  expect(injectLegacyPatch('<html><body><header>x</header></body></html>', BASE)).toBeNull()
})

test('leaves the rest of the document byte-for-byte intact', () => {
  const out = injectLegacyPatch(V1_HTML, BASE)!
  const insertAt = V1_HTML.indexOf('<head>') + '<head>'.length
  const injected = out.slice(insertAt, out.length - (V1_HTML.length - insertAt))

  expect(out.slice(0, insertAt)).toBe(V1_HTML.slice(0, insertAt))
  expect(out.slice(insertAt + injected.length)).toBe(V1_HTML.slice(insertAt))
  expect(out.length).toBe(V1_HTML.length + injected.length)
})

test('escapes the base href — artifact URIs come from attacker-influenceable metadata', () => {
  const out = injectLegacyPatch(V1_HTML, 'https://ipfs.io/ipfs/Qm"><script>alert(1)</script>/')!
  expect(out).not.toContain('"><script>alert(1)')
  expect(out).toContain('&quot;&gt;&lt;script&gt;')
})

// --- artifactBaseHref --------------------------------------------------------

test('artifactBaseHref appends a trailing slash to a bare CID URL', () => {
  expect(artifactBaseHref('https://ipfs.io/ipfs/QmAbC')).toBe('https://ipfs.io/ipfs/QmAbC/')
  expect(artifactBaseHref('https://ipfs.io/ipfs/QmAbC/')).toBe('https://ipfs.io/ipfs/QmAbC/')
})

test('artifactBaseHref drops the query string and any filename', () => {
  expect(artifactBaseHref('https://ipfs.io/ipfs/QmAbC/?fxhash=oo1')).toBe('https://ipfs.io/ipfs/QmAbC/')
  expect(artifactBaseHref('https://ipfs.io/ipfs/QmAbC/index.html?x=1#y')).toBe('https://ipfs.io/ipfs/QmAbC/')
})

test('artifactBaseHref returns null for a URL it cannot parse', () => {
  expect(artifactBaseHref('not a url')).toBeNull()
})
