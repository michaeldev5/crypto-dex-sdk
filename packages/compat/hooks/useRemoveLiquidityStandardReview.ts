import type { Pair } from '@crypto-dex-sdk/amm'
import type { Amount, Type } from '@crypto-dex-sdk/currency'
import type { Percent } from '@crypto-dex-sdk/math'
import { ParachainId } from '@crypto-dex-sdk/chain'
import {
  useRemoveLiquidityStandardReview as useAmplitudeRemoveLiquidityStandardReview,
} from '@crypto-dex-sdk/parachains-amplitude'
import { useRemoveLiquidityStandardReview as useWagmiRemoveLiquidityStandardReview } from '@crypto-dex-sdk/wagmi'
import { useMemo } from 'react'
import { isEvmNetwork } from '../config'

interface UseRemoveLiquidityStandardReviewParams {
  chainId: ParachainId
  token0: Type
  token1: Type
  minAmount0: Amount<Type> | undefined
  minAmount1: Amount<Type> | undefined
  pool: Pair | null
  percentToRemove: Percent
  balance: Amount<Type> | undefined
}

type UseRemoveLiquidityStandardReview = (params: UseRemoveLiquidityStandardReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useRemoveLiquidityStandardReview: UseRemoveLiquidityStandardReview = ({
  chainId,
  ...params
}) => {
  const wagmiRemoveLiquidityStandardReview = useWagmiRemoveLiquidityStandardReview({
    chainId,
    ...params,
  })

  // const bifrostRemoveLiquidityStandardReview = useBifrostRemoveLiquidityStandardReview({
  //   chainId,
  //   ...params,
  // })

  const amplitudeRemoveLiquidityStandardReview = useAmplitudeRemoveLiquidityStandardReview({
    chainId,
    ...params,
  })

  return useMemo(() => {
    if (chainId && isEvmNetwork(chainId))
      return wagmiRemoveLiquidityStandardReview

    if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
      return amplitudeRemoveLiquidityStandardReview
    else
      return amplitudeRemoveLiquidityStandardReview
  }, [amplitudeRemoveLiquidityStandardReview, chainId, wagmiRemoveLiquidityStandardReview])
}
