import type { Amount, Type } from '@crypto-dex-sdk/currency'
import { ParachainId } from '@crypto-dex-sdk/chain'
import {
  useStakeLiquidityStandardReview as useAmplitudeStakeLiquidityStandardReview,
} from '@crypto-dex-sdk/parachains-amplitude'
import { useStakeLiquidityReview as useWagmiStakeLiquidityReview } from '@crypto-dex-sdk/wagmi'
import { useMemo } from 'react'
import { isEvmNetwork } from '../config'

interface UseStakeLiquidityStableReviewParams {
  chainId: ParachainId
  pid: number
  amountToStake: Amount<Type> | undefined
}

type UseStakeLiquidityStableReview = (params: UseStakeLiquidityStableReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  farmAddress: string | undefined
}

export const useStakeLiquidityStableReview: UseStakeLiquidityStableReview = ({
  chainId,
  ...params
}) => {
  const wagmiReview = useWagmiStakeLiquidityReview({
    chainId,
    ...params,
  })

  // const bifrostReview = useBifrostStakeLiquidityStandardReview({
  //   chainId,
  //   ...params,
  // })

  const amplitudeReview = useAmplitudeStakeLiquidityStandardReview({
    chainId,
    ...params,
  })

  return useMemo(() => {
    if (chainId && isEvmNetwork(chainId))
      return wagmiReview

    if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
      return amplitudeReview
    else
      return amplitudeReview
  }, [chainId, wagmiReview, amplitudeReview])
}
