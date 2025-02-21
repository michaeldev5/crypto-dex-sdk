import type { NetworkSelectorProps } from './index'
import { classNames, Dialog, Input } from '@crypto-dex-sdk/ui'
import { Popover } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import React, { useState } from 'react'
import { CHAIN_META as chains } from '../config/chain'
import { NetworkIcon } from '../icons/NetworkIcon'

export function NetworkSelectorDialog<T extends string>({
  networks,
  onSelect,
  selected,
  children,
}: Omit<NetworkSelectorProps<T>, 'variant'>) {
  const [query, setQuery] = useState<string>('')

  return (
    <Popover>
      {({ open, close }) => (
        <>
          {typeof children === 'function' ? children({ close, open }) : children}
          <Dialog onClose={() => close()} open={open}>
            <Dialog.Content className="flex flex-col gap-2 scroll sm:overflow-hidden !pb-0 !h-[75vh] sm:!h-[640px]">
              <Dialog.Header title={<Trans>Select Network</Trans>} />
              <Popover.Panel>
                <Input.Search
                  className={classNames(
                    'my-3 ring-offset-2 border border-slate-500/20 ring-offset-slate-300 dark:ring-offset-slate-800 flex gap-2 !bg-slate-200 dark:!bg-slate-700 w-full relative items-center justify-between rounded-2xl focus-within:ring-2 text-primary ring-blue',
                  )}
                  loading={false}
                  onChange={setQuery}
                  value={query}
                />
                <div className="h-[calc(100%-44px)] scroll overflow-auto">
                  {networks
                    .filter(el => (query ? chains[el].name.toLowerCase().includes(query.toLowerCase()) : Boolean))
                    .map(el => (
                      <button
                        className={classNames(
                          'w-full px-1 group hover:bg-white hover:dark:bg-slate-800 flex rounded-lg justify-between gap-2 items-center cursor-pointer transform-all h-[44px]',
                        )}
                        key={el}
                        onClick={() => onSelect(el, close)}
                      >
                        <div className="flex items-center gap-3">
                          <NetworkIcon
                            chain={chains[el].chain}
                            className="text-gray-600 group-hover:text-gray-900 dark:text-slate-50 rounded-full bg-black/10 dark:bg-white/10"
                            height={28}
                            type="naked"
                            width={28}
                          />
                          <p
                            className={classNames(
                              selected === el ? 'font-semibold text-gray-900' : 'font-medium text-gray-500',
                              'group-hover:text-gray-900 dark:text-slate-300 group-hover:dark:text-slate-50',
                            )}
                          >
                            {chains[el].name}
                          </p>
                        </div>
                        {selected === el && <CheckIcon className="text-blue" height={20} strokeWidth={2} width={20} />}
                      </button>
                    ))}
                </div>
              </Popover.Panel>
            </Dialog.Content>
          </Dialog>
        </>
      )}
    </Popover>
  )
}
