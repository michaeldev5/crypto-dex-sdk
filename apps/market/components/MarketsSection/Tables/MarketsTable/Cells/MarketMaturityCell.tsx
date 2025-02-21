import type { FC } from 'react'
import type { CellProps } from './types'
import { getMaturityFormatDate } from '@crypto-dex-sdk/market'
import { Typography, useBreakpoint } from '@crypto-dex-sdk/ui'
import { formatDistanceToNow } from 'date-fns'

export const MarketMaturityCell: FC<CellProps> = ({ row }) => {
  const { isSm } = useBreakpoint('sm')

  return (
    <div className="flex items-center gap-3 sm:gap-0">
      <div className="flex flex-col items-end">
        <Typography
          className="flex items-center gap-1 text-slate-900 dark:text-slate-50"
          variant={isSm ? 'sm' : 'xs'}
          weight={600}
        >
          {getMaturityFormatDate(row)}
        </Typography>
        <Typography
          className="text-slate-500 dark:text-slate-400"
          variant={isSm ? 'sm' : 'xs'}
          weight={600}
        >
          {formatDistanceToNow(Number(row.expiry.toString()) * 1000)}
        </Typography>
      </div>
    </div>
  )
}
