// Frank wanted https://killedbyapixel.github.io/fxhashArchive/gallery to work,
// rather than only the /#/gallery form.
//
// GitHub Pages serves files, not routes: it answers a path only if something is
// there. For a route that is *known at build time* — and the museum is one, where
// /token/:slug is 27,430 — the fix is not a redirect hack but simply putting a
// file at that path. public/ is copied to the site root, so public/gallery/index.html
// is served at /gallery/ (Pages redirects /gallery to it), and it forwards into
// the hash route the app actually uses.
//
// This is the pair that can drift: a stub pointing at a route that no longer
// exists, or a route renamed without the stub following.

import { test, expect } from 'vitest'
import { readFileSync } from 'node:fs'

const stub = readFileSync('public/gallery/index.html', 'utf8')
const app = readFileSync('src/App.tsx', 'utf8')

test('the /gallery stub forwards to the hash route the app really has', () => {
  expect(app).toContain(`path: '/gallery'`)
  // relative, so it works from a project page, a custom domain, and the offline
  // zip alike — the site never hard-codes where it is hosted
  expect(stub).toContain('../#/gallery')
  expect(stub).not.toMatch(/https?:\/\/[^"']*gallery/)
  expect(stub).toContain('location.replace')     // replace, not assign: Back must leave, not loop
})

test('the stub stands on its own: no build assets, and it works without JavaScript', () => {
  // It is served from a directory one level down, where any relative asset path
  // would resolve wrongly; it must need none.
  expect(stub).not.toContain('/assets/')
  expect(stub).not.toContain('<script type="module"')
  expect(stub).toMatch(/<meta[^>]+http-equiv=["']refresh["']/i)
  expect(stub).toMatch(/<a [^>]*href=["']\.\.\/#\/gallery["']/)
  expect(Buffer.byteLength(stub)).toBeLessThan(2048)
})
