import type { Amount, Token } from '@crypto-dex-sdk/currency'
import type { Market } from '@crypto-dex-sdk/market'
import type { YtInterestAndRewardsResult } from '@crypto-dex-sdk/wagmi'
import type { FC, ReactNode } from 'react'
import { Button, Dialog, Dots } from '@crypto-dex-sdk/ui'
import { useRedeemRewardsReview } from '@crypto-dex-sdk/wagmi'
import { Trans } from '@lingui/macro'
import { useMemo, useState } from 'react'
import { MarketLPRewards } from './MarketLPRewards'
import { YtInterestAndRewards } from './YtInterestAndRewards'

interface MarketRewardsReviewModalProps {
  chainId: number
  market: Market
  ytData: YtInterestAndRewardsResult | undefined
  lpRewardsData: Amount<Token>[] | undefined
  children: ({ isWritePending, setOpen, disabled }: {
    isWritePending: boolean
    setOpen: (open: boolean) => void
    disabled: boolean
  }) => ReactNode
}

export const MarketRewardsReviewModal: FC<MarketRewardsReviewModalProps> = ({
  chainId,
  ytData,
  market,
  lpRewardsData,
  children,
}) => {
  const [open, setOpen] = useState(false)

  const { isWritePending, sendTransaction } = useRedeemRewardsReview({
    chainId,
    setOpen,
    yts: useMemo(() => ytData && [ytData.market.YT], [ytData]),
    markets: useMemo(() => [market], [market]),
  })

  return (
    <>
      {children({ isWritePending, setOpen, disabled: !sendTransaction })}
      <Dialog onClose={() => setOpen(false)} open={open}>
        <Dialog.Content className="max-w-sm !pb-4 !bg-slate-100 dark:!bg-slate-800">
          <Dialog.Header border={false} onClose={() => setOpen(false)} title={<Trans>Redeem</Trans>} />
          <div className="border rounded-2xl bg-slate-300/40 dark:bg-slate-700/40 border-slate-500/20 dark:border-slate-200/5">
            <YtInterestAndRewards data={ytData} isLoading={false} market={market} />
            <MarketLPRewards data={lpRewardsData} isLoading={false} market={market} showBoostButton={false} />
          </div>
          <Button className="mt-4" disabled={isWritePending} fullWidth onClick={() => sendTransaction?.()} size="md">
            {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : <Trans>Redeem</Trans>}
          </Button>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
