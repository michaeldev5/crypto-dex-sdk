import { NetworkIcon } from '@crypto-dex-sdk/ui'
import type { FC } from 'react'
import type { CellProps } from './types'
import { ICON_SIZE } from '../../constants'

export const PairChainCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex items-center gap-2">
      <NetworkIcon chainId={row.chainId} height={ICON_SIZE} type="naked" width={ICON_SIZE} />
    </div>
  )
}
