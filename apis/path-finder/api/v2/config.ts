import type { Chain, PublicClient } from 'viem'
import { EthereumChainId, ParachainId } from '@crypto-dex-sdk/chain'
import { DataFetcher } from '@crypto-dex-sdk/smart-router'
import { astar, scroll } from '@crypto-dex-sdk/wagmi-config'
import { createPublicClient, fallback, http } from 'viem'
import { base, moonbeam } from 'viem/chains'
import 'dotenv/config'

export const MAX_REQUESTS_PER_MIN = 20

export const CHAINS = [
  ParachainId.MOONBEAM,
  ParachainId.SCROLL_ALPHA,
  ParachainId.SCROLL,
  ParachainId.BASE,
  ParachainId.ASTAR,
]

export const SUPPORTED_CHAINS = Array.from(
  new Set([...CHAINS]),
)

export function getClient(chainId: ParachainId): PublicClient | undefined {
  switch (chainId) {
    case ParachainId.MOONBEAM:
      return createPublicClient({
        chain: moonbeam,
        transport: fallback([
          http(process.env.MOONBEAM_ENDPOINT_URL),
          http('https://moonbeam.public.blastapi.io'),
        ]),
        batch: {
          multicall: {
            batchSize: 1024 * 10,
          },
        },
      })
    case ParachainId.SCROLL:
      return createPublicClient({
        chain: scroll as Chain,
        transport: fallback([
          http(process.env.SCROLL_ENDPOINT_URL),
          http(scroll.rpcUrls.default.http[0]),
        ]),
        batch: {
          multicall: {
            batchSize: 1024 * 10,
          },
        },
      })
    case ParachainId.BASE:
      return createPublicClient({
        chain: base as Chain,
        transport: fallback([
          http(process.env.BASE_ENDPOINT_URL),
          http(base.rpcUrls.default.http[0]),
        ]),
        batch: {
          multicall: {
            batchSize: 1024 * 10,
          },
        },
      })
    case ParachainId.ASTAR:
      return createPublicClient({
        chain: astar,
        transport: fallback([
          http(process.env.ASTAR_ENDPOINT_URL),
          http(astar.rpcUrls.default.http[0]),
        ]),
        batch: {
          multicall: {
            batchSize: 1024 * 10,
          },
        },
      })
    default:
      return undefined
  }
}

export function getDataFetcher(chainId: ParachainId): DataFetcher | undefined {
  switch (chainId) {
    case ParachainId.MOONBEAM: {
      const client = getClient(chainId)
      if (!client)
        return undefined
      return new DataFetcher(ParachainId.MOONBEAM, client)
    }
    case ParachainId.SCROLL: {
      const client = getClient(chainId)
      if (!client)
        return undefined
      return new DataFetcher(ParachainId.SCROLL, client)
    }
    case ParachainId.BASE: {
      const client = getClient(chainId)
      if (!client)
        return undefined
      return new DataFetcher(ParachainId.BASE, client)
    }
    case ParachainId.ASTAR: {
      const client = getClient(chainId)
      if (!client)
        return undefined
      return new DataFetcher(ParachainId.ASTAR, client)
    }
    default:
      return undefined
  }
}

export function convertChainId(chainId: EthereumChainId | ParachainId): ParachainId {
  switch (chainId) {
    case EthereumChainId.MOONBEAM:
      return ParachainId.MOONBEAM
    case EthereumChainId.ASTAR:
      return ParachainId.ASTAR
    default:
      return chainId as ParachainId
  }
}
