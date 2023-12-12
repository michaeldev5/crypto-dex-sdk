import type { Token } from '@crypto-dex-sdk/currency'
import type { StableSwapWithBase } from '@crypto-dex-sdk/wagmi'
import { useMemo } from 'react'

export function useTokensFromStableSwap(swap?: StableSwapWithBase, useBase = true): Token[] {
  return useMemo(
    () => swap
      ? (useBase && swap.baseSwap)
          ? [
              ...swap.pooledTokens.filter(token => !token.equals(swap.baseSwap!.liquidityToken)),
              ...swap.baseSwap.pooledTokens,
            ]
          : swap.pooledTokens
      : [],
    [swap, useBase],
  )
}
