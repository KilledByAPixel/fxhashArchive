# fxhash viewer

An unofficial, read-only archive viewer for [fxhash](https://fxhash.xyz), the
generative-art platform on Tezos. fxhash's own site is currently offline
(its hosting returns HTTP 402 — unpaid bill), taking down public access to
~27,000 generative art projects and the minted artworks ("iterations") made
from them. This project is a stopgap: a static site that lets people browse
the catalog and run the art again, without needing fxhash's servers to be up.

It is **not affiliated with fxhash** in any way, and it hosts **no artwork
itself** — every image, every piece of executable art code, and every live
iteration record streams from public infrastructure (IPFS gateways and a
public Tezos indexer) at view time.

## Why this keeps working when fxhash doesn't

The viewer is built around four data sources, none of which fxhash has to
serve at view time:

| Tier | Content | Source | Runtime dependency on fxhash |
|---|---|---|---|
| 1 | Projects + artists | Committed JSON snapshot in `public/data/` | **None** — served from GitHub Pages |
| 2 | Project → iteration id mapping | Committed JSON in `public/data/iterations/` | **None** — served from GitHub Pages |
| 3 | Iterations (individual minted artworks), their seeds and traits | [TzKT](https://tzkt.io), a public Tezos blockchain indexer, queried live | **None** — independent operator |
| 4 | Images and artwork code | IPFS, via a multi-gateway fallback chain | **None** for IPFS |

Tiers 1 and 2 were both **captured from fxhash's own GraphQL API**
(`api.fxhash.xyz`) while it was still answering — this viewer is independent
of fxhash *at runtime*, not independent of fxhash as a source of record.
That API is used only by `scripts/snapshot.mjs` and
`scripts/snapshot-iterations.mjs`, offline; nothing under `src/` references
it. If it goes away entirely, the site keeps working exactly as it does
today; only future refreshes stop.

### Why the iteration mapping exists (tier 2)

Iterations can in principle be found on-chain by joining gentk tokens on
their `metadata.generatorUri`. That join misses roughly **a third** of all
gentk tokens, because tokens minted in fxhash's launch era carry no
`generatorUri` at all — so a viewer relying on it alone would show early,
historically important projects as though nothing had ever been minted from
them. `public/data/iterations/` avoids that by naming the iterations
outright: **27,430 projects → 1,845,509 iteration ids** (`FX{version}-{tokenId}`),
sharded one file per token shard. The ids are then resolved live against
TzKT, so the artwork data itself still comes from the chain — the committed
mapping only answers *which* tokens belong to a project.

Some supporting facts, verified against the live endpoints while building
this:

- TzKT sends `access-control-allow-origin: *`, so the static site can query
  it directly from the browser with no proxy or backend.
- Public IPFS gateways serve the artwork images as plain `<img>` tags, which
  need no CORS at all. The chain is `ipfs.io` → `dweb.link` →
  `gateway.pinata.cloud`, tried in order; an image only falls back to a
  placeholder once all three have failed. That's two independent operators
  across three endpoints, not three: `ipfs.io` and `dweb.link` are both
  Protocol Labs / Interplanetary Shipyard endpoints (path-style vs.
  subdomain-style of the same service), while `gateway.pinata.cloud` is a
  genuinely separate operator. (Entries are checked for being both alive and
  independent: `cloudflare-ipfs.com` was removed after Cloudflare retired the
  host, and `w3s.link` / `nftstorage.link` are not used because they redirect
  onto `dweb.link`, which is already in the chain — the same duplication test
  that trims the `ipfs.io`/`dweb.link` pair down to one operator above.)
- Each iteration's live code runs inside an
  `<iframe sandbox="allow-scripts">` with **no** `allow-same-origin` — these
  are untrusted third-party programs, and the sandbox is deliberately strict.
  Only `ipfs://` and `onchfs://` URIs are ever resolved into that frame; every
  other scheme, `http(s):` included, is rejected outright. Real records use
  nothing else, so allowing them would only have served a hostile URL.

## Local development

```bash
npm install       # install dependencies (package-lock.json is committed)
npm run dev       # start the dev server
npm test          # run the test suite (vitest)
npm run typecheck # tsc --noEmit (vite build does not typecheck)
npm run build     # production build to dist/
npm run preview   # serve the production build locally
npm run snapshot  # refresh public/data/ from the live fxhash API
npm run snapshot:iterations  # refresh the project -> iteration id mapping
```

`npm run snapshot` refuses to write if the catalog it fetched is smaller than
95% of the committed one, since a mid-run API failure looks exactly like the
end of the catalog. Use `--out <dir>` for partial or experimental runs.

## How deployment works

Pushing to `master` triggers `.github/workflows/deploy.yml`, which installs
dependencies, typechecks, runs the test suite, builds the site with Vite, and
publishes `dist/` to GitHub Pages via the official `actions/deploy-pages`
action. No manual build or upload step is needed once this is wired up.

Separately, `.github/workflows/snapshot.yml` runs every Monday (and can be
triggered manually), re-running `scripts/snapshot.mjs` against the live
fxhash API and committing `public/data/` if the catalog changed. When it does
commit, it explicitly dispatches `deploy.yml` — GitHub does not trigger
workflows from pushes made with the default `GITHUB_TOKEN`, so without that
step the refreshed catalog would never reach the live site. This
doubles as a **liveness canary**: the day fxhash's API is finally retired
for good, this job starts failing loudly in the Actions tab, while the
committed snapshot — and the live site built from it — stays exactly as it
is. Nothing about the deployed viewer breaks; only future catalog refreshes
stop.

## Publishing this for the first time

This repository has no GitHub remote configured yet — none was created as
part of building it, since pushing to a new public repo is something only
you should choose to do. To publish:

1. Create a new repository on GitHub (public, so Pages can serve it on the
   free tier), without initializing it with a README/license/gitignore.
2. Add it as a remote and push:
   ```bash
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin master
   ```
3. In the repository's **Settings → Pages**, set **Source** to
   **GitHub Actions**. (You do not need to pick a branch/folder — the
   `deploy.yml` workflow handles that.)
4. Push (or re-run `Deploy to GitHub Pages` from the Actions tab) and the
   site will build and publish automatically. The Pages URL appears in the
   workflow's summary once it completes.
5. Verify on the real origin (this matters — it's the definitive CORS
   check, since some cross-origin behavior only shows up from a real
   `*.github.io` host, not from `localhost`):
   - Open the Pages URL — the catalog grid should render.
   - Open a project — its iterations should load from TzKT (watch the
     devtools network tab for CORS errors).
   - Open an iteration — the image should load, and "Run live" should
     execute the piece.
   - Hard-refresh a deep link such as `.../#/token/<slug>` — it should not
     404 (hash-based routing means GitHub Pages never sees the route, so
     this should just work, but it's worth checking once for real).

## Known limitations

- **Moderation is honored, deliberately without a bypass — for projects.**
  2,692 projects (9.8% of the catalog) carry fxhash moderation flags
  (`MALICIOUS`, `HIDDEN`, `REPORTED`, `AUTO_DETECT_COPY`) for plagiarism or
  abuse, and are hidden from the browse grid, from artist pages, and from
  project lookup by slug. There is no toggle to reveal them, on purpose.
  This is enforced in the data layer — `findTokenBySlug` resolves a flagged
  slug to not-found via `isVisible` — so a direct `#/token/<slug>` link
  cannot reach a flagged project, and no in-app link ever points at one.
  **This does not extend to individual iterations.** `#/gentk/<contract>/
  <tokenId>` resolves a minted token directly against TzKT, with no
  moderation check on that path — a hand-crafted URL naming an iteration
  of a flagged project can still reach it and will still offer "Run live".
  Closing that would need a reverse index from iteration id back to its
  project, which does not exist yet. Two things bound the exposure in the
  meantime: nothing in the app links to that URL (the only `/gentk/` links
  live on project pages, and flagged project pages are unreachable), and
  whatever code runs there is confined to the same `sandbox="allow-scripts"`
  iframe, with no `allow-same-origin`, as every other iteration.
- **One partial dependency on fxhash remains.** 372 projects (~1.4% of the
  catalog) and roughly 12% of newer iterations store their code via
  `onchfs://` URIs — fxhash's *on-chain* filesystem, which is different from
  IPFS. The only working resolver currently known for this scheme is
  `https://onchfs.fxhash2.xyz/`, which is operated by fxhash. Live renders
  of those pieces depend on that resolver being up; their thumbnails are on
  IPFS and display regardless. Because the underlying bytes live on-chain,
  a future independent resolver could always recover them — this is not
  data loss, just a temporary single point of failure for live rendering.
- **The browse page loads the entire catalog up front** — about 6.0 MB
  gzipped — because search and sort span all 27,430 projects. This is an
  accepted tradeoff for v1; revisit if real-world load time is a problem.
- **`iterationsCount` in fxhash's own data is unreliable** (it's zero for
  83.6% of projects, since it only ever counted mints from the v2 era of
  fxhash). Because of this, the UI shows the project's edition size plus a
  live count from TzKT instead of trusting that field. Please don't "fix"
  it back to using `iterationsCount` — it undercounts almost everything.
- **The committed data is a point-in-time capture, and it came from fxhash.**
  Both the catalog and the project → iteration mapping were pulled from
  `api.fxhash.xyz` while it still answered. They cannot be regenerated from
  scratch if that API stays down (the mapping in particular has no equivalent
  on-chain source — that is the whole reason it is committed), and they will
  not grow on their own. Nothing new is being minted on a dead platform, so
  this is a frozen archive rather than a live mirror.
- This is an **unofficial** archive viewer with no affiliation to fxhash.
  It hosts no artwork of its own — every image and every piece of art code
  you see streams live from IPFS gateways and the Tezos chain via TzKT.
