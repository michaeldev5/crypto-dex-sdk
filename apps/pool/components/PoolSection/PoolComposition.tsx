import type { Pool } from '@crypto-dex-sdk/graph-client'
import type { FC } from 'react'
import { formatUSD } from '@crypto-dex-sdk/format'
import { usePrices, useTokensFromPool } from '@crypto-dex-sdk/shared'
import { AppearOnMount, Currency, Table, Typography } from '@crypto-dex-sdk/ui'
import { Trans } from '@lingui/macro'

interface PoolCompositionProps {
  pool: Pool
}

export const PoolComposition: FC<PoolCompositionProps> = ({ pool }) => {
  const { data: prices } = usePrices({ chainId: pool.chainId })
  const { tokens, reserves } = useTokensFromPool(pool)

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex items-center justify-between px-2">
        <Typography className="text-slate-900 dark:text-slate-50" weight={600}>
          <Trans>Pool Composition</Trans>
        </Typography>
        <AppearOnMount>
          <Typography className="text-slate-600 dark:text-slate-400" variant="sm" weight={400}>
            <Trans>Total Assets:</Trans>{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-50">
              {' '}
              {formatUSD(pool.reserveUSD)}
            </span>
          </Typography>
        </AppearOnMount>
      </div>
      <Table.container className="w-full">
        <Table.table>
          <Table.thead>
            <Table.thr>
              <Table.th>
                <div className="text-left"><Trans>Token</Trans></div>
              </Table.th>
              <Table.th>
                <div className="text-left"><Trans>Amount</Trans></div>
              </Table.th>
              <Table.th>
                <div className="text-left"><Trans>Value</Trans></div>
              </Table.th>
            </Table.thr>
          </Table.thead>
          <Table.tbody>
            {tokens.map((token, i) => (
              <Table.tr key={token.wrapped.address}>
                <Table.td>
                  <div className="flex items-center gap-3">
                    <Currency.Icon currency={token} height={24} width={24} />
                    <Typography className="text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
                      {token.symbol}
                    </Typography>
                  </div>
                </Table.td>
                <Table.td>
                  <Typography className="text-slate-600 dark:text-slate-400" variant="sm" weight={500}>
                    {reserves[i]?.toSignificant(6)}
                  </Typography>
                </Table.td>
                <Table.td>
                  <AppearOnMount>
                    <Typography className="text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
                      {formatUSD(
                        prices?.[token.wrapped.address]
                          ? reserves[i].multiply(prices?.[token.wrapped.address].asFraction).toSignificant(6)
                          : '',
                      )}
                    </Typography>
                  </AppearOnMount>
                </Table.td>
              </Table.tr>
            ))}
          </Table.tbody>
        </Table.table>
      </Table.container>
    </div>
  )
}
