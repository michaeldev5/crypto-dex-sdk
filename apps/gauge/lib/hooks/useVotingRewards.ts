import type { Token } from '@crypto-dex-sdk/currency'
import type { Address } from 'viem'
import type { z } from 'zod'
import { ParachainId } from '@crypto-dex-sdk/chain'
import { Amount, DOT } from '@crypto-dex-sdk/currency'
import { JSBI, ZERO } from '@crypto-dex-sdk/math'
import { useCheckVotingRewards, votingResultValidator } from '@crypto-dex-sdk/wagmi'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

interface UseVotingRewardsReturn {
  unClaimedDOTAmount: Amount<Token>
  data: z.infer<typeof votingResultValidator>
}

export function useVotingRewards(account?: string | Address): UseVotingRewardsReturn {
  const queryKey = useMemo(() => ['https://zenlink-stats.zenlink.pro/api/vote/claim', account], [account])

  const { data } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await fetch(`https://zenlink-stats.zenlink.pro/api/vote/claim/${account}`)
        .then(response => response.json())
      return votingResultValidator.parse(res.data)
    },
    staleTime: 20000,
    enabled: !!account,
  })

  const { data: checkedData } = useCheckVotingRewards(ParachainId.MOONBEAM, data)

  return useMemo(() => {
    const unClaimedDOTAmount = Amount.fromRawAmount(
      DOT[ParachainId.MOONBEAM],
      checkedData.reduce((total, d) => JSBI.add(total, JSBI.BigInt(d.amount)), ZERO),
    )

    return {
      unClaimedDOTAmount,
      data: checkedData,
    }
  }, [checkedData])
}
