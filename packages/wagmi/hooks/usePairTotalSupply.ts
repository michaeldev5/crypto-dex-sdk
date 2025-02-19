import type { ParachainId } from '@crypto-dex-sdk/chain'
import { chainsParachainIdToChainId, isEvmNetwork } from '@crypto-dex-sdk/chain'
import { Amount, Token } from '@crypto-dex-sdk/currency'
import { useEffect, useMemo } from 'react'
import type { Pair } from '@crypto-dex-sdk/amm'
import type { Address } from 'viem'
import { useReadContract } from 'wagmi'
import { pair as pairContract } from '../abis'
import { useBlockNumber } from './useBlockNumber'

export function usePairTotalSupply(pair: Pair | undefined | null, chainId: ParachainId) {
  const blockNumber = useBlockNumber(chainId)
  const { data: totalSupply, refetch } = useReadContract({
    address: (pair?.liquidityToken.address ?? '') as Address,
    abi: pairContract,
    functionName: 'totalSupply',
    chainId: chainsParachainIdToChainId[chainId && isEvmNetwork(chainId) ? chainId : -1],
  })

  useEffect(() => {
    if (pair && blockNumber)
      refetch()
  }, [blockNumber, pair, refetch])

  return useMemo(() => {
    const address = pair?.liquidityToken.address
    if (address && totalSupply) {
      const zlp = new Token({
        address,
        name: 'Zenlink LP Token',
        decimals: 18,
        symbol: 'ZLK-LP',
        chainId,
      })

      return Amount.fromRawAmount(zlp, totalSupply.toString())
    }
  }, [chainId, pair?.liquidityToken.address, totalSupply])
}
