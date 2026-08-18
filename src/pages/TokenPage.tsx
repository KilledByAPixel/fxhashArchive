import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { findTokenBySlug, loadIterationContract, loadIterationIds, loadProjectMarketStats, loadSummary } from '../lib/data'
import { fetchIterations, fetchIterationsByIds, type Iteration } from '../lib/tzkt'
import type { LeanToken, MarketStats } from '../lib/types'
import IpfsImage from '../components/IpfsImage'
import LoadError from '../components/LoadError'
import NotFoundPage from './NotFoundPage'
import ArchivedPlayer from '../components/ArchivedPlayer'

const PAGE = 48

const tez = (mutez: number) => `${(mutez / 1e6).toLocaleString(undefined, { maximumFractionDigits: 1 })} tez`

/**
 * The project's iteration ids from the snapshot mapping:
 *   undefined — still resolving
 *   null      — unavailable (no entry, or the map shard would not load)
 *   string[]  — known; empty means the project genuinely never minted
 */
type ObjktIds = string[] | null | undefined

/**
 * "We could not load it" and "it does not exist" are different answers, and only one
 * of them is safe to assert from a rejected fetch. Collapsing both into null told
 * people their link was dead when the network merely blinked.
 */
type ProjectState =
  | { status: 'loading' }
  | { status: 'ok'; token: LeanToken }
  | { status: 'notfound' }
  | { status: 'error' }

export default function TokenPage() {
  const { slug } = useParams()
  const [state, setState] = useState<ProjectState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const [objktIds, setObjktIds] = useState<ObjktIds>(undefined)
  // The gentk contract those ids live on; null when the mapping has no entry, which
  // is the caller's cue to fall back rather than to guess one from the id prefix.
  const [iterContract, setIterContract] = useState<string | null>(null)
  const [iterations, setIterations] = useState<Iteration[] | null>(null)
  const [iterError, setIterError] = useState(false)
  const [offset, setOffset] = useState(0)
  const [done, setDone] = useState(false)
  const [market, setMarket] = useState<MarketStats | null>(null)
  // Whether this project's generator code is stored in this repo, which is what
  // makes the archived player possible. A failed summary just means no player.
  const [isArchived, setIsArchived] = useState(false)

  useEffect(() => {
    let cancelled = false
    // Reset all per-project state synchronously so a slug change (e.g. editing the
    // URL hash while already on a project page) can't leave the previous project's
    // hero, iterations, offset, or error state visible while the new one loads.
    setState({ status: 'loading' })
    setObjktIds(undefined)
    setIterContract(null)
    setIterations(null)
    setIterError(false)
    setOffset(0)
    setDone(false)
    setMarket(null)
    setIsArchived(false)
    findTokenBySlug(slug!).then(
      (t) => { if (!cancelled) setState(t ? { status: 'ok', token: t } : { status: 'notfound' }) },
      // A rejected lookup says nothing about whether the project exists.
      () => { if (!cancelled) setState({ status: 'error' }) },
    )
    return () => { cancelled = true }
  }, [slug, attempt])

  // The loaded project, or null while it is unavailable for any reason.
  const token = state.status === 'ok' ? state.token : null

  // Resolve the authoritative id list. A failure here is "we don't know", never
  // "nothing was minted" — the fallback join below gets a chance instead.
  //
  // The ids and the contract they live on are resolved together, and committed
  // together: querying with one and not the other is exactly how iterations end up
  // being asked of a contract that never held them.
  useEffect(() => {
    if (!token) return
    let cancelled = false
    Promise.all([
      Promise.resolve().then(() => loadIterationIds(token.slug, token.id)).catch(() => null),
      // "We could not read the contract mapping" and "this project has no entry" both
      // mean the same thing here: we may not guess, so fall back.
      Promise.resolve().then(() => loadIterationContract(token.id)).catch(() => null),
    ]).then(([ids, contract]) => {
      if (cancelled) return
      setIterContract(contract)
      setObjktIds(ids)
    })
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
      // Ids but no contract: fall through to the join. Never pick a contract for
      // them — a wrong one renders another project's artwork under this name.
      if (iterContract) {
        fetchIterationsByIds(objktIds, iterContract, offset, PAGE).then(
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
    }

    // No usable id path — fall back to the lossy generatorUri join.
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
  }, [token, objktIds, iterContract, offset])

  useEffect(() => {
    if (!token) return
    let cancelled = false
    loadProjectMarketStats(token.slug, token.id).then(
      (m) => { if (!cancelled) setMarket(m) },
      () => { if (!cancelled) setMarket(null) },
    )
    return () => { cancelled = true }
  }, [token])

  useEffect(() => {
    if (!token) return
    let cancelled = false
    loadSummary().then(
      (s) => { if (!cancelled) setIsArchived(s.archived.includes(token.id)) },
      () => { if (!cancelled) setIsArchived(false) },
    )
    return () => { cancelled = true }
  }, [token])

  if (state.status === 'loading') return <p>Loading…</p>
  if (state.status === 'notfound') return <NotFoundPage />
  if (state.status === 'error') {
    return <LoadError what="this project" onRetry={() => setAttempt((a) => a + 1)} />
  }

  const project = state.token
  const neverMinted = Array.isArray(objktIds) && objktIds.length === 0

  /**
   * The iteration list is built from the captured ids and merely *decorated* with
   * whatever TzKT returns, rather than being TzKT's to provide.
   *
   * It used to be the other way round, which meant the whole list vanished the
   * moment the indexer was unreachable — including for projects whose generator
   * and seeds are sitting in this repository. Every id, and therefore the size of
   * the edition and each piece's identity, is known locally; only the names and
   * thumbnails ever needed the network.
   */
  const enrichment = new Map((iterations ?? []).map((it) => [it.tokenId, it]))
  const localCells =
    Array.isArray(objktIds) && objktIds.length > 0 && iterContract
      ? objktIds.slice(0, offset + PAGE).map((id) => {
          const tokenId = id.split('-')[1]
          return { id, tokenId, contract: iterContract, row: enrichment.get(tokenId) }
        })
      : null
  const localDone = localCells !== null && Array.isArray(objktIds)
    ? offset + PAGE >= objktIds.length
    : done
  // The id path is only usable with both halves: the ids and their contract.
  const byIdsUsable = Array.isArray(objktIds) && objktIds.length > 0 && iterContract !== null
  // Nothing left to try: no usable id path, and no generatorUri to join on.
  const noSource =
    objktIds !== undefined && !neverMinted && !byIdsUsable && !project.generativeUri

  return (
    <div>
      <div className="token-hero">
        <IpfsImage uri={project.displayUri ?? project.thumbnailUri} alt={project.name} className="hero-img" />
        <div>
          <h2>{project.name}</h2>
          <p>
            by{' '}
            {project.author
              ? <Link to={`/artist/${project.author.id}`}>{project.author.name ?? project.author.id}</Link>
              : 'unknown'}
          </p>
          <p className="muted">
            edition of {project.supply}
            {/* The authoritative mint count from the captured mapping — not how many rows
                this page happens to have paged in, which changes as you scroll and tells
                a visitor nothing about the artwork itself. */}
            {Array.isArray(objktIds) && ` · ${objktIds.length} minted`}
          </p>
          {project.tags.length > 0 && <p className="muted">{project.tags.join(', ')}</p>}
          {market && market.pv + market.sv > 0 && (
            <p className="muted">
              {tez(market.pv + market.sv)} traded
              {market.hi != null && market.hi > 0 && ` · highest sale ${tez(market.hi)}`}
            </p>
          )}
        </div>
      </div>

      {isArchived && Array.isArray(objktIds) && objktIds.length > 0 && (
        <ArchivedPlayer projectId={project.id} iterationIds={objktIds} />
      )}

      <h3>Iterations{Array.isArray(objktIds) && objktIds.length > 0 && ` (${objktIds.length})`}</h3>

      {/* With the ids held locally, an unreachable indexer costs names and thumbnails,
          not the list itself — so say what is actually missing. */}
      {iterError && localCells && (
        <p className="muted">
          Titles and preview images are unavailable (TzKT unreachable). The iterations
          themselves are listed from this repository.
        </p>
      )}
      {iterError && !localCells && <p>Iterations unavailable right now (TzKT unreachable). Try again later.</p>}
      {!localCells && !iterError && !neverMinted && noSource && <p>No iterations available for this project.</p>}
      {!localCells && !iterError && !neverMinted && !noSource && (objktIds === undefined || iterations === null) && (
        <p>Loading iterations…</p>
      )}
      {!iterError && neverMinted && <p>No iterations have been minted for this project.</p>}
      {/* We looked but came up empty — say so without asserting the art never existed. */}
      {!localCells && !iterError && !neverMinted && !noSource && iterations !== null && iterations.length === 0 && (
        <p>Could not load iterations for this project.</p>
      )}

      {localCells && (
        <div className="token-grid">
          {localCells.map((cell) => (
            <Link
              key={cell.id}
              to={`/gentk/${cell.contract}/${cell.tokenId}`}
              className="token-card"
            >
              {/* No row means the indexer never answered for this id, so we do not
                  know whether a preview exists — which is a different statement from
                  "this artwork has no image", and from "IPFS would not serve it". */}
              {cell.row ? (
                <IpfsImage
                  uri={cell.row.thumbnailUri ?? cell.row.displayUri}
                  alt={cell.row.name ?? `#${cell.tokenId}`}
                  className="token-thumb"
                />
              ) : (
                <div className="img-fallback token-thumb" title={`#${cell.tokenId}: preview unavailable — TzKT unreachable`}>
                  <span>Preview unavailable</span>
                </div>
              )}
              <div className="token-name">{cell.row?.name ?? `#${cell.tokenId}`}</div>
            </Link>
          ))}
        </div>
      )}

      {!localCells && iterations && iterations.length > 0 && (
        <div className="token-grid">
          {iterations.map((it) => (
            <Link key={`${it.contract}-${it.tokenId}`} to={`/gentk/${it.contract}/${it.tokenId}`} className="token-card">
              <IpfsImage uri={it.thumbnailUri ?? it.displayUri} alt={it.name ?? it.tokenId} className="token-thumb" />
              <div className="token-name">{it.name ?? `#${it.tokenId}`}</div>
            </Link>
          ))}
        </div>
      )}
      {/* Outside the grid on purpose: a page that returned no rows (TzKT can do that
          while ids remain) used to hide this button and strand the rest of the list. */}
      {!localDone && (localCells !== null || iterations !== null) && (
        <button className="load-more" onClick={() => setOffset((o) => o + PAGE)}>Load more</button>
      )}
    </div>
  )
}
