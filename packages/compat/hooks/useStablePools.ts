import type { StableSwap } from '@crypto-dex-sdk/amm'
import type { Token } from '@crypto-dex-sdk/currency'
import type { StableSwapWithBase } from '../types'
import { ParachainId } from '@crypto-dex-sdk/chain'
import { useGetStablePools as useAmplitudeGetStablePools } from '@crypto-dex-sdk/parachains-amplitude'
import { useGetStablePools as useWagmiGetStablePools } from '@crypto-dex-sdk/wagmi'
import { useMemo } from 'react'
import { isEvmNetwork } from '../config'

export enum StablePoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function useGetStablePools(
  chainId: number | undefined,
  tokenMap: { [address: string]: Token },
  addresses: string[] = [],
  config = { enabled: true },
): {
    isLoading: boolean
    isError: boolean
    data: [StablePoolState, StableSwap | null][]
  } {
  const wagmiStablePools = useWagmiGetStablePools(chainId, tokenMap, addresses, {
    enabled: Boolean(config.enabled && chainId && isEvmNetwork(chainId)),
  })
  // const bifrostStablePools = useBifrostGetStablePools()
  const amplitudeStablePools = useAmplitudeGetStablePools()

  return useMemo(() => {
    if (!chainId) {
      return {
        isLoading: false,
        isError: true,
        data: [],
      }
    }

    if (isEvmNetwork(chainId))
      return wagmiStablePools

    if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
      return amplitudeStablePools
    else
      return amplitudeStablePools
  }, [amplitudeStablePools, chainId, wagmiStablePools])
}

export function generateStableSwapWithBase(swaps: StableSwap[]): StableSwapWithBase[] {
  return swaps.map((swap) => {
    const baseSwap = swaps.find(
      baseSwap => swap.involvesToken(baseSwap.liquidityToken),
    )

    return baseSwap ? Object.assign(swap, { baseSwap }) : swap
  })
}

interface UseStableSwapWithBaseReturn {
  isLoading: boolean
  isError: boolean
  data: StableSwapWithBase | undefined
}

export function useStableSwapWithBase(
  chainId: number,
  tokenMap: { [address: string]: Token },
  address?: string,
  config?: { enabled: boolean },
): UseStableSwapWithBaseReturn {
  const { data, isLoading, isError } = useGetStablePools(chainId, tokenMap, [], config)

  return useMemo(
    () => {
      const pools = Object.values(
        data
          .filter((result): result is [StablePoolState.EXISTS, StableSwap] =>
            Boolean(result[0] === StablePoolState.EXISTS && result[1]))
          .map(([, stablePool]) => stablePool),
      )

      return {
        isLoading,
        isError,
        data: generateStableSwapWithBase(pools).find(swap => swap.contractAddress.toLowerCase() === address),
      }
    },
    [address, data, isError, isLoading],
  )
}
