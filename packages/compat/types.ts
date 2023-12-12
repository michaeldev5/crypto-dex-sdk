import type { StableSwap } from '@crypto-dex-sdk/amm'

export interface StableSwapWithBase extends StableSwap {
  baseSwap?: StableSwap
}
