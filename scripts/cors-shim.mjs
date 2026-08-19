/**
 * The script prepended to a generator's derived runner (`_run.html`).
 *
 * ## Why this exists
 *
 * Archived generators run in `<iframe sandbox="allow-scripts">` with no
 * `allow-same-origin`, so the document has an *opaque* origin — one that matches
 * nothing, not even the server the file came from. The generator's own images,
 * loaded by relative path, are therefore cross-origin to it. A cross-origin image
 * fetched in no-cors mode gives back pixels the page may not read, so drawing one
 * taints the canvas and `texImage2D` / `getImageData` / `toDataURL` throw.
 *
 * That broke 54 archived projects, Brutal Nature among them: right files, right
 * seed, and a SecurityError instead of an artwork.
 *
 * Dropping the sandbox would fix it and is not worth it — these are ~400 unaudited
 * third-party programs, and GitHub Pages serves every one of this account's ~30
 * sites from a single origin, so same-origin access would reach all of their
 * storage. Instead the images opt into CORS: GitHub Pages already answers
 * `Access-Control-Allow-Origin: *`, which satisfies the opaque origin's
 * `Origin: null`, and a CORS-approved image does not taint anything.
 *
 * ## What it deliberately does not do
 *
 * It does not touch `<img src="…">` written directly in the HTML. Those have
 * already begun loading by the time any script could reach them, and setting
 * `crossOrigin` afterwards re-fetches — firing a second `load` event. Generators
 * routinely count loads (`if (--pending === 0) draw()`), so a spurious second load
 * would stop the piece rendering at all. Generative art builds its images in
 * script, which is covered; markup images are left alone rather than risk that.
 */
export const CORS_SHIM = `
(function () {
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

  var types = [
    typeof HTMLImageElement !== 'undefined' ? HTMLImageElement : null,
    typeof HTMLVideoElement !== 'undefined' ? HTMLVideoElement : null,
    typeof HTMLAudioElement !== 'undefined' ? HTMLAudioElement : null,
  ]
  for (var i = 0; i < types.length; i++) {
    if (!types[i]) continue
    patchSrc(types[i].prototype)
    patchSetAttribute(types[i].prototype)
  }
})();
`.trim()
