import type { FC } from 'react'
import { useIsMounted } from '@crypto-dex-sdk/hooks'
import { useSettings } from '@crypto-dex-sdk/shared'
import { Overlay, SlideIn, Switch, Tooltip, Typography } from '@crypto-dex-sdk/ui'
import { ChevronRightIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { CpuChipIcon } from '@heroicons/react/24/solid'
import { t, Trans } from '@lingui/macro'
import { useState } from 'react'

export const AggregatorOverlay: FC = () => {
  const isMounted = useIsMounted()
  const [open, setOpen] = useState<boolean>(false)

  const [{ aggregator }, { updateAggregator }] = useSettings()

  if (!isMounted)
    return <></>

  return (
    <div>
      <button
        className="relative flex items-center justify-between w-full gap-3 group rounded-xl"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center justify-center w-5 h-5">
          <CpuChipIcon className="-ml-0.5 text-slate-500" height={20} width={20} />
        </div>
        <div className="flex items-center justify-between w-full gap-1 py-4">
          <div className="flex items-center gap-1">
            <Typography variant="sm" weight={500}>
              <Trans>Enable Aggregator</Trans>
            </Typography>
            <Tooltip
              content={(
                <div className="flex flex-col gap-2 w-80">
                  <Typography variant="xs" weight={500}>
                    <Trans>
                      Facilitate cost-efficient and secure swap transactions across multiple liquidity sources.
                    </Trans>
                  </Typography>
                </div>
              )}
            >
              <InformationCircleIcon height={14} width={14} />
            </Tooltip>
          </div>
          <div className="flex gap-1">
            <Typography className="hover:text-slate-800 hover:dark:text-slate-200 text-slate-700 dark:text-slate-300" variant="sm" weight={500}>
              {aggregator ? t`On` : t`Off`}
            </Typography>
            <div className="w-5 h-5 -mr-1.5 flex items-center">
              <ChevronRightIcon className="hover:text-slate-800 hover:dark:text-slate-200 text-slate-700 dark:text-slate-300" height={16} width={16} />
            </div>
          </div>
        </div>
      </button>
      <SlideIn.FromLeft className="!mt-0" onClose={() => setOpen(false)} show={open}>
        <Overlay.Content>
          <Overlay.Header onClose={() => setOpen(false)} title={t`Enable Aggregator`} />
          <div className="flex flex-col gap-2 py-3 mx-1 border-b border-slate-200/5">
            <div className="flex items-center justify-between gap-3 mb-1">
              <Typography className="text-slate-900 dark:text-slate-50" variant="sm" weight={500}>
                <Trans>Enable Aggregator</Trans>
              </Typography>
              <Switch checked={aggregator} onChange={() => updateAggregator(!aggregator)} size="sm" />
            </div>
            <Typography className="text-slate-500" variant="xs" weight={400}>
              <Trans>
                Facilitate cost-efficient and secure swap transactions across multiple liquidity sources.
              </Trans>
            </Typography>
          </div>
        </Overlay.Content>
      </SlideIn.FromLeft>
    </div>
  )
}
