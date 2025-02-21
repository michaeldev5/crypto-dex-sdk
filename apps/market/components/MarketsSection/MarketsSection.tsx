import type { FC } from 'react'
import { ParachainId } from '@crypto-dex-sdk/chain'
import { useAccount } from '@crypto-dex-sdk/compat'
import { useIsMounted } from '@crypto-dex-sdk/hooks'
import { Chip, classNames } from '@crypto-dex-sdk/ui'
import { useMarketPositions, useMarkets } from '@crypto-dex-sdk/wagmi'
import { Tab } from '@headlessui/react'
import { Trans } from '@lingui/macro'
import { useMemo, useState } from 'react'
import { PositionDashboard } from './PositionDashboard'
import { MarketsTable, PositionsTable, TableFilters } from './Tables'

export const MarketsSection: FC = () => {
  const { address } = useAccount()
  const mounted = useIsMounted()
  const [tab, setTab] = useState<number>(0)

  const { data: markets, isLoading: isMarketsLoading } = useMarkets(ParachainId.MOONBEAM)
  const { data: positions, isLoading: isMarketPositionsLoading } = useMarketPositions(ParachainId.MOONBEAM, markets || [])

  const validPositions = useMemo(() => {
    if (!positions)
      return []

    return positions.filter(
      position =>
        position.ptBalance?.greaterThan(0)
        || position.ytBalance?.greaterThan(0)
        || position.lpBalance?.greaterThan(0),
    )
  }, [positions])

  return (
    <section className="flex flex-col">
      <Tab.Group onChange={setTab} selectedIndex={tab}>
        <div className="flex items-center gap-6 mb-6">
          <Tab className={({ selected }) => classNames(
            selected ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500',
            'hover:text-slate-900 hover:dark:text-slate-50 focus:text-slate-900 focus:dark:text-slate-50 font-medium !outline-none',
          )}
          >
            <Trans>All Markets</Trans>
          </Tab>
          {address && mounted && (
            <Tab
              className={({ selected }) => classNames(
                selected ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500',
                'hover:text-slate-900 hover:dark:text-slate-50 focus:text-slate-900 focus:dark:text-slate-50 font-medium !outline-none',
              )}
            >
              <Trans>My Positions</Trans> <Chip color="blue" label={validPositions?.length || '0'} size="sm" />
            </Tab>
          )}
        </div>
        <Tab.Panels>
          <Tab.Panel unmount={false}>
            <TableFilters showAllFilters />
            <MarketsTable isLoading={isMarketsLoading} markets={markets} />
          </Tab.Panel>
          <Tab.Panel unmount={!address || !mounted}>
            <PositionDashboard positions={validPositions} />
            <TableFilters showAllFilters />
            <PositionsTable isLoading={isMarketPositionsLoading} positions={validPositions} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  )
}
