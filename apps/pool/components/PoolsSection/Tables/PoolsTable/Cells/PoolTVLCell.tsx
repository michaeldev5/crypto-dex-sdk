import type { FC } from 'react'
import type { CellProps } from './types'
import { formatUSD } from '@crypto-dex-sdk/format'
import { Typography } from '@crypto-dex-sdk/ui'

export const PoolTVLCell: FC<CellProps> = ({ row }) => {
  const tvl = formatUSD(row.reserveUSD)

  return (
    <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
      {tvl.includes('NaN') ? '$0.00' : tvl}
    </Typography>
  )
}
