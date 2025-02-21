import type { Pair, StableSwap } from '@crypto-dex-sdk/graph-client'
import type { FC } from 'react'
import { StakeSectionStandard } from './StakeSectionStandard'

interface StakeSectionStableProps {
  pool: StableSwap
}

export const StakeSectionStable: FC<StakeSectionStableProps> = ({ pool }) => {
  return <StakeSectionStandard pair={pool as unknown as Pair} />
}
