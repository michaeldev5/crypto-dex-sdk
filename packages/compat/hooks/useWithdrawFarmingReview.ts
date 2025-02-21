import type { Amount, Type } from '@crypto-dex-sdk/currency'
import { ParachainId } from '@crypto-dex-sdk/chain'
import { useWithdrawFarmingReview as useAmplitudeWithdrawFarmingReview } from '@crypto-dex-sdk/parachains-amplitude'
import { useWithdrawFarmingReview as useWagmiWithdrawFarmingReview } from '@crypto-dex-sdk/wagmi'
import { useMemo } from 'react'
import { isEvmNetwork } from '../config'

interface UseWithdrawFarmingReviewParams {
  chainId: ParachainId
  farmAddress?: string
  pid: number
  amountToWithdraw: Amount<Type> | undefined
}

type UseWithdrawFarmingReview = (params: UseWithdrawFarmingReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  farmAddress: string | undefined
}

export const useWithdrawFarmingReview: UseWithdrawFarmingReview = ({
  chainId,
  ...params
}) => {
  const wagmiReview = useWagmiWithdrawFarmingReview({
    chainId,
    ...params,
  })

  // const bifrostReview = useBifrostWithdrawFarmingReview({
  //   chainId,
  //   ...params,
  // })

  const amplitudeReview = useAmplitudeWithdrawFarmingReview({
    chainId,
    ...params,
  })

  return useMemo(() => {
    if (chainId && isEvmNetwork(chainId))
      return wagmiReview

    if (chainId === ParachainId.AMPLITUDE)
      return amplitudeReview
    else
      return amplitudeReview
  }, [amplitudeReview, chainId, wagmiReview])
}
