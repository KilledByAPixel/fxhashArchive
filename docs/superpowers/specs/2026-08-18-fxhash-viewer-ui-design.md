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
   being up, and one curve showing that ~1% of projects account for ~68% of collector
   spending, which is why a small archive covers most of what mattered.
4. **Random artwork** — a strip that reshuffles on each visit.
5. **Most collected** — a strip of the work people engaged with most.

Art comes before statistics in visual weight: the numbers explain the archive, but the
page should look like a gallery, not a dashboard.

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

## Money, downplayed

Sales figures are shown where they explain something, in tez, never converted to dollars.
The site should read as being about the art; the money is context, not the point.

Concretely:

- **Grid cards: no figures.** Browsing stays about the work. This is the rule that matters
  most, because the grid is where nearly all browsing happens, and prices on a wall of
  cards would turn it into a sales chart.
- **Detail pages: one line among the other facts**, beside edition size and mint date —
  total traded and highest sale. Historical record, presented at the same weight as
  everything else, not featured.
- **Landing page: the concentration curve**, showing that ~1% of projects account for
  ~68% of collector spending. This earns its place because it is the argument for why a
  396-project archive captures most of what mattered.

Only **historical totals** are shown — traded volume and highest sale. Floor prices and
current listings are deliberately excluded: they describe a live market that no longer
exists, so showing them would imply an action a visitor cannot take.

"Most collected" therefore ranks by collector spending, and that basis can be stated
plainly in the landing page text rather than left unexplained.

## Data

One generated file, `public/data/summary.json` (~200 KB):

- project ids ordered by rank — position *is* the rank, so no per-project figures are
  needed for sorting or for the grid
- the set of archived project ids
- headline counts for the landing page
- a dozen precomputed points for the concentration curve, so the landing page never loads
  the market shards to draw it

Per-project tez figures are needed only on a detail page, and load lazily from that
project's existing market shard (~100 KB) when the page opens.

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
