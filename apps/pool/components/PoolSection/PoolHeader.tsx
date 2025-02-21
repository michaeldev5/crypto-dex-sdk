import type { Pool } from '@crypto-dex-sdk/graph-client'
import type { FC } from 'react'
import chains from '@crypto-dex-sdk/chain'
import { formatPercent, formatUSD } from '@crypto-dex-sdk/format'
import { POOL_TYPE } from '@crypto-dex-sdk/graph-client'
import { usePrices, useTokensFromPool } from '@crypto-dex-sdk/shared'
import { AppearOnMount, Currency, Link, NetworkIcon, Typography } from '@crypto-dex-sdk/ui'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'

interface PoolHeaderProps {
  pool: Pool
}

export const PoolHeader: FC<PoolHeaderProps> = ({ pool }) => {
  const { data: prices } = usePrices({ chainId: pool.chainId })
  const { tokens, liquidityToken } = useTokensFromPool(pool)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex gap-1 items-center">
          <NetworkIcon chainId={pool.chainId} height={16} type="naked" width={16} />
          <Typography className="text-slate-500" variant="xs">
            {chains[pool.chainId].name}
          </Typography>
        </div>
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex">
            {pool.type === POOL_TYPE.STANDARD_POOL
              ? (
                  <Currency.IconList iconHeight={44} iconWidth={44}>
                    {tokens.map(token => <Currency.Icon currency={token} key={token.wrapped.address} />)}
                  </Currency.IconList>
                )
              : (
                  <div className="mr-[26px]">
                    <Currency.Icon currency={liquidityToken} height={44} width={44} />
                  </div>
                )}
            <Link.External
              className="flex flex-col !no-underline group"
              href={chains[pool.chainId].getTokenUrl(liquidityToken.wrapped.address)}
            >
              <div className="flex items-center gap-2">
                <Typography
                  className="flex items-center gap-1 text-slate-900 dark:text-slate-50 group-hover:text-blue-400"
                  variant="lg"
                  weight={600}
                >
                  {pool.type === POOL_TYPE.STANDARD_POOL ? `${tokens[0].symbol}/${tokens[1].symbol}` : `${pool.name}`}
                  <ArrowTopRightOnSquareIcon className="text-slate-600 dark:text-slate-400 group-hover:text-blue-400" height={20} width={20} />
                </Typography>
              </div>
              <Typography className="text-slate-700 dark:text-slate-300" variant="xs">
                <Trans>
                  Fee:
                  {pool.type === POOL_TYPE.STANDARD_POOL ? 0.3 : 0.05}
                  %
                </Trans>
              </Typography>
            </Link.External>
          </div>
          <div className="flex flex-col gap-1">
            <Typography as="span" className="text-slate-600 dark:text-slate-400 sm:text-right" weight={400}>
              <Trans>Best APR: </Trans> <span className="font-semibold text-slate-900 dark:text-slate-50">{formatPercent(pool.apr)}</span>
            </Typography>
            <div className="flex gap-2">
              <Typography as="span" className="text-slate-600 dark:text-slate-400" variant="sm" weight={400}>
                <Trans>
                  Best Rewards: {formatPercent(pool.bestStakeApr)}
                </Trans>
              </Typography>
              <Typography as="span" className="text-slate-600 dark:text-slate-400" variant="sm" weight={400}>
                <Trans>
                  Fees: {formatPercent(pool.feeApr)}
                </Trans>
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {tokens.map(token => (
          <div
            className="flex gap-3 p-3 rounded-lg shadow-sm border border-slate-500/20 bg-white dark:bg-slate-800 shdow-white/10 dark:shadow-black/10"
            key={token.wrapped.address}
          >
            <Currency.Icon currency={token} height={20} width={20} />
            <Typography className="text-slate-700 dark:text-slate-300" variant="sm" weight={600}>
              <AppearOnMount>
                {token.symbol} ={' '}
                {prices?.[token.wrapped.address]
                  ? formatUSD(Number(prices[token.wrapped.address].toSignificant(6)))
                  : '$0.00'}
              </AppearOnMount>
            </Typography>
          </div>
        ))}
      </div>
    </div>
  )
}
