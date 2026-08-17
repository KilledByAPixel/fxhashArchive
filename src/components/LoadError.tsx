interface Props {
  /** What could not be loaded, e.g. "this project". */
  what: string
  onRetry: () => void
}

/**
 * Shown when a load *failed*, as opposed to a page that genuinely does not exist.
 *
 * The distinction matters: a fetch failure is not evidence of absence, and telling
 * someone their deep link points at nothing — permanently, with no way to try again —
 * is worse than admitting the site could not reach its own data.
 */
export default function LoadError({ what, onRetry }: Props) {
  return (
    <div>
      <p>Could not load {what}. The data was unreachable — this is a loading failure, not a missing page.</p>
      <button className="load-more" onClick={onRetry}>Retry</button>
    </div>
  )
}
