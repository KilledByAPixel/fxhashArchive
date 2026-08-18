import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchIteration, GENTK_V1_CONTRACT, type Iteration } from '../lib/tzkt'
import { ipfsToHttp } from '../lib/ipfs'
import { artifactBaseHref, injectLegacyPatch, needsLegacyPatch } from '../lib/legacyPatch'
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
  const [state, setState] = useState<IterationState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const [frame, setFrame] = useState<Frame>({ view: 'image' })

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
        {live && liveSrc
          ? (frame.view === 'fetching'
            ? <p>Preparing live view…</p>
            : frame.view === 'patched'
              ? <iframe srcDoc={frame.html} sandbox="allow-scripts" className="live-frame" title={title} />
              : <iframe src={liveSrc} sandbox="allow-scripts" className="live-frame" title={title} />)
          : <IpfsImage uri={it.displayUri ?? it.thumbnailUri} alt={title} className="iteration-img" />}
      </div>
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
