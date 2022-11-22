import { chainName, chainShortNameToChainId } from '@zenlink-interface/chain'
import { fetchPairById } from '../../queries'
import type { PairMeta } from '../../types'
import { POOL_TYPE } from '../../types'

export const pairById = async (id: string) => {
  const [chainShortName, address] = id.split(':') as [string, string]
  const chainId = chainShortNameToChainId[chainShortName]

  const pairTransformer = (pair: PairMeta, chainId: number) => {
    const vloumeUSDOneWeek = pair.pairDayData
      .slice(0, 7)
      .reduce((total, current) => total + Number(current.dailyVolumeUSD), 0)
    const feeApr = Number(pair?.reserveUSD) > 500
      ? (vloumeUSDOneWeek * 0.0015 * 365) / (Number(pair?.reserveUSD) * 7)
      : 0
    const apr = Number(feeApr)

    return {
      ...pair,
      type: POOL_TYPE.STANDARD_POOL,
      name: `${pair.token0.symbol}-${pair.token1.symbol}`,
      address: pair.id,
      id: `${chainShortName}:${pair.id}`,
      chainId,
      chainName: chainName[chainId],
      chainShortName,
      token0: {
        ...pair.token0,
        chainId,
      },
      token1: {
        ...pair.token1,
        chainId,
      },
      apr,
      feeApr,
    }
  }

  return fetchPairById(chainId, address)
    .then(data => data.data ? pairTransformer(data.data, chainId) : undefined)
}