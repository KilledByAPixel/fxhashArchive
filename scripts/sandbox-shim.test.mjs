import { test, expect } from 'vitest'
import vm from 'node:vm'
import { SANDBOX_SHIM } from './sandbox-shim.mjs'

/**
 * The shim's whole job is to replace APIs that throw inside an opaque origin, and
 * an opaque origin is not something jsdom or Node can produce. So these tests build
 * the condition directly: a window and a document whose accessors throw the way
 * Chrome's do, and stubs for the few browser objects the shim reaches for.
 *
 * What this can prove is the part that would fail silently — Storage semantics, the
 * cookie jar, which URL a worker is actually fetched from, and that nothing is
 * patched when the real API works. What it cannot prove is that a browser accepts
 * a blob-backed worker from an opaque origin at all; `public/sandbox-check.html`
 * covers that, in a real browser, because nothing else can.
 */

const BASE = 'https://example.test/data/generators/20459/_run.html'
const DIR = 'https://example.test/data/generators/20459/'

const throwing = () => {
  throw new Error("The document is sandboxed and lacks the 'allow-same-origin' flag.")
}

/**
 * @param {object} opts
 * @param {boolean} [opts.sandboxed] false gives working APIs, to prove the shim leaves them be
 * @param {object} [opts.extra] additional globals (Worker and friends)
 */
function run({ sandboxed = true, extra = {} } = {}) {
  // Browsers declare these on Window.prototype / Document.prototype, and the shim
  // shadows them with an own property; putting them on a prototype here keeps that
  // distinction real rather than assuming it away.
  const windowProto = {}
  const documentProto = {}
  const notes = { cookieWrites: [] }

  if (sandboxed) {
    for (const name of ['localStorage', 'sessionStorage', 'indexedDB']) {
      Object.defineProperty(windowProto, name, { configurable: true, get: throwing })
    }
    Object.defineProperty(documentProto, 'cookie', {
      configurable: true,
      get: throwing,
      set: throwing,
    })
  } else {
    const real = { getItem: () => 'real', setItem: () => {}, marker: 'native' }
    for (const name of ['localStorage', 'sessionStorage']) {
      Object.defineProperty(windowProto, name, { configurable: true, get: () => real })
    }
    Object.defineProperty(windowProto, 'indexedDB', { configurable: true, get: () => 'real-idb' })
    Object.defineProperty(documentProto, 'cookie', {
      configurable: true,
      get: () => 'native=1',
      set: (v) => notes.cookieWrites.push(v),
    })
  }

  const window = Object.create(windowProto)
  const document = Object.create(documentProto)
  document.baseURI = BASE

  const context = vm.createContext({
    window,
    document,
    URL,
    Map,
    Proxy,
    Array,
    Object,
    Number,
    String,
    Date,
    JSON,
    WeakSet,
    ...extra,
  })
  vm.runInContext(SANDBOX_SHIM, context)
  return { window, document, notes }
}

test('localStorage is replaced with something that behaves like Storage', () => {
  const { window } = run()
  const s = window.localStorage

  expect(s.getItem('missing')).toBe(null)
  s.setItem('w', 1500)
  expect(s.getItem('w')).toBe('1500') // Storage stringifies, and generators compare strings
  expect(s.length).toBe(1)
  expect(s.key(0)).toBe('w')
  expect(s.key(9)).toBe(null)

  s.setItem('h', 2000)
  expect(Object.keys(s)).toEqual(['w', 'h'])
  s.removeItem('w')
  expect(s.getItem('w')).toBe(null)
  s.clear()
  expect(s.length).toBe(0)
})

test('named property access works the way Storage does, methods included', () => {
  const { window } = run()
  const s = window.localStorage

  s.pxlDens = 3
  expect(s.pxlDens).toBe('3')
  expect(s.getItem('pxlDens')).toBe('3')
  expect('pxlDens' in s).toBe(true)
  delete s.pxlDens
  expect(s.getItem('pxlDens')).toBe(null)

  // The spec's odd corner: a key named after a method is still stored and still
  // readable through getItem, but the method wins on property access.
  s.setItem('getItem', 'stored')
  expect(typeof s.getItem).toBe('function')
  expect(s.getItem('getItem')).toBe('stored')
})

test('assigning to length or a method name does not become an entry', () => {
  // Either would shift every key() index and show up in Object.keys, which is a
  // nastier failure than the assignment simply not taking.
  const { window } = run()
  const s = window.localStorage
  s.setItem('real', '1')
  s.length = 99
  s.getItem = 'clobbered'
  expect(s.length).toBe(1)
  expect(Object.keys(s)).toEqual(['real'])
  expect(typeof s.getItem).toBe('function')
  expect('length' in s).toBe(true)
})

test('sessionStorage is a separate jar, not the same object', () => {
  const { window } = run()
  window.localStorage.setItem('k', 'local')
  window.sessionStorage.setItem('k', 'session')
  expect(window.localStorage.getItem('k')).toBe('local')
  expect(window.sessionStorage.getItem('k')).toBe('session')
})

test('indexedDB becomes readable and falsy, so feature detection takes the fallback', () => {
  // All three projects that touch it guard with `typeof indexedDB === 'undefined'`
  // or `window.indexedDB || window.mozIndexedDB`; both need the read not to throw.
  const { window } = run()
  expect(window.indexedDB).toBe(undefined)
})

test('document.cookie round-trips, and expiring one deletes it', () => {
  const { document } = run()

  document.cookie = 'i18next=en; path=/'
  expect(document.cookie).toBe('i18next=en')

  document.cookie = 'other=2'
  expect(document.cookie).toBe('i18next=en; other=2')

  document.cookie = 'i18next=en; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
  expect(document.cookie).toBe('other=2')

  document.cookie = 'other=2; max-age=0'
  expect(document.cookie).toBe('')

  // Attribute-only writes and junk must not create a phantom cookie.
  document.cookie = 'path=/'
  expect(document.cookie).toBe('path=/')
  document.cookie = 'novalue'
  expect(document.cookie).toBe('path=/')
})

test('a future expiry is a write, not a delete', () => {
  const { document } = run()
  document.cookie = 'keep=1; expires=Fri, 01 Jan 2100 00:00:00 GMT'
  expect(document.cookie).toBe('keep=1')
})

test('nothing is patched when the real APIs work', () => {
  // Outside a sandbox — a browser tab opened straight on index.html, or a future
  // where the frame is allowed an origin — the genuine article must survive.
  const { window, document, notes } = run({ sandboxed: false })
  expect(window.localStorage.marker).toBe('native')
  expect(window.sessionStorage.marker).toBe('native')
  expect(window.indexedDB).toBe('real-idb')
  document.cookie = 'a=1'
  expect(document.cookie).toBe('native=1')
  expect(notes.cookieWrites).toEqual(['a=1'])
})

/** A worker environment: a constructor to spy on, a stub XHR, and blob plumbing. */
function workerEnv({ status = 200, body = 'self.onmessage = function () {}' } = {}) {
  const calls = { opened: [], blobs: [], built: [] }

  function FakeWorker(url, options) {
    calls.built.push({ url, options })
  }

  function FakeXHR() {}
  FakeXHR.prototype.open = function (method, url, async) {
    calls.opened.push({ method, url, async })
  }
  FakeXHR.prototype.send = function () {
    this.status = status
    this.responseText = body
  }

  function FakeBlob(parts, options) {
    this.parts = parts
    this.type = options && options.type
  }

  const patchedURL = new Proxy(URL, {
    get(target, prop) {
      if (prop === 'createObjectURL') {
        return (blob) => {
          calls.blobs.push(blob)
          return 'blob:null/fake-' + calls.blobs.length
        }
      }
      return Reflect.get(target, prop)
    },
  })

  return {
    calls,
    extra: {
      Worker: FakeWorker,
      XMLHttpRequest: FakeXHR,
      Blob: FakeBlob,
      URL: patchedURL,
    },
  }
}

test('a same-server worker script is fetched and handed over as a blob', () => {
  const { calls, extra } = workerEnv()
  const { window } = run({ extra })

  const worker = new window.Worker('./709.c1a98cc2849d14fd.js')

  expect(calls.opened).toEqual([
    { method: 'GET', url: DIR + '709.c1a98cc2849d14fd.js', async: false },
  ])
  expect(calls.built[0].url).toBe('blob:null/fake-1')
  expect(calls.blobs[0].type).toBe('text/javascript')
  expect(worker).toBeInstanceOf(extra.Worker)
})

test('the blob carries a preamble that restores the script directory', () => {
  // Inside a blob worker `self.location` is 'blob:null/…', so importScripts('./x')
  // and fetch('./x') would resolve against nothing. Only the directory can fix it,
  // and it has to be baked in because the worker cannot ask where it came from.
  const { calls, extra } = workerEnv({ body: 'ORIGINAL_BODY' })
  const { window } = run({ extra })
  new window.Worker('./709.js')

  const source = calls.blobs[0].parts[0]
  expect(source).toContain(JSON.stringify(DIR))
  expect(source).toContain('self.importScripts')
  expect(source).toContain('self.fetch')
  expect(source.endsWith('ORIGINAL_BODY')).toBe(true)
  // The artist's code must start on a line of its own, or a trailing `//` comment
  // in the preamble would swallow its first statement.
  expect(source).toContain('\nORIGINAL_BODY')
})

test('a URL object is accepted, which is how bundlers write it', () => {
  // Release, and every other webpack build in the archive, emits
  // `new Worker(new URL(chunk, import.meta.url))` — never a plain string.
  const { calls, extra } = workerEnv()
  const { window } = run({ extra })
  new window.Worker(new URL('709.js', DIR))
  expect(calls.opened[0].url).toBe(DIR + '709.js')
  expect(calls.built[0].url).toBe('blob:null/fake-1')
})

test('a cross-origin worker URL is left exactly as it was', () => {
  // A blob cannot rescue it — fetching the script would need CORS the other server
  // has no reason to allow — so passing it through keeps today's behaviour.
  const { calls, extra } = workerEnv()
  const { window } = run({ extra })
  new window.Worker('https://cdn.example.com/w.js')
  expect(calls.opened).toEqual([])
  expect(calls.built[0].url).toBe('https://cdn.example.com/w.js')
})

test('an inline worker source is left alone', () => {
  const { calls, extra } = workerEnv()
  const { window } = run({ extra })
  new window.Worker('blob:null/already-a-blob')
  new window.Worker('data:text/javascript,self.close()')
  expect(calls.opened).toEqual([])
  expect(calls.built.map((c) => c.url)).toEqual([
    'blob:null/already-a-blob',
    'data:text/javascript,self.close()',
  ])
})

test('a failed fetch falls back to the original URL rather than an empty worker', () => {
  const { calls, extra } = workerEnv({ status: 404, body: 'Not Found' })
  const { window } = run({ extra })
  new window.Worker('./missing.js')
  expect(calls.blobs).toEqual([])
  expect(calls.built[0].url).toBe('./missing.js')
})

test('worker options are passed through untouched', () => {
  const { calls, extra } = workerEnv()
  const { window } = run({ extra })
  new window.Worker('./w.js', { name: 'render', type: 'classic' })
  expect(calls.built[0].options).toEqual({ name: 'render', type: 'classic' })
})
