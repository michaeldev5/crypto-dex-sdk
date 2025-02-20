import type { Token } from './Token'
import type { Type } from './Type'
import { getCurrencyCombinations } from './getCurrencyCombinations'

export function useCurrencyCombinations(chainId?: number, currencyA?: Type, currencyB?: Type): [Token, Token][] {
  return (chainId && currencyA && currencyB ? getCurrencyCombinations(chainId, currencyA, currencyB) : [])
}
