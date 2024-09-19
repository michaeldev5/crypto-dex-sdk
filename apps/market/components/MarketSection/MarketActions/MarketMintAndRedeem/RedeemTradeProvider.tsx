import type { AggregatorTrade } from '@zenlink-interface/amm'
import type { Amount, Type } from '@zenlink-interface/currency'
import type { Market } from '@zenlink-interface/market'
import type { FC, ReactNode } from 'react'
import { useAccount } from '@zenlink-interface/compat'
import { useSettings } from '@zenlink-interface/shared'
import { useAggregationTrade } from 'lib/hooks'
import { createContext, useContext, useMemo } from 'react'

interface RedeemTradeContext {
  isLoading: boolean
  isSyncing: boolean
  isError: boolean
  trade: AggregatorTrade | undefined
  outputAmount: Amount<Type> | undefined
}

const Context = createContext<RedeemTradeContext | undefined>(undefined)

interface RedeemTradeProviderProps {
  market: Market
  amountSpecified: Amount<Type> | undefined
  currencyOut: Type | undefined
  children: ReactNode
}

export const RedeemTradeProvider: FC<RedeemTradeProviderProps> = ({
  market,
  amountSpecified,
  currencyOut,
  children,
}) => {
  const [{ slippageTolerance }] = useSettings()
  const { address } = useAccount()

  const isToUseAggregationTrade = useMemo(
    () => amountSpecified && currencyOut && !amountSpecified.currency.equals(currencyOut),
    [amountSpecified, currencyOut],
  )

  const { trade, isLoading, isError, isSyncing } = useAggregationTrade({
    enabled: Boolean(isToUseAggregationTrade),
    chainId: market.chainId,
    fromToken: amountSpecified?.currency,
    amount: amountSpecified,
    toToken: currencyOut,
    recipient: address,
    slippageTolerance,
  })

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          isError: isToUseAggregationTrade ? isError : false,
          isLoading: isToUseAggregationTrade ? isLoading : false,
          isSyncing: isToUseAggregationTrade ? isSyncing : false,
          trade,
          outputAmount: isToUseAggregationTrade ? trade?.outputAmount : amountSpecified,
        }),
        [amountSpecified, isError, isLoading, isSyncing, isToUseAggregationTrade, trade],
      )}
    >
      {children}
    </Context.Provider>
  )
}

export function useRedeemTrade() {
  const context = useContext(Context)
  if (!context)
    throw new Error('Hook can only be used inside Market redeem Context')

  return context
}
