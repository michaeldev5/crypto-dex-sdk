import type { EChartsOption } from 'echarts-for-react'
import type { FC } from 'react'
import { formatUSD } from '@crypto-dex-sdk/format'
import { classNames, Typography } from '@crypto-dex-sdk/ui'
import { Trans } from '@lingui/macro'
import { format } from 'date-fns'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import { useCallback, useMemo, useState } from 'react'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.js'

const tailwind = resolveConfig(tailwindConfig)

enum VolumeChartPeriod {
  Day,
  Week,
  Month,
  Year,
  All,
}

const chartTimespans: Record<VolumeChartPeriod, number> = {
  [VolumeChartPeriod.Day]: 86400 * 1000,
  [VolumeChartPeriod.Week]: 604800 * 1000,
  [VolumeChartPeriod.Month]: 2629746 * 1000,
  [VolumeChartPeriod.Year]: 31556952 * 1000,
  [VolumeChartPeriod.All]: Number.POSITIVE_INFINITY,
}

export const VolumeChart: FC<{ x: number[], y0: number[], y1: number[] }> = ({ x, y0, y1 }) => {
  const [chartPeriod, setChartPeriod] = useState<VolumeChartPeriod>(VolumeChartPeriod.Month)
  const { theme } = useTheme()

  const [xData, y0Data, y1Data] = useMemo(() => {
    const currentDate = Math.round(Date.now())
    const predicates = x?.map(x => x * 1000 >= currentDate - chartTimespans[chartPeriod])
    return [
      x?.filter((_, i) => predicates[i]).reverse(),
      y0?.filter((_, i) => predicates[i]).reverse(),
      y1?.filter((_, i) => predicates[i]).reverse(),
    ]
  }, [chartPeriod, x, y0, y1])

  // Transient update for performance
  const onMouseOver = useCallback(({ name, value0, value1 }: { name: number, value0: number, value1: number }) => {
    const valueNodes = document.getElementsByClassName('hoveredItemValueVolume')
    const nameNodes = document.getElementsByClassName('hoveredItemNameVolume')

    valueNodes[0].innerHTML = formatUSD(value0 + value1)
    nameNodes[0].innerHTML = format(new Date(name * 1000), 'dd MMM yyyy HH:mm')
  }, [])

  const isLightTheme = useMemo(() => theme === 'light', [theme])

  const DEFAULT_OPTION: EChartsOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        extraCssText: 'z-index: 1000',
        responsive: true,
        backgroundColor: isLightTheme ? tailwind.theme.colors.slate['300'] : tailwind.theme.colors.slate['700'],
        textStyle: {
          color: isLightTheme ? tailwind.theme.colors.slate['900'] : tailwind.theme.colors.slate['50'],
          fontSize: 12,
          fontWeight: 600,
        },
        formatter: (params: any) => {
          onMouseOver({ name: params[0].name, value0: params[0].value, value1: params[1].value })

          const date = new Date(Number(params[0].name * 1000))
          return `<div class="flex flex-col">
            <span class="text-sm text-pink-500 font-bold">Market: ${formatUSD(params[1].value)}</span>
            <span class="text-sm text-blue-500 font-bold">Pool: ${formatUSD(params[0].value)}</span>
            <span class="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">${
      date instanceof Date && !Number.isNaN(date?.getTime()) ? format(date, 'dd MMM yyyy HH:mm') : ''
      }</span>
          </div>`
        },
        borderWidth: 0,
      },
      toolbox: {
        show: false,
      },
      grid: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      dataZoom: {
        show: false,
        start: 0,
        end: 100,
      },
      visualMap: {
        show: false,
        color: [tailwind.theme.colors.blue['500']],
      },
      xAxis: [
        {
          show: false,
          type: 'category',
          boundaryGap: true,
          data: xData,
        },
      ],
      yAxis: {
        type: 'value',
        show: false,
      },
      series: [
        {
          name: 'Pool Volume',
          type: 'bar',
          stack: 'Volume',
          itemStyle: {
            color: 'blue',
            normal: {
              barBorderRadius: 2,
            },
          },
          areaStyle: {
            color: tailwind.theme.colors.blue['500'],
          },
          animationEasing: 'elasticOut',
          animationDelayUpdate(idx: number) {
            return idx * 2
          },
          data: y0Data.map(d => ({
            value: d,
            itemStyle: {
              color: tailwind.theme.colors.blue['500'],
            },
          })),
        },
        {
          name: 'Market Volume',
          type: 'bar',
          stack: 'Volume',
          itemStyle: {
            color: tailwind.theme.colors.pink['500'],
            normal: {
              barBorderRadius: 2,
            },
          },
          areaStyle: {
            color: tailwind.theme.colors.pink['500'],
          },
          animationEasing: 'elasticOut',
          animationDelayUpdate(idx: number) {
            return idx * 2
          },
          data: y1Data.map(d => ({
            value: d,
            itemStyle: {
              color: tailwind.theme.colors.pink['500'],
            },
          })),
        },
      ],
    }),
    [isLightTheme, onMouseOver, xData, y0Data, y1Data],
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">
        <div className="pb-2 font-semibold text-sm"><Trans>Volume</Trans></div>
        <div className="flex gap-4">
          <button
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === VolumeChartPeriod.Week ? 'text-blue' : 'text-slate-500',
            )}
            onClick={() => setChartPeriod(VolumeChartPeriod.Week)}
          >
            1W
          </button>
          <button
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === VolumeChartPeriod.Month ? 'text-blue' : 'text-slate-500',
            )}
            onClick={() => setChartPeriod(VolumeChartPeriod.Month)}
          >
            1M
          </button>
          <button
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === VolumeChartPeriod.Year ? 'text-blue' : 'text-slate-500',
            )}
            onClick={() => setChartPeriod(VolumeChartPeriod.Year)}
          >
            1Y
          </button>
          <button
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === VolumeChartPeriod.All ? 'text-blue' : 'text-slate-500',
            )}
            onClick={() => setChartPeriod(VolumeChartPeriod.All)}
          >
            ALL
          </button>
        </div>
      </div>
      <div className="flex flex-col h-[48px]">
        {y0Data && y0Data.length && y1Data && y1Data.length && (
          <Typography className="text-slate-900 dark:text-slate-50" variant="xl" weight={500}>
            <span className="hoveredItemValueVolume">{formatUSD(y0Data[y0Data.length - 1] + y1Data[y1Data.length - 1])}</span>{' '}
          </Typography>
        )}
        {xData && xData.length && (
          <Typography className="text-slate-500 hoveredItemNameVolume" variant="sm">
            {format(new Date(xData[xData.length - 1] * 1000), 'dd MMM yyyy HH:mm')}
          </Typography>
        )}
      </div>
      <ReactECharts option={DEFAULT_OPTION} style={{ height: 320 }} />
    </div>
  )
}
