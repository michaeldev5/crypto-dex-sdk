import type { MarketGraphData } from '@crypto-dex-sdk/graph-client'
import type { Market } from '@crypto-dex-sdk/market'
import type { BreadcrumbLink } from '@crypto-dex-sdk/ui'
import type { Address } from 'viem'
import { ParachainId } from '@crypto-dex-sdk/chain'
import { getMaturityFormatDate } from '@crypto-dex-sdk/market'
import { AppearOnMount, LoadingOverlay } from '@crypto-dex-sdk/ui'
import { useMarket } from '@crypto-dex-sdk/wagmi'
import {
  Layout,
  MarketActions,
  MarketAPY,
  MarketChart,
  MarketComposition,
  MarketHeader,
  MarketRewards,
  MarketStats,
} from 'components'
import { useRouter } from 'next/router'
import useSWR from 'swr'

function LINKS(market: Market): BreadcrumbLink[] {
  return [
    {
      href: `/${market.id}`,
      label: `${market.SY.yieldToken.symbol} - ${getMaturityFormatDate(market)}`,
    },
  ]
}

function MarketPage() {
  const router = useRouter()

  const { data: market, isLoading } = useMarket(
    ParachainId.MOONBEAM,
    router.query.id as Address,
    { enabled: !!router.query.id },
  )

  const { data: marketGraphData, isLoading: isMarketGraphDataLoading } = useSWR<MarketGraphData | undefined>(
    `/market/api/market/${router.query.id}`,
    (url: string) => fetch(url).then(response => response.json()),
  )

  if (!market)
    return <LoadingOverlay show={isLoading} />

  return (
    <>
      <Layout breadcrumbs={LINKS(market)} maxWidth="6xl">
        <div className="flex flex-col lg:grid lg:grid-cols-[690px_auto] gap-16">
          <div className="flex flex-col order-1 gap-9">
            <MarketHeader market={market} />
            <hr className="my-3 border-t border-slate-500/20 dark:border-slate-200/5" />
            <MarketChart isLoading={isMarketGraphDataLoading} market={marketGraphData} />
            <AppearOnMount show={!!marketGraphData}>
              <MarketStats market={marketGraphData} />
            </AppearOnMount>
            <MarketComposition market={market} />
            <MarketAPY graphData={marketGraphData} market={market} />
          </div>
          <div className="flex flex-col order-2 gap-4">
            <MarketActions market={market} />
            <MarketRewards market={market} />
          </div>
        </div>
      </Layout>
    </>
  )
}

export default MarketPage
