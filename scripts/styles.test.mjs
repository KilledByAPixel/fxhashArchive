import { test, expect } from 'vitest'
import { readFileSync } from 'node:fs'

const css = readFileSync('src/styles.css', 'utf8')

/** The declaration block for a selector, as written. */
function rule(selector) {
  const at = css.indexOf(selector)
  expect(at, `${selector} not found in styles.css`).toBeGreaterThanOrEqual(0)
  return css.slice(at, css.indexOf('}', at))
}

test('everything under a running artwork shares one width', () => {
  // This is the bug that shipped, and it was invisible from the code: an archived
  // piece was 640px, a streamed one filled the page, and the buttons under both
  // centred across the full 1200px content area — so they sat under nothing.
  //
  // "Centred under the artwork" only means something if these agree on how wide
  // the artwork is, and they only agree if they read the same number.
  const column = [
    '.iteration-view',
    '.iteration-img',
    '.live-frame',
    '.legacy-note',
    '.iteration-actions',
    '.archived-stage',
    '.archived-frame, .archived-blank',
    '.archived-nav',
    '.archived-caption',
  ]
  for (const selector of column) {
    expect(rule(selector), `${selector} should size itself from --artwork`).toContain(
      'var(--artwork)',
    )
  }
})

test('the width is defined once', () => {
  expect(css.match(/--artwork:/g)).toHaveLength(1)
})

test('a running piece is the same size whichever source it came from', () => {
  // Archived or streamed is our distinction, not the viewer's, and it should not
  // change the size of the art.
  for (const selector of ['.live-frame', '.archived-frame, .archived-blank']) {
    expect(rule(selector)).toContain('aspect-ratio: 1 / 1')
    expect(rule(selector)).toContain('max-width: var(--artwork)')
  }
})

// Frank: opening Rooms or About while a piece was running put the panel *behind*
// the artwork. Nothing in the gallery declared a z-index at all, so the two
// layers stacked by document order — and GalleryView renders the Viewer after
// the Hud, which is exactly backwards for a menu you are meant to reach from
// inside a piece.
test('the HUD stacks above the running artwork, so its panels are reachable', () => {
  const zOf = (selector) => {
    const m = /z-index:\s*(-?\d+)/.exec(rule(selector))
    expect(m, `${selector} declares no z-index, so it stacks by document order`).toBeTruthy()
    return Number(m[1])
  }
  const hud = zOf('.gallery-hud {')
  const viewer = zOf('.gallery-viewer {')
  expect(hud).toBeGreaterThan(viewer)
  // Both are positioned, or a z-index on them means nothing at all.
  for (const s of ['.gallery-hud {', '.gallery-viewer {']) {
    expect(rule(s)).toMatch(/position:\s*(absolute|fixed|relative)/)
  }
})

// Frank: an artist's name in the search results sat a few pixels to the right of
// the count beneath it. `.token-name` carried the *card's* inset — sensible under
// a full-bleed thumbnail, wrong in an artist row, where the name sits beside an
// avatar next to a `.muted` line that has no padding at all. Four places use the
// class and only three of them are cards, so the inset belongs to the card.
test('a name is flush with the line under it, and inset only inside a card', () => {
  /** The block for a rule whose selector is exactly this — not one containing it. */
  const exact = (selector) => {
    const m = new RegExp(`^${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]*)\\}`, 'm').exec(css)
    expect(m, `no rule for exactly \`${selector}\``).toBeTruthy()
    return m[1]
  }
  expect(exact('.token-name')).not.toMatch(/padding/)
  // The card still insets both of its lines, by the same amount, or the name and
  // the author under it would not line up either.
  // `padding: <top> <side>`, where a zero top is written bare rather than as 0rem.
  const side = (block) => /padding:\s*(?:[\d.]+rem|0)\s+([\d.]+rem)/.exec(block)?.[1]
  expect(side(exact('.token-card .token-name'))).toBe(side(exact('.token-author')))
})

// Frank: the two links at the foot of the gallery's About panel were the same
// colour as the prose above them and carried no mark of any kind, so nothing said
// they were links at all — let alone that one leaves the gallery and the other
// leaves the site.
test('the About panel marks its links as links, and says which way each one goes', () => {
  const link = rule('.gallery-about a ')
  // Not the colour of the panel's own text, which is what made them invisible.
  const colourOf = (block) => /color:\s*(#[0-9a-f]{3,6})/i.exec(block)?.[1]?.toLowerCase()
  expect(colourOf(link)).toBeTruthy()
  expect(colourOf(link)).not.toBe(colourOf(rule('.gallery-about {')))
  // An arrow ahead of each: back out of the building, or away to another site.
  expect(rule('.gallery-about a::before')).toMatch(/content:\s*'←/)
  expect(rule('.gallery-about a[target="_blank"]::before')).toMatch(/content:\s*'↗/)
})
