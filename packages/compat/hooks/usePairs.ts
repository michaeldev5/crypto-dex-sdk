import type { Pair } from '@crypto-dex-sdk/amm'
import type { Currency } from '@crypto-dex-sdk/currency'
import { usePairs as useWagmiPairs } from '@crypto-dex-sdk/wagmi'
import { usePairs as useAmplitudePairs } from '@crypto-dex-sdk/parachains-amplitude'
import { useMemo } from 'react'
import { ParachainId } from '@crypto-dex-sdk/chain'
import { isEvmNetwork, isSubstrateNetwork } from '../config'

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

interface UsePairsReturn {
  isLoading: boolean
  isError: boolean
  data: [PairState, Pair | null][]
}

export function usePairs(
  chainId: number | undefined,
  currencies: [Currency | undefined, Currency | undefined][],
  config?: { enabled?: boolean },
): UsePairsReturn {
  const wagmiPairs = useWagmiPairs(chainId, currencies, {
    enabled: config?.enabled ? config?.enabled : Boolean(chainId && isEvmNetwork(chainId)),
  })

  // const bifrostPairs = useBifrostPairs(chainId, currencies, Boolean(chainId && isSubstrateNetwork(chainId)))

  const amplitudePairs = useAmplitudePairs(chainId, currencies, Boolean(chainId && isSubstrateNetwork(chainId)))

  return useMemo(() => {
    if (!chainId) {
      return {
        isLoading: false,
        isError: true,
        data: [[PairState.INVALID, null]],
      }
    }
    if (isEvmNetwork(chainId))
      return wagmiPairs

    if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
      return amplitudePairs
    else
      return amplitudePairs
  }, [amplitudePairs, chainId, wagmiPairs])
}

interface UsePairReturn {
  isLoading: boolean
  isError: boolean
  data: [PairState, Pair | null]
}

export function usePair(
  chainId: number,
  tokenA?: Currency,
  tokenB?: Currency,
  config?: { enabled?: boolean },
): UsePairReturn {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB])
  const { data, isLoading, isError } = usePairs(chainId, inputs, config)

  return useMemo(
    () => ({
      isLoading,
      isError,
      data: data?.[0],
    }),
    [data, isError, isLoading],
  )
}
