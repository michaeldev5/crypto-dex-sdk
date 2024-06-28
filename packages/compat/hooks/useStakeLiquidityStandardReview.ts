import { ParachainId } from '@crypto-dex-sdk/chain'
import type { Amount, Type } from '@crypto-dex-sdk/currency'
import { useStakeLiquidityReview as useWagmiStakeLiquidityReview } from '@crypto-dex-sdk/wagmi'
import {
  useStakeLiquidityStandardReview as useAmplitudeStakeLiquidityStandardReview,
} from '@crypto-dex-sdk/parachains-amplitude'
import { useMemo } from 'react'
import { isEvmNetwork } from '../config'

interface UseStakeLiquidityStandardReviewParams {
  chainId: ParachainId
  pid: number
  amountToStake: Amount<Type> | undefined
}

type UseStakeLiquidityStandardReview = (params: UseStakeLiquidityStandardReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  farmAddress: string | undefined
}

export const useStakeLiquidityStandardReview: UseStakeLiquidityStandardReview = ({
  chainId,
  ...params
}) => {
  const wagmiStakeLiquidityStandardReview = useWagmiStakeLiquidityReview({
    chainId,
    ...params,
  })

  // const bifrostStakeLiquidityStandardReview = useBifrostStakeLiquidityStandardReview({
  //   chainId,
  //   ...params,
  // })

  const amplitudeStakeLiquidityStandardReview = useAmplitudeStakeLiquidityStandardReview({
    chainId,
    ...params,
  })

  return useMemo(() => {
    if (chainId && isEvmNetwork(chainId))
      return wagmiStakeLiquidityStandardReview

    if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
      return amplitudeStakeLiquidityStandardReview
    else
      return amplitudeStakeLiquidityStandardReview
  }, [amplitudeStakeLiquidityStandardReview, chainId, wagmiStakeLiquidityStandardReview])
}
