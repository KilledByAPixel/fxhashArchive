# fxhash Static Viewer — Design Spec

**Date:** 2026-08-17
**Status:** Approved design, pre-implementation

## Problem

fxhash.xyz is offline (HTTP 402 — hosting bill lapsed). The generative
art it hosted is not lost: project and iteration records live on the
Tezos blockchain, artwork code and images live on IPFS, and fxhash's
GraphQL API (`api.fxhash.xyz/graphql`) is still answering — for now.

Goal: a simplified, read-only, fully static viewer for the fxhash
catalog, hosted on GitHub Pages. No minting, buying, selling, or wallet
connection. It must keep working even if fxhash's remaining
infrastructure disappears.

## Verified facts (probed 2026-08-17)

- `api.fxhash.xyz/graphql` — alive; full schema; `generativeTokens`,
  `users`, `objkts` queries all return real data with
  `filters/sort/skip/take` paging.
- `api.tzkt.io` — independent Tezos indexer, synced. Indexes both gentk
  contracts:
  - v1 `KT1KEa8z6vWXDJrVqtMrAeDVzsvxat3kHaCE` — 589,146 tokens
  - v2 `KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr` — 226,346 tokens
- On-chain iteration metadata contains everything needed to display and
  run a piece: `artifactUri` (generator IPFS URI with `?fxhash=<hash>`
  and, for fx(params) pieces, `&fxparams=<bytes>` pre-assembled),
  `displayUri`, `thumbnailUri`, `iterationHash`, trait `attributes`,
  and `generatorUri`.
- Join key verified: iteration `metadata.generatorUri` equals the
  project's `generativeUri`. TzKT query
  `/v1/tokens?contract=<gentk>&metadata.generatorUri=<uri>` returns a
  project's iterations in well under 1s.
- Public IPFS gateways (ipfs.io etc.) serve the content.

## Architecture

Single-page app, **Vite + React + TypeScript**, deployed to GitHub
Pages via GitHub Action. **Hash routing** (`#/token/farol`) — GitHub
Pages has no server-side rewrites, so path routing would 404 on deep
links.

We do NOT fork `fxhash-website` (Next.js with wallet machinery woven
throughout). We read it for reference only — IPFS URI conventions,
thumbnail handling.

### Data tiers

| Tier | Content | Source | Runtime dependency |
|---|---|---|---|
| 1 | Project catalog, artist profiles | fxhash API → **snapshot to static JSON, committed** | None (served from Pages) |
| 2 | Iterations: hashes, images, traits, artifactUri | **TzKT, live at runtime** | TzKT (independent of fxhash) |
| 3 | Images and generator code | **IPFS** via gateway chain with fallback | Public gateways |

fxhash's API is used **only at snapshot time**, never at runtime. The
snapshot captures the curation layer that is not on-chain: slugs,
artist display names, bios, avatars, tags, moderation flags. If the
API dies, the site keeps running on the last committed snapshot; only
refreshes stop.

### Snapshot layout (`public/data/`)

- `tokens/index-NNN.json` — ~30 shards, ~1k lean project records each:
  id, slug, name, thumbnailUri, displayUri, generativeUri, supply,
  iterationsCount, createdAt, author {id, name, avatarUri}, tags, flag.
- `tokens/slug-index.json` — slug → shard, for deep links.
- `artists/index.json` — artist directory: id, name, avatarUri, bio
  (from `metadata`), token count.
- `artists/tokens-map.json` — author id → token ids.
- `meta.json` — snapshot timestamp, counts, shard manifest.

Estimated 30–60 MB committed — fine for GitHub Pages.

The snapshot script is a Node script in `scripts/`, run manually now
and by a **weekly cron GitHub Action** that re-snapshots and commits.
The Action failing loudly doubles as a liveness canary for the fxhash
API.

### Pages

1. **Home / Browse** — grid of all projects from Tier 1 shards.
   Infinite scroll; sort by recent / most minted; client-side filter by
   tag and name search (against loaded shards; a small prebuilt search
   index file if that proves clunky).
2. **Project detail** — project info + artist link; hero image
   (`displayUri`); grid of its iterations fetched live from TzKT
   (paged). "Unavailable" panel if TzKT is unreachable.
3. **Iteration detail** — `displayUri` image by default; **"Run live"
   button** loads on-chain `artifactUri` in a sandboxed iframe
   (`sandbox="allow-scripts"`, no same-origin). Shows hash, traits,
   minter.
4. **Artist directory** — searchable list from `artists/index.json`.
5. **Artist page** — profile + their projects via `tokens-map.json`.

### IPFS gateway chain

`ipfs://` URIs rewritten to a gateway; on image error, fall back
through a small ordered list (ipfs.io → dweb.link → cloudflare-ipfs →
others). One shared helper, used for images and the live-render iframe.

### Moderation

Projects whose snapshot `flag` marks them reported/malicious are
hidden by default (honoring fxhash's moderation), behind a
"show flagged" toggle in settings if we ever want one — not in v1 UI.

## Error handling

- TzKT down → iteration grids show a retry-able "unavailable" notice;
  everything Tier-1 keeps working.
- Gateway failures → automatic fallback chain; broken-image
  placeholder after the chain is exhausted.
- Missing slug (bad deep link) → friendly not-found page.
- Snapshot Action failure → red CI run, no site impact.

## Testing

- Unit: snapshot script transforms (record → lean shard), ipfs-URI
  helper, TzKT query builder, slug lookup. Vitest.
- Integration: snapshot script against the live API with `take: 5`
  (skipped in CI if API is dead).
- Manual: deep-link routing on the deployed Pages site; live-render
  iframe on a handful of known-heavy pieces.

## Out of scope (v1)

- Articles/essays, marketplace anything, wallet connect, minting,
  pricing/listing data, full iteration snapshot (~815k records —
  feasible later if TzKT ever looks shaky), fx(text) articles,
  curated collections.

## Open risks

- **CORS from `*.github.io` to TzKT and IPFS gateways** — TzKT is
  documented as open CORS and gateways generally are; verify in the
  first implementation step with a real browser test before building
  on top.
- **IPFS pinning decay** — if fxhash stops paying pinning services,
  content could slowly vanish from gateways. Preservation/re-pinning
  is a separate project; this viewer degrades per-image, not
  catastrophically.
- **v0 (pre-2022) quirks** — earliest gentk v1 tokens may have metadata
  shape differences; snapshot script must tolerate missing fields.
