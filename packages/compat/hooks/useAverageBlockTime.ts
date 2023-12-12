import type { ParachainId } from '@crypto-dex-sdk/chain'
import { useAverageBlockTime as useWagmiAverageBlockTime } from '@crypto-dex-sdk/wagmi'
import { useMemo } from 'react'
import { useAverageBlockTime as useSubstrateAverageBlockTime } from '@crypto-dex-sdk/polkadot'
import { isEvmNetwork } from '../config'

export function useAverageBlockTime(chainId: ParachainId) {
  const wagmiBlockNumber = useWagmiAverageBlockTime(chainId)
  const substrateBlockNumber = useSubstrateAverageBlockTime(chainId)

  return useMemo(() => {
    if (isEvmNetwork(chainId))
      return wagmiBlockNumber
    return substrateBlockNumber
  }, [chainId, substrateBlockNumber, wagmiBlockNumber])
}
