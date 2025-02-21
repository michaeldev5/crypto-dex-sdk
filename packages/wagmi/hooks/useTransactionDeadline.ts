import { useSettings } from '@crypto-dex-sdk/shared'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { useCurrentBlockTimestamp } from './useCurrentBlockTimestamp'

export function useTransactionDeadline(chainId: number | undefined, enabled = true) {
  const blockTimestamp = useCurrentBlockTimestamp(chainId, enabled)
  const [{ transactionDeadline: ttl }] = useSettings()
  return useMemo(() => {
    if (blockTimestamp && ttl && enabled)
      return BigNumber.from(blockTimestamp as bigint).add(ttl * 60)
    return undefined
  }, [blockTimestamp, ttl, enabled])
}
