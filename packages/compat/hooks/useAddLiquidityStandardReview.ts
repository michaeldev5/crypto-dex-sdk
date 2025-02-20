import type { Amount, Type } from '@crypto-dex-sdk/currency'
import type { PairState } from '@crypto-dex-sdk/wagmi'
import type { Dispatch, SetStateAction } from 'react'
import { ParachainId } from '@crypto-dex-sdk/chain'
import {
  useAddLiquidityStandardReview as useAmplitudeAddLiquidityStandardReview,
} from '@crypto-dex-sdk/parachains-amplitude'
import { useAddLiquidityStandardReview as useWagmiAddLiquidityStandardReview } from '@crypto-dex-sdk/wagmi'
import { useMemo } from 'react'
import { isEvmNetwork } from '../config'

interface UseAddLiquidityStandardReviewParams {
  chainId: ParachainId
  poolState: PairState
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  setOpen: Dispatch<SetStateAction<boolean>>
}

type UseAddLiquidityStandardReview = (params: UseAddLiquidityStandardReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useAddLiquidityStandardReview: any = ({
  chainId,
  ...params
}: any) => {
  const wagmiAddLiquidityStandardReview = useWagmiAddLiquidityStandardReview({
    chainId,
    ...params,
  })

  // const bifrostAddLiquidityStandardReview = useBifrostAddLiquidityStandardReview({
  //   chainId,
  //   ...params,
  // })

  const amplitudeAddLiquidityStandardReview = useAmplitudeAddLiquidityStandardReview({
    chainId,
    ...params,
  })

  return useMemo(() => {
    if (chainId && isEvmNetwork(chainId))
      return wagmiAddLiquidityStandardReview

    if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
      return amplitudeAddLiquidityStandardReview
  }, [amplitudeAddLiquidityStandardReview, chainId, wagmiAddLiquidityStandardReview])
}
