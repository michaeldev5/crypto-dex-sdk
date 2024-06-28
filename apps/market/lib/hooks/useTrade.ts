import { type AggregatorTrade, TradeVersion } from '@crypto-dex-sdk/amm'
import type { Amount, Currency } from '@crypto-dex-sdk/currency'
import { useDebounce } from '@crypto-dex-sdk/hooks'
import type { Market } from '@crypto-dex-sdk/market'
import { Trade } from '@crypto-dex-sdk/market'
import { getSwapRouterContractConfig } from '@crypto-dex-sdk/wagmi'
import { useMemo } from 'react'

export interface UseTradeOutput {
  trade: Trade | undefined
}

export function useTrade(
  market: Market,
  _amountSpecified?: Amount<Currency>,
  _currencyOut?: Currency,
  aggregatorTrade?: AggregatorTrade | undefined,
): UseTradeOutput {
  const [amountSpecified, currencyOut] = useDebounce(
    useMemo(() => [_amountSpecified, _currencyOut], [_amountSpecified, _currencyOut]),
    200,
  )

  return useMemo(() => {
    if (
      amountSpecified
      && currencyOut
      && amountSpecified.greaterThan(0)
      && currencyOut.wrapped.address !== amountSpecified.currency.wrapped.address
    ) {
      const aggregationSwapData = aggregatorTrade
        ? {
            router: getSwapRouterContractConfig(market.chainId, TradeVersion.AGGREGATOR).address,
            executor: aggregatorTrade.writeArgs[0] as string,
            swapAmountIn: aggregatorTrade.inputAmount,
            swapAmountOut: aggregatorTrade.outputAmount,
            route: aggregatorTrade.writeArgs[2] as string,
          }
        : undefined
      const bestTrade = Trade.bestTradeExactIn(market, amountSpecified, currencyOut, aggregationSwapData)
      return { trade: bestTrade }
    }

    return { trade: undefined }
  }, [aggregatorTrade, amountSpecified, currencyOut, market])
}
