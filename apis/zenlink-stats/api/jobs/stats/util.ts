/* eslint-disable no-console */
import { ParachainId } from '@crypto-dex-sdk/chain'
import { fetchZenlinkStats } from '@crypto-dex-sdk/graph-client'
import { getUnixTime } from 'date-fns'
import stringify from 'fast-json-stable-stringify'

import redis from '../../../lib/redis'
import { EVM_CHAINS, ZENLINK_CHAINS } from './config'
import { getZLKInfo } from './distribute'
import { fetchBifrostKusamaZLKHolders, fetchEvmZLKHoldersFromSubScan } from './holders'

async function fetchZLKHolders(chainId: ParachainId) {
  if (chainId === ParachainId.BIFROST_KUSAMA)
    return await fetchBifrostKusamaZLKHolders()
  if (EVM_CHAINS.includes(chainId))
    return await fetchEvmZLKHoldersFromSubScan(chainId)
  return 0
}

async function getZLKHolders() {
  const results = await Promise.all(
    ZENLINK_CHAINS.map(chainId => fetchZLKHolders(chainId)),
  )

  return results
    .filter((result): result is NonNullable<typeof results[0]> => result !== undefined)
    .map((holders, i) => ({ chainId: ZENLINK_CHAINS[i], holders }))
}

async function getZenlinkStatsResults() {
  const results = await Promise.all(
    ZENLINK_CHAINS.map(chainId => fetchZenlinkStats(chainId)),
  )

  return results
    .filter((result): result is NonNullable<typeof results[0]> => result !== undefined)
    .map(({ data }, i) => ({ chainId: ZENLINK_CHAINS[i], zenlinkStats: data }))
}

export async function execute() {
  console.log(
    `Updating zenlink stats for chains: ${ZENLINK_CHAINS
      .map(chainId => ParachainId[chainId])
      .join(', ')}`,
  )

  const zenlinkStatsResults = await getZenlinkStatsResults()
  const zenlinkHolders = await getZLKHolders()
  const chainIds = Array.from(new Set(zenlinkStatsResults.map(result => result.chainId)))
  const zlkInfos = await getZLKInfo()
  const combined = chainIds.map((chainId) => {
    const sources = zenlinkStatsResults.filter(result => result.chainId === chainId)

    const distributeAndBurn = zlkInfos.find(info => info.chainId === chainId)?.result
    const zenlinkStats = sources[0].zenlinkStats
    const holders = zenlinkHolders.find(holder => holder.chainId === chainId)?.holders ?? 0
    const totalDistribute = distributeAndBurn?.totalDistribute ?? 0
    const totalBurn = distributeAndBurn?.burn ?? 0
    const zenlinkInfo = {
      totalTvlUSD: zenlinkStats?.totalTvlUSD,
      totalVolumeUSD: zenlinkStats?.totalVolumeUSD,
      holders,
      totalDistribute,
      totalBurn,
    }
    return { chainId, updatedAtTimestamp: getUnixTime(Date.now()), zenlinkInfo }
  })

  const zlkStats = Object.fromEntries(
    combined.map(({ chainId, zenlinkInfo, updatedAtTimestamp }) => [
      chainId,
      stringify({
        chainId,
        zenlinkInfo,
        updatedAtTimestamp,
      }),
    ]),
  )

  await redis.hset('zlk-stats', zlkStats)
  console.log('Finished updating zlk stats')
}
