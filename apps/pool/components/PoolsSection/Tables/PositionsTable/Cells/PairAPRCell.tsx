import type { FC } from 'react'
import type { CellProps } from './types'
import { formatPercent } from '@crypto-dex-sdk/format'
import { Typography } from '@crypto-dex-sdk/ui'

export const PairAPRCell: FC<CellProps> = ({ row }) => {
  return (
    <Typography className="flex items-center justify-end gap-1 text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
      {formatPercent(row.pool.apr)}
    </Typography>
  )
}
