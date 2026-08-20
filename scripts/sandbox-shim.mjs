/**
 * The script prepended to a generator's derived runner (`_run.html`).
 *
 * ## The one root cause
 *
 * Archived generators run in `<iframe sandbox="allow-scripts">` with no
 * `allow-same-origin`, so the document has an *opaque* origin — one that matches
 * nothing, not even the server the file came from. Everything below follows from
 * that single fact, which is why it is one file and one insertion point:
 *
 *   - the generator's own images are cross-origin to it, so drawing one taints the
 *     canvas and `texImage2D` / `getImageData` / `toDataURL` throw;
 *   - `document.cookie`, `localStorage`, `sessionStorage` and `indexedDB` are
 *     origin-keyed, and an opaque origin has no storage, so *reading the property
 *     at all* throws SecurityError;
 *   - a classic worker's script must be same-origin, and nothing is same-origin
 *     with an opaque origin, so `new Worker('./worker.js')` is refused.
 *
 * Between them these broke 272 of the 420 archived projects: right files, right
 * seed, and an exception instead of an artwork.
 *
 * Dropping the sandbox would fix all three and is not worth it — these are ~420
 * unaudited third-party programs, and GitHub Pages serves every one of this
 * account's ~30 sites from a single origin, so same-origin access would reach all
 * of their storage. Each problem is instead answered in the page itself.
 *
 * ## What it deliberately does not do
 *
 * It does not touch `<img src="…">` written directly in the HTML. Those have
 * already begun loading by the time any script could reach them, and setting
 * `crossOrigin` afterwards re-fetches — firing a second `load` event. Generators
 * routinely count loads (`if (--pending === 0) draw()`), so a spurious second load
 * would stop the piece rendering at all. Generative art builds its images in
 * script, which is covered; markup images are left alone rather than risk that.
 *
 * Every part fails soft. Each patch is installed only after checking that the API
 * is actually broken, and if a patch or a fetch it depends on fails, the original
 * behaviour is left in place — which is the behaviour the piece has today, so no
 * generator ends up worse off than before the shim existed.
 *
 * `public/sandbox-check.html` exercises all of this in a real sandboxed iframe;
 * open it whenever a browser release makes a piece stop working.
 */

/**
 * Images opt into CORS.
 *
 * GitHub Pages already answers `Access-Control-Allow-Origin: *`, which satisfies
 * the opaque origin's `Origin: null`, and a CORS-approved image does not taint
 * anything. (Vite is configured to send the same header, or these pieces would
 * work in production and fail locally — the worst way round.)
 */
const CORS_SHIM = String.raw`
  // Only assets this document itself serves. Forcing CORS on a third-party URL
  // whose server does not allow it would fail a load that works today.
  function sameServer(url) {
    try {
      var base = new URL(document.baseURI)
      var u = new URL(String(url), base)
      return u.protocol === base.protocol && u.host === base.host
    } catch (e) { return false }
  }

  // Elements whose CORS attempt already failed; never retried, so no loop.
  var giveUp = new WeakSet()

  function onError(e) {
    var el = e.currentTarget
    if (!el || giveUp.has(el) || !el.crossOrigin) return
    // No CORS on this server. Fall back to a plain load so the piece still draws,
    // tainted as it would have been anyway — never worse than before this shim.
    giveUp.add(el)
    var src = el.src
    el.removeAttribute('crossorigin')
    el.src = src
  }

  function wants(el, value) {
    return el && !giveUp.has(el) && !el.crossOrigin && sameServer(value)
  }

  function arm(el) {
    el.crossOrigin = 'anonymous'
    el.addEventListener('error', onError, { once: true })
  }

  function patchSrc(proto) {
    var d = Object.getOwnPropertyDescriptor(proto, 'src')
    if (!d || !d.set) return
    Object.defineProperty(proto, 'src', {
      configurable: true,
      enumerable: d.enumerable,
      get: d.get,
      set: function (value) {
        if (wants(this, value)) arm(this)
        d.set.call(this, value)
      },
    })
  }

  function patchSetAttribute(proto) {
    var original = proto.setAttribute
    proto.setAttribute = function (name, value) {
      if (String(name).toLowerCase() === 'src' && wants(this, value)) arm(this)
      return original.apply(this, arguments)
    }
  }

  // HTMLMediaElement, not HTMLVideoElement and HTMLAudioElement: 'src' is declared
  // on the shared base, so asking the two subclasses for its descriptor returned
  // undefined and patchSrc quietly did nothing. Video and audio have been going
  // through without crossOrigin ever since this shim was written — setAttribute
  // was covered, the property was not.
  var mediaTypes = [
    typeof HTMLImageElement !== 'undefined' ? HTMLImageElement : null,
    typeof HTMLMediaElement !== 'undefined' ? HTMLMediaElement : null,
  ]
  for (var i = 0; i < mediaTypes.length; i++) {
    if (!mediaTypes[i]) continue
    patchSrc(mediaTypes[i].prototype)
    patchSetAttribute(mediaTypes[i].prototype)
  }
`

/**
 * Storage that exists but forgets.
 *
 * 264 archived projects touch `localStorage` and 58 `document.cookie` — most of
 * them without knowing it, because p5.js reads both while starting up to guess a
 * language, and p5 is bundled into most of this archive. In an opaque origin the
 * getter itself throws, so the failure is not "the feature is unavailable" but
 * "the library died before `setup()` ran".
 *
 * The replacements are in-memory and last exactly as long as the frame. That is
 * not a compromise for an archive: an artwork is meant to be reproducible from its
 * seed, and one that quietly remembered a previous visit would render differently
 * on the second view. Rückkopplung, for instance, stores render settings on a
 * keypress and reads them back on reload; the shim gives it a jar that works, and
 * a fresh one each time the piece is opened.
 *
 * Semantics follow the real `Storage` interface, including the odd corner where a
 * key named `getItem` is readable via `getItem('getItem')` but shadowed by the
 * method on property access — matching the spec is cheaper than guessing which
 * corners 264 unaudited programs rely on.
 */
const STORAGE_SHIM = String.raw`
  function memoryStorage() {
    var data = new Map()
    // Methods live on the prototype so the proxy target has no own properties,
    // which keeps the ownKeys/getOwnPropertyDescriptor invariants trivially safe.
    var api = {
      getItem: function (k) { k = String(k); return data.has(k) ? data.get(k) : null },
      setItem: function (k, v) { data.set(String(k), String(v)) },
      removeItem: function (k) { data.delete(String(k)) },
      clear: function () { data.clear() },
      key: function (i) {
        var keys = Array.from(data.keys())
        i = Number(i)
        return i >= 0 && i < keys.length ? keys[i] : null
      },
    }
    return new Proxy(Object.create(api), {
      get: function (t, p) {
        if (p === 'length') return data.size
        if (p in api || typeof p !== 'string') return t[p]
        return data.has(p) ? data.get(p) : undefined
      },
      set: function (t, p, v) {
        // 'length' is a read-only attribute on the real interface, and assigning
        // over a method is not something any generator means to do. Both are
        // dropped rather than becoming entries that would then surface in key()
        // and ownKeys() and quietly shift every index. setItem still stores them.
        if (typeof p === 'string' && p !== 'length' && !(p in api)) data.set(p, String(v))
        return true
      },
      has: function (t, p) {
        return p === 'length' || p in t || (typeof p === 'string' && data.has(p))
      },
      deleteProperty: function (t, p) { data.delete(String(p)); return true },
      ownKeys: function () { return Array.from(data.keys()) },
      getOwnPropertyDescriptor: function (t, p) {
        if (typeof p === 'string' && data.has(p)) {
          return { value: data.get(p), writable: true, enumerable: true, configurable: true }
        }
        return undefined
      },
    })
  }

  // An own property on the instance shadows the throwing accessor that Window and
  // Document declare on their prototypes.
  function shadow(target, name, value) {
    try {
      Object.defineProperty(target, name, { configurable: true, writable: true, value: value })
      return true
    } catch (e) { return false }
  }

  // Read it first: outside a sandbox the real thing works and must be left alone.
  function broken(read) {
    try { read(); return false } catch (e) { return true }
  }

  if (broken(function () { return window.localStorage })) shadow(window, 'localStorage', memoryStorage())
  if (broken(function () { return window.sessionStorage })) shadow(window, 'sessionStorage', memoryStorage())

  // Nothing here polyfills IndexedDB — an in-memory database is a project of its
  // own, and all three projects that touch it are feature-detecting a screen
  // recorder they never use. Making the property readable and falsy is enough for
  // "typeof indexedDB === 'undefined'" to take the branch the author wrote for a
  // browser without it.
  if (broken(function () { return window.indexedDB })) shadow(window, 'indexedDB', undefined)

  if (broken(function () { return document.cookie })) {
    var jar = new Map()
    try {
      Object.defineProperty(document, 'cookie', {
        configurable: true,
        get: function () {
          var out = []
          jar.forEach(function (v, k) { out.push(k + '=' + v) })
          return out.join('; ')
        },
        set: function (value) {
          var text = String(value)
          var semi = text.indexOf(';')
          var pair = semi >= 0 ? text.slice(0, semi) : text
          var eq = pair.indexOf('=')
          if (eq < 0) return
          var name = pair.slice(0, eq).trim()
          if (!name) return
          // Deleting a cookie in JavaScript means re-setting it already expired,
          // so an attribute scan is the only way to tell a write from a delete.
          var maxAge = /;\s*max-age\s*=\s*([^;]*)/i.exec(text)
          var expires = /;\s*expires\s*=\s*([^;]*)/i.exec(text)
          if ((maxAge && Number(maxAge[1]) <= 0) ||
              (!maxAge && expires && !(new Date(expires[1]).getTime() > Date.now()))) {
            jar.delete(name)
            return
          }
          jar.set(name, pair.slice(eq + 1).trim())
        },
      })
    } catch (e) { /* leave the throwing accessor in place; nothing is made worse */ }
  }
`

/**
 * Workers, loaded through a blob.
 *
 * A classic worker's script has to be same-origin with the document that creates
 * it, and an opaque origin is same-origin with nothing — so 23 archived projects
 * fail on `new Worker(...)` with "cannot be accessed from origin 'null'", Release
 * among them. A `blob:` URL minted by this document *is* accepted, so the script
 * is fetched and handed over as a blob instead.
 *
 * The fetch is a synchronous XHR, deliberately. `new Worker()` must return a live
 * worker that accepts `postMessage` on the next line, and the alternative — an
 * async wrapper that queues messages and replays listeners — changes when
 * transferables detach and when errors surface. Blocking on one same-server
 * request, usually already in the HTTP cache, is the smaller lie.
 *
 * A blob worker's own base URL is `blob:null/…`, so anything it resolves relatively
 * would break; the preamble restores the directory the script actually came from.
 */
const WORKER_SHIM = String.raw`
  var NativeWorker = typeof Worker !== 'undefined' ? Worker : null
  if (NativeWorker) {
    // Restores relative resolution inside the worker, whose base is now the blob.
    function preamble(dir) {
      return '(function(){var b=' + JSON.stringify(dir) + ';' +
        'var i=self.importScripts;' +
        'if(i)self.importScripts=function(){' +
          'return i.apply(self,[].map.call(arguments,function(u){return new URL(u,b).href}))};' +
        'var f=self.fetch;' +
        'if(f)self.fetch=function(u,o){' +
          'try{if(typeof u==="string")u=new URL(u,b).href}catch(e){}return f.call(self,u,o)};' +
        '})();\n'
    }

    function asBlobUrl(script) {
      var raw = String(script)
      // Already an inline source, or a third-party URL that a blob cannot rescue
      // (fetching it would need CORS the other server has no reason to allow).
      if (/^(blob|data):/i.test(raw) || !sameServer(raw)) return script
      var href = new URL(raw, document.baseURI).href
      var xhr = new XMLHttpRequest()
      xhr.open('GET', href, false)
      xhr.send()
      if (xhr.status && (xhr.status < 200 || xhr.status >= 300)) return script
      var dir = href.slice(0, href.lastIndexOf('/') + 1)
      var body = preamble(dir) + xhr.responseText
      return URL.createObjectURL(new Blob([body], { type: 'text/javascript' }))
    }

    function PatchedWorker(script, options) {
      var url = script
      try {
        url = asBlobUrl(script)
      } catch (e) {
        // Fall through to the native constructor, which throws exactly what it
        // throws today. A worse error is not worth inventing.
      }
      return new NativeWorker(url, options)
    }
    // Shared prototype so "instanceof Worker" still holds for the real object the
    // constructor returns.
    PatchedWorker.prototype = NativeWorker.prototype
    try { window.Worker = PatchedWorker } catch (e) { /* leave the native one */ }
  }
`

/**
 * The whole shim, as one IIFE.
 *
 * One scope on purpose: the worker patch reuses `sameServer` from the CORS patch,
 * and the three parts share a single cause worth reading top to bottom.
 */
export const SANDBOX_SHIM = ['(function () {', CORS_SHIM, STORAGE_SHIM, WORKER_SHIM, '})();'].join(
  '\n',
)
