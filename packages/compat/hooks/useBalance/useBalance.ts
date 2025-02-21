import type { Amount, Type } from '@crypto-dex-sdk/currency'
import type { Address } from 'viem'
import type { BalanceMap } from './types'
import { ParachainId } from '@crypto-dex-sdk/chain'
import { useBalances as useAmplitudeBalances } from '@crypto-dex-sdk/parachains-amplitude'
import { useBalances as useWagmiBalances } from '@crypto-dex-sdk/wagmi'
import { AddressZero } from '@ethersproject/constants'
import { useMemo } from 'react'
import { isEvmNetwork } from '../../config'

interface UseBalancesParams {
  account: string | undefined
  currencies: (Type | undefined)[]
  chainId?: ParachainId
  enabled?: boolean
  watch?: boolean
}

type UseBalances = (params: UseBalancesParams) => {
  data: BalanceMap
  isLoading: boolean
  isError: boolean
}

export const useBalances: any = ({
  chainId,
  account,
  currencies,
  enabled,
  watch,
}: any) => {
  const wagmiBalances = useWagmiBalances({
    chainId,
    account: account as Address,
    currencies,
    enabled: enabled && chainId && isEvmNetwork(chainId),
    watch,
  })

  // const bifrostBalances = useBifrostBalances({
  //   chainId,
  //   account,
  //   currencies,
  //   enabled: chainId === ParachainId.BIFROST_KUSAMA || chainId === ParachainId.BIFROST_POLKADOT,
  // })

  const amplitudeBalances = useAmplitudeBalances({
    chainId,
    account,
    currencies,
    enabled: chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM,
  })

  return useMemo(() => {
    if (!chainId) {
      return {
        data: {},
        isLoading: false,
        isError: true,
      }
    }
    if (isEvmNetwork(chainId))
      return wagmiBalances

    if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
      return amplitudeBalances
  }, [amplitudeBalances, chainId, wagmiBalances])
}

interface UseBalanceParams {
  account: string | undefined
  currency: Type | undefined
  chainId?: ParachainId
  enabled?: boolean
  watch?: boolean
}

type UseBalance = (params: UseBalanceParams) => Pick<ReturnType<typeof useBalances>, 'isError' | 'isLoading'> & {
  data: Amount<Type> | undefined
}

export const useBalance: UseBalance = ({
  watch = true,
  chainId,
  account,
  currency,
  enabled = true,
}) => {
  const currencies = useMemo(() => [currency], [currency])
  const { data, isLoading, isError } = useBalances({ watch, chainId, currencies, account, enabled })

  return useMemo(() => {
    const balance = currency && chainId
      ? data?.[
        isEvmNetwork(chainId)
          ? currency.isNative
            ? AddressZero
            : currency.wrapped.address
          : currency.wrapped.address
      ]
      : undefined

    return {
      isError,
      isLoading,
      data: balance,
    }
  }, [currency, chainId, data, isError, isLoading])
}
