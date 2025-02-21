import type { FC } from 'react'
import type { CellProps } from './types'
import { formatPercent } from '@crypto-dex-sdk/format'
import { Typography } from '@crypto-dex-sdk/ui'
import { useMarketFilters } from 'components/MarketsFiltersProvider'

export const ImpliedAPYCell: FC<CellProps> = ({ row }) => {
  const { marketsGraphDataMap, isGraphDataLoading } = useMarketFilters()

  const impliedAPY = formatPercent(marketsGraphDataMap[row.address.toLowerCase()]?.impliedAPY || 0)

  if (isGraphDataLoading)
    return <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-3/4 h-[30px] animate-pulse" />

  return (
    <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
      {impliedAPY}
    </Typography>
  )
}
