import type { FC } from 'react'
import type { CellProps } from './types'
import { Percent } from '@crypto-dex-sdk/math'
import { Typography } from '@crypto-dex-sdk/ui'
import { useGaugeVotes } from 'components'

export const GaugeCommunityVoteCell: FC<CellProps> = ({ row }) => {
  const { communityVotedPercentMap } = useGaugeVotes()

  return (
    <div className="flex items-center">
      <Typography className="flex items-center text-slate-900 dark:text-slate-50" variant="base" weight={600}>
        {(communityVotedPercentMap[row.id] || new Percent(0)).toFixed(0)}%
      </Typography>

    </div>
  )
}
