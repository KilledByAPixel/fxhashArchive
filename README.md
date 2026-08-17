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
  owns what, but the actual images and code live on IPFS. If nobody keeps those
  files pinned, the chain will still say a piece exists while the artwork itself
  becomes unretrievable. 372 projects store their code on-chain and are immune;
  everything else depends on IPFS staying alive.
- **One small fxhash dependency remains.** Those same 372 on-chain projects need
  an fxhash-run resolver to *run*. Their images work regardless, and the bytes
  are on-chain, so nothing is lost — but live rendering for them depends on that
  service.
- **Moderation is honored.** 2,692 projects (about 10%) were flagged by fxhash
  for plagiarism or abuse and are hidden, with no way to reveal them. One gap:
  a hand-crafted URL to an individual artwork of a flagged project can still
  reach it. Nothing in the site links there, and it still runs sandboxed.
- **The first page load is heavy** (~6 MB), because search covers the whole
  catalog at once.
- **Unofficial and unaffiliated.** No artwork is stored here. Every image and
  every program streams from IPFS and the Tezos chain when you view it.

## License

MIT for the code — see [LICENSE](LICENSE).

That doesn't extend to the catalog. The data under `public/data/` is factual
record data (ids, titles, tags, addresses, content hashes) captured from
fxhash's public API, not authored here. Rights to the artwork remain with the
artists who made it.
