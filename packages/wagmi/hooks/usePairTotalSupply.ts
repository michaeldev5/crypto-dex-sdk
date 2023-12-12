import type { ParachainId } from '@crypto-dex-sdk/chain'
import { chainsParachainIdToChainId } from '@crypto-dex-sdk/chain'
import { Amount, Token } from '@crypto-dex-sdk/currency'
import { useMemo } from 'react'
import type { Address } from 'wagmi'
import { useContractRead } from 'wagmi'
import type { Pair } from '@crypto-dex-sdk/amm'
import { pair as pairContract } from '../abis'

export function usePairTotalSupply(pair: Pair | undefined | null, chainId: ParachainId) {
  const { data: totalSupply } = useContractRead({
    address: (pair?.liquidityToken.address ?? '') as Address,
    abi: pairContract,
    functionName: 'totalSupply',
    chainId: chainsParachainIdToChainId[chainId],
  })

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
