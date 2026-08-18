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
   * Enough cards for the landing page to render its two strips without
   * fetching the 16.5 MB catalog. `top` is in rank order; `sample` is spread
   * across the catalog so the random strip covers every era of the platform.
   */
  featured: {
    top: CardToken[]
    sample: CardToken[]
  }
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
