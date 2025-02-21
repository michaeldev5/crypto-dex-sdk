import type { FC } from 'react'
import type { CellProps } from './types'
import { getMaturityFormatDate } from '@crypto-dex-sdk/market'
import { Currency, Typography } from '@crypto-dex-sdk/ui'
import { ICON_SIZE } from '../../constants'

export const GaugeNameCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex items-center gap-3 sm:gap-0">
      <div className="flex">
        <div className="mr-1 sm:mr-4 flex items-center">
          <Currency.Icon currency={row.market.SY.yieldToken} disableLink height={ICON_SIZE} width={ICON_SIZE} />
        </div>
      </div>
      <div className="flex flex-col">
        <Typography className="flex items-center text-slate-900 dark:text-slate-50" variant="base" weight={600}>
          {row.market.SY.yieldToken.symbol} Pool
        </Typography>
        <Typography
          className="text-slate-500 dark:text-slate-400"
          variant="xs"
          weight={600}
        >
          {getMaturityFormatDate(row.market)}
        </Typography>
      </div>
    </div>
  )
}
