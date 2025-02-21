import type { FC } from 'react'
import { formatFullNumber, formatUSD } from '@crypto-dex-sdk/format'
import { useZLKPrice, useZLKStats } from '@crypto-dex-sdk/shared'
import { Link } from '@crypto-dex-sdk/ui'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { t, Trans } from '@lingui/macro'
import numeral from 'numeral'
import { useMemo } from 'react'
import { DistributionSection } from './DistributionSection'
import { StatsCard } from './StatsCard'

export const ZLKStats: FC = () => {
  const { data: stats, isLoading } = useZLKStats()
  const { data: zlkPrice, isLoading: isZLKPriceLoading } = useZLKPrice()

  const totalStats = useMemo(
    () => (stats ?? []).reduce((total, { totalTvlUSD, totalVolumeUSD, holders, totalDistribute, totalBurn }) => {
      total.totalTvl = total.totalTvl + Number(totalTvlUSD)
      total.totalVolume = total.totalVolume + Number(totalVolumeUSD)
      total.totalHolders = total.totalHolders + holders
      total.totalBurn = total.totalBurn + Number(totalBurn) / (10 ** 18)
      total.totalCirculatingSupply = total.totalCirculatingSupply + Number(totalDistribute) / (10 ** 18)
      return total
    }, {
      totalTvl: 0,
      totalVolume: 0,
      totalHolders: 0,
      totalCirculatingSupply: 0,
      totalBurn: 0,
      totalMarketCap: 0,
    }),
    [stats],
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full space-y-5">
        <div className="grid gap-4 overflow-auto grid-col-1 lg:grid-cols-3">
          <StatsCard
            loading={isZLKPriceLoading}
            stats={numeral(zlkPrice).format('$0,0.000')}
            text={t`ZLK Price`}
          />
          <StatsCard
            loading={isLoading}
            stats={formatFullNumber(100000000)}
            text={t`Total Supply`}
          />
          <StatsCard
            loading={isLoading}
            stats={formatFullNumber(totalStats?.totalHolders ?? 0)}
            text={t`Holders`}
          />
        </div>
        <div className="grid gap-4 overflow-auto grid-col-1 lg:grid-cols-3">
          <StatsCard
            loading={isLoading || isZLKPriceLoading}
            stats={formatUSD(zlkPrice ? (totalStats?.totalCirculatingSupply) * zlkPrice : 0, '$0,0')}
            text={t`ZLK Market Cap`}
          />
          <StatsCard
            loading={isLoading}
            stats={formatFullNumber(totalStats?.totalCirculatingSupply)}
            text={t`ZLK Circulating Supply`}
          />
          <Link.External href="https://wiki.zenlink.pro/ecosystem/buyback">
            <StatsCard
              loading={isLoading}
              stats={formatFullNumber(totalStats?.totalBurn)}
              text={(
                <span className="flex gap-2">
                  <Trans>Burn Total</Trans>
                  <ArrowTopRightOnSquareIcon height={20} width={20} />
                </span>
              )}
            />
          </Link.External>
        </div>
      </div>
      <DistributionSection />
    </div>
  )
}
