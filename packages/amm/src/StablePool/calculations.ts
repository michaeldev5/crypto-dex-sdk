import type { Token } from '@crypto-dex-sdk/currency'
import type { MultiPath } from '../MultiRoute'
import type { StableSwap } from './StableSwap'
import { Amount } from '@crypto-dex-sdk/currency'
import { ZERO } from '@crypto-dex-sdk/math'
import invariant from 'tiny-invariant'

export function calculateSwapFromBase(
  pool: StableSwap,
  basePool: StableSwap,
  tokenIndexFrom: number,
  tokenIndexTo: number,
  amount: Amount<Token>,
): Amount<Token> {
  const baseToken = basePool.liquidityToken
  const baseTokenIndex = pool.getTokenIndex(baseToken)
  const baseAmounts = basePool.pooledTokens.map(token => Amount.fromRawAmount(token, ZERO))

  baseAmounts[tokenIndexFrom] = amount
  const baseLpAmount = basePool.calculateTokenAmount(baseAmounts, true)

  if (baseTokenIndex === tokenIndexTo)
    return baseLpAmount

  return pool.calculateSwap(baseTokenIndex, tokenIndexTo, baseLpAmount)
}

export function calculateSwapToBase(
  pool: StableSwap,
  basePool: StableSwap,
  tokenIndexFrom: number,
  tokenIndexTo: number,
  amount: Amount<Token>,
): Amount<Token> {
  const baseToken = basePool.liquidityToken
  const baseTokenIndex = pool.getTokenIndex(baseToken)
  let tokenLPAmount = amount

  if (baseTokenIndex !== tokenIndexFrom)
    tokenLPAmount = pool.calculateSwap(tokenIndexFrom, baseTokenIndex, amount)

  return basePool.calculateRemoveLiquidityOneToken(tokenLPAmount, tokenIndexTo)[0]
}

export function getStableSwapOutputAmount(
  path: MultiPath,
  inputAmount: Amount<Token>,
): Amount<Token> {
  let outputAmount: Amount<Token>

  invariant(path.stable, 'NOT_STABLESWAP')
  invariant(inputAmount.currency.equals(path.input), 'INPUTTOKEN')

  try {
    if (!path.basePool && path.pool) {
      const fromIndex = path.pool.getTokenIndex(path.input)
      const toIndex = path.pool.getTokenIndex(path.output)

      outputAmount = path.pool.calculateSwap(fromIndex, toIndex, inputAmount)
    }
    else if (path.fromBase) {
      invariant(path.pool && path.basePool, 'POOL')
      const fromIndex = path.basePool.getTokenIndex(path.input)
      const toIndex = path.pool.getTokenIndex(path.output)

      outputAmount = calculateSwapFromBase(path.pool, path.basePool, fromIndex, toIndex, inputAmount)
    }
    else {
      invariant(path.pool && path.basePool, 'POOL')
      const fromIndex = path.pool.getTokenIndex(path.input)
      const toIndex = path.basePool.getTokenIndex(path.output)

      outputAmount = calculateSwapToBase(path.pool, path.basePool, fromIndex, toIndex, inputAmount)
    }

    return outputAmount
  }
  catch {
    return Amount.fromRawAmount(path.output, ZERO)
  }
}
