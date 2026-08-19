import { test, expect } from 'vitest'
import { extractRefs, resolveRef } from './archive-lib.mjs'

test('extractRefs finds the assets a document actually references', () => {
  const html = `
    <html><head>
      <link rel="stylesheet" href="style.css">
      <script src='lib/three.min.js'></script>
    </head><body><img src=sprites/a.png></body></html>`
  expect(extractRefs(html).sort()).toEqual(['lib/three.min.js', 'sprites/a.png', 'style.css'])
})

test('extractRefs ignores assignments inside inline scripts', () => {
  // The bug this exists for: a real generator assigning window.location.href sent
  // the archiver chasing a fragment of its own minified JavaScript as a filename.
  const html = `
    <html><body><script>
      window.location.href = "https://example.com/x"
      a.href = n.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream")
    </script><script src="real.js"></script></body></html>`
  expect(extractRefs(html)).toEqual(['real.js'])
})

test('extractRefs skips references that are not ours to store', () => {
  const html = `
    <a href="https://example.com/x">x</a>
    <img src="//cdn.example.com/y.png">
    <img src="data:image/png;base64,AAAA">
    <a href="#section">jump</a>
    <img src="local.png?v=2#frag">`
  // Only the relative one survives, with its query and fragment trimmed off, since
  // those address a view of the file and not a different file.
  expect(extractRefs(html)).toEqual(['local.png'])
})

test('extractRefs reads url() out of CSS', () => {
  const css = `@font-face { src: url("fonts/a.woff2") } .b { background: url(img/b.png) }`
  expect(extractRefs(css, true).sort()).toEqual(['fonts/a.woff2', 'img/b.png'])
})

test('resolveRef resolves against the file that referenced it', () => {
  expect(resolveRef('index.html', 'lib/x.js')).toBe('lib/x.js')
  expect(resolveRef('lib/main.css', 'fonts/a.woff2')).toBe('lib/fonts/a.woff2')
  expect(resolveRef('lib/deep/main.css', '../a.png')).toBe('lib/a.png')
  expect(resolveRef('index.html', './x.js')).toBe('x.js')
})

test('resolveRef refuses anything that leaves the generator directory', () => {
  // A remote gateway's response decides filenames on disk here. Climbing out is
  // refused rather than clamped: clamping would quietly fetch a different, valid
  // path instead of rejecting a hostile one.
  expect(resolveRef('index.html', '../../../etc/passwd')).toBeNull()
  expect(resolveRef('lib/x.css', '../../secrets')).toBeNull()
  expect(resolveRef('index.html', '/etc/passwd')).toBeNull()
  expect(resolveRef('index.html', 'a\\..\\..\\b')).toBeNull()
  expect(resolveRef('index.html', '~')).toBeNull()
  expect(resolveRef('index.html', '')).toBeNull()
  expect(resolveRef('index.html', '.')).toBeNull()
})
