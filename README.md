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

The viewer is built around three data tiers, each with a different — and
mostly independent — source:

| Tier | Content | Source | Runtime dependency on fxhash |
|---|---|---|---|
| 1 | Projects + artists | Committed JSON snapshot in `public/data/` | **None** — served from GitHub Pages |
| 2 | Iterations (individual minted artworks), their seeds and traits | [TzKT](https://tzkt.io), a public Tezos blockchain indexer, queried live | **None** — independent operator |
| 3 | Images and artwork code | IPFS, via a multi-gateway fallback chain | **None** for IPFS |

fxhash's own GraphQL API (`api.fxhash.xyz`) is used **only** by
`scripts/snapshot.mjs`, offline, to build the Tier 1 snapshot. It is never
called at runtime — nothing under `src/` references it. If that API goes
away entirely, the site keeps working exactly as it does today, serving the
last committed snapshot; the only thing that stops is future refreshes.

Some supporting facts, verified against the live endpoints while building
this:

- TzKT sends `access-control-allow-origin: *`, so the static site can query
  it directly from the browser with no proxy or backend.
- Public IPFS gateways serve the artwork images as plain `<img>` tags, which
  need no CORS at all.
- Each iteration's live code runs inside an
  `<iframe sandbox="allow-scripts">` with **no** `allow-same-origin` — these
  are untrusted third-party programs, and the sandbox is deliberately strict.

## Local development

```bash
npm install       # install dependencies (package-lock.json is committed)
npm run dev       # start the dev server
npm test          # run the test suite (vitest)
npm run build     # production build to dist/
npm run preview   # serve the production build locally
npm run snapshot  # refresh public/data/ from the live fxhash API
```

## How deployment works

Pushing to `master` triggers `.github/workflows/deploy.yml`, which installs
dependencies, runs the test suite, builds the site with Vite, and publishes
`dist/` to GitHub Pages via the official `actions/deploy-pages` action. No
manual build or upload step is needed once this is wired up.

Separately, `.github/workflows/snapshot.yml` runs every Monday (and can be
triggered manually), re-running `scripts/snapshot.mjs` against the live
fxhash API and committing `public/data/` if the catalog changed. This
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

- **Moderation is honored, deliberately without a bypass.** 2,692 projects
  (9.8% of the catalog) carry fxhash moderation flags (`MALICIOUS`,
  `HIDDEN`, `REPORTED`, `AUTO_DETECT_COPY`) for plagiarism or abuse, and are
  hidden from the browse grid and lookups. There is no toggle to reveal
  them, on purpose.
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
- This is an **unofficial** archive viewer with no affiliation to fxhash.
  It hosts no artwork of its own — everything you see streams live from
  IPFS gateways and the Tezos chain via TzKT.
