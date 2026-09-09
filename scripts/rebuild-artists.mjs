// Rewrite artists/index.json so the directory's project count is the one the
// artist's own page shows.
//
// WHY THIS EXISTS
// ---------------
// The index is normally written by snapshot.mjs, straight from the fxhash API — which
// is still alive: it was the *website* that started answering 402 when fxhash shut
// down, and an earlier version of this comment claimed the API had gone with it. It
// had not, and the weekly refresh proved it by overwriting this file on 2026-08-31
// with a version that had none of the corrections below.
//
// So this exists for the corrections the API cannot make: it knows nothing of
// collaborations recovered from contract storage, and nothing of which avatars this
// repository has stored. snapshot.mjs applies both itself now, and this rebuilds the
// file from what is committed — the token shards carry each project's author and
// moderation flag — without waiting a week or asking the network for anything.
//
// The defect: a row counted a project only under `token.author.id`, over the raw
// catalog. An artist page counts their own *and* their collaborative projects and
// hides moderated ones, so the two disagreed for 1,574 of 5,407 artists. See
// reviseArtists in snapshot-lib.mjs for what the corrected count means, and
// snapshot-conformance.test.mjs for the assertion that the two agree.
//
// Identity — name, avatar, description — is carried through from the existing file
// untouched. It cannot be rebuilt: a lean token holds no author description.
//
// Usage:
//   node scripts/rebuild-artists.mjs [--out DIR] [--dry-run]

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { markLocalAvatars, reviseArtists } from './snapshot-lib.mjs'

const args = process.argv.slice(2)
const outArg = args.indexOf('--out')
const OUT = outArg >= 0 ? args[outArg + 1] : 'public/data'
const DRY = args.includes('--dry-run')

const read = async (...p) => JSON.parse(await readFile(join(OUT, ...p), 'utf8'))

const before = await read('artists', 'index.json')
const collaborations = await read('collaborations.json')
const shards = (await readdir(join(OUT, 'tokens'))).filter((f) => /^index-\d{3}\.json$/.test(f)).sort()
const tokens = (await Promise.all(shards.map((f) => read('tokens', f)))).flat()

console.log(`${tokens.length} projects, ${before.length} artists listed`)

// Which artists have their avatar stored here, from whatever archive-avatars.mjs has
// managed to fetch so far. Recorded in this file because it is the one both the
// artists list and an artist's own page already load.
const avatarFiles = await readdir(join(OUT, 'avatars')).catch(() => [])
const after = markLocalAvatars(reviseArtists(before, tokens, collaborations), avatarFiles)

const kept = new Map(after.map((a) => [a.id, a]))
const contracts = new Set(Object.values(collaborations.byProject).map((c) => c.contract))
const droppedContracts = before.filter((a) => contracts.has(a.id)).length
const droppedEmpty = before.length - after.length - droppedContracts
const changed = before.filter((a) => kept.has(a.id) && kept.get(a.id).tokenCount !== a.tokenCount)
const raised = changed.filter((a) => kept.get(a.id).tokenCount > a.tokenCount).length

console.log(`dropped ${droppedContracts} collaboration contracts and ${droppedEmpty} artists with nothing visible`)
console.log(`corrected ${changed.length} counts (${raised} raised by collaborations, ${changed.length - raised} lowered by moderated work)`)
console.log(`${after.length} artists remain, ${after.filter((a) => a.avatar).length} with an avatar stored here`)

// A count that moved by a lot is worth seeing, not just tallying.
for (const a of [...changed].sort((x, y) => Math.abs(kept.get(y.id).tokenCount - y.tokenCount) - Math.abs(kept.get(x.id).tokenCount - x.tokenCount)).slice(0, 5)) {
  console.log(`  ${a.name ?? a.id}: ${a.tokenCount} -> ${kept.get(a.id).tokenCount}`)
}

if (DRY) {
  console.log('\n--dry-run: nothing written')
} else {
  await writeFile(join(OUT, 'artists', 'index.json'), JSON.stringify(after))
  console.log(`\nwrote ${join(OUT, 'artists', 'index.json')}`)
  console.log('run `npm run summary` next: its artist count reads this file\'s length')
}
