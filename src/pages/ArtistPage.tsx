import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  loadArtists,
  loadTokensMap,
  loadAllTokens,
  loadSummary,
  loadCollaborations,
  isVisible,
  type Collaborator,
} from '../lib/data'
import type { Artist, LeanToken } from '../lib/types'
import TokenCard from '../components/TokenCard'
import { bylineLabel } from '../components/Byline'
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
  const [thumbs, setThumbs] = useState<Record<string, string>>({})
  /**
   * Collaborative projects credited to this artist, keyed by project id.
   *
   * These were missing from every artist page. A project minted through a shared
   * collaboration contract is recorded under the contract, so it belonged to nobody
   * and none of its actual artists could find it here — including on their own page.
   */
  const [collabs, setCollabs] = useState<Record<number, Collaborator[]>>({})

  useEffect(() => {
    let cancelled = false
    // Reset per-artist state synchronously so navigating between two artists
    // while this page stays mounted can't leave the previous one's name, bio,
    // or project grid visible while the new one loads.
    setState({ status: 'loading' })
    setTokens([])
    loadSummary().then(
      (s) => { if (!cancelled) { setArchivedIds(new Set(s.archived)); setThumbs(s.thumbs) } },
      () => { if (!cancelled) { setArchivedIds(new Set()); setThumbs({}) } },
    )
    ;(async () => {
      try {
        const [artists, map, all, collaborations] = await Promise.all([
          loadArtists(),
          loadTokensMap(),
          loadAllTokens(),
          // Not fatal: without it the page is what it always was, minus collaborations.
          loadCollaborations().catch(() => null),
        ])
        if (cancelled) return

        const collabIds = collaborations?.byArtist[id!] ?? []
        const credited: Record<number, Collaborator[]> = {}
        for (const pid of collabIds) {
          const entry = collaborations?.byProject[String(pid)]
          if (entry) credited[pid] = entry.collaborators
        }
        setCollabs(credited)

        const found = artists.find((a) => a.id === id)
        /**
         * Someone can be a real fxhash artist and appear in no artists index: the
         * index was built from people who minted a project of their own, and a third
         * of collaborators never did. Their name still exists on chain, and it is
         * already sitting in the collaboration record, so the page is built from that
         * rather than answering "no such artist" to a link we ourselves rendered.
         */
        const fromCollab: Artist | null = collabIds.length
          ? {
              id: id!,
              name: credited[collabIds[0]]?.find((c) => c.id === id)?.name ?? null,
              avatarUri: null,
              description: null,
              tokenCount: collabIds.length,
            }
          : null
        const artist = found ?? fromCollab
        setState(artist ? { status: 'ok', artist } : { status: 'notfound' })

        const ids = new Set([...(map[id!] ?? []), ...collabIds])
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
              <TokenCard
                key={t.id}
                token={t}
                archived={archivedIds.has(t.id)}
                localThumb={thumbs[String(t.id)]}
                authorLabel={collabs[t.id] ? bylineLabel(collabs[t.id]) : undefined}
              />
            ))}
          </div>
        )}
    </div>
  )
}
