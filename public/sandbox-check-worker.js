// Probe worker for public/sandbox-check.html.
//
// Reaching this file at all is the result being measured: a classic worker's script
// has to be same-origin, and the sandboxed frame that starts it has an opaque
// origin, so without the shim's blob indirection the constructor is refused before
// a line of this runs.
//
// It also checks that relative resolution still works from inside a blob, whose own
// base URL is `blob:null/…` — the shim bakes the real directory back in, and this
// fetch is what proves it.
fetch('./sandbox-check-worker.js')
  .then(function (res) {
    postMessage({
      ok: res.ok,
      detail: res.ok
        ? 'ran, and resolved a relative fetch'
        : 'ran, but a relative fetch returned HTTP ' + res.status,
    })
  })
  .catch(function (err) {
    postMessage({ ok: false, detail: 'ran, but a relative fetch failed: ' + err.message })
  })
