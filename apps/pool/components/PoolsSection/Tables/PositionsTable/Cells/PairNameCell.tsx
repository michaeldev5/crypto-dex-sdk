import { formatNumber } from '@zenlink-interface/format'
import { Currency, NetworkIcon, Typography, classNames } from '@zenlink-interface/ui'
import { useTokensFromPair } from 'lib/hooks'
import type { FC } from 'react'
import { ICON_SIZE } from '../../constants'

import type { CellProps } from './types'

export const PairNameCell: FC<CellProps> = ({ row }) => {
  const { token0, token1 } = useTokensFromPair(row.pair)

  return (
    <div className="flex items-center gap-3 sm:gap-0">
      <div className="hidden sm:flex">
        <Currency.IconList iconWidth={ICON_SIZE} iconHeight={ICON_SIZE}>
          <Currency.Icon disableLink currency={token0} />
          <Currency.Icon disableLink currency={token1} />
        </Currency.IconList>
      </div>
      <div className="flex sm:hidden">
        <NetworkIcon chainId={row.pair.chainId} width={ICON_SIZE} height={ICON_SIZE} />
      </div>
      <div className="flex flex-col">
        <Typography variant="sm" weight={500} className="flex items-center gap-1 text-slate-50">
          {token0.symbol} <span className="text-slate-500">/</span> {token1.symbol}{' '}
          <div className={classNames('bg-slate-700 rounded-lg px-1 py-0.5 ml-1')}>
            {formatNumber(30 / 100)}%
          </div>
        </Typography>
        <Typography variant="xxs" className="text-slate-400">
          Standard
        </Typography>
      </div>
    </div>
  )
}
