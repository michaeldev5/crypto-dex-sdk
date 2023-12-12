import type { Pool } from '@crypto-dex-sdk/graph-client'

export function isPoolEnabledFarms(pool: Pool): boolean {
  return pool.farm !== undefined && pool.farm.some(
    ({ incentives }) =>
      incentives.some(({ rewardPerDay }) => Number(rewardPerDay) > 0),
  )
}
