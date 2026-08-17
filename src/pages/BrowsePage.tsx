import { useEffect, useMemo, useState } from 'react'
import { loadAllTokens, isVisible } from '../lib/data'
import type { LeanToken } from '../lib/types'
import TokenCard from '../components/TokenCard'

const PAGE = 60
type SortMode = 'newest' | 'edition'

export default function BrowsePage() {
  const [tokens, setTokens] = useState<LeanToken[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortMode>('newest')
  const [shown, setShown] = useState(PAGE)

  useEffect(() => {
    loadAllTokens().then(setTokens, (e) => setError(String(e)))
  }, [])

  const visible = useMemo(() => {
    if (!tokens) return []
    const q = query.trim().toLowerCase()
    const filtered = tokens.filter(
      (t) => isVisible(t) && (!q ||
        t.name.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        (t.author?.name ?? '').toLowerCase().includes(q)),
    )
    return sort === 'edition'
      ? [...filtered].sort((a, b) => b.supply - a.supply)
      : [...filtered].reverse() // snapshot is mint-date ASC, so reverse = newest first
  }, [tokens, query, sort])

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
        <select value={sort} onChange={(e) => setSort(e.target.value as SortMode)}>
          <option value="newest">Newest</option>
          <option value="edition">Largest edition</option>
        </select>
        <span className="count">{visible.length} projects</span>
      </div>
      <div className="token-grid">
        {visible.slice(0, shown).map((t) => <TokenCard key={t.id} token={t} />)}
      </div>
      {shown < visible.length && (
        <button className="load-more" onClick={() => setShown((s) => s + PAGE)}>
          Load more ({visible.length - shown} remaining)
        </button>
      )}
    </div>
  )
}
