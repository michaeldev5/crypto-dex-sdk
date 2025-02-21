import type { ParachainId } from '@crypto-dex-sdk/chain'
import type { Amount, Type } from '@crypto-dex-sdk/currency'
import { ZERO } from '@crypto-dex-sdk/math'
import { usePrices } from '@crypto-dex-sdk/shared'
import { useMemo } from 'react'

interface Params {
  chainId: ParachainId
  amounts: (Amount<Type> | undefined)[]
}

type UseTokenAmountDollarValues = (params: Params) => number[]

export const useTokenAmountDollarValues: UseTokenAmountDollarValues = ({ chainId, amounts }) => {
  const { data: prices } = usePrices({ chainId })

  return useMemo(() => {
    return amounts.map((amount) => {
      if (!amount?.greaterThan(ZERO) || !prices?.[amount.currency.wrapped.address])
        return 0
      const price = Number(Number(amount.toExact()) * Number(prices[amount.currency.wrapped.address].toFixed(10)))

      if (Number.isNaN(price) || price < 0.000001)
        return 0

      return price
    })
  }, [amounts, prices])
}
