import { test, expect, beforeEach, afterEach, vi } from 'vitest'
import { buildRunner, needsRunner, RUNNER_ENTRY } from './runner-lib.mjs'
import { CORS_SHIM } from './cors-shim.mjs'

// --- choosing which projects get a runner ------------------------------------

test('a project that ships images needs a runner', () => {
  expect(needsRunner(['index.html', 'sketch.js', 'landscape/image0.jpg'])).toBe(true)
  expect(needsRunner(['index.html', 'tex.png'])).toBe(true)
  expect(needsRunner(['index.html', 'clip.mp4'])).toBe(true)
})

test('a project that ships only code does not', () => {
  // Nothing to taint, so the artist's own file is what runs — which is the
  // preferred outcome wherever we can get away with it.
  expect(needsRunner(['index.html', 'p5.min.js', 'style.css', 'LICENSE'])).toBe(false)
})

// --- building the derived entry point ----------------------------------------

const DOC = '<!doctype html><html><head><meta charset="utf-8"><title>x</title></head><body><script>go()</script></body></html>'

test('the shim is placed ahead of the generator own script', () => {
  const out = buildRunner(DOC)
  // It works by patching prototypes, so anything that loads an image before it
  // runs is not covered. Ordering is the whole contract.
  expect(out.indexOf(CORS_SHIM)).toBeLessThan(out.indexOf('go()'))
  expect(out.indexOf(CORS_SHIM)).toBeGreaterThan(out.indexOf('<head>'))
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
  expect(out.indexOf(CORS_SHIM)).toBeLessThan(out.indexOf('go()'))
})

test('a bare fragment with no <html> still gets the shim first', () => {
  const out = buildRunner('<script>go()</script>')
  expect(out.indexOf(CORS_SHIM)).toBeLessThan(out.indexOf('go()'))
})

test('an unusual <head> attribute does not defeat the match', () => {
  const out = buildRunner('<html><head lang="en" data-x><script>go()</script></head></html>')
  expect(out.indexOf(CORS_SHIM)).toBeLessThan(out.indexOf('go()'))
})

// --- what the shim does once it runs -----------------------------------------
// Executed for real against jsdom's DOM rather than asserted about as a string.

const runShim = () => new Function(CORS_SHIM)()

let saved
beforeEach(() => {
  saved = ['src'].map((p) => [p, Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, p)])
})
afterEach(() => {
  // Restore the prototype so one test's patch cannot leak into the next.
  for (const [p, d] of saved) if (d) Object.defineProperty(HTMLImageElement.prototype, p, d)
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
