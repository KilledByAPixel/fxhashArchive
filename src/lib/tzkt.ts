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

export async function fetchIteration(contract: string, tokenId: string): Promise<Iteration | null> {
  const url = `${TZKT}/tokens?contract=${contract}&tokenId=${encodeURIComponent(tokenId)}&select=tokenId,firstMinter,metadata`
  const rows = await getRows(url)
  return rows.length ? toIteration(contract, rows[0]) : null
}
