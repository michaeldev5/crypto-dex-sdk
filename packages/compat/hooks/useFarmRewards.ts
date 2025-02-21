import type { Address } from 'viem'
import { ParachainId } from '@crypto-dex-sdk/chain'
import { useFarmsRewards as useAmplitudeFarmsRewards } from '@crypto-dex-sdk/parachains-amplitude'
import { useFarmsRewards as useWagmiFarmsRewards } from '@crypto-dex-sdk/wagmi'
import { useMemo } from 'react'
import { isEvmNetwork } from '../config'

interface UserReward {
  token: string
  amount: string
}
interface FarmReward {
  pid: number
  nextClaimableBlock?: string
  nextClaimableTime?: string
  userRewards: UserReward[]
}

interface UseFarmsRewardsParams {
  account: string | undefined
  pids: (number | undefined)[]
  chainId?: ParachainId
  enabled?: boolean
  watch?: boolean
}

type UseFarmsRewards = (params: UseFarmsRewardsParams) => {
  data: Record<number, FarmReward>
  isLoading: boolean
  isError: boolean
}

export const useFarmsRewards: any = ({
  chainId,
  account,
  pids,
  enabled,
  watch,
}: any) => {
  const wagmiBalances = useWagmiFarmsRewards({
    chainId,
    account: account as Address,
    pids,
    enabled: enabled && chainId && isEvmNetwork(chainId),
    watch,
  })

  // const bifrostBalances = useBifrostFarmsRewards({
  //   chainId,
  //   account,
  //   pids,
  // })

  const amplitudeBalances = useAmplitudeFarmsRewards({
    chainId,
    account,
    pids,
  })

  return useMemo(() => {
    if (!chainId) {
      return {
        data: {},
        isLoading: false,
        isError: true,
      }
    }
    if (isEvmNetwork(chainId))
      return wagmiBalances

    if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
      return amplitudeBalances
    // else
    //   return bifrostBalances
  }, [amplitudeBalances, chainId, wagmiBalances])
}

interface UseFarmRewardsParams {
  account: string | undefined
  chainId?: ParachainId
  pid: number
  enabled?: boolean
  watch?: boolean
}

type UseFarmRewards = (params: UseFarmRewardsParams) => Pick<ReturnType<typeof useFarmsRewards>, 'isError' | 'isLoading'> & {
  data?: FarmReward
}

export const useFarmRewards: UseFarmRewards = ({
  watch = true,
  chainId,
  account,
  pid,
  enabled = true,
}) => {
  const pids = useMemo(() => [pid], [pid])
  const { data, isLoading, isError } = useFarmsRewards({ watch, chainId, pids, account, enabled })

  return useMemo(() => {
    const balance = (pid !== undefined) && chainId
      ? data?.[pid]
      : undefined

    return {
      isError,
      isLoading,
      data: balance,
    }
  }, [pid, chainId, data, isError, isLoading])
}
