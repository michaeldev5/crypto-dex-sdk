import type { ParachainId } from '@crypto-dex-sdk/chain'
import type { FC } from 'react'
import chains, { chainsChainIdToParachainId, chainsParachainIdToChainId } from '@crypto-dex-sdk/chain'
import { useSettings } from '@crypto-dex-sdk/shared'
import { classNames, DEFAULT_INPUT_UNSTYLED, NetworkIcon, Typography } from '@crypto-dex-sdk/ui'
import { useWalletState } from '@crypto-dex-sdk/wagmi'
import { Popover } from '@headlessui/react'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useCallback, useMemo, useState } from 'react'
import { useAccount, useConnectorClient, useSwitchChain } from 'wagmi'
import { isEvmNetwork, SUPPORTED_CHAIN_IDS } from '../../config'

interface NetworkSelectorProps {
  supportedNetworks?: ParachainId[]
}

export const NetworkSelector: FC<NetworkSelectorProps> = ({ supportedNetworks = SUPPORTED_CHAIN_IDS }) => {
  const [{ parachainId }, { updateParachainId }] = useSettings()
  const [query, setQuery] = useState('')
  const { chain: evmChain } = useAccount()
  const connector = useConnectorClient()
  const { notConnected } = useWalletState(!!connector)
  const { switchChainAsync: switchEvmChainAsync } = useSwitchChain()

  const switchNetwork = useCallback((chainId: ParachainId) => {
    if (isEvmNetwork(chainId)) {
      if (
        notConnected
        || (evmChain && chainsChainIdToParachainId[evmChain.id] === chainId)
      ) {
        updateParachainId(chainId)
      }
      else {
        switchEvmChainAsync
        && switchEvmChainAsync({ chainId: chainsParachainIdToChainId[chainId] })
          .then(() => updateParachainId(chainId))
      }
    }
    else {
      updateParachainId(chainId)
    }
  }, [evmChain, notConnected, switchEvmChainAsync, updateParachainId])

  const isChainActive = useCallback((chainId: ParachainId) => {
    const isParachainIdEqual = parachainId === chainId
    if (!isParachainIdEqual)
      return false
    if (isEvmNetwork(chainId))
      return chainsChainIdToParachainId[evmChain?.id ?? -1] === chainId
    return isParachainIdEqual
  }, [evmChain?.id, parachainId])

  const panel = useMemo(() => (
    <Popover.Panel className="flex flex-col w-full sm:w-[320px] fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] mt-4 sm:rounded-xl rounded-b-none shadow-dropdown bg-white dark:bg-slate-800 border border-slate-500/20 dark:border-slate-200/20">
      <div className="flex gap-2 items-center p-4 pb-3">
        <MagnifyingGlassIcon className="text-slate-500" height={20} width={20} />
        <input
          className={classNames(DEFAULT_INPUT_UNSTYLED, 'w-full bg-transparent placeholder:font-medium text-base')}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search networks"
          value={query}
        />
      </div>
      <div className="mx-4 border-b border-slate-500/20 dark:border-slate-200/10" />
      <div className="p-2 max-h-[300px] scroll">
        {supportedNetworks
          .filter(el => (query ? chains[el].name.toLowerCase().includes(query.toLowerCase()) : Boolean))
          .map(el => (
            <div
              className="hover:bg-gray-200 hover:dark:bg-slate-700 px-2 h-[40px] flex rounded-lg justify-between gap-2 items-center cursor-pointer transform-all"
              key={el}
              onClick={() => { switchNetwork(el) }}
            >
              <div className="flex items-center gap-2">
                <NetworkIcon
                  chainId={el}
                  className="text-gray-600 group-hover:text-gray-900 dark:text-slate-50"
                  height={22}
                  width={22}
                />
                <Typography className="text-gray-700 dark:text-slate-300" variant="sm" weight={500}>
                  {chains[el].name}
                </Typography>
              </div>
              {isChainActive(el) && <div className="w-2 h-2 mr-1 rounded-full bg-green" />}
            </div>
          ))}
      </div>
    </Popover.Panel>
  ), [isChainActive, query, supportedNetworks, switchNetwork])

  return (
    <Popover className="relative">
      {({ open }) => {
        return (
          <>
            <Popover.Button
              className={classNames(
                DEFAULT_INPUT_UNSTYLED,
                'flex items-center gap-1 md:gap-2 !bg-black/[0.04] dark:!bg-white/[0.04] hover:!bg-black/[0.08] hover:!dark:bg-white/[0.08] hover:text-black hover:dark:text-white h-[38px] rounded-xl px-2 !font-semibold !text-sm text-slate-800 dark:text-slate-200',
              )}
            >
              <NetworkIcon chainId={parachainId} height={20} width={20} />
              <div className="hidden sm:block">{chains[parachainId]?.name}</div>
              <ChevronDownIcon
                className={classNames(open ? 'rotate-180' : 'rotate-0', 'transition-transform')}
                height={20}
                width={20}
              />
            </Popover.Button>
            {panel}
          </>
        )
      }}
    </Popover>
  )
}
