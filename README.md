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
programs.

## What is preserved

fxhash is not coming back, so this repository also keeps the parts that would
otherwise be lost with it.

**Every seed.** All 1,802,387 of them. A seed is what turns a project's
generator into one specific artwork. Tezos stores only a pointer to a JSON file
on IPFS, and the seed lives inside that file — that is where these were read
from, and the only place a seed can simply be looked up.

Most have a second, harder home: an fxhash seed is usually the hash of the
operation that minted the piece, so the value does survive on chain — as the
*name* of an operation, not as data inside one. Recovering seeds that way means
indexing the chain and joining every token to its mint operation. That is a
rebuild, not a lookup, and it does not cover everything: on the newest gentk
contract fxhash stopped deriving seeds from mint operations at token 46,890,
and the **162,315 seeds after it, 9% of the archive, exist nowhere else**.
Those are the ones that go when the pins do. All of it fits in 327 MB.

**Generator code for 420 projects.** A generator plus a seed is everything
needed to recreate a piece, so those projects work with no IPFS, no Tezos, and
no internet at all — a copy of this repository is enough. The full catalog would
run to 80–150 GB, so the selection is ranked by how much collectors engaged with
each project: those 420 are about 1.5% of the catalog and account for **71.6%**
of everything ever spent on the platform.

One preview image per archived project is stored too (50 MB), so the grid still
has something to show with IPFS unreachable. Everything else streams as before:
for an archived project the generator and seed reproduce any image at any
resolution, which is better than a stored JPEG.

Artwork runs in a sandboxed iframe with no same-origin access, which is what
keeps ~400 unaudited third-party programs away from this site. A side effect is
that a piece cannot read its *own* images: the sandbox gives it an opaque origin,
so its files count as cross-origin and taint any canvas they touch. 57 projects
do exactly that. Each of those gets a generated `_run.html` — the artist's
document with one script in front of it that makes those images request CORS.
The artist's `index.html` is never modified, and the other 363 projects run it
directly. See `scripts/cors-shim.mjs`.

**What the artists said about it.** The description of every project — 27,422 of
the 27,430 have one — plus the text fxhash showed on each individual iteration.
382 bytes on average, 21.6 MB in total, and for most of this art the only prose
anyone ever wrote about it. It survives in two places: fxhash's API, which is
still answering despite the site being switched off for non-payment, and the
metadata JSON on IPFS, behind exactly the pins this archive exists to outlive.

**Who made the work.** 553 projects were minted through fxhash's shared
collaboration contracts, which meant the catalog recorded a KT1 address as the
artist and no name at all. Each of those contracts names its members in its own
on-chain storage, so all 427 were read out: 553 projects, 717 artists. Names came
from fxhash's on-chain user registry, all 18,855 of them, which is also the only
surviving source for anyone who collaborated without ever releasing work of their
own. 41 addresses have no name recorded anywhere and are shown as addresses.

### Asking for work to be archived

There is room for more. Most generators are under 1 MB, so if you would like a
project included, open a
[preservation request](../../issues/new?template=preserve-request.yml).

Artists' own requests are honored regardless of trading volume — the ranking is
just a way to choose when nobody has asked — and regardless of size. Automatic
selection skips anything over 10 MB, so that a few large outliers cannot eat the
budget while nobody has asked for them, but a request is a request: Brutal Nature
is 29 MB, almost all of it the photographs it collages, and those are the artwork.
If space ever runs out the answer will be said out loud rather than applied as a
silent size limit.

The same applies in reverse: if your generator is archived here and you would
rather it were not, open an issue and it will be removed.

## Running it locally

```bash
npm install
npm run dev       # dev server
npm test          # tests
npm run build     # production build
```

Pushing to `master` builds and publishes to GitHub Pages automatically.

## Honest limitations

- **This is a frozen archive, not a mirror.** The catalog was captured at a
  point in time and won't grow. Nothing new is being minted on a dead platform.
- **The real long-term risk is IPFS, not fxhash.** The blockchain records who
  owns what, but the artwork itself lives on IPFS. If nobody keeps those files
  pinned, the chain will still say a piece exists while the artwork becomes
  unretrievable. Every seed is now held here, and 420 projects have their code
  here too; 372 more store their code on-chain and cannot be lost. The remaining
  ~26,600 projects still depend on IPFS staying alive.
- **Public IPFS gateways are getting harder to use.** ipfs.io, dweb.link and
  gateway.pinata.cloud now answer browsers with a Cloudflare challenge, which
  cannot be framed — so artwork simply stopped running through them, while
  answering scripts with a cheerful 200 the whole time. The site has moved to
  three that still work; `npm run check:gateways` probes them the way a browser
  does, and is the check that was missing.
- **371 on-chain projects still need an fxhash resolver to run.** Their code is
  stored on-chain via `onchfs://` rather than IPFS, so nothing can be lost, but
  reading it back currently goes through a service fxhash runs. The archiver can
  now fetch them, so any of them can be made fully local on request.
- **Moderation is honored.** 2,692 projects (about 10%) were flagged by fxhash
  for plagiarism or abuse and are hidden, with no way to reveal them, and the
  archiver will not store their code either. One gap: a hand-crafted URL to an
  individual artwork of a flagged project can still reach it. Nothing in the site
  links there, and it still runs sandboxed.
- **Browsing all 27,430 projects is a heavy page load** (~16.5 MB), because
  search covers the whole catalog at once. The front page is not — it ships the
  few dozen cards it needs, about 200 KB.
- **Unofficial and unaffiliated.** Nothing here is endorsed by fxhash or by the
  artists. Most artwork is not stored here at all: images and programs stream
  from IPFS and the Tezos chain as you view them. The exception is the 420
  archived generators described above, which are stored, and which any artist
  can have removed on request.

## License

MIT for the code — see [LICENSE](LICENSE).

That doesn't extend to anything under `public/data/`, which is two different
things:

- **Record data** — ids, titles, tags, addresses, seeds, content hashes, market
  totals. Captured from public APIs and the Tezos chain, not authored here.
- **Archived generator code** — `public/data/generators/` holds the actual
  programs written by the artists behind 420 projects, copied from IPFS and from
  Tezos so they survive both. These
  are their work, under whatever terms they published it. They are kept here to
  preserve it, not to relicense it, and any artist can have their generator
  removed by opening an issue.

Rights to all of the artwork remain with the artists who made it.
