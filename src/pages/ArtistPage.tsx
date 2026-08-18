import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { loadArtists, loadTokensMap, loadAllTokens, loadSummary, isVisible } from '../lib/data'
import type { Artist, LeanToken } from '../lib/types'
import TokenCard from '../components/TokenCard'
import IpfsImage from '../components/IpfsImage'
import LoadError from '../components/LoadError'
import NotFoundPage from './NotFoundPage'

/** As on TokenPage: a failed load must not masquerade as "no such artist". */
type ArtistState =
  | { status: 'loading' }
  | { status: 'ok'; artist: Artist }
  | { status: 'notfound' }
  | { status: 'error' }

export default function ArtistPage() {
  const { id } = useParams()
  const [state, setState] = useState<ArtistState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const [tokens, setTokens] = useState<LeanToken[]>([])
  // An artist looking at their own page is exactly who needs to know which of
  // their works are fully archived — it is what the preservation request form
  // asks them to check. A failed summary just means no badges, never a broken page.
  const [archivedIds, setArchivedIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    let cancelled = false
    // Reset per-artist state synchronously so navigating between two artists
    // while this page stays mounted can't leave the previous one's name, bio,
    // or project grid visible while the new one loads.
    setState({ status: 'loading' })
    setTokens([])
    loadSummary().then(
      (s) => { if (!cancelled) setArchivedIds(new Set(s.archived)) },
      () => { if (!cancelled) setArchivedIds(new Set()) },
    )
    ;(async () => {
      try {
        const [artists, map, all] = await Promise.all([loadArtists(), loadTokensMap(), loadAllTokens()])
        if (cancelled) return
        const found = artists.find((a) => a.id === id)
        setState(found ? { status: 'ok', artist: found } : { status: 'notfound' })
        const ids = new Set(map[id!] ?? [])
        setTokens(all.filter((t) => ids.has(t.id) && isVisible(t)))
      } catch {
        if (!cancelled) setState({ status: 'error' })
      }
    })()
    return () => { cancelled = true }
  }, [id, attempt])

  if (state.status === 'loading') return <p>Loading…</p>
  if (state.status === 'notfound') return <NotFoundPage />
  if (state.status === 'error') {
    return <LoadError what="this artist" onRetry={() => setAttempt((a) => a + 1)} />
  }

  const artist = state.artist

  return (
    <div>
      <div className="token-hero">
        <IpfsImage uri={artist.avatarUri} alt={artist.name ?? artist.id} className="avatar-lg" />
        <div>
          <h2>{artist.name ?? artist.id}</h2>
          <p className="muted"><code>{artist.id}</code></p>
          {artist.description && <p>{artist.description}</p>}
        </div>
      </div>
      <h3>{tokens.length} projects</h3>
      {tokens.length === 0
        ? <p className="muted">No visible projects from this artist.</p>
        : (
          <div className="token-grid">
            {tokens.map((t) => (
              <TokenCard key={t.id} token={t} archived={archivedIds.has(t.id)} />
            ))}
          </div>
        )}
    </div>
  )
}
