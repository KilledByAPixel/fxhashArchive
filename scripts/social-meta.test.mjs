import { test, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

/**
 * The social card is the one part of this site nobody here ever sees fail.
 *
 * A scraper fetches these URLs from its own servers, with no document to resolve a
 * relative path against and no console to complain in. Get the address wrong and
 * the link previews bare on somebody else's timeline, indefinitely, and the only
 * signal is that nobody mentions it. So the values are checked here instead.
 */

const html = readFileSync('index.html', 'utf8')
const PUBLIC = 'public'
const BASE = 'https://killedbyapixel.github.io/fxhashViewer/'

const meta = (attr, name) =>
  new RegExp(`<meta[^>]*\\b${attr}="${name}"[^>]*content="([^"]*)"`, 'i').exec(html)?.[1] ??
  new RegExp(`<meta[^>]*content="([^"]*)"[^>]*\\b${attr}="${name}"`, 'i').exec(html)?.[1] ??
  null

/** The public/ file an absolute site URL refers to. */
const localFileFor = (url) => join(PUBLIC, url.slice(BASE.length))

test('the card image is an absolute URL under the deployed site', () => {
  const image = meta('property', 'og:image')
  expect(image).toBeTruthy()
  // Relative would be dropped by every scraper, which is the failure this catches.
  expect(image.startsWith(BASE)).toBe(true)
})

test('the image it names is actually in the repository', () => {
  // Nothing in the build would notice this: an og:image is never requested by the
  // app itself, so a typo ships and only strangers see the result.
  const path = localFileFor(meta('property', 'og:image'))
  expect(existsSync(path)).toBe(true)
})

test('the declared dimensions match the file', async () => {
  const { width, height } = await sharp(localFileFor(meta('property', 'og:image'))).metadata()
  expect(String(width)).toBe(meta('property', 'og:image:width'))
  expect(String(height)).toBe(meta('property', 'og:image:height'))
})

test('the image is large enough to render as a large card', async () => {
  // Under 600x315 and the platforms fall back to a small square thumbnail, which
  // is the same silent, remote-only failure in a subtler form.
  const { width, height } = await sharp(localFileFor(meta('property', 'og:image'))).metadata()
  expect(width).toBeGreaterThanOrEqual(600)
  expect(height).toBeGreaterThanOrEqual(315)
  expect(meta('name', 'twitter:card')).toBe('summary_large_image')
})

test('og:url points at the site itself', () => {
  expect(meta('property', 'og:url')).toBe(BASE)
})

test('the card describes the site, and the image has alt text', () => {
  // Scraped once and shown to people who have not arrived yet, so it has to stand
  // on its own — and the alt text is what a screen reader gets instead of the art.
  expect(meta('property', 'og:title')).toBeTruthy()
  expect((meta('property', 'og:description') ?? '').length).toBeGreaterThan(40)
  expect((meta('name', 'description') ?? '').length).toBeGreaterThan(40)
  expect((meta('property', 'og:image:alt') ?? '').length).toBeGreaterThan(20)
})
