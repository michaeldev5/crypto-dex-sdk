import type { FC } from 'react'
import type { CellProps } from './types'
import { formatUSD } from '@crypto-dex-sdk/format'
import { useInViewport } from '@crypto-dex-sdk/hooks'
import { Typography } from '@crypto-dex-sdk/ui'
import { PoolPositionProvider } from 'components'
import { useRef } from 'react'

export const PairValueCell: FC<CellProps> = ({ row }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inViewport = useInViewport(ref)

  return (
    <div ref={ref}>
      {inViewport && (
        <PoolPositionProvider pool={row.pool} watch={false}>
          <_PairValueCell row={row} />
        </PoolPositionProvider>
      )}
    </div>
  )
}

const _PairValueCell: FC<CellProps> = ({ row }) => {
  return (
    <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
      {formatUSD(row.valueUSD)}
    </Typography>
  )
}
