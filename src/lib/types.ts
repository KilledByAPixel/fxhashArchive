export interface LeanAuthor {
  id: string
  name: string | null
  avatarUri: string | null
}

export interface LeanToken {
  id: number
  slug: string
  name: string
  flag: string
  supply: number
  iterationsCount: number
  createdAt: string | null
  mintOpensAt: string | null
  thumbnailUri: string | null
  displayUri: string | null
  generativeUri: string | null
  tags: string[]
  author: LeanAuthor | null
}

export interface Artist {
  id: string
  name: string | null
  avatarUri: string | null
  description: string | null
  tokenCount: number
}

export interface SnapshotMeta {
  generatedAt: string
  tokenCount: number
  shardCount: number
  shardSize: number
}

/** Per-project market history, in mutez. Divide by 1e6 for tez. */
export interface MarketStats {
  pv: number
  pn: number
  sv: number
  sn: number
  floor: number | null
  med: number | null
  hi: number | null
  lo: number | null
  listed: number
}

export interface Summary {
  generatedAt: string
  counts: {
    projects: number
    artists: number
    iterations: number
    seeds: number
    archived: number
    /**
     * Percentage of all collector spending the archived projects account for.
     * The archive is a small fraction of the catalog by count but most of it by
     * engagement, and this is the number that says so.
     */
    archivedShareOfVolume: number
  }
  /** Project ids, highest collector spending first. Position is the rank. */
  ranked: number[]
  /** Project ids whose generator code is archived in this repo. */
  archived: number[]
  /**
   * Archived projects that must be run through their generated `_run.html`
   * instead of the artist's own entry point.
   *
   * Those pieces draw their own images onto a canvas, which the viewer's sandbox
   * turns into a SecurityError: the iframe has an opaque origin, so the
   * generator's own files are cross-origin to it and taint anything they touch.
   * The runner is the artist's document with a small script in front of it that
   * makes those images ask for CORS. See scripts/cors-shim.mjs.
   */
  runners: number[]
  /**
   * Enough cards for the landing page to render its two strips without
   * fetching the 16.5 MB catalog. `top` is in rank order; `sample` is spread
   * across the catalog so the random strip covers every era of the platform.
   */
  featured: {
    top: CardToken[]
    sample: CardToken[]
  }
  /**
   * Project id -> filename under `data/thumbs/`, for archived projects whose
   * preview image is stored here. Everything else streams its preview from IPFS.
   */
  thumbs: Record<string, string>
}

/**
 * The fields a project card renders. `thumbnailUri` is an ipfs:// pointer, not
 * image data. `LeanToken` satisfies this, so the grid can pass its own tokens
 * straight through.
 */
export interface CardToken {
  id: number
  slug: string
  name: string
  flag: string
  thumbnailUri: string | null
  author: { id: string; name: string | null } | null
}
