import type { CurrencyInputProps } from '@crypto-dex-sdk/compat'
import type { Amount, Type } from '@crypto-dex-sdk/currency'
import type { FC } from 'react'
import { TradeType } from '@crypto-dex-sdk/amm'
import { Web3Input } from '@crypto-dex-sdk/compat'
import { formatTransactionAmount } from '@crypto-dex-sdk/format'
import { ZERO } from '@crypto-dex-sdk/math'
import { usePrices } from '@crypto-dex-sdk/shared'
import { useMemo } from 'react'
import { useTrade } from './TradeProvider'

interface _CurrencyInputProps extends CurrencyInputProps {
  inputType: TradeType
  tradeType: TradeType
  isWrap?: boolean
}

function currencyAmountToPreciseFloat(currencyAmount: Amount<Type> | undefined) {
  if (!currencyAmount)
    return undefined
  const floatForLargerNumbers = Number.parseFloat(currencyAmount.toExact())
  if (floatForLargerNumbers < 0.1)
    return Number.parseFloat(currencyAmount.toSignificant(6))

  return floatForLargerNumbers
}

export const CurrencyInput: FC<_CurrencyInputProps> = ({
  className,
  value: _value,
  onChange,
  onSelect,
  currency,
  disableMaxButton,
  customTokenMap,
  tokenMap,
  onAddToken,
  onRemoveToken,
  chainId,
  inputType,
  tradeType,
  disabled,
  loading = false,
  isWrap = false,
}) => {
  const { trade } = useTrade()
  const { data: prices } = usePrices({ chainId })
  // If output field and (un)wrapping, set to _value
  const [value, displayValue] = useMemo(() => {
    let value = inputType === tradeType
      ? _value
      : trade
        ? trade.outputAmount.toExact()
        : ''
    value = inputType === TradeType.EXACT_OUTPUT && isWrap ? _value : value

    let displayValue = inputType === tradeType
      ? _value
      : trade
        ? formatTransactionAmount(currencyAmountToPreciseFloat(trade.outputAmount))
        : ''
    displayValue = inputType === TradeType.EXACT_OUTPUT && isWrap ? _value : displayValue

    return [value, displayValue]
  }, [_value, inputType, isWrap, trade, tradeType])

  // Usd pct change
  const srcTokenPrice = trade?.inputAmount.currency ? prices?.[trade.inputAmount.currency.wrapped.address] : undefined
  const dstTokenPrice = trade?.outputAmount.currency ? prices?.[trade.outputAmount.currency.wrapped.address] : undefined
  const usdPctChange = useMemo(() => {
    const inputUSD
      = trade?.inputAmount && srcTokenPrice ? trade.inputAmount.multiply(srcTokenPrice.asFraction) : undefined
    const outputUSD
      = trade?.outputAmount && dstTokenPrice ? trade.outputAmount.multiply(dstTokenPrice.asFraction) : undefined
    return inputUSD && outputUSD && inputUSD?.greaterThan(ZERO)
      ? ((Number(outputUSD?.toExact()) - Number(inputUSD?.toExact())) / Number(inputUSD?.toExact())) * 100
      : undefined
  }, [dstTokenPrice, srcTokenPrice, trade?.inputAmount, trade?.outputAmount])

  return (
    <Web3Input.Currency
      chainId={chainId}
      className={className}
      currency={currency}
      customTokenMap={customTokenMap}
      disableMaxButton={disableMaxButton}
      disabled={disabled}
      displayValue={displayValue}
      loading={loading}
      onAddToken={onAddToken}
      onChange={onChange}
      onRemoveToken={onRemoveToken}
      onSelect={onSelect}
      tokenMap={tokenMap}
      usdPctChange={inputType === TradeType.EXACT_OUTPUT ? usdPctChange : undefined}
      value={value}
    />
  )
}
