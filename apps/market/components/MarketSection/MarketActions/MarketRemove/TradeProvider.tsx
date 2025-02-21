import type { AggregatorTrade } from '@crypto-dex-sdk/amm'
import type { Amount, Type } from '@crypto-dex-sdk/currency'
import type { Market } from '@crypto-dex-sdk/market'
import type { FC, ReactNode } from 'react'
import { useAccount } from '@crypto-dex-sdk/compat'
import { useSettings } from '@crypto-dex-sdk/shared'
import { useAggregationTrade } from 'lib/hooks'
import { createContext, useContext, useMemo } from 'react'

interface TradeContext {
  isLoading: boolean
  isSyncing: boolean
  isError: boolean
  trade: AggregatorTrade | undefined
  outputAmount: Amount<Type> | undefined
}

const Context = createContext<TradeContext | undefined>(undefined)

interface TradeProviderProps {
  market: Market
  amountSpecified: Amount<Type> | undefined
  currencyOut: Type | undefined
  children: ReactNode
}

export const TradeProvider: FC<TradeProviderProps> = ({
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

export function useTrade() {
  const context = useContext(Context)
  if (!context)
    throw new Error('Hook can only be used inside Market remove Context')

  return context
}
