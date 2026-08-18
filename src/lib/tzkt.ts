const TZKT = 'https://api.tzkt.io/v1'

/**
 * The original gentk contract ("v1"/beta). Named separately because it is the one
 * contract whose artifacts need the legacy Math.pow patch, and that decision must be
 * keyed to this address rather than to a position in the array below.
 */
export const GENTK_V1_CONTRACT = 'KT1KEa8z6vWXDJrVqtMrAeDVzsvxat3kHaCE'

/**
 * Every gentk contract, in the index order used by `iterations/contracts.json`.
 *
 * There are three, not two. A project's iterations live on exactly one of them, but
 * *which* one cannot be derived from an iteration id: the `FX{n}` prefix in the
 * snapshot mapping is the issuer version, and FX0 ids exist on both the first and the
 * middle contract. The middle one holds more tokens than either of the others, so
 * while it was missing here every project on it resolved to zero iterations.
 */
export const GENTK_CONTRACTS = [
  GENTK_V1_CONTRACT,
  'KT1U6EHmNxJTkvaWJ4ThczG4FSDaHC21ssvi',
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

/**
 * Snapshot objkt id: `FX{issuerVersion}-{tokenId}`.
 *
 * The version is captured but deliberately unused: it is the *issuer* version, not
 * the gentk contract, and inferring one from the other is exactly the bug that made
 * most of the catalog render "Could not load iterations". Only the token id is ours
 * to read; the contract is the caller's to supply.
 */
const OBJKT_ID = /^FX\d+-(\d+)$/

const parseTokenId = (id: string): string | null => OBJKT_ID.exec(id)?.[1] ?? null

/**
 * Fetch one page of iterations by their snapshot ids, from a known contract.
 *
 * This is the primary path: ~33% of gentk tokens (the entire launch era) carry no
 * `metadata.generatorUri`, so `fetchIterations`'s join silently misses them.
 *
 * `contract` comes from `iterations/contracts.json` via `loadIterationContract` and is
 * never guessed — a wrong contract would render another project's artwork under this
 * project's name. Since all of a project's iterations live on one contract, the page
 * is a single batched `tokenId.in` request, whose failure rejects (the caller's cue to
 * say "unavailable", never "never minted"). Only the requested page is queried and the
 * result is re-ordered to match `objktIds` — mint order matters to collectors and TzKT
 * gives no ordering guarantee for `tokenId.in`. Ids TzKT does not return are dropped
 * rather than faked, leaving a gap instead of shifting later iterations up.
 */
export async function fetchIterationsByIds(
  objktIds: string[],
  contract: string,
  offset = 0,
  limit = 48,
): Promise<Iteration[]> {
  if (limit > MAX_IDS_PER_QUERY) {
    throw new RangeError(`fetchIterationsByIds: limit ${limit} exceeds MAX_IDS_PER_QUERY (${MAX_IDS_PER_QUERY})`)
  }
  const page = objktIds.slice(offset, offset + limit)
  const tokenIds = page.map(parseTokenId).filter((t): t is string => t !== null)
  if (tokenIds.length === 0) return []

  const url =
    `${TZKT}/tokens?contract=${encodeURIComponent(contract)}&tokenId.in=${tokenIds.join(',')}` +
    `&limit=${tokenIds.length}&select=tokenId,firstMinter,metadata`
  const rows = await getRows(url)

  const found = new Map<string, Iteration>()
  for (const row of rows) found.set(String(row.tokenId), toIteration(contract, row))

  const ordered: Iteration[] = []
  for (const id of page) {
    const tokenId = parseTokenId(id)
    if (!tokenId) continue
    const hit = found.get(tokenId)
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
