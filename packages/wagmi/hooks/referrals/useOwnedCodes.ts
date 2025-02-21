import type { ParachainId } from '@crypto-dex-sdk/chain'
import type { Address } from 'viem'
import type { useReadContracts } from 'wagmi'
import { chainsParachainIdToChainId, isEvmNetwork } from '@crypto-dex-sdk/chain'
import { useEffect, useMemo } from 'react'
import { useReadContract } from 'wagmi'
import { referralStorage } from '../../abis'
import { useBlockNumber } from '../useBlockNumber'
import { ReferralStorageContractAddresses } from './config'

interface UseOwnedCodesParams {
  account: string | undefined
  chainId?: ParachainId
  enabled?: boolean
  watch?: boolean
}

type UseOwnedCodes = (params: UseOwnedCodesParams) => (
  | Pick<ReturnType<typeof useReadContracts>, 'isError' | 'isLoading'>
) & {
  data: string[]
}

export const useOwnedCodes: UseOwnedCodes = ({
  account,
  chainId,
  enabled = true,
  watch = true,
}) => {
  const contract = useMemo(() => ({
    chainId: chainsParachainIdToChainId[chainId && isEvmNetwork(chainId) ? chainId : -1],
    address: ReferralStorageContractAddresses[chainId && isEvmNetwork(chainId) ? chainId : -1] as Address,
    abi: referralStorage,
    functionName: 'getOwnedCodes',
    args: [account as Address],
  } as const), [account, chainId])

  const blockNumber = useBlockNumber(chainId)
  const { data, isLoading, isError, refetch } = useReadContract({ ...contract })

  useEffect(() => {
    if (enabled && watch && blockNumber)
      refetch()
  }, [blockNumber, enabled, refetch, watch])

  return useMemo(() => ({
    data: (data || []) as string[],
    isLoading,
    isError,
  }), [data, isError, isLoading])
}
