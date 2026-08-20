# Changelog

Release notes live here, not in the GitHub release form. The workflow reads the
section matching the tag and publishes it — so the notes are versioned with the
code, and they end up inside the archive rather than only on a website that could
go the way fxhash did.

To cut a release: add a `## vX.Y.Z` section below, set the same version in
`package.json`, then push the tag. Anything under the heading becomes the release
body verbatim.

## v1.0.0

The first published archive.

**What it holds**

- fxhash's Tezos catalog — 27,430 projects and 5,407 artists
- all **1,802,387 seeds**, including 162,315 that exist nowhere else at all
- generator code for 420 projects, which run with no network of any kind
- 27,422 project descriptions, in the artists' own words
- 553 collaborations read back out of on-chain contract storage, naming 717
  artists the catalog had recorded only as a contract address
- market totals that existed nowhere but fxhash's own API

A seed is what turns a generator into one specific artwork. For the 420 archived
projects, a generator and a seed together are everything needed to redraw any
edition exactly — offline, indefinitely. For the rest, this holds the records and
the seeds while the artwork itself still depends on IPFS.

**The download.** `fxhash-archive-v1.0.0.zip` is all of that plus the viewer, in
one 394 MB file. Unzip it, serve the folder over HTTP, and it runs with no
internet. `README.txt` inside explains how — in short, do not open `index.html`
directly, because browsers block `fetch()` on `file://` and the page will look
broken when it is not.

**Known gaps**, set out in full in the readme: roughly 26,600 projects still
depend on somebody keeping IPFS files pinned; 370 projects store their code on
chain but need a resolver fxhash runs to read it back; and the Ethereum and Base
work is not covered at all.

Nothing here is endorsed by fxhash or by any artist, and nothing is for sale. Any
artist can have their generator removed by opening an issue.
