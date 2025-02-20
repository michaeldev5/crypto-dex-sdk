import type { Amount, Type } from '@crypto-dex-sdk/currency'
import type { Pool } from '@crypto-dex-sdk/graph-client'
import type { FC, ReactNode } from 'react'
import { useAccount, useBalance } from '@crypto-dex-sdk/compat'
import { useTokensFromPool } from '@crypto-dex-sdk/shared'
import { createContext, useContext, useMemo } from 'react'
import { useTokenAmountDollarValues, useUnderlyingTokenBalanceFromPool } from '../lib/hooks'

interface PoolPositionContext {
  balance: Amount<Type> | undefined
  values: number[]
  underlyings: Amount<Type>[]
  isLoading: boolean
  isError: boolean
}

const Context = createContext<PoolPositionContext | undefined>(undefined)

export const PoolPositionProvider: FC<{ pool: Pool, children: ReactNode, watch?: boolean }> = ({
  pool,
  children,
  watch = true,
}) => {
  const { address: account } = useAccount()
  const { reserves, liquidityToken, totalSupply } = useTokensFromPool(pool)

  const {
    data: balance,
    isLoading,
    isError,
  } = useBalance({ chainId: pool.chainId, currency: liquidityToken, account, watch })

  const underlyings = useUnderlyingTokenBalanceFromPool({
    reserves,
    totalSupply,
    balance,
  })

  const values = useTokenAmountDollarValues({ chainId: pool.chainId, amounts: underlyings })

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          balance,
          values,
          underlyings,
          isLoading,
          isError,
        }),
        [balance, isError, isLoading, underlyings, values],
      )}
    >
      {children}
    </Context.Provider>
  )
}

export function usePoolPosition() {
  const context = useContext(Context)
  if (!context)
    throw new Error('Hook can only be used inside Pool Position Context')

  return context
}
