import { ParachainId } from '@crypto-dex-sdk/chain'
import type { Amount, Type } from '@crypto-dex-sdk/currency'
import type { Dispatch, SetStateAction } from 'react'
import { useMemo } from 'react'
import { useAddLiquidityStandardReview as useWagmiAddLiquidityStandardReview } from '@crypto-dex-sdk/wagmi'
import {
  useAddLiquidityStandardReview as useBifrostAddLiquidityStandardReview,
} from '@crypto-dex-sdk/parachains-bifrost'
import {
  useAddLiquidityStandardReview as useAmplitudeAddLiquidityStandardReview,
} from '@crypto-dex-sdk/parachains-amplitude'
import { isEvmNetwork } from '../config'
import type { PairState } from './usePairs'

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

export const useAddLiquidityStandardReview: UseAddLiquidityStandardReview = ({
  chainId,
  ...params
}) => {
  const wagmiAddLiquidityStandardReview = useWagmiAddLiquidityStandardReview({
    chainId,
    ...params,
  })

  const bifrostAddLiquidityStandardReview = useBifrostAddLiquidityStandardReview({
    chainId,
    ...params,
  })

  const amplitudeAddLiquidityStandardReview = useAmplitudeAddLiquidityStandardReview({
    chainId,
    ...params,
  })

  return useMemo(() => {
    if (chainId && isEvmNetwork(chainId))
      return wagmiAddLiquidityStandardReview

    if (chainId === ParachainId.AMPLITUDE)
      return amplitudeAddLiquidityStandardReview
    else
      return bifrostAddLiquidityStandardReview
  }, [amplitudeAddLiquidityStandardReview, bifrostAddLiquidityStandardReview, chainId, wagmiAddLiquidityStandardReview])
}
