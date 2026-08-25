import { useEffect, useMemo, useState } from 'react'
import { loadAllTokens, loadSummary, loadCollaborations, isVisible, type Collaborations } from '../lib/data'
import { seededShuffle } from '../lib/shuffle'
import type { LeanToken, Summary } from '../lib/types'
import TokenCard from '../components/TokenCard'
import { bylineLabel } from '../components/Byline'

const PAGE = 60
type SortMode = 'random' | 'collected' | 'newest' | 'oldest'

export default function BrowsePage() {
  const [tokens, setTokens] = useState<LeanToken[] | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [summaryFailed, setSummaryFailed] = useState(false)
  // Credits for the 553 collaborations, whose catalog author is the contract they
  // minted through. Without it those cards name a KT1 address, which credits nobody.
  const [collabs, setCollabs] = useState<Collaborations | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortMode>('random')
  const [shown, setShown] = useState(PAGE)
  const [archivedOnly, setArchivedOnly] = useState(false)
  // One seed per visit, chosen on mount. Re-rolling it during render would
  // reshuffle the grid on every keystroke and every "load more".
  const [seed] = useState(() => Math.floor(Math.random() * 0xffffffff))

  useEffect(() => {
    loadAllTokens().then(setTokens, (e) => setError(String(e)))
    // The summary only affects ordering and badges, so a failure must not blank
    // the grid — the catalog alone is still worth showing. But staying silent about
    // it is misleading: with no summary, archivedIds is empty, so "Fully archived
    // only" would read "0 projects" — which says "none of these are archived"
    // rather than "we don't know" — so the failure must surface as a visible note.
    loadSummary().then(setSummary, () => { setSummary(null); setSummaryFailed(true) })
    // Purely additive: without it, collaborations fall back to showing the contract,
    // which is what they did before and is at least not a wrong name.
    loadCollaborations().then(setCollabs, () => setCollabs(null))
  }, [])

  const rank = useMemo(() => {
    const map = new Map<number, number>()
    summary?.ranked.forEach((id, i) => map.set(id, i))
    return map
  }, [summary])

  const archivedIds = useMemo(() => new Set(summary?.archived ?? []), [summary])

  const visible = useMemo(() => {
    if (!tokens) return []
    const q = query.trim().toLowerCase()
    const filtered = tokens.filter(
      (t) => isVisible(t) &&
        (!archivedOnly || archivedIds.has(t.id)) &&
        (!q ||
          t.name.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          (t.author?.name ?? '').toLowerCase().includes(q)),
    )
    if (sort === 'random') return seededShuffle(filtered, seed)
    if (sort === 'collected') {
      // Unranked projects (no recorded trades) sort last, keeping their own order.
      const last = Number.MAX_SAFE_INTEGER
      return [...filtered].sort((a, b) => (rank.get(a.id) ?? last) - (rank.get(b.id) ?? last))
    }
    // Sort by the date the cards actually show.
    //
    // This used to reverse the catalog, on the grounds that the snapshot is mint
    // date ascending. It is — scripts/snapshot.mjs pages the API with
    // sort: { mintOpensAt: "ASC" } — but `mintOpensAt` is when a mint opens, not
    // when the work was made, and the two come apart badly. Farol was made in
    // November 2023 and had its mint scheduled for April 2026, so reversing put a
    // 2023 project at the head of "Newest" and buried every one of the 1,451
    // visible projects from 2024 onward behind it.
    const dir = sort === 'newest' ? -1 : 1
    return [...filtered].sort((a, b) => {
      // Undated projects sort last whichever way round it is, as unranked ones do
      // above: an unknown date is not a very old one.
      if (!a.createdAt) return b.createdAt ? 1 : 0
      if (!b.createdAt) return -1
      const byDate = a.createdAt.localeCompare(b.createdAt)
      // 1,249 projects share a timestamp with another, so without a tiebreak the
      // order within a second is whatever the sort happens to do with it.
      return (byDate !== 0 ? byDate : a.id - b.id) * dir
    })
  }, [tokens, query, sort, seed, rank, archivedOnly, archivedIds])

  if (error) return <p>Failed to load catalog: {error}</p>
  if (!tokens) return <p>Loading catalog…</p>

  return (
    <div>
      <div className="browse-controls">
        <input
          placeholder="Search projects, tags, artists…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShown(PAGE) }}
        />
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value as SortMode); setShown(PAGE) }}
        >
          <option value="random">Random</option>
          <option value="collected">Most collected</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
        <label className="archived-filter">
          <input
            type="checkbox"
            checked={archivedOnly}
            onChange={(e) => { setArchivedOnly(e.target.checked); setShown(PAGE) }}
          />
          Fully archived only{archivedIds.size > 0 && ` (${archivedIds.size})`}
        </label>
        <span className="count">{visible.length} projects</span>
      </div>
      {summaryFailed && (
        <p className="browse-note">
          Archive and ranking information could not be loaded.
        </p>
      )}
      <div className="token-grid">
        {visible.slice(0, shown).map((t) => (
          <TokenCard
            key={t.id}
            token={t}
            archived={archivedIds.has(t.id)}
            localThumb={summary?.thumbs[String(t.id)]}
            authorLabel={
              collabs?.byProject[String(t.id)]
                ? bylineLabel(collabs.byProject[String(t.id)].collaborators)
                : undefined
            }
          />
        ))}
      </div>
      {shown < visible.length && (
        <button className="load-more" onClick={() => setShown((s) => s + PAGE)}>
          Load more ({visible.length - shown} remaining)
        </button>
      )}
    </div>
  )
}
