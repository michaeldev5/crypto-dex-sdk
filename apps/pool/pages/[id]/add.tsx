import type { Pair, Pool, StableSwap } from '@crypto-dex-sdk/graph-client'
import type { BreadcrumbLink } from '@crypto-dex-sdk/ui'
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import type { FC } from 'react'
import { chainShortName } from '@crypto-dex-sdk/chain'
import {
  pairById,
  pairsByChainIds,
  POOL_TYPE,
  singleTokenLockById,
  singleTokenLocksByChainIds,
  stableSwapById,
  stableSwapsByChainIds,
} from '@crypto-dex-sdk/graph-client'
import { AppearOnMount } from '@crypto-dex-sdk/ui'
import {
  AddSectionStable,
  AddSectionStandard,
  Layout,
  PoolPositionProvider,
  PoolPositionStakedProvider,
} from 'components'
import { AddSectionMyPosition } from 'components/AddSection/AddSectionMyPosition'
import { StakeSectionStable, StakeSectionStandard } from 'components/StakeSection'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { AVAILABLE_POOL_TYPE_MAP } from 'lib/constants'
import { swapFeeOfPool } from 'lib/functions'
import { useRouter } from 'next/router'
import useSWR, { SWRConfig } from 'swr'

function LINKS({ pool }: { pool: Pool }): BreadcrumbLink[] {
  return [
    {
      href: `/${pool.id}`,
      label: `${pool.name} - ${AVAILABLE_POOL_TYPE_MAP[pool.type]} - ${swapFeeOfPool(pool.type)}`,
    },
    {
      href: `/${pool.id}/add`,
      label: 'Add Liquidity',
    },
  ]
}

const Add: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <AddCore />
    </SWRConfig>
  )
}

function AddCore() {
  const router = useRouter()
  const { data } = useSWR<{ pool: Pool }>(
    `/pool/api/pool/${router.query.id}`,
    (url: string) => fetch(url).then(response => response.json()),
  )

  if (!data)
    return <></>
  const { pool } = data

  return (
    <PoolPositionProvider pool={pool}>
      <PoolPositionStakedProvider pool={pool}>
        <Layout breadcrumbs={LINKS(data)}>
          <div className="grid grid-cols-1 sm:grid-cols-[340px_auto] md:grid-cols-[auto_396px_264px] gap-10">
            <div className="hidden md:block" />
            <div className="flex flex-col order-3 gap-3 pb-40 sm:order-2">
              <div>
                {pool.type === POOL_TYPE.STANDARD_POOL && <AddSectionStandard pair={pool as Pair} />}
                {pool.type === POOL_TYPE.STABLE_POOL && <AddSectionStable pool={pool as StableSwap} />}
              </div>
              <div>
                {pool.type === POOL_TYPE.STANDARD_POOL && <StakeSectionStandard pair={pool as Pair} />}
                {pool.type === POOL_TYPE.STABLE_POOL && <StakeSectionStable pool={pool as StableSwap} />}
                {pool.type === POOL_TYPE.SINGLE_TOKEN_POOL && <StakeSectionStandard pair={pool as Pair} />}
              </div>
            </div>
            <div className="order-1 sm:order-3">
              <AppearOnMount>
                <AddSectionMyPosition pool={pool} />
              </AppearOnMount>
            </div>
          </div>
        </Layout>
      </PoolPositionStakedProvider>
    </PoolPositionProvider>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pools = (
    await Promise.all([
      pairsByChainIds({ chainIds: SUPPORTED_CHAIN_IDS }),
      stableSwapsByChainIds({ chainIds: SUPPORTED_CHAIN_IDS }),
      singleTokenLocksByChainIds({ chainIds: SUPPORTED_CHAIN_IDS }),
    ])
  ).flat()

  // Get the paths we want to pre-render based on pairs
  const paths = pools
    .sort(({ reserveUSD: a }, { reserveUSD: b }) => {
      return Number(b) - Number(a)
    })
    .slice(0, 50)
    .map(pool => ({
      params: { id: `${chainShortName[pool.chainId]}:${pool.address}` },
    }))

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string
  const [pair, stableSwap, singleTokenLock] = await Promise.all([
    pairById(id),
    stableSwapById(id),
    singleTokenLockById(id),
  ])
  const pool = pair || stableSwap || singleTokenLock

  if (!pool) {
    // If there is a server error, you might want to
    // throw an error instead of returning so that the cache is not updated
    // until the next successful request.
    throw new Error(`Failed to fetch pair, received ${pool}`)
  }

  return {
    props: {
      fallback: {
        [`/pool/api/pool/${id}`]: { pool },
      },
    },
    revalidate: 60,
  }
}

export default Add
