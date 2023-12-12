import type { Token } from '@crypto-dex-sdk/currency'
import { Amount } from '@crypto-dex-sdk/currency'
import { ZERO } from '@crypto-dex-sdk/math'
import type { CalculatedStbaleSwapLiquidity, StableSwapWithBase } from '@crypto-dex-sdk/wagmi'
import { useMemo } from 'react'
import { calculateStableSwapTokenAmount } from 'lib/functions'

export function useAddStableSwapLiquidity(
  swap: StableSwapWithBase | undefined,
  amounts: Amount<Token>[],
  useBase: boolean,
): CalculatedStbaleSwapLiquidity {
  const allAmounts = useMemo(
    () => {
      const baseAmounts = swap?.baseSwap && useBase
        ? swap.baseSwap.pooledTokens.map(
          token => amounts.find(amount => amount.currency.equals(token)) || Amount.fromRawAmount(token, ZERO),
        )
        : []

      const metaAmounts = swap?.baseSwap
        ? swap.pooledTokens.map(
          token => token.equals(swap.baseSwap!.liquidityToken) && useBase
            ? Amount.fromRawAmount(token, ZERO)
            : amounts.find(amount => amount.currency.equals(token)) || Amount.fromRawAmount(token, ZERO),
        )
        : swap?.pooledTokens.map(
          token => amounts.find(amount => amount.currency.equals(token)) || Amount.fromRawAmount(token, ZERO),
        ) ?? []

      return { baseAmounts, metaAmounts }
    },
    [amounts, swap?.baseSwap, swap?.pooledTokens, useBase],
  )

  return useMemo(
    () => {
      const { baseAmounts, metaAmounts } = allAmounts

      try {
        return {
          amount: swap
            ? calculateStableSwapTokenAmount(
              swap,
              useBase,
              metaAmounts,
              baseAmounts,
              true,
            )
            : undefined,
          baseAmounts,
          metaAmounts,
        }
      }
      catch {
        return {
          amount: undefined,
          baseAmounts: [],
          metaAmounts: [],
        }
      }
    },
    [allAmounts, swap, useBase],
  )
}
