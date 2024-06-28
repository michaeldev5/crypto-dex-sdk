import type { Amount, Type } from '@crypto-dex-sdk/currency'
import { ZERO } from '@crypto-dex-sdk/math'
import { usePrices } from '@crypto-dex-sdk/shared'
import { useMemo } from 'react'

interface UseUsdPctChangeProps {
  chainId: number | undefined
  inputAmount: Amount<Type> | undefined
  outputAmount: Amount<Type> | undefined
}

export function useUsdPctChange({ inputAmount, outputAmount, chainId }: UseUsdPctChangeProps): number | undefined {
  const { data: prices } = usePrices({ chainId })

  const srcTokenPrice = inputAmount?.currency ? prices?.[inputAmount.currency.wrapped.address] : undefined
  const dstTokenPrice = outputAmount?.currency ? prices?.[outputAmount.currency.wrapped.address] : undefined

  return useMemo(() => {
    const inputUSD
      = inputAmount && srcTokenPrice ? inputAmount.multiply(srcTokenPrice.asFraction) : undefined
    const outputUSD
      = outputAmount && dstTokenPrice ? outputAmount.multiply(dstTokenPrice.asFraction) : undefined
    return inputUSD && outputUSD && inputUSD?.greaterThan(ZERO)
      ? ((Number(outputUSD?.toExact()) - Number(inputUSD?.toExact())) / Number(inputUSD?.toExact())) * 100
      : undefined
  }, [dstTokenPrice, inputAmount, outputAmount, srcTokenPrice])
}
