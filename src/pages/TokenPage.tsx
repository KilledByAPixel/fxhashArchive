import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { findTokenBySlug, loadIterationIds } from '../lib/data'
import { fetchIterations, fetchIterationsByIds, type Iteration } from '../lib/tzkt'
import type { LeanToken } from '../lib/types'
import IpfsImage from '../components/IpfsImage'
import NotFoundPage from './NotFoundPage'

const PAGE = 48

/**
 * The project's iteration ids from the snapshot mapping:
 *   undefined — still resolving
 *   null      — unavailable (no entry, or the map shard would not load)
 *   string[]  — known; empty means the project genuinely never minted
 */
type ObjktIds = string[] | null | undefined

export default function TokenPage() {
  const { slug } = useParams()
  const [token, setToken] = useState<LeanToken | null | undefined>(undefined)
  const [objktIds, setObjktIds] = useState<ObjktIds>(undefined)
  const [iterations, setIterations] = useState<Iteration[] | null>(null)
  const [iterError, setIterError] = useState(false)
  const [offset, setOffset] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let cancelled = false
    // Reset all per-project state synchronously so a slug change (e.g. editing the
    // URL hash while already on a project page) can't leave the previous project's
    // hero, iterations, offset, or error state visible while the new one loads.
    setToken(undefined)
    setObjktIds(undefined)
    setIterations(null)
    setIterError(false)
    setOffset(0)
    setDone(false)
    findTokenBySlug(slug!).then(
      (t) => { if (!cancelled) setToken(t) },
      () => { if (!cancelled) setToken(null) },
    )
    return () => { cancelled = true }
  }, [slug])

  // Resolve the authoritative id list. A failure here is "we don't know", never
  // "nothing was minted" — the fallback join below gets a chance instead.
  useEffect(() => {
    if (!token) return
    let cancelled = false
    Promise.resolve()
      .then(() => loadIterationIds(token.slug, token.id))
      .then(
        (ids) => { if (!cancelled) setObjktIds(ids) },
        () => { if (!cancelled) setObjktIds(null) },
      )
    return () => { cancelled = true }
  }, [token])

  useEffect(() => {
    if (!token || objktIds === undefined) return
    let cancelled = false

    if (objktIds !== null) {
      if (objktIds.length === 0) {
        // Known to have never minted — nothing to ask the chain, and no fallback.
        setIterations([])
        setDone(true)
        return
      }
      fetchIterationsByIds(objktIds, offset, PAGE).then(
        (page) => {
          if (cancelled) return
          setIterations((prev) => [...(prev ?? []), ...page])
          // Page against the id list, not the row count: TzKT may not return a row
          // for every id, and a short page must not truncate the rest of the list.
          if (offset + PAGE >= objktIds.length) setDone(true)
        },
        () => { if (!cancelled) setIterError(true) },
      )
      return () => { cancelled = true }
    }

    // Mapping unavailable — fall back to the lossy generatorUri join.
    if (!token.generativeUri) return
    fetchIterations(token.generativeUri, offset, PAGE).then(
      (page) => {
        if (cancelled) return
        setIterations((prev) => [...(prev ?? []), ...page])
        if (page.length < PAGE) setDone(true)
      },
      () => { if (!cancelled) setIterError(true) },
    )
    return () => { cancelled = true }
  }, [token, objktIds, offset])

  if (token === undefined) return <p>Loading…</p>
  if (token === null) return <NotFoundPage />

  const neverMinted = Array.isArray(objktIds) && objktIds.length === 0
  // Mapping unavailable and no generatorUri to join on: nothing left to try.
  const noSource = objktIds === null && !token.generativeUri

  return (
    <div>
      <div className="token-hero">
        <IpfsImage uri={token.displayUri ?? token.thumbnailUri} alt={token.name} className="hero-img" />
        <div>
          <h2>{token.name}</h2>
          <p>
            by{' '}
            {token.author
              ? <Link to={`/artist/${token.author.id}`}>{token.author.name ?? token.author.id}</Link>
              : 'unknown'}
          </p>
          <p className="muted">
            edition of {token.supply}
            {iterations && iterations.length > 0 && ` · ${iterations.length} iterations loaded`}
          </p>
          {token.tags.length > 0 && <p className="muted">{token.tags.join(', ')}</p>}
        </div>
      </div>

      <h3>Iterations</h3>
      {iterError && <p>Iterations unavailable right now (TzKT unreachable). Try again later.</p>}
      {!iterError && !neverMinted && noSource && <p>No iterations available for this project.</p>}
      {!iterError && !neverMinted && !noSource && (objktIds === undefined || iterations === null) && (
        <p>Loading iterations…</p>
      )}
      {!iterError && neverMinted && <p>No iterations have been minted for this project.</p>}
      {/* We looked but came up empty — say so without asserting the art never existed. */}
      {!iterError && !neverMinted && !noSource && iterations !== null && iterations.length === 0 && (
        <p>Could not load iterations for this project.</p>
      )}
      {iterations && iterations.length > 0 && (
        <>
          <div className="token-grid">
            {iterations.map((it) => (
              <Link key={`${it.contract}-${it.tokenId}`} to={`/gentk/${it.contract}/${it.tokenId}`} className="token-card">
                <IpfsImage uri={it.thumbnailUri ?? it.displayUri} alt={it.name ?? it.tokenId} className="token-thumb" />
                <div className="token-name">{it.name ?? `#${it.tokenId}`}</div>
              </Link>
            ))}
          </div>
          {!done && (
            <button className="load-more" onClick={() => setOffset((o) => o + PAGE)}>Load more</button>
          )}
        </>
      )}
    </div>
  )
}
