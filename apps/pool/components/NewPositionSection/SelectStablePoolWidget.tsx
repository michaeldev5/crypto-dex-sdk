import type { StableSwap } from '@crypto-dex-sdk/graph-client'
import type { FC } from 'react'
import { Token } from '@crypto-dex-sdk/currency'
import { classNames, Currency, Loader, Typography, Widget } from '@crypto-dex-sdk/ui'
import { Description, Disclosure, DisclosureButton, DisclosurePanel, Label, Radio, RadioGroup, Transition } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'
import { memo } from 'react'

interface SelectStablePoolWidgetProps {
  stablePools: StableSwap[] | undefined
  selectedStablePool: StableSwap | undefined
  setStablePool: (type: StableSwap) => void
}

export const SelectStablePoolWidget: FC<SelectStablePoolWidgetProps> = memo(
  function SelectStablePoolWidget({ selectedStablePool, setStablePool, stablePools }) {
    return (
      <Widget className="dark:!bg-slate-800 !border-slate-500/20" id="selectStablePool" maxWidth={440}>
        <Widget.Content>
          <Disclosure>
            {() => (
              <>
                <DisclosureButton className="w-full pr-3">
                  <div className="flex items-center justify-between">
                    <Widget.Header className="!pb-3" title={<Trans>3. Select Pool</Trans>} />
                    <Typography className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900" variant="sm" weight={700}>
                      {!selectedStablePool ? <Loader /> : selectedStablePool?.name}
                    </Typography>
                  </div>
                </DisclosureButton>
                <Transition
                  as="div"
                  className="transition-[max-height] overflow-hidden"
                  enter="duration-300 ease-in-out"
                  enterFrom="transform max-h-0"
                  enterTo="transform max-h-[380px]"
                  leave="transition-[max-height] duration-250 ease-in-out"
                  leaveFrom="transform max-h-[380px]"
                  leaveTo="transform max-h-0"
                  unmount={false}
                >
                  <DisclosurePanel unmount={false}>
                    <RadioGroup onChange={setStablePool} value={selectedStablePool}>
                      <div className="flex flex-col p-3 gap-2">
                        {stablePools?.map(pool => (
                          <Radio
                            className={({ checked }) => classNames(
                              checked ? 'bg-slate-300/75 dark:bg-slate-600/75' : 'bg-slate-100 dark:bg-slate-900',
                              'relative flex cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600 rounded-xl px-5 py-4 shadow-sm border border-slate-500/20',
                            )}
                            key={pool.address}
                            value={pool}
                          >
                            {({ checked }) => (
                              <div className="flex w-full items-center justify-between">
                                <div className="flex flex-col">
                                  <Label className="flex items-center gap-2">
                                    <Currency.Icon
                                      currency={
                                        new Token({
                                          chainId: pool.chainId,
                                          name: pool.name,
                                          symbol: '4pool',
                                          decimals: 18,
                                          address: pool.lpToken,
                                        })
                                      }
                                      height={24}
                                      width={24}
                                    />
                                    <Typography className="text-slate-800 dark:text-slate-200" variant="base" weight={500}>
                                      {pool.name}
                                    </Typography>
                                  </Label>
                                  <Description>
                                    <Typography as="span" className="text-slate-600 dark:text-slate-400" variant="xxs" weight={400}>
                                      {pool.tokens.map(token => token.symbol).join(' / ')}
                                    </Typography>
                                  </Description>
                                </div>
                                {checked && (
                                  <CheckCircleIcon className="h-6 w-6 shrink-0 text-green-500" />
                                )}
                              </div>
                            )}
                          </Radio>
                        ))}
                      </div>
                    </RadioGroup>
                  </DisclosurePanel>
                </Transition>
              </>
            )}
          </Disclosure>
        </Widget.Content>
      </Widget>
    )
  },
)
