import { test, expect, beforeEach, afterEach, vi } from 'vitest'
import { buildRunner, RUNNER_ENTRY } from './runner-lib.mjs'
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
  expect(out.indexOf(SANDBOX_SHIM)).toBeGreaterThan(out.indexOf('<head>'))
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
