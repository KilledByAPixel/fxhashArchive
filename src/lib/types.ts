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
  }
  /** Project ids, highest collector spending first. Position is the rank. */
  ranked: number[]
  /** Project ids whose generator code is archived in this repo. */
  archived: number[]
  curve: Array<{ p: number; share: number }>
}
