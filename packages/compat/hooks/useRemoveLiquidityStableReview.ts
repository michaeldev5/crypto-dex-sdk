import type { ParachainId } from '@crypto-dex-sdk/chain'
import type { Amount, Token, Type } from '@crypto-dex-sdk/currency'
import type { CalculatedStbaleSwapLiquidity, StableSwapWithBase } from '@crypto-dex-sdk/wagmi'
import { useRemoveLiquidityStableReview as useWagmiRemoveLiquidityStableReview } from '@crypto-dex-sdk/wagmi'
import { useMemo } from 'react'
import { isEvmNetwork } from '../config'

interface UseRemoveLiquidityStableReviewParams {
  chainId: ParachainId
  swap: StableSwapWithBase | undefined
  poolName: string | undefined
  minReviewedAmounts: Amount<Token>[]
  liquidity: CalculatedStbaleSwapLiquidity
  balance: Amount<Type> | undefined
  amountToRemove: Amount<Type> | undefined
  useBase: boolean
}

type UseRemoveLiquidityStableReview = (params: UseRemoveLiquidityStableReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useRemoveLiquidityStableReview: UseRemoveLiquidityStableReview = ({
  chainId,
  ...props
}) => {
  const wagmiRemoveLiquidityStableReview = useWagmiRemoveLiquidityStableReview({
    chainId,
    ...props,
  })

  return useMemo(() => {
    if (isEvmNetwork(chainId))
      return wagmiRemoveLiquidityStableReview

    return {
      isWritePending: false,
      sendTransaction: undefined,
      routerAddress: undefined,
    }
  }, [chainId, wagmiRemoveLiquidityStableReview])
}
