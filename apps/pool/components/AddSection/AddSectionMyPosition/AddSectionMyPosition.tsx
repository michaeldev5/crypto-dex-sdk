import type { Pool } from '@crypto-dex-sdk/graph-client'
import type { FC } from 'react'
import { formatPercent } from '@crypto-dex-sdk/format'
import { Typography } from '@crypto-dex-sdk/ui'
import { Trans } from '@lingui/macro'
import React from 'react'
import { AddSectionMyPositionStaked } from './AddSectionMyPositionStaked'
import { AddSectionMyPositionUnstaked } from './AddSectionMyPositionUnstaked'

export const AddSectionMyPosition: FC<{ pool: Pool }> = ({ pool }) => {
  return (
    <div className="flex flex-col shadow-sm border border-slate-500/20 bg-white dark:bg-white/[0.04] rounded-2xl">
      <div className="flex flex-col gap-2 p-5">
        <div className="grid items-center grid-cols-2 gap-2">
          <Typography className="text-slate-700 dark:text-slate-300" variant="xs" weight={500}>
            <Trans>Best Total APR:</Trans>
          </Typography>
          <Typography className="text-right text-slate-700 dark:text-slate-300" variant="xs" weight={500}>
            {formatPercent(pool.apr)}
          </Typography>
        </div>
        <div className="grid items-center grid-cols-2 gap-2">
          <Typography className="text-slate-700 dark:text-slate-300" variant="xs" weight={500}>
            <Trans>Fee APR:</Trans>
          </Typography>
          <Typography className="text-right text-slate-700 dark:text-slate-300" variant="xs" weight={500}>
            {formatPercent(pool.feeApr)}
          </Typography>
        </div>
        <div className="grid items-center grid-cols-2 gap-2">
          <Typography className="text-slate-700 dark:text-slate-300" variant="xs" weight={500}>
            <Trans>Best Reward APR:</Trans>
          </Typography>
          <Typography className="text-right text-slate-700 dark:text-slate-300" variant="xs" weight={500}>
            {formatPercent(pool.bestStakeApr ?? 0)}
          </Typography>
        </div>
      </div>
      <div className="px-5">
        <hr className="h-px border-t border-slate-500/20 dark:border-slate-200/5" />
      </div>
      <div className="p-5 space-y-5">
        <AddSectionMyPositionUnstaked />
        <AddSectionMyPositionStaked />
      </div>
    </div>
  )
}
