import type { Market } from '@crypto-dex-sdk/market'
import type { FC } from 'react'
import { classNames } from '@crypto-dex-sdk/ui'
import { Tab } from '@headlessui/react'
import { Trans } from '@lingui/macro'
import { TAB_DEFAULT_CLASS, TAB_NOT_SELECTED_CLASS, TAB_SELECTED_CLASS } from 'components/MarketSection/constants'
import { MarketAddManual } from './MarketAddManual'
import { MarketAddZap } from './MarketAddZap'

interface MarketAddProps {
  market: Market
}

export const MarketAdd: FC<MarketAddProps> = ({ market }) => {
  return (
    <div className="w-full max-w-md px-2 py-2 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex w-2/5 space-x-1 rounded-full bg-blue-900/20 p-1">
          <Tab
            className={({ selected }) =>
              classNames(
                TAB_DEFAULT_CLASS,
                selected ? TAB_SELECTED_CLASS : TAB_NOT_SELECTED_CLASS,
              )}
          >
            <Trans>Zap In</Trans>
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                TAB_DEFAULT_CLASS,
                selected ? TAB_SELECTED_CLASS : TAB_NOT_SELECTED_CLASS,
              )}
          >
            <Trans>Manual</Trans>
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <MarketAddZap market={market} />
          </Tab.Panel>
          <Tab.Panel>
            <MarketAddManual market={market} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
