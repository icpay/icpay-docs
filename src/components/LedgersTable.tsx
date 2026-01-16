import React from 'react'

type LedgerRow = {
  id: string
  name: string
  symbol: string
  shortcode?: string | null
  canisterId: string
  decimals: number
  verified: boolean
  // Chain fields (may come from either ledger or join)
  chainName?: string | null
  chainNameFromChain?: string | null
  chainType?: string | null
}

function getApiBaseUrl(): string {
  // Prefer explicit docs env var if present; fallback to public API
  const fromEnv =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.ICPAY_API_URL ||
    process.env.NEXT_PUBLIC_ICPAY_API_URL
  return (fromEnv && fromEnv.trim()) || 'https://api.icpay.org'
}

async function fetchLedgers(): Promise<LedgerRow[]> {
  const apiUrl = getApiBaseUrl()
  const res = await fetch(`${apiUrl}/ledgers`, {
    // Refresh approximately hourly; tokens do not change often
    next: { revalidate: 60 * 60 },
    // Ensure server-side fetch
    cache: 'force-cache',
  })
  if (!res.ok) {
    throw new Error(`Failed to load ledgers (${res.status})`)
  }
  const data = (await res.json()) as any[]
  return data as LedgerRow[]
}

function groupByChain(ledgers: LedgerRow[]): Map<string, { chainType: string | null; items: LedgerRow[] }> {
  const groups = new Map<string, { chainType: string | null; items: LedgerRow[] }>()
  for (const l of ledgers) {
    const chainName = (l.chainNameFromChain || l.chainName || 'Unknown').toString()
    const group = groups.get(chainName)
    if (group) {
      group.items.push(l)
    } else {
      groups.set(chainName, { chainType: l.chainType ?? null, items: [l] })
    }
  }
  // Sort items within each group by symbol then name for stable output
  for (const [, g] of groups) {
    g.items.sort((a, b) => {
      const as = (a.symbol || '').toLowerCase()
      const bs = (b.symbol || '').toLowerCase()
      if (as !== bs) return as.localeCompare(bs)
      return (a.name || '').toLowerCase().localeCompare((b.name || '').toLowerCase())
    })
  }
  return groups
}

export default async function LedgersTable() {
  let ledgers: LedgerRow[] = []
  try {
    ledgers = await fetchLedgers()
  } catch (e: any) {
    return (
      <div className="not-prose rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800/40 dark:bg-red-950 dark:text-red-100">
        <div className="font-medium">Failed to load tokens</div>
        <div className="mt-1 opacity-80">
          {(e && (e.message || String(e))) || 'An unexpected error occurred while fetching ledgers.'}
        </div>
      </div>
    )
  }

  if (!Array.isArray(ledgers) || ledgers.length === 0) {
    return (
      <div className="not-prose rounded-md border border-gray-200 p-4 text-sm text-gray-700 dark:border-gray-800 dark:text-gray-300">
        No tokens available at the moment.
      </div>
    )
  }

  const groups = groupByChain(ledgers)
  const chainNames = Array.from(groups.keys()).sort((a, b) => a.localeCompare(b))

  return (
    <div className="space-y-12">
      {chainNames.map((chainName) => {
        const group = groups.get(chainName)!
        const chainType = group.chainType ? group.chainType.toUpperCase() : null
        return (
          <section key={chainName}>
            <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100">
              {chainName}
              {chainType ? <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">{chainType}</span> : null}
            </h3>
            <div className="not-prose overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
              <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-800">
                <thead className="bg-gray-50 text-left dark:bg-gray-900/30">
                  <tr className="text-gray-600 dark:text-gray-300">
                    <th className="px-4 py-2 font-medium">Token</th>
                    <th className="px-4 py-2 font-medium">Shortcode</th>
                    <th className="px-4 py-2 font-medium">Contract / Canister</th>
                    <th className="px-4 py-2 font-medium">Decimals</th>
                    <th className="px-4 py-2 font-medium">Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {group.items.map((l) => {
                    const verifiedBadge = l.verified ? (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-200 dark:ring-green-500/30">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/20 dark:bg-gray-800/50 dark:text-gray-300 dark:ring-gray-600/30">
                        No
                      </span>
                    )
                    return (
                      <tr key={l.id} className="text-gray-900 dark:text-gray-100">
                        <td className="whitespace-nowrap px-4 py-2">
                          <div className="font-medium">{l.symbol}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{l.name}</div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-2">
                          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[12px] dark:bg-gray-800">{l.shortcode || '—'}</code>
                        </td>
                        <td className="px-4 py-2">
                          <div className="truncate text-xs">
                            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[12px] dark:bg-gray-800">{l.canisterId}</code>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-2">{l.decimals}</td>
                        <td className="whitespace-nowrap px-4 py-2">{verifiedBadge}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )
      })}
    </div>
  )
}

