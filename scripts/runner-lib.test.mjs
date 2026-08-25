import { test, expect, beforeEach, afterEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { buildRunner, needsLegacyPatch, RUNNER_ENTRY } from './runner-lib.mjs'
import { SANDBOX_SHIM } from './sandbox-shim.mjs'

// What the shim itself does is covered in sandbox-shim.test.mjs, against a window
// that throws the way a sandboxed one does. This file is about the wrapper: where
// the script lands in the artist's document, and that the document survives it.

// --- building the derived entry point ----------------------------------------

const DOC = '<!doctype html><html><head><meta charset="utf-8"><title>x</title></head><body><script>go()</script></body></html>'

test('the shim is placed ahead of the generator own script', () => {
  const out = buildRunner(DOC)
  // It works by patching prototypes and globals, so anything that runs before it
  // is not covered. Ordering is the whole contract.
  expect(out.indexOf(SANDBOX_SHIM)).toBeLessThan(out.indexOf('go()'))
  // Inside the document's opening structure, not bolted on in front of it. This
  // used to be measured against <head>; it goes in after <html> now, which is
  // earlier and is the only placement that works for the documents whose fxhash
  // snippet runs before any <head> exists.
  expect(out.indexOf(SANDBOX_SHIM)).toBeGreaterThan(out.indexOf('<html>'))
})

test('the original document survives intact', () => {
  const out = buildRunner(DOC)
  // Everything the artist wrote is still there, in order — this is an insertion,
  // never a rewrite.
  for (const fragment of ['<!doctype html>', '<meta charset="utf-8">', '<title>x</title>', '<script>go()</script>']) {
    expect(out).toContain(fragment)
  }
})

test('it says in the file that it is not the artwork', () => {
  // Someone reading the repo in ten years should not mistake this for what the
  // artist shipped.
  expect(buildRunner(DOC)).toContain('not part of the original artwork')
  expect(RUNNER_ENTRY).toBe('_run.html')
})

test('a document with no <head> still gets the shim before its script', () => {
  const out = buildRunner('<html><body><script>go()</script></body></html>')
  expect(out.indexOf(SANDBOX_SHIM)).toBeLessThan(out.indexOf('go()'))
})

test('a bare fragment with no <html> still gets the shim first', () => {
  const out = buildRunner('<script>go()</script>')
  expect(out.indexOf(SANDBOX_SHIM)).toBeLessThan(out.indexOf('go()'))
})

test('an unusual <head> attribute does not defeat the match', () => {
  const out = buildRunner('<html><head lang="en" data-x><script>go()</script></head></html>')
  expect(out.indexOf(SANDBOX_SHIM)).toBeLessThan(out.indexOf('go()'))
})

test('the inserted script has no closing tag that would end it early', () => {
  // A literal "</script>" anywhere in the shim source would terminate the block
  // the HTML parser is reading and dump the rest of it into the page as markup.
  expect(SANDBOX_SHIM.toLowerCase()).not.toContain('</script')
})

// --- what the shim does once it runs -----------------------------------------
// Executed for real against jsdom's DOM rather than asserted about as a string.

const runShim = () => new Function(SANDBOX_SHIM)()

let saved
beforeEach(() => {
  saved = [HTMLImageElement, HTMLMediaElement].map((t) => [t, Object.getOwnPropertyDescriptor(t.prototype, 'src')])
})
afterEach(() => {
  // Restore the prototype so one test's patch cannot leak into the next.
  for (const [t, d] of saved) if (d) Object.defineProperty(t.prototype, 'src', d)
  // jsdom's origin decides whether the storage half of the shim installs itself
  // at all, so clear anything it may have shadowed onto this process's globals.
  for (const name of ['localStorage', 'sessionStorage', 'indexedDB']) {
    delete globalThis.window[name]
  }
  delete globalThis.document.cookie
  vi.restoreAllMocks()
})

test('an image from this server is switched to a CORS load', () => {
  runShim()
  const img = document.createElement('img')
  img.src = 'landscape/image0.jpg'
  // This is the fix: a CORS-approved image does not taint the canvas, so
  // texImage2D and getImageData work.
  expect(img.crossOrigin).toBe('anonymous')
})

test('video and audio get the property patch, not only setAttribute', () => {
  // Regression: these were patched via HTMLVideoElement/HTMLAudioElement, which do
  // not declare 'src' — it is on HTMLMediaElement — so the descriptor lookup came
  // back undefined and the patch was a no-op for every piece with a video in it.
  runShim()
  const video = document.createElement('video')
  video.src = 'clip.mp4'
  expect(video.crossOrigin).toBe('anonymous')

  const audio = document.createElement('audio')
  audio.src = 'track.mp3'
  expect(audio.crossOrigin).toBe('anonymous')
})

test('setAttribute is covered too, not just the property', () => {
  runShim()
  const img = document.createElement('img')
  img.setAttribute('src', 'tex.png')
  expect(img.crossOrigin).toBe('anonymous')
})

test('a third-party URL is left exactly as the artist wrote it', () => {
  // Forcing CORS on a server that does not allow it turns a working load into a
  // failed one. Only assets we serve are ours to change.
  runShim()
  const img = document.createElement('img')
  img.src = 'https://cdn.example.com/tex.png'
  expect(img.crossOrigin).toBeNull()
})

test('an explicit crossOrigin from the artist is respected', () => {
  runShim()
  const img = document.createElement('img')
  img.crossOrigin = 'use-credentials'
  img.src = 'tex.png'
  expect(img.crossOrigin).toBe('use-credentials')
})

test('the patched setter still assigns the value', () => {
  runShim()
  const img = document.createElement('img')
  img.src = 'tex.png'
  expect(img.getAttribute('src')).toBe('tex.png')
})

test('applying the shim twice does not break the setter', () => {
  // The runner is regenerated from the artist's file each time, so a double
  // application should not happen — but a shim that corrupts the prototype when
  // run twice is a trap worth closing.
  runShim()
  runShim()
  const img = document.createElement('img')
  img.src = 'tex.png'
  expect(img.getAttribute('src')).toBe('tex.png')
  expect(img.crossOrigin).toBe('anonymous')
})

// --- the legacy Math.pow patch -------------------------------------------------
//
// A tester, on the archive: "the fxhash legacy snippet bug-fix still needs to be
// implemented here (same as with the first site) ... something the community will
// have to deal with forever". It did, and it does not: the patch existed but only
// on the IPFS path, so 72 of the 420 archived projects ran from wrong seeds in the
// viewer and on the gallery walls. The runner is the right place for it — the
// artist's index.html stays untouched and the query string survives, which a
// srcdoc document could not manage.

/** A gentk v1 document: seeds itself with Math.pow(alphabet.length, ...). */
const V1_DOC = [
  '<!doctype html><html><head><title>v1</title></head><body>',
  '<script>',
  'let alphabet = "123456789abc";',
  'var fxhash = "oo" + "x";',
  'let b58dec = (str) => str.split("").reduce((p,c,i) => p + alphabet.indexOf(c) * (Math.pow(alphabet.length, str.length-i-1)), 0);',
  'go();',
  '</script></body></html>',
].join('')

/** A v2 document: same fxhash wording, folds iteratively, no Math.pow anywhere. */
const V2_DOC = [
  '<!doctype html><html><head><title>v2</title></head><body>',
  '<script>',
  'let alphabet = "123456789abc";',
  'var fxhash = "oo" + "x";',
  'let b58dec = str=>[...str].reduce((p,c)=>p*alphabet.length+alphabet.indexOf(c)|0, 0);',
  'go();',
  '</script></body></html>',
].join('')

test('a v1 document gets the Math.pow pin, ahead of its own seeding snippet', () => {
  const out = buildRunner(V1_DOC)
  expect(out).toContain('fxhash-legacy-patch')
  expect(out).toContain('24986644000165536000')
  // Ordering is the contract: the patch has to be parsed before the snippet that
  // calls Math.pow, or it pins nothing.
  expect(out.indexOf('fxhash-legacy-patch')).toBeLessThan(out.indexOf('b58dec'))
  expect(out.indexOf('fxhash-legacy-patch')).toBeLessThan(out.indexOf('go()'))
})

test('a v2 document is left alone', () => {
  const out = buildRunner(V2_DOC)
  // v2 reads its seed without Math.pow, so the pin would be dead weight in 348 of
  // the 420 archived projects.
  expect(out).not.toContain('fxhash-legacy-patch')
  expect(out).toContain(SANDBOX_SHIM)          // it still gets the sandbox shim
})

test('artwork that merely uses Math.pow is not mistaken for a v1 seeder', () => {
  const doc = '<!doctype html><html><head></head><body><script>var fxhash="oo";r=Math.pow(x,2);</script></body></html>'
  expect(needsLegacyPatch(doc)).toBe(false)
  // and a document with the snippet but nothing to do with fxhash is not one either
  expect(needsLegacyPatch('<script>Math.pow(alphabet.length, 3)</script>')).toBe(false)
})

test('a v1 document still keeps everything the artist wrote', () => {
  const out = buildRunner(V1_DOC)
  for (const fragment of ['<title>v1</title>', 'let alphabet = "123456789abc";', 'go();']) {
    expect(out).toContain(fragment)
  }
})

test('the patch here is character-for-character the one the IPFS path uses', () => {
  // Two copies of this string exist, one per module boundary — scripts are plain
  // node and src is TypeScript through vite. The repo's habit is a "kept in step
  // with" comment; this is the same idea with teeth, because a patch that drifts
  // silently pins the wrong number and the art quietly changes again.
  const ts = readFileSync('src/lib/legacyPatch.ts', 'utf8')
  const mjs = readFileSync('scripts/runner-lib.mjs', 'utf8')
  const literal = /'(<script id="fxhash-legacy-patch">[^']*<\/script>)'/
  const inTs = ts.match(literal)
  const inMjs = mjs.match(literal)
  expect(inTs).toBeTruthy()
  expect(inMjs).toBeTruthy()
  expect(inMjs[1]).toBe(inTs[1])
})

// Two of the archived projects ship a minified p5 that prints a page of its own,
// so the first literal "<head>" in the file is 620,000 bytes in and inside a
// JavaScript string: i.print("<head>"). Splicing there wrote a comment and a
// script tag into the middle of a string literal — a syntax error — and put the
// shim after the artwork it was meant to precede. Both were silently broken.

test('a <head> buried in a script string is not mistaken for the document head', () => {
  const doc = [
    '<!doctype html><html lang=en>',
    '<script id="fxhash-snippet">let alphabet="123";var fxhash="oo";',
    'let b58dec=(str)=>str.split("").reduce((p,c,i)=>p+alphabet.indexOf(c)*(Math.pow(alphabet.length,str.length-i-1)),0);</script>',
    '<script>' + 'var pad="x".repeat(5000);i.print("<html>"),i.print("<head>");go();</script>',
  ].join('')
  const out = buildRunner(doc)
  // Everything we add lands in the opening structure, ahead of all of it.
  expect(out.indexOf(SANDBOX_SHIM)).toBeLessThan(out.indexOf('fxhash-snippet'))
  expect(out.indexOf('fxhash-legacy-patch')).toBeLessThan(out.indexOf('b58dec'))
  // And nothing was written into the string literal further down.
  expect(out).toContain('i.print("<head>")')
  expect(out.indexOf(SANDBOX_SHIM)).toBeLessThan(out.indexOf('i.print'))
})

test('a document whose only <head> is deep in a string is left to prepending', () => {
  // No <html> either, so there is no structural landmark to trust at all.
  const doc = '<script>var s="' + 'y'.repeat(5000) + '<head>";go();</script>'
  const out = buildRunner(doc)
  expect(out.indexOf(SANDBOX_SHIM)).toBeLessThan(out.indexOf('go()'))
  expect(out).toContain('<head>";go();')      // the string survived untouched
})

test('a document that opens on its own script gets ours in front of it', () => {
  // Project 16467: the fxhash snippet is at byte 0 and <html> is 1,372 bytes
  // later, so inserting at the tag would put the shim behind the artist's script.
  const doc = '<script id="fxhash-snippet">var fxhash="oo";seed();</script>' +
    '<html><head><title>late</title></head><body><script>go()</script></body></html>'
  const out = buildRunner(doc)
  expect(out.indexOf(SANDBOX_SHIM)).toBeLessThan(out.indexOf('seed()'))
  expect(out.indexOf(SANDBOX_SHIM)).toBeLessThan(out.indexOf('<html>'))
  // Still an insertion and nothing more.
  for (const fragment of ['<title>late</title>', 'var fxhash="oo";seed();', '<script>go()</script>']) {
    expect(out).toContain(fragment)
  }
})
