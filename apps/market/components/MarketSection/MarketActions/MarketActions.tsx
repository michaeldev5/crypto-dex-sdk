import type { Market } from '@crypto-dex-sdk/market'
import type { FC } from 'react'
import { classNames, Widget } from '@crypto-dex-sdk/ui'
import { Tab } from '@headlessui/react'
import { Trans } from '@lingui/macro'
import { SettingsOverlay } from 'components'
import { MarketAdd } from './MarketAdd'
import { MarketMintAndRedeem } from './MarketMintAndRedeem'
import { MarketRemove } from './MarketRemove'
import { MarketSwap } from './MarketSwap'

interface MarketActionsProps {
  market: Market
}

const TAB_DEFAULT_CLASS = 'hover:text-slate-900 hover:dark:text-slate-50 focus:text-slate-900 focus:dark:text-slate-50 font-medium !outline-none'
const TAB_SELECTED_CLASS = 'text-slate-800 dark:text-slate-200'
const TAB_NOT_SELECTED_CLASS = 'text-slate-500'

export const MarketActions: FC<MarketActionsProps> = ({ market }) => {
  return (
    <Widget className="!bg-transparent border-transparent" id="MarketActions" maxWidth={440}>
      <Widget.Content>
        <Tab.Group>
          <Widget.Header
            className="!pb-3"
            title={(
              <div className="flex items-center gap-6">
                <Tab className={({ selected }) =>
                  classNames(
                    selected ? TAB_SELECTED_CLASS : TAB_NOT_SELECTED_CLASS,
                    TAB_DEFAULT_CLASS,
                  )}
                >
                  <Trans>Swap</Trans>
                </Tab>
                <Tab className={({ selected }) =>
                  classNames(
                    selected ? TAB_SELECTED_CLASS : TAB_NOT_SELECTED_CLASS,
                    TAB_DEFAULT_CLASS,
                  )}
                >
                  <Trans>Mint</Trans>
                </Tab>
                <Tab className={({ selected }) =>
                  classNames(
                    selected ? TAB_SELECTED_CLASS : TAB_NOT_SELECTED_CLASS,
                    TAB_DEFAULT_CLASS,
                  )}
                >
                  <Trans>Add</Trans>
                </Tab>
                <Tab className={({ selected }) =>
                  classNames(
                    selected ? TAB_SELECTED_CLASS : TAB_NOT_SELECTED_CLASS,
                    TAB_DEFAULT_CLASS,
                  )}
                >
                  <Trans>Remove</Trans>
                </Tab>
              </div>
            )}
          >
            <SettingsOverlay chainId={market.chainId} />
          </Widget.Header>
          <Tab.Panels>
            <Tab.Panel unmount={false}>
              <MarketSwap market={market} />
            </Tab.Panel>
            <Tab.Panel unmount={false}>
              <MarketMintAndRedeem market={market} />
            </Tab.Panel>
            <Tab.Panel unmount={false}>
              <MarketAdd market={market} />
            </Tab.Panel>
            <Tab.Panel unmount={false}>
              <MarketRemove market={market} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </Widget.Content>
    </Widget>
  )
}
