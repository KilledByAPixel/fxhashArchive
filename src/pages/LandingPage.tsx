import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadSummary, loadAllTokens, isVisible } from '../lib/data'
import { seededShuffle } from '../lib/shuffle'
import type { LeanToken, Summary } from '../lib/types'
import TokenCard from '../components/TokenCard'

const STRIP = 8
const n = (value: number) => value.toLocaleString()

/**
 * One labelled proportion bar.
 *
 * These replaced a log-scale concentration curve, which plotted the right data
 * but was unreadable: a visitor could not tell what the axes meant. Two of
 * these side by side carry the same argument directly — a small share of the
 * catalog, most of the engagement — with nothing to decode.
 */
function ShareBar({ label, percent, testId }: { label: string; percent: number; testId: string }) {
  const clamped = Math.max(0, Math.min(100, percent))
  return (
    <div className="share-row" data-testid={testId}>
      <span className="share-label">{label}</span>
      <div
        className="bar"
        role="img"
        aria-label={`${label}: ${clamped.toFixed(1)} percent`}
      >
        <div className="bar-fill" style={{ width: `${clamped.toFixed(2)}%` }} />
      </div>
      <span className="share-value">{clamped.toFixed(1)}%</span>
    </div>
  )
}

export default function LandingPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [tokens, setTokens] = useState<LeanToken[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [seed] = useState(() => Math.floor(Math.random() * 0xffffffff))

  useEffect(() => {
    loadSummary().then(setSummary, (e) => setError(String(e)))
    // The art strips are a bonus; the archive statistics are the point. A failed
    // catalog fetch must not take the whole page down with it.
    loadAllTokens().then(setTokens, () => setTokens(null))
  }, [])

  // The strips are where the badge matters most: the most-collected strip is
  // almost entirely archived projects, so omitting this rendered zero badges on
  // the one row where nearly every card should carry one.
  const archivedIds = useMemo(() => new Set(summary?.archived ?? []), [summary])

  const shown = useMemo(() => (tokens ?? []).filter(isVisible), [tokens])
  const random = useMemo(() => seededShuffle(shown, seed).slice(0, STRIP), [shown, seed])
  const collected = useMemo(() => {
    if (!summary) return []
    const byId = new Map(shown.map((t) => [t.id, t]))
    return summary.ranked.map((id) => byId.get(id)).filter((t): t is LeanToken => Boolean(t)).slice(0, STRIP)
  }, [summary, shown])

  const archivedPct = summary
    ? (100 * summary.counts.archived) / summary.counts.projects
    : 0

  return (
    <div className="landing">
      <h1>An archive of fxhash on Tezos</h1>
      <p className="landing-intro">
        fxhash went offline. This is an unofficial, read-only viewer for the generative
        art made there — every project, every artist, and the seed behind every piece
        ever minted. Nothing here is for sale.
      </p>

      {error && <p>Could not load archive statistics: {error}</p>}

      {summary && (
        <ul className="landing-stats">
          <li><strong>{n(summary.counts.projects)}</strong> projects catalogued</li>
          <li><strong>{n(summary.counts.artists)}</strong> artists</li>
          <li><strong>{n(summary.counts.iterations)}</strong> iterations</li>
          <li><strong>{n(summary.counts.seeds)}</strong> seeds preserved</li>
          <li><strong>{n(summary.counts.archived)}</strong> playable offline</li>
        </ul>
      )}

      {/* Art before charts: this is a gallery that happens to keep statistics,
          not a dashboard that happens to show pictures. */}
      {random.length > 0 && (
        <section>
          <h2>Random from the archive</h2>
          <div className="token-grid" data-testid="landing-random">
            {random.map((t) => (
              <TokenCard key={t.id} token={t} archived={archivedIds.has(t.id)} />
            ))}
          </div>
        </section>
      )}

      {summary && (
        <section className="landing-coverage">
          <h2>What is preserved</h2>
          <p>
            Every project's details and every iteration's seed are stored here, so any
            piece can be regenerated. Generator code is larger, so it is archived
            selectively: {n(summary.counts.archived)} projects run with
            no network at all, while the rest still depend on IPFS staying up.
          </p>
          <div className="share-bars">
            <ShareBar
              label="of projects archived"
              percent={archivedPct}
              testId="share-projects"
            />
            <ShareBar
              label="of collector interest covered"
              percent={summary.counts.archivedShareOfVolume}
              testId="share-interest"
            />
          </div>
          <p className="landing-note">
            Those two numbers are the whole idea: the archived projects are a sliver of
            the catalog, but they are the ones people actually engaged with.
          </p>
        </section>
      )}

      {collected.length > 0 && (
        <section>
          <h2>Most collected</h2>
          <div className="token-grid" data-testid="landing-collected">
            {collected.map((t) => (
              <TokenCard key={t.id} token={t} archived={archivedIds.has(t.id)} />
            ))}
          </div>
          <Link to="/artwork">Browse all {n(summary?.counts.projects ?? 0)} projects →</Link>
        </section>
      )}
    </div>
  )
}
