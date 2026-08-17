const TZKT = 'https://api.tzkt.io/v1'

/** gentk v1, gentk v2 — a project's iterations live on exactly one of these. */
export const GENTK_CONTRACTS = [
  'KT1KEa8z6vWXDJrVqtMrAeDVzsvxat3kHaCE',
  'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr',
]

export interface Iteration {
  contract: string
  tokenId: string
  name: string | null
  iterationHash: string | null
  artifactUri: string | null
  displayUri: string | null
  thumbnailUri: string | null
  attributes: { name: string; value: unknown }[]
  minter: string | null
}

interface TzktRow {
  tokenId: string
  firstMinter?: { address?: string; alias?: string }
  metadata?: Record<string, unknown>
}

function toIteration(contract: string, row: TzktRow): Iteration {
  const md = (row.metadata ?? {}) as Record<string, any>
  return {
    contract,
    tokenId: row.tokenId,
    name: md.name ?? null,
    iterationHash: md.iterationHash ?? null,
    artifactUri: md.artifactUri ?? null,
    displayUri: md.displayUri ?? null,
    thumbnailUri: md.thumbnailUri ?? null,
    attributes: Array.isArray(md.attributes) ? md.attributes : [],
    minter: row.firstMinter?.alias ?? row.firstMinter?.address ?? null,
  }
}

async function getRows(url: string): Promise<TzktRow[]> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`TzKT: HTTP ${res.status}`)
  return res.json()
}

export async function fetchIterations(generativeUri: string, offset = 0, limit = 48): Promise<Iteration[]> {
  const uri = encodeURIComponent(generativeUri)
  const settled = await Promise.allSettled(
    GENTK_CONTRACTS.map(async (contract) => {
      const url =
        `${TZKT}/tokens?contract=${contract}&metadata.generatorUri=${uri}` +
        `&offset=${offset}&limit=${limit}&select=tokenId,firstMinter,metadata`
      return (await getRows(url)).map((r) => toIteration(contract, r))
    }),
  )
  const fulfilled = settled.filter((s): s is PromiseFulfilledResult<Iteration[]> => s.status === 'fulfilled')
  if (fulfilled.length === 0) {
    throw (settled[0] as PromiseRejectedResult).reason
  }
  return fulfilled.flatMap((s) => s.value)
}

/**
 * Most ids allowed in one `tokenId.in` batch. 100 ids of ~7 digits keeps the query
 * string near 1 KB — comfortably inside every proxy/CDN URL limit on the way to TzKT.
 */
export const MAX_IDS_PER_QUERY = 100

/** Snapshot objkt id: `FX{version}-{tokenId}`, version indexing GENTK_CONTRACTS. */
const OBJKT_ID = /^FX(\d+)-(\d+)$/

function parseObjktId(id: string): { versionIndex: number; tokenId: string } | null {
  const m = OBJKT_ID.exec(id)
  if (!m) return null
  const versionIndex = Number(m[1])
  return GENTK_CONTRACTS[versionIndex] ? { versionIndex, tokenId: m[2] } : null
}

const rowKey = (contract: string, tokenId: string | number) => `${contract}-${String(tokenId)}`

/**
 * Fetch one page of iterations by their snapshot ids.
 *
 * This is the primary path: ~33% of gentk tokens (the entire launch era) carry no
 * `metadata.generatorUri`, so `fetchIterations`'s join silently misses them.
 *
 * Only the requested page is queried, batched into one request per gentk version,
 * and the result is re-ordered to match `objktIds` — mint order matters to collectors
 * and TzKT gives no ordering guarantee for `tokenId.in`. Ids TzKT does not return are
 * dropped rather than faked. As with `fetchIterations`, a version whose request fails
 * is skipped; the call rejects only when every request fails.
 */
export async function fetchIterationsByIds(
  objktIds: string[],
  offset = 0,
  limit = 48,
): Promise<Iteration[]> {
  if (limit > MAX_IDS_PER_QUERY) {
    throw new RangeError(`fetchIterationsByIds: limit ${limit} exceeds MAX_IDS_PER_QUERY (${MAX_IDS_PER_QUERY})`)
  }
  const page = objktIds.slice(offset, offset + limit)

  const byVersion = new Map<number, string[]>()
  for (const id of page) {
    const parsed = parseObjktId(id)
    if (!parsed) continue
    const bucket = byVersion.get(parsed.versionIndex)
    if (bucket) bucket.push(parsed.tokenId)
    else byVersion.set(parsed.versionIndex, [parsed.tokenId])
  }
  if (byVersion.size === 0) return []

  const settled = await Promise.allSettled(
    [...byVersion].map(async ([versionIndex, tokenIds]) => {
      const contract = GENTK_CONTRACTS[versionIndex]
      const url =
        `${TZKT}/tokens?contract=${contract}&tokenId.in=${tokenIds.join(',')}` +
        `&limit=${tokenIds.length}&select=tokenId,firstMinter,metadata`
      return (await getRows(url)).map((r) => toIteration(contract, r))
    }),
  )
  const fulfilled = settled.filter((s): s is PromiseFulfilledResult<Iteration[]> => s.status === 'fulfilled')
  if (fulfilled.length === 0) {
    throw (settled.find((s) => s.status === 'rejected') as PromiseRejectedResult).reason
  }

  const found = new Map<string, Iteration>()
  for (const s of fulfilled) {
    for (const it of s.value) found.set(rowKey(it.contract, it.tokenId), it)
  }

  const ordered: Iteration[] = []
  for (const id of page) {
    const parsed = parseObjktId(id)
    if (!parsed) continue
    const hit = found.get(rowKey(GENTK_CONTRACTS[parsed.versionIndex], parsed.tokenId))
    if (hit) ordered.push(hit)
  }
  return ordered
}

export async function fetchIteration(contract: string, tokenId: string): Promise<Iteration | null> {
  // Both params come from the URL hash; encode both, not just the token id.
  const url =
    `${TZKT}/tokens?contract=${encodeURIComponent(contract)}` +
    `&tokenId=${encodeURIComponent(tokenId)}&select=tokenId,firstMinter,metadata`
  const rows = await getRows(url)
  return rows.length ? toIteration(contract, rows[0]) : null
}
