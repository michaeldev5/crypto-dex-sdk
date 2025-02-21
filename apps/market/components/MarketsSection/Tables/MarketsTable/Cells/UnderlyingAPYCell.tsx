import type { FC } from 'react'
import type { CellProps } from './types'
import { formatPercent, formatUSD } from '@crypto-dex-sdk/format'
import { Typography } from '@crypto-dex-sdk/ui'
import { useMarketFilters } from 'components'

export const UnderlyingAPYCell: FC<CellProps> = ({ row }) => {
  const { marketsGraphDataMap, isGraphDataLoading } = useMarketFilters()

  const underlyingAPY = formatPercent(marketsGraphDataMap[row.address.toLowerCase()]?.underlyingAPY || 0)
  const underlyingPrice = formatUSD(marketsGraphDataMap[row.address.toLowerCase()]?.sy.baseAsset.priceUSD)

  if (isGraphDataLoading)
    return <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-3/4 h-[30px] animate-pulse" />

  return (
    <div className="flex flex-col">
      <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
        {underlyingAPY}
      </Typography>
      <Typography className="text-right text-slate-500 dark:text-slate-400" variant="sm" weight={600}>
        {underlyingPrice}
      </Typography>
    </div>
  )
}
