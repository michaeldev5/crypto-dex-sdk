import { useAccount } from '@crypto-dex-sdk/compat'
import type { Market } from '@crypto-dex-sdk/market'
import { JSBI, ZERO, _100 } from '@crypto-dex-sdk/math'
import { useBalance, useMarketActiveBalances, useVotingEscrow } from '@crypto-dex-sdk/wagmi'
import { useMemo } from 'react'

const TOKENLESS_PRODUCTION = JSBI.BigInt(40)

export function useIsBoosted(market: Market): boolean {
  const { data: activeBalances } = useMarketActiveBalances(market.chainId, [market])
  const { data: ve } = useVotingEscrow(market.chainId)
  const { address } = useAccount()
  const { data: lpBalance } = useBalance({ chainId: market.chainId, currency: market, account: address })

  return useMemo(() => {
    const activeBalance = activeBalances?.[0]
    if (!activeBalance || !ve || !lpBalance)
      return false

    let veBoostedLpBalance = JSBI.divide(JSBI.multiply(lpBalance.quotient, TOKENLESS_PRODUCTION), _100)
    if (JSBI.greaterThan(ve.totalSupplyAmount, ZERO)) {
      veBoostedLpBalance = JSBI.add(
        veBoostedLpBalance,
        JSBI.divide(
          JSBI.multiply(
            JSBI.divide(JSBI.multiply(market.marketState.totalLp.quotient, ve.balance), ve.totalSupplyAmount),
            JSBI.subtract(_100, TOKENLESS_PRODUCTION),
          ),
          _100,
        ),
      )
    }

    return JSBI.greaterThanOrEqual(JSBI.BigInt(activeBalance.toString()), veBoostedLpBalance)
  }, [activeBalances, lpBalance, market.marketState.totalLp.quotient, ve])
}
