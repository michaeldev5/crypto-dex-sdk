import type { AggregatorTrade, Trade } from '@crypto-dex-sdk/amm'
import { TradeVersion } from '@crypto-dex-sdk/amm'
import type { Dispatch, SetStateAction } from 'react'
import { useMemo } from 'react'
import type { Permit2Actions } from '@crypto-dex-sdk/wagmi'
import { useSwapReview as useWagmiSwapReview } from '@crypto-dex-sdk/wagmi'
// import { useSwapReview as useBifrostSwapReview } from '@crypto-dex-sdk/parachains-bifrost'
import { useSwapReview as useAmplitudeSwapReview } from '@crypto-dex-sdk/parachains-amplitude'
import { ParachainId } from '@crypto-dex-sdk/chain'
import { EVM_NETWORKS, isEvmNetwork } from '../config'

interface UseSwapReviewParams {
  chainId: number | undefined
  trade: Trade | AggregatorTrade | undefined
  open: boolean
  enablePermit2?: boolean
  permit2Actions?: Permit2Actions
  setOpen: Dispatch<SetStateAction<boolean>>
  setError: Dispatch<SetStateAction<string | undefined>>
  onSuccess: () => void
}

type UseSwapReview = (params: UseSwapReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | (() => Promise<void>) | undefined
  routerAddress: string | undefined
}

export const useSwapReview: UseSwapReview = ({
  chainId,
  trade,
  enablePermit2,
  permit2Actions,
  ...params
}) => {
  const wagmiSwapReview = useWagmiSwapReview({
    chainId,
    trade,
    enableNetworks: EVM_NETWORKS,
    enablePermit2,
    permit2Actions,
    ...params,
  })

  // const bifrostSwapReview = useBifrostSwapReview({
  //   chainId,
  //   trade: trade?.version === TradeVersion.LEGACY ? trade : undefined,
  //   ...params,
  // })

  const amplitudeSwapReview = useAmplitudeSwapReview({
    chainId,
    trade: trade?.version === TradeVersion.LEGACY ? trade : undefined,
    ...params,
  })

  return useMemo(() => {
    if (chainId && isEvmNetwork(chainId))
      return wagmiSwapReview

    if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
      return amplitudeSwapReview
    else
      return amplitudeSwapReview
  }, [amplitudeSwapReview, chainId, wagmiSwapReview])
}
