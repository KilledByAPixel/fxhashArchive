import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadArtists } from '../lib/data'
import type { Artist } from '../lib/types'
import IpfsImage from '../components/IpfsImage'

const PAGE = 100

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [shown, setShown] = useState(PAGE)

  useEffect(() => { loadArtists().then(setArtists, (e) => setError(String(e))) }, [])

  const visible = useMemo(() => {
    if (!artists) return []
    const q = query.trim().toLowerCase()
    return artists.filter((a) => !q || (a.name ?? a.id).toLowerCase().includes(q))
  }, [artists, query])

  if (error) return <p>Failed to load artists: {error}</p>
  if (!artists) return <p>Loading artists…</p>

  return (
    <div>
      <div className="browse-controls">
        <input placeholder="Search artists…" value={query}
          onChange={(e) => { setQuery(e.target.value); setShown(PAGE) }} />
        <span className="count">{visible.length} artists</span>
      </div>
      <div className="artist-list">
        {visible.slice(0, shown).map((a) => (
          <Link key={a.id} to={`/artist/${a.id}`} className="artist-row">
            <IpfsImage uri={a.avatarUri} alt={a.name ?? a.id} className="avatar" />
            <div>
              <div className="token-name">{a.name ?? a.id}</div>
              <div className="muted">{a.tokenCount} projects</div>
            </div>
          </Link>
        ))}
      </div>
      {shown < visible.length && (
        <button className="load-more" onClick={() => setShown((s) => s + PAGE)}>Load more</button>
      )}
    </div>
  )
}
