import type { FC } from 'react'
import type { CellProps } from './types'
import { formatUSD } from '@crypto-dex-sdk/format'
import { Typography } from '@crypto-dex-sdk/ui'
import { useMarketFilters } from 'components'

export const PositionSyBalanceCell: FC<CellProps> = ({ row }) => {
  const { marketsGraphDataMap } = useMarketFilters()

  const syPrice = marketsGraphDataMap[row.id.toLowerCase()]?.sy.priceUSD || 0

  const syBalanceUSD = formatUSD(Number((row.syBalance?.toExact() || '0')) * syPrice)

  return (
    <div className="flex flex-col">
      <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
        {row.syBalance?.toSignificant(6) || '0'}
      </Typography>
      <Typography className="text-right text-slate-500 dark:text-slate-400" variant="sm" weight={600}>
        {syBalanceUSD}
      </Typography>
    </div>
  )
}
