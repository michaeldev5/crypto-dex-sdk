import type { FC } from 'react'
import type { CellProps } from './types'
import { formatUSD } from '@crypto-dex-sdk/format'
import { Typography } from '@crypto-dex-sdk/ui'
import { useMarketFilters } from 'components'

export const PositionYtBalanceCell: FC<CellProps> = ({ row }) => {
  const { marketsGraphDataMap } = useMarketFilters()

  const ytPrice = marketsGraphDataMap[row.id.toLowerCase()]?.yt.priceUSD || 0

  const ytBalanceUSD = formatUSD(Number((row.ytBalance?.toExact() || '0')) * ytPrice)

  return (
    <div className="flex flex-col">
      <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
        {row.ytBalance?.toSignificant(6) || '0'}
      </Typography>
      <Typography className="text-right text-slate-500 dark:text-slate-400" variant="sm" weight={600}>
        {ytBalanceUSD}
      </Typography>
    </div>
  )
}
