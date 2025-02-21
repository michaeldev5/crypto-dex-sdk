import type { FC } from 'react'
import { formatUSD } from '@crypto-dex-sdk/format'
import { Currency, Typography } from '@crypto-dex-sdk/ui'
import { Trans } from '@lingui/macro'
import React from 'react'
import { usePoolPositionStaked } from '../../PoolPositionStakedProvider'

export const AddSectionMyPositionStaked: FC = () => {
  const { balance, values, underlyings, isError, isLoading } = usePoolPositionStaked()

  if (isLoading && !isError && !balance) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-1 justify-between items-center">
          <Typography className="text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
            <Trans>
              My Staked Position
            </Trans>
          </Typography>
          <div className="h-[16px] w-[40px] animate-pulse bg-slate-600 rounded-full" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center gap-1.5">
            <div className="h-[16px] w-[120px] bg-slate-700 animate-pulse rounded-full" />
            <div className="h-[16px] w-[40px] bg-slate-700 animate-pulse rounded-full" />
          </div>
          <div className="flex justify-between items-center gap-1.5">
            <div className="h-[16px] w-[120px] bg-slate-700 animate-pulse rounded-full" />
            <div className="h-[16px] w-[40px] bg-slate-700 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 justify-between items-center">
        <Typography className="text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
          <Trans>
            My Staked Position
          </Trans>
        </Typography>
        <Typography className="text-slate-600 dark:text-slate-400" variant="xs" weight={500}>
          {formatUSD(values.reduce((total, current) => total + current, 0))}
        </Typography>
      </div>
      <div className="flex flex-col gap-1.5">
        {underlyings.map(amount => (
          <div className="flex items-center gap-1.5" key={amount.currency.wrapped.address}>
            <div className="w-4 h-4">
              {amount && <Currency.Icon currency={amount.currency} height={16} width={16} />}
            </div>
            <Typography className="flex items-center gap-1 text-slate-600 dark:text-slate-400" variant="xs" weight={500}>
              {balance && amount?.toSignificant(3)} {amount?.currency.symbol}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  )
}
