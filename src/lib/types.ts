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
