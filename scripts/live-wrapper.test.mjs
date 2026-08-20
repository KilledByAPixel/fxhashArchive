import { test, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { buildLiveWrapper } from './runner-lib.mjs'
import { SANDBOX_SHIM } from './sandbox-shim.mjs'
import { GATEWAY_ORIGINS } from './archive-lib.mjs'

// public/live.html is the only shim delivery path that is assembled at build time
// rather than inlined, so a bad substitution produces a page that still loads and
// silently protects nothing. These tests are aimed squarely at that.

const SRC = readFileSync('scripts/live-wrapper.src.html', 'utf8')
const built = () => buildLiveWrapper(SRC, GATEWAY_ORIGINS)

/** The wrapper's inline script, as the browser would see it. */
function inlineScript(html) {
  const match = /<script>([\s\S]*?)<\/script>\s*<\/body>/i.exec(html)
  if (!match) throw new Error('could not find the wrapper script')
  return match[1]
}

test('the generated page has no placeholder left in it', () => {
  const html = built()
  expect(html).not.toContain('__SANDBOX_SHIM__')
  expect(html).not.toContain('__GATEWAY_ORIGINS__')
})

test('a missing placeholder is a build failure, not a silent pass', () => {
  // The failure mode this guards against is a rename in the source template that
  // nothing notices until a piece quietly stops being shimmed in production.
  expect(() => buildLiveWrapper('<html><head></head></html>', GATEWAY_ORIGINS)).toThrow(
    /__SANDBOX_SHIM__/,
  )
})

test('the substituted script still parses', () => {
  // JSON.stringify of an 8 KB program with quotes, backslashes and regex literals
  // in it is exactly the kind of thing that produces a page which loads fine and
  // throws on the line that matters.
  expect(() => new Function(inlineScript(built()))).not.toThrow()
})

test('the whole shim is carried, not a truncated copy', () => {
  const script = inlineScript(built())
  // Round-trip it the way the browser will, rather than string-matching the source.
  const shim = JSON.parse(/var SHIM = ("(?:[^"\\]|\\.)*")/.exec(script)[1])
  expect(shim).toBe(SANDBOX_SHIM)
})

test('the gateway allow-list is the same one the archiver fetches from', () => {
  const script = inlineScript(built())
  const origins = JSON.parse(/var ALLOWED_ORIGINS = (\[[^\]]*\])/.exec(script)[1])
  expect(origins).toEqual(GATEWAY_ORIGINS)
  // An empty list would refuse everything; a list containing '*' or a bare protocol
  // would defeat the check entirely.
  expect(origins.length).toBeGreaterThan(0)
  expect(origins.every((o) => /^https:\/\/[a-z0-9.-]+$/i.test(o))).toBe(true)
})

test('nothing in the page can end its own script block early', () => {
  // The shim is written into a <script> inside another <script>. Either an
  // unescaped closing tag would end the block and dump the rest into the page as
  // markup.
  const html = built()
  const script = inlineScript(html)
  expect(script.toLowerCase()).not.toContain('</script>')
  expect(SANDBOX_SHIM.toLowerCase()).not.toContain('</script')
})

test('the shim is spliced in after <head>, so the doctype stays first', () => {
  // Writing anything ahead of the doctype puts the document in quirks mode, which
  // changes the box model and can visibly break a piece's layout.
  const script = inlineScript(built())
  const splice = new Function(
    'artifact',
    'SHIM',
    script.slice(script.indexOf('function splice')).replace(
      /^function splice\(html\) \{/,
      'return (function splice(html) {',
    ).replace(/\n  \}[\s\S]*$/, '\n  })'),
  )('https://gateway.fxhash.xyz/ipfs/QmAbC/', 'SHIM_BODY')

  const out = splice('<!doctype html><html><head><title>x</title></head><body><script>go()<\/script></body></html>')
  expect(out.indexOf('<!doctype html>')).toBe(0)
  expect(out.indexOf('SHIM_BODY')).toBeGreaterThan(out.indexOf('<head>'))
  expect(out.indexOf('SHIM_BODY')).toBeLessThan(out.indexOf('go()'))
  expect(out).toContain('<base href="https://gateway.fxhash.xyz/ipfs/QmAbC/">')
})
