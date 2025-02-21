import type { DaySnapshot, DaySnapshotsQueryData } from '../../types'
import { chainName, chainShortName } from '@crypto-dex-sdk/chain'
import { ZENLINK_ENABLED_NETWORKS } from '@crypto-dex-sdk/graph-config'
import { ZenlinkDayInfoOrderByInput } from '../../__generated__/types-and-hooks'
import { fetchDaySnapshots } from '../../queries'

interface QueryDaySnapshotsByChainIdsArgs {
  chainIds: number[]
  limit?: number
  orderBy?: ZenlinkDayInfoOrderByInput
}

export async function daySnapshotsByChainIds({
  chainIds,
  limit = 1000,
  orderBy = ZenlinkDayInfoOrderByInput.DateDesc,
}: QueryDaySnapshotsByChainIdsArgs) {
  const daySnapshotsTransformer = (snapshotMetas: DaySnapshotsQueryData[], chainId: number) => snapshotMetas.map(snapshotMeta => ({
    ...snapshotMeta,
    chainId,
    chainName: chainName[chainId],
    chainShortName: chainShortName[chainId],
  }))

  return Promise.allSettled([
    ...chainIds
      .filter((el): el is typeof ZENLINK_ENABLED_NETWORKS[number] => ZENLINK_ENABLED_NETWORKS.includes(el))
      .map(chainId =>
        fetchDaySnapshots({ chainId, limit, orderBy })
          .then(data =>
            data.data
              ? daySnapshotsTransformer(data.data, chainId)
              : [],
          ),
      ),
  ]).then(daySnapshots =>
    daySnapshots.flat().reduce<DaySnapshot[]>((previousValue, currentValue) => {
      if (currentValue.status === 'fulfilled')
        previousValue.push(...currentValue.value)

      return previousValue
    }, []),
  )
}
