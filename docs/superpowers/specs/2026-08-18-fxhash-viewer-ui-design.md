# fxhash viewer — UI redesign

Design, 2026-08-18. Status: awaiting review.

## Why

The site opens onto a grid of the *newest* projects. In a 27,430-project archive of a
platform that has shut down, recency is the least interesting ordering there is — it
shows whatever happened to be uploaded last, not what is worth seeing.

Three other things are worth fixing at the same time:

- the artwork grid is only reachable by clicking the site title, which reads as a bug
- "Largest edition" sorts by the edition size an artist chose, not by anything a visitor
  cares about
- the preservation work is invisible: nothing tells a visitor that 396 projects now run
  without IPFS, Tezos, or any network at all

## Routes

```
/            landing page      (new)
/artwork     the grid          (moved from /)
/artists     artist directory  (unchanged)
/token/:slug project           (unchanged)
/gentk/...   iteration         (unchanged)
```

Only the bare root changes meaning. Every shared deep link keeps working.

The header gains **Artwork** and **Artists** tabs; the site title returns to the landing
page.

## Landing page

1. **What this is** — two or three sentences: an unofficial read-only archive of fxhash
   on Tezos, built because the platform went offline.
2. **The numbers** — projects, artists, iterations, seeds captured, projects playable
   offline.
3. **Coverage** — simple bars showing what is archived versus what still depends on IPFS
   being up.
4. **Random artwork** — a strip that reshuffles on each visit.
5. **Most collected** — a strip of the work people engaged with most.

All visuals are plain SVG/CSS. No chart library: it keeps the bundle small and, more
importantly, keeps the page working in a fully offline copy.

## Artwork grid

Sort options become:

| Option | Behaviour |
|---|---|
| **Random** (default) | Shuffled once per visit, stable across "load more" so paging never repeats or drops a project |
| **Most collected** | Ranked by collector activity |
| **Newest** | Current behaviour, kept |

"Largest edition" is removed.

Archived projects get a small badge, and the controls gain a **fully archived only**
toggle — so an artist can check whether their work is covered, which leads naturally to
the preservation request issue.

## No money in the UI

Sale prices and volumes are not displayed anywhere — not on cards, not on detail pages.
This is an archive, not a marketplace, and it cannot be used to buy anything.

The captured market data still exists in `public/data/market` as a historical record, and
still drives the "Most collected" ordering, because it is by far the strongest available
signal of engagement.

### Open question

Ranking by collector spending while never showing it is defensible, but it does mean the
ordering cannot be fully explained on the page. Three ways to resolve this:

- **A.** Rank by spending, label it "Most collected", explain the basis in one sentence in
  the landing page text. Honest, no figures shown. *Recommended.*
- **B.** Rank by number of collectors rather than amount spent, if that can be derived —
  a genuinely non-monetary number, though it still originates in sales data.
- **C.** Rank by iterations minted. Fully non-monetary, but a much weaker signal: the top
  1% of projects account for 17.4% of mints versus 67.9% of collector spending. Large free
  editions would dominate.

The same question applies to the landing page. An earlier draft included a curve showing
that ~1% of projects account for ~68% of collector spending — the argument for why a small
archive captures most of what mattered. That chart is inherently about money, so under this
decision it is **dropped**, and the coverage bars carry the story instead.

## Data

One generated file, `public/data/summary.json` (~200 KB):

- project ids ordered by rank — position *is* the rank, so no figures ship to the client
- the set of archived project ids
- headline counts for the landing page

A build script generates it from the existing snapshots. This avoids loading the 3 MB of
market shards or regenerating the 17 MB catalog, and one fetch serves both the landing page
and the grid.

## Testing

Added to the existing 134-test suite:

- routes resolve, including that `/` is the landing page and `/artwork` is the grid
- random sort is stable across paging — the property most likely to break silently
- badge and filter derive from the archived set
- landing page renders from stubbed summary data
- `summary.json` generation, against a small fixture

## Not in scope

Offline playback itself. The viewer still renders iterations from IPFS; wiring it to prefer
local generators is a separate change and a bigger one.
