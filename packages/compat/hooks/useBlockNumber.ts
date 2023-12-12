import type { ParachainId } from '@crypto-dex-sdk/chain'
import { useBlockNumber as useWagmiBlockNumber } from '@crypto-dex-sdk/wagmi'
import { useMemo } from 'react'
import { useBlockNumber as useSubstrateBlockNumber } from '@crypto-dex-sdk/polkadot'
import { isEvmNetwork } from '../config'

export function useBlockNumber(chainId: ParachainId) {
  const wagmiBlockNumber = useWagmiBlockNumber(chainId)
  const substrateBlockNumber = useSubstrateBlockNumber(chainId)

  return useMemo(() => {
    if (isEvmNetwork(chainId))
      return wagmiBlockNumber ? Number(wagmiBlockNumber) : undefined
    return substrateBlockNumber?.toNumber()
  }, [chainId, substrateBlockNumber, wagmiBlockNumber])
}
