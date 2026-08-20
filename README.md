# fxhash viewer

**→ [killedbyapixel.github.io/fxhashViewer](https://killedbyapixel.github.io/fxhashViewer/)**

An unofficial, read-only way to browse the art from [fxhash](https://fxhash.xyz)
while fxhash itself is down. Its site currently returns a billing error, which
took public access to ~27,000 generative art projects offline with it.

This is a stopgap. You can browse the catalog, look through artists, and run the
original artworks again — no wallet, no minting, no marketplace.

**Tezos only.** fxhash also published work on Ethereum and Base, and none of that
is here. Its Tezos and EVM sides are served by different backends, and only the
Tezos one was reachable while this was built. Everything below is about the
Tezos catalog: 27,430 projects and 5,407 artists.

## What you can do here

- **Browse and search** the whole Tezos catalog, by project, tag or artist.
- **Run the artwork** — not a picture of it. Every piece is the artist's own
  program, re-run with the seed that produced the edition you are looking at, so
  what you see is the piece as it was minted.
- **Step through an edition** with next/previous, on any project, whether or not
  its code is stored here.
- **Follow a piece to the chain.** Each artwork links to its token, its minter and
  its current owner on [tzkt.io](https://tzkt.io) — often not the same person who
  minted it — and to [objkt.com](https://objkt.com) for what it has sold for.

## Why it still works

The catalog is captured into this repository as plain JSON, so browsing never
touches fxhash. Individual artworks are looked up live on [TzKT](https://tzkt.io),
an independent public Tezos indexer, and the images and artwork code stream from
IPFS. None of those need fxhash to be online.

fxhash's own API was used only to *build* the snapshot, offline. If it disappears
tomorrow the site keeps working exactly as it does today — only future refreshes
stop. A weekly job tries to refresh the catalog and will start failing loudly
the day that API is finally switched off.

Artwork runs in a locked-down sandbox, since these are arbitrary third-party
programs. That takes away a few things a piece may need — reading its own images,
storing settings, starting a worker — so a small compatibility script puts them
back without ever modifying what the artist wrote. The details, and why each
choice was made, are in [`scripts/sandbox-shim.mjs`](scripts/sandbox-shim.mjs);
[`/sandbox-check.html`](https://killedbyapixel.github.io/fxhashViewer/sandbox-check.html)
reports which of them still work in your browser.

## For artists

**To have your work archived:** there is room for more, and most generators are
under 1 MB. Open a
[preservation request](../../issues/new?template=preserve-request.yml).

Artists' own requests are honored regardless of trading volume — the ranking below
is just a way to choose when nobody has asked — and regardless of size. Automatic
selection skips anything over 10 MB so a few large outliers cannot quietly eat the
budget, but a request is a request: Brutal Nature is 29 MB, almost all of it the
photographs it collages, and those are the artwork. If space ever runs out, that
will be said out loud rather than applied as a silent size limit.

**To have your work removed:** open an issue and it will be taken out. Removals
are recorded so they stick, rather than being undone the next time the archive is
rebuilt.

**Nothing here is endorsed by fxhash or by any artist.** Most artwork is not
stored here at all — images and programs stream from IPFS and the Tezos chain as
you view them. The exception is the 420 archived generators described below.

## What is preserved

fxhash is not coming back, so this repository also keeps the parts that would
otherwise be lost with it.

**Every seed.** All 1,802,387 of them. A seed is what turns a project's generator
into one specific artwork. Tezos stores only a pointer to a JSON file on IPFS, and
the seed lives inside that file — that is where these were read from, and the only
place a seed can simply be looked up.

Most have a second, harder home: an fxhash seed is usually the hash of the
operation that minted the piece, so the value does survive on chain — as the *name*
of an operation, not as data inside one. Recovering seeds that way means indexing
the chain and joining every token to its mint operation, which is a rebuild rather
than a lookup. And it does not cover everything: on the newest gentk contract
fxhash stopped deriving seeds from mint operations at token 46,890, and the
**162,315 seeds after it, 9% of the archive, exist nowhere else**. Those are the
ones that go when the pins do.

**Generator code for 420 projects.** A generator plus a seed is everything needed
to recreate a piece, so those projects work with no IPFS, no Tezos, and no internet
at all — a copy of this repository is enough. The full catalog would run to
80–150 GB, so the selection is ranked by how much collectors engaged with each
project: those 420 are about 1.5% of the catalog and account for **71.9%** of
everything ever spent on the platform. One small preview per archived project is
stored alongside, so the grid still shows something when IPFS is unreachable.

**What the artists said about it.** The description of every project — 27,422 of
the 27,430 have one — plus the text fxhash showed on each individual iteration.
382 bytes on average and, for most of this art, the only prose anyone ever wrote
about it. It survives in two places: fxhash's API, which is still answering despite
the site being switched off, and the metadata on IPFS, behind exactly the pins this
archive exists to outlive.

**Who made the work.** 553 projects were minted through fxhash's shared
collaboration contracts, which meant the catalog recorded a KT1 address as the
artist and no name at all. Each of those contracts names its members in its own
on-chain storage, so all 427 were read out: 553 projects, 717 artists. Names came
from fxhash's on-chain user registry, all 18,855 of them, which is also the only
surviving source for anyone who collaborated without ever releasing work of their
own. 41 addresses have no name recorded anywhere and are shown as addresses.

## Honest limitations

- **This is a frozen archive, not a mirror.** The catalog was captured at a point
  in time and won't grow. Nothing new is being minted on a dead platform.
- **The real long-term risk is IPFS, not fxhash.** The blockchain records who owns
  what, but the artwork itself lives on IPFS. If nobody keeps those files pinned,
  the chain will still say a piece exists while the artwork becomes unretrievable.
  Every seed is now held here, and 420 projects have their code here too; 372 more
  store their code on-chain and cannot be lost. The remaining ~26,600 projects
  still depend on IPFS staying alive.
- **370 on-chain projects still need an fxhash service to run.** Their code is
  stored on chain via `onchfs://` rather than IPFS, so nothing can be lost, but
  reading it back currently goes through a resolver fxhash runs. Any of them can be
  made fully local on request.
- **Public IPFS gateways are getting harder to use.** Several large ones now answer
  browsers with a challenge page that cannot be framed, so artwork silently stopped
  running through them. The site has moved to three that still work, and there is a
  check (`npm run check:gateways`) that probes them the way a browser does.
- **Moderation is honored.** 2,692 projects (about 10%) were flagged by fxhash for
  plagiarism or abuse and are hidden, with no way to reveal them, and their code is
  not archived either. One gap: a hand-crafted URL to an individual artwork of a
  flagged project can still reach it. Nothing in the site links there, and it still
  runs sandboxed.
- **Browsing all 27,430 projects is a heavy page load** (~16.5 MB), because search
  covers the whole catalog at once. The front page is not — it ships the few dozen
  cards it needs, about 200 KB.

## For developers

```bash
npm install
npm run dev       # dev server
npm test          # tests
npm run build     # production build
```

Pushing to `master` builds and publishes to GitHub Pages automatically.

The interesting parts are documented where they live rather than here:
`scripts/` holds the capture and archiving tools, each explaining what it captures
and why that source is the one that matters; `scripts/sandbox-shim.mjs` covers
running untrusted art safely; and `data/preserve.json` records which projects are
archived, which are excluded, and the reason for each.

## License

MIT for the code — see [LICENSE](LICENSE).

That doesn't extend to anything under `public/data/`, which is two different
things:

- **Record data** — ids, titles, tags, addresses, seeds, content hashes, market
  totals. Captured from public APIs and the Tezos chain, not authored here.
- **Archived generator code** — `public/data/generators/` holds the actual programs
  written by the artists behind 420 projects, copied from IPFS and from Tezos so
  they survive both. These are their work, under whatever terms they published it.
  They are kept here to preserve it, not to relicense it, and any artist can have
  their generator removed by opening an issue.

Rights to all of the artwork remain with the artists who made it.
