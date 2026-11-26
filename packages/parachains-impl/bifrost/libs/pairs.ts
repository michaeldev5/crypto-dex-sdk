import type { Currency, Token, Type } from '@crypto-dex-sdk/currency'
import type { PairPrimitivesAssetId } from '../types'
import { ParachainId } from '@crypto-dex-sdk/chain'
import { addressToZenlinkAssetId } from '@crypto-dex-sdk/format'

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function getPairs(chainId: number | undefined, currencies: [Currency | undefined, Currency | undefined][]) {
  return currencies
    .filter((currencies): currencies is [Type, Type] => {
      const [currencyA, currencyB] = currencies
      return Boolean(
        chainId
        && (chainId === ParachainId.BIFROST_KUSAMA || chainId === ParachainId.BIFROST_POLKADOT)
        && currencyA
        && currencyB
        && currencyA.chainId === currencyB.chainId
        && chainId === currencyA.chainId
        && !currencyA.wrapped.equals(currencyB.wrapped),
      )
    })
    .reduce<[Token[], Token[], PairPrimitivesAssetId[]]>(
      (acc, [currencyA, currencyB]) => {
        const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
          ? [currencyA.wrapped, currencyB.wrapped]
          : [currencyB.wrapped, currencyA.wrapped]

        acc[0].push(token0)
        acc[1].push(token1)
        acc[2].push([
          addressToZenlinkAssetId(token0.address),
          addressToZenlinkAssetId(token1.address),
        ])
        return acc
      },
      [[], [], []],
    )
}

export function uniqePairKey(tokenA: Token, tokenB: Token): string {
  return `${tokenA.address}-${tokenB.address}`
}
