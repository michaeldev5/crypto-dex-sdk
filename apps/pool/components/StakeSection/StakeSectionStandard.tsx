import type { Pair } from '@crypto-dex-sdk/graph-client'
import type { FC } from 'react'
import { StakeSectionWidgetStandard } from './StakeSectionWidgetStandard'

interface StakeSectionLegacyProps {
  pair: Pair
}

export const StakeSectionStandard: FC<StakeSectionLegacyProps> = ({ pair }) => {
  return (
    <div>
      <StakeSectionWidgetStandard
        chainId={pair.chainId}
        isFarm={true}
        pair={pair}
      />
    </div>
  )
}
