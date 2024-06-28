import type { Amount, Type } from '@crypto-dex-sdk/currency'
import { formatTransactionAmount } from '@crypto-dex-sdk/format'
import { ZERO } from '@crypto-dex-sdk/math'
import { usePrices } from '@crypto-dex-sdk/shared'
import { useMemo } from 'react'

interface Params {
  chainId: number | undefined
  amounts: (Amount<Type> | undefined)[]
}

type UseTokenAmountDollarValues = (params: Params) => (string | undefined)[]

export const useTokenAmountDollarValues: UseTokenAmountDollarValues = ({ chainId, amounts }) => {
  const { data: prices } = usePrices({ chainId })

  return useMemo(() => {
    return amounts.map((amount) => {
      if (!amount?.greaterThan(ZERO) || !prices?.[amount.currency.wrapped.address])
        return undefined
      const price = Number(Number(amount.toExact()) * Number(prices[amount.currency.wrapped.address].toFixed(10)))

      if (Number.isNaN(price) || price < 0.000001)
        return '< 0.000001'

      return formatTransactionAmount(price)
    })
  }, [amounts, prices])
}
