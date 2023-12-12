import { ParachainId } from '@crypto-dex-sdk/chain'
import { useClaimFarmingRewardsReview as useWagmiClaimFarmingRewardsReview } from '@crypto-dex-sdk/wagmi'
import {
  useClaimFarmingRewardsReview as useBifrostClaimFarmingRewardsReview,
} from '@crypto-dex-sdk/parachains-bifrost'
import {
  useClaimFarmingRewardsReview as useAmplitudeClaimFarmingRewardsReview,
} from '@crypto-dex-sdk/parachains-amplitude'
import { useMemo } from 'react'
import { isEvmNetwork } from '../config'

interface UseClaimFarmingRewardsReviewParams {
  chainId: ParachainId
  pid: number
}

type UseClaimFarmingRewardsReview = (params: UseClaimFarmingRewardsReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  farmAddress: string | undefined
}

export const useClaimFarmingRewardsReview: UseClaimFarmingRewardsReview = ({
  chainId,
  ...params
}) => {
  const wagmiClaimFarmingRewardsReview = useWagmiClaimFarmingRewardsReview({
    chainId,
    ...params,
  })

  const bifrostClaimFarmingRewardsReview = useBifrostClaimFarmingRewardsReview({
    chainId,
    ...params,
  })

  const amplitudeClaimFarmingRewardsReview = useAmplitudeClaimFarmingRewardsReview({
    chainId,
    ...params,
  })

  return useMemo(() => {
    if (chainId && isEvmNetwork(chainId))
      return wagmiClaimFarmingRewardsReview

    if (chainId === ParachainId.AMPLITUDE)
      return amplitudeClaimFarmingRewardsReview
    else
      return bifrostClaimFarmingRewardsReview
  }, [amplitudeClaimFarmingRewardsReview, bifrostClaimFarmingRewardsReview, chainId, wagmiClaimFarmingRewardsReview])
}
