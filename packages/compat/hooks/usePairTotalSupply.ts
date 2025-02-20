import type { Pair } from '@crypto-dex-sdk/amm'
import { ParachainId } from '@crypto-dex-sdk/chain'
import { usePairTotalSupply as useAmplitudePairTotalSupply } from '@crypto-dex-sdk/parachains-amplitude'
import { usePairTotalSupply as useWagmiPairTotalSupply } from '@crypto-dex-sdk/wagmi'
import { useMemo } from 'react'
import { isEvmNetwork, isSubstrateNetwork } from '../config'

export function usePairTotalSupply(pair: Pair | undefined | null, chainId: ParachainId) {
  const wagmiPairTotalSupply = useWagmiPairTotalSupply(pair, chainId)
  // const bifrostPairTotalSupply = useBifrostPairTotalSupply(pair, chainId, isSubstrateNetwork(chainId))
  const amplitudePairTotalSupply = useAmplitudePairTotalSupply(pair, chainId, isSubstrateNetwork(chainId))

  return useMemo(() => {
    if (isEvmNetwork(chainId))
      return wagmiPairTotalSupply

    if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
      return amplitudePairTotalSupply
    else
      return amplitudePairTotalSupply
  }, [amplitudePairTotalSupply, chainId, wagmiPairTotalSupply])
}
