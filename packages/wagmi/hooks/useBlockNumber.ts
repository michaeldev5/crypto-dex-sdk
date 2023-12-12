import type { ParachainId } from '@crypto-dex-sdk/chain'
import { chainsParachainIdToChainId } from '@crypto-dex-sdk/chain'
import { useBlockNumber as useWagmiBlockNumber } from 'wagmi'

export function useBlockNumber(chainId: ParachainId) {
  const { data } = useWagmiBlockNumber({
    chainId: chainsParachainIdToChainId[chainId],
  })

  return data
}
