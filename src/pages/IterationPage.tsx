import { Fragment, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { fetchIteration, GENTK_V1_CONTRACT, type Iteration } from '../lib/tzkt'
import { ipfsToHttp } from '../lib/ipfs'
import { artifactBaseHref, injectLegacyPatch, needsLegacyPatch } from '../lib/legacyPatch'
import { loadProjectSeed, loadSummary } from '../lib/data'
import ArchivedFrame from '../components/ArchivedFrame'
import IpfsImage from '../components/IpfsImage'
import LoadError from '../components/LoadError'
import NotFoundPage from './NotFoundPage'

/** As on TokenPage/ArtistPage: a failed load must not masquerade as "no such iteration". */
type IterationState =
  | { status: 'loading' }
  | { status: 'ok'; iteration: Iteration }
  | { status: 'notfound' }
  | { status: 'error' }

/**
 * What the viewer area is showing.
 *
 * - `image`   — the static displayUri (the default).
 * - `fetching`— a v1 artifact is being downloaded so it can be patched; see below.
 * - `patched` — the downloaded HTML, rewritten and handed to the iframe via srcdoc.
 * - `direct`  — the artifact URL straight into `src`, exactly as before this change.
 */
type Frame =
  | { view: 'image' }
  | { view: 'fetching' }
  | { view: 'patched'; html: string }
  | { view: 'direct' }
  /** The copy stored in this repo, run from local files. */
  | { view: 'archived' }

/**
 * gentk v1, and *only* gentk v1. Its hash is hardcoded into the artifact, so srcdoc
 * costs it nothing — whereas the other two gentk contracts are v2-style and read their
 * seed from `?fxhash=` in the artifact URL, which a srcdoc document does not have:
 * patching one of those would silently render random art. The gate compares the
 * contract address itself so that reordering or extending GENTK_CONTRACTS cannot
 * quietly change which contract gets patched.
 */
const GENTK_V1 = GENTK_V1_CONTRACT

export default function IterationPage() {
  const { contract, tokenId } = useParams()
  const [params] = useSearchParams()
  const [state, setState] = useState<IterationState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const [frame, setFrame] = useState<Frame>({ view: 'image' })

  /**
   * The project this iteration belongs to, carried in the link that got us here.
   *
   * A gentk URL names a contract and a token, not a project, and archived
   * generators are stored by project — so without this hint the page cannot tell
   * which generator to run. Building a token-to-project index instead would cost
   * every visitor about 592 KB, to serve cold deep links that an offline visitor
   * does not have. When the hint is absent, the page simply behaves as it always
   * did and streams from IPFS.
   */
  const projectId = Number(params.get('p'))
  const hasProject = Number.isFinite(projectId) && params.get('p') !== null
  const [archivedSeed, setArchivedSeed] = useState<string | null>(null)

  useEffect(() => {
    if (!hasProject) { setArchivedSeed(null); return }
    let cancelled = false
    setArchivedSeed(null)
    // Both halves have to hold: the project's code must be archived here, and this
    // token must have a seed. Either missing means there is nothing local to run.
    Promise.all([loadSummary(), loadProjectSeed(projectId, Number(tokenId))]).then(
      ([summary, seed]) => {
        if (cancelled) return
        setArchivedSeed(summary.archived.includes(projectId) ? seed : null)
      },
      () => { if (!cancelled) setArchivedSeed(null) },
    )
    return () => { cancelled = true }
  }, [hasProject, projectId, tokenId])

  useEffect(() => {
    let cancelled = false
    // Reset per-iteration state synchronously so navigating between two iterations
    // while this page stays mounted can't leave the previous one's content or the
    // "live" toggle visible while the new one loads.
    setState({ status: 'loading' })
    setFrame({ view: 'image' })
    fetchIteration(contract!, tokenId!).then(
      (result) => { if (!cancelled) setState(result ? { status: 'ok', iteration: result } : { status: 'notfound' }) },
      // A rejected fetch says nothing about whether the iteration exists.
      () => { if (!cancelled) setState({ status: 'error' }) },
    )
    return () => { cancelled = true }
  }, [contract, tokenId, attempt])

  const liveSrc = state.status === 'ok' ? ipfsToHttp(state.iteration.artifactUri) : null

  /**
   * Download a v1 artifact and splice fxhash's legacy Math.pow patch in ahead of its
   * seeding snippet. Every failure — network, non-OK, HTML that isn't actually a
   * legacy piece, no <head> to splice after — falls back to the untouched URL: a
   * possibly-wrong seed beats a blank frame.
   */
  useEffect(() => {
    if (frame.view !== 'fetching' || !liveSrc) return
    let cancelled = false
    const base = artifactBaseHref(liveSrc)
    fetch(liveSrc)
      .then((res) => (res.ok ? res.text() : Promise.reject(new Error(`artifact: HTTP ${res.status}`))))
      .then((html) => {
        if (cancelled) return
        const patched = base && needsLegacyPatch(html) ? injectLegacyPatch(html, base) : null
        setFrame(patched ? { view: 'patched', html: patched } : { view: 'direct' })
      })
      .catch(() => { if (!cancelled) setFrame({ view: 'direct' }) })
    return () => { cancelled = true }
  }, [frame.view, liveSrc])

  // An archived copy is enough to render the page on its own. The indexer supplies
  // the title, the owner and the attributes, and losing those must no longer cost a
  // visitor the artwork itself when it is sitting in this repository.
  if (state.status !== 'ok' && archivedSeed) {
    return (
      <div>
        <h2>#{tokenId}</h2>
        <p className="muted">
          Details are unavailable (TzKT unreachable), so this is the archived copy —
          rebuilt from the generator and seed stored in this repository, with no
          network of any kind.
        </p>
        <div className="iteration-view">
          <ArchivedFrame projectId={projectId} seed={archivedSeed} label={`#${tokenId}`} />
        </div>
        <dl className="iteration-meta">
          <dt>Hash</dt><dd><code>{archivedSeed}</code></dd>
        </dl>
      </div>
    )
  }

  if (state.status === 'loading') return <p>Loading…</p>
  if (state.status === 'notfound') return <NotFoundPage />
  if (state.status === 'error') {
    return <LoadError what="this iteration" onRetry={() => setAttempt((a) => a + 1)} />
  }

  const it = state.iteration
  const isLegacy = it.contract === GENTK_V1
  const live = frame.view !== 'image'
  const title = it.name ?? 'artwork'

  return (
    <div>
      <h2>{it.name ?? `#${it.tokenId}`}</h2>
      <div className="iteration-view">
        {frame.view === 'archived' && archivedSeed
          ? <ArchivedFrame projectId={projectId} seed={archivedSeed} label={title} />
          : live && liveSrc
          ? (frame.view === 'fetching'
            ? <p>Preparing live view…</p>
            : frame.view === 'patched'
              ? <iframe srcDoc={frame.html} sandbox="allow-scripts" className="live-frame" title={title} />
              : <iframe src={liveSrc} sandbox="allow-scripts" className="live-frame" title={title} />)
          : <IpfsImage uri={it.displayUri ?? it.thumbnailUri} alt={title} className="iteration-img" />}
      </div>
      {archivedSeed && (
        <button
          className="load-more"
          onClick={() => setFrame(frame.view === 'archived' ? { view: 'image' } : { view: 'archived' })}
        >
          {frame.view === 'archived' ? 'Show image' : 'Run archived copy'}
        </button>
      )}
      {liveSrc && (
        <button
          className="load-more"
          onClick={() => setFrame(live ? { view: 'image' } : { view: isLegacy ? 'fetching' : 'direct' })}
        >
          {live ? 'Show image' : 'Run live'}
        </button>
      )}
      {frame.view === 'patched' && (
        // Manual escape hatch: nothing outside the sandbox can tell whether a patched
        // piece rendered correctly, so leave a way back to the untouched artifact.
        <p className="muted legacy-note">
          Rendering with the legacy fxhash seed fix.{' '}
          <button className="link-button" onClick={() => setFrame({ view: 'direct' })}>load original</button>
        </p>
      )}
      <dl className="iteration-meta">
        <dt>Hash</dt><dd><code>{it.iterationHash ?? 'unknown'}</code></dd>
        <dt>Minted by</dt><dd>{it.minter ?? 'unknown'}</dd>
        {it.attributes.map((a) => (
          <Fragment key={a.name}>
            <dt>{a.name}</dt><dd>{String(a.value)}</dd>
          </Fragment>
        ))}
      </dl>
    </div>
  )
}
