import type { FC } from 'react'
import type { CellProps } from './types'
import { formatNumber } from '@crypto-dex-sdk/format'
import { POOL_TYPE } from '@crypto-dex-sdk/graph-client'
import { isPoolEnabledFarms, useTokensFromPool } from '@crypto-dex-sdk/shared'
import { Currency, NetworkIcon, RewardIcon, Typography } from '@crypto-dex-sdk/ui'
import { ICON_SIZE } from './constants'

export const PoolNameCell: FC<CellProps> = ({ row }) => {
  const { tokens, liquidityToken } = useTokensFromPool(row)

  return (
    <div className="flex items-center gap-3 sm:gap-0">
      <div className="hidden sm:flex">
        {row.type === POOL_TYPE.STANDARD_POOL
          ? (
              <Currency.IconList iconHeight={ICON_SIZE} iconWidth={ICON_SIZE}>
                {tokens.map(token => <Currency.Icon currency={token} disableLink key={token.wrapped.address} />)}
              </Currency.IconList>
            )
          : (
              <div className="mr-[22px]">
                <Currency.Icon currency={liquidityToken} disableLink height={ICON_SIZE} width={ICON_SIZE} />
              </div>
            )}
      </div>
      <div className="flex sm:hidden">
        <NetworkIcon chainId={row.chainId} height={ICON_SIZE} width={ICON_SIZE} />
      </div>
      <div className="flex flex-col">
        <Typography className="flex items-center gap-1 text-slate-900 dark:text-slate-50" variant="sm" weight={500}>
          {row.type === POOL_TYPE.STANDARD_POOL
            ? (
                <>
                  {tokens[0].symbol} <span className="text-slate-500">/</span> {tokens[1].symbol}{' '}
                </>
              )
            : (
                <>
                  {row.name}{' '}
                </>
              )}
          {row.type !== POOL_TYPE.SINGLE_TOKEN_POOL && (
            <div className="bg-slate-300 dark:bg-slate-700 rounded-lg px-1 py-0.5 text-xs ml-1">
              {row.type === POOL_TYPE.STANDARD_POOL ? formatNumber(30 / 100) : formatNumber(5 / 100)}
              %
            </div>
          )}
          {isPoolEnabledFarms(row) && (
            <div className="bg-green-500/50 rounded-lg flex items-center justify-center w-6 h-5 ml-1">
              <RewardIcon className="-mt-0.5" height={16} width={16} />
            </div>
          )}
        </Typography>
        <Typography className="text-slate-600 dark:text-slate-400" variant="xxs">
          {row.type === POOL_TYPE.STANDARD_POOL
            ? 'Standard'
            : row.type === POOL_TYPE.SINGLE_TOKEN_POOL
              ? 'Single'
              : 'Stable'}
        </Typography>
      </div>
    </div>
  )
}
