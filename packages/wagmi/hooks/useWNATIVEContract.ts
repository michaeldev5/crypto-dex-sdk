import { chainsParachainIdToChainId } from '@crypto-dex-sdk/chain'
import { WNATIVE_ADDRESS } from '@crypto-dex-sdk/currency'
import { usePublicClient } from 'wagmi'
import type { Address } from '@wagmi/core'
import { getContract } from 'wagmi/actions'
import { wnative } from '../abis'

export function getWNATIVEContractConfig(chainId: number | undefined) {
  return {
    address: (chainId ? WNATIVE_ADDRESS[chainId] : '') as Address,
    abi: wnative,
  }
}

export function useWNATIVEContract(chainId: number | undefined) {
  return getContract({
    ...getWNATIVEContractConfig(chainId),
    walletClient: usePublicClient({ chainId: chainsParachainIdToChainId[chainId ?? -1] }),
  })
}
