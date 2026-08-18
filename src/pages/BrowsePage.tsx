import { useEffect, useMemo, useState } from 'react'
import { loadAllTokens, loadSummary, isVisible } from '../lib/data'
import { seededShuffle } from '../lib/shuffle'
import type { LeanToken, Summary } from '../lib/types'
import TokenCard from '../components/TokenCard'

const PAGE = 60
type SortMode = 'random' | 'collected' | 'newest'

export default function BrowsePage() {
  const [tokens, setTokens] = useState<LeanToken[] | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
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
    // the grid — the catalog alone is still worth showing.
    loadSummary().then(setSummary, () => setSummary(null))
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
    return [...filtered].reverse() // snapshot is mint-date ASC, so reverse = newest first
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
        </select>
        <label className="archived-filter">
          <input
            type="checkbox"
            checked={archivedOnly}
            onChange={(e) => { setArchivedOnly(e.target.checked); setShown(PAGE) }}
          />
          Fully archived only
        </label>
        <span className="count">{visible.length} projects</span>
      </div>
      <div className="token-grid">
        {visible.slice(0, shown).map((t) => (
          <TokenCard key={t.id} token={t} archived={archivedIds.has(t.id)} />
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
