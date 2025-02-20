import type { Address } from 'viem'
import { WNATIVE_ADDRESS } from '@crypto-dex-sdk/currency'
import { wnative } from '../abis'

export function getWNATIVEContractConfig(chainId: number | undefined) {
  return {
    address: (chainId ? WNATIVE_ADDRESS[chainId] : '') as Address,
    abi: wnative,
  }
}

export function useWNATIVEContract(chainId: number | undefined) {
  return getWNATIVEContractConfig(chainId)
}
