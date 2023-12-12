import type { Amount, Type } from '@crypto-dex-sdk/currency'

export type BalanceMap = Record<string, Amount<Type> | undefined> | undefined
