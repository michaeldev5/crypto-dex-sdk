import type { Pair } from '@crypto-dex-sdk/amm'
import type { ParachainId } from '@crypto-dex-sdk/chain'
import type { Type } from '@crypto-dex-sdk/currency'
import type { ReactElement } from 'react'
import type { PairState } from '../../hooks'

export interface ComponentsWrapperProps<T> {
  children:
    | ReactElement<T>
    | Array<ReactElement<T> | undefined>
    | Array<Array<ReactElement<T>> | ReactElement<T> | undefined>
    | undefined
}

export type PoolStateUnion = [
  PairState,
  Pair | null,
]

export enum PoolFinderType {
  Standard,
  Stable,
}

export interface PoolExistenceStateAction {
  type: 'update'
  payload: { state: PoolStateUnion, index: number, poolType: PoolFinderType }
}

export interface StandardPoolFinderProps {
  chainId: ParachainId
  token0: Type | undefined
  token1: Type | undefined
  index?: number
  dispatch?(payload: PoolExistenceStateAction): void
  enabled: boolean
}
