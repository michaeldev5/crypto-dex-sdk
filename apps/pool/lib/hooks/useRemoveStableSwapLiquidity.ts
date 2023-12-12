import type { Amount, Token } from '@crypto-dex-sdk/currency'
import type { CalculatedStbaleSwapLiquidity, StableSwapWithBase } from '@crypto-dex-sdk/wagmi'
import { useMemo } from 'react'
import { calculateRemoveStableLiquidity, calculateRemoveStableLiquidityOneToken } from 'lib/functions'

export function useRemoveStableSwapLiquidity(
  swap: StableSwapWithBase | undefined,
  lpAmount: Amount<Token> | undefined,
  tokenIndex: number,
  useBase: boolean,
): CalculatedStbaleSwapLiquidity {
  return useMemo(
    () => {
      try {
        if (!swap || !lpAmount) {
          return {
            amount: undefined,
            baseAmounts: [],
            metaAmounts: [],
          }
        }

        if (tokenIndex === -1) {
          const { baseAmounts, metaAmounts } = calculateRemoveStableLiquidity(
            swap,
            useBase,
            lpAmount,
          )

          return {
            amount: undefined,
            baseAmounts,
            metaAmounts,
          }
        }
        else {
          const amount = calculateRemoveStableLiquidityOneToken(
            swap,
            useBase,
            tokenIndex,
            lpAmount,
          )

          return {
            amount,
            baseAmounts: [],
            metaAmounts: [],
          }
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
    [lpAmount, swap, tokenIndex, useBase],
  )
}
