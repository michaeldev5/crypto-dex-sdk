import type { MarketGraphData } from '@crypto-dex-sdk/graph-client'
import { marketById, marketsByChainIds } from '@crypto-dex-sdk/graph-client'
import { SUPPORTED_CHAIN_IDS } from 'config'

export async function getMarkets(): Promise<MarketGraphData[]> {
  try {
    const markets = await marketsByChainIds({ chainIds: SUPPORTED_CHAIN_IDS })
    return markets
  }
  catch {
    return []
  }
}

export async function getMarket(id: string): Promise<MarketGraphData | undefined> {
  try {
    const market = await marketById(id.toLowerCase())
    return market
  }
  catch {
    return undefined
  }
}
