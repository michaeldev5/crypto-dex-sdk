import type { LiquidityPosition, POOL_TYPE } from '@crypto-dex-sdk/graph-client'

export interface CellProps {
  row: LiquidityPosition<POOL_TYPE>
}
