import type { QueryableStorageEntry } from '@polkadot/api/types'
import type { ParachainId } from '@crypto-dex-sdk/chain'
import type { Token, Type } from '@crypto-dex-sdk/currency'
import { Amount } from '@crypto-dex-sdk/currency'
import { isZenlinkAddress } from '@crypto-dex-sdk/format'
import { JSBI } from '@crypto-dex-sdk/math'
import { useAccount, useApi, useCallMulti, useNativeBalancesAll } from '@crypto-dex-sdk/polkadot'
import type { OrmlTokensAccountData } from '@zenlink-types/bifrost/interfaces'
import { useMemo } from 'react'

import { addressToNodeCurrency, isNativeCurrency } from '../../libs'
import type { BalanceMap } from './types'

interface UseBalancesParams {
  account: string | undefined
  currencies: (Type | undefined)[]
  chainId?: ParachainId
  enabled?: boolean
}

type UseBalances = (params: UseBalancesParams) => {
  data: BalanceMap
  isLoading: boolean
  isError: boolean
}

export const useBalances: UseBalances = ({
  chainId,
  account,
  currencies,
  enabled = true,
}) => {
  const api = useApi(chainId)
  const { isAccount } = useAccount()

  const nativeBalancesAll = useNativeBalancesAll(chainId, account, enabled)

  const validatedTokens = useMemo(
    () =>
      currencies.filter(
        (currency): currency is Token => {
          return !!chainId && !!currency && isZenlinkAddress(currency.wrapped.address)
        },
      ),
    [chainId, currencies],
  )

  const balances = useCallMulti<OrmlTokensAccountData[]>({
    chainId,
    calls: (api && isAccount(account))
      ? validatedTokens
        .map(currency => [api.query.tokens.accounts, [account, addressToNodeCurrency(currency.wrapped.address)]])
        .filter((call): call is [QueryableStorageEntry<'promise'>, [string, any]] => Boolean(call[0]))
      : [],
    options: { enabled: enabled && Boolean(api && isAccount(account)) },
  })

  const balanceMap: BalanceMap = useMemo(() => {
    const result: BalanceMap = {}

    if (balances.length !== validatedTokens.length)
      return result
    for (let i = 0; i < validatedTokens.length; i++) {
      const value = balances[i]?.free.toString()
      const amount = value ? JSBI.BigInt(value.toString()) : undefined

      if (!result[validatedTokens[i].address])
        result[validatedTokens[i].address] = Amount.fromRawAmount(validatedTokens[i], '0')

      if (amount)
        result[validatedTokens[i].address] = Amount.fromRawAmount(validatedTokens[i], amount)
      else
        result[validatedTokens[i].address] = Amount.fromRawAmount(validatedTokens[i], '0')

      if (isNativeCurrency(validatedTokens[i]))
        result[validatedTokens[i].wrapped.address] = Amount.fromRawAmount(validatedTokens[i], nativeBalancesAll?.availableBalance.toString() || '0')
    }
    return result
  }, [balances, nativeBalancesAll?.availableBalance, validatedTokens])

  return useMemo(() => ({
    data: balanceMap,
    isLoading: isAccount(account) && (!nativeBalancesAll || !balances.length),
    isError: !isAccount(account),
  }), [balanceMap, isAccount, account, nativeBalancesAll, balances.length])
}

interface UseBalanceParams {
  account: string | undefined
  currency: Type | undefined
  chainId?: ParachainId
  enabled?: boolean
}

type UseBalance = (params: UseBalanceParams) => Pick<ReturnType<typeof useBalances>, 'isError' | 'isLoading'> & {
  data: Amount<Type> | undefined
}

export const useBalance: UseBalance = ({
  chainId,
  account,
  currency,
  enabled,
}) => {
  const currencies = useMemo(() => [currency], [currency])
  const { data, isLoading, isError } = useBalances({ chainId, currencies, account, enabled })

  return useMemo(() => {
    const balance = currency
      ? data?.[currency.wrapped.address]
      : undefined

    return {
      isError,
      isLoading,
      data: balance,
    }
  }, [isError, isLoading, currency, data])
}
