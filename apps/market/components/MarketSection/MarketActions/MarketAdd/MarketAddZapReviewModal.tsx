import type { Type } from '@crypto-dex-sdk/currency'
import type { Market } from '@crypto-dex-sdk/market'
import type { FC, ReactNode } from 'react'
import { Approve, useAccount } from '@crypto-dex-sdk/compat'
import { useNotifications } from '@crypto-dex-sdk/shared'
import { Button, Dialog, Dots } from '@crypto-dex-sdk/ui'
import { useAddZapReview } from '@crypto-dex-sdk/wagmi'
import { Trans } from '@lingui/macro'
import { useState } from 'react'
import { MarketAddZapWidget } from './MarketAddZap'
import { useTrade } from './TradeProvider'

interface MarketAddZapReviewModalProps {
  market: Market
  children: ({ isWritePending, setOpen }: { isWritePending: boolean, setOpen: (open: boolean) => void }) => ReactNode
  zeroPriceImpactMode: boolean
  addToken: Type
  addInput: string
  onSuccess: () => void
}

export const MarketAddZapReviewModal: FC<MarketAddZapReviewModalProps> = ({
  market,
  children,
  onSuccess,
  addToken,
  addInput,
  zeroPriceImpactMode,
}) => {
  const [open, setOpen] = useState(false)
  const { address } = useAccount()
  const [, { createNotification }] = useNotifications(address)

  const { lpMinted, ytMinted, trade, guess, amountSpecified } = useTrade()

  const { isWritePending, sendTransaction, routerAddress } = useAddZapReview({
    chainId: market.chainId,
    market,
    setOpen,
    trade,
    lpMinted,
    ytMinted,
    guess,
    amountSpecified,
    onSuccess,
    zeroPriceImpactMode,
  })

  return (
    <>
      {children({ isWritePending, setOpen })}
      <Dialog onClose={() => setOpen(false)} open={open}>
        <Dialog.Content className="max-w-sm !pb-4 !bg-slate-100 dark:!bg-slate-800">
          <Dialog.Header border={false} onClose={() => setOpen(false)} title={<Trans>Zap In</Trans>} />
          <MarketAddZapWidget
            addInput={addInput}
            addToken={addToken}
            market={market}
            previewMode
            zeroPriceImpactMode={zeroPriceImpactMode}
          />
          <Approve
            chainId={market.chainId}
            className="flex-grow !justify-end"
            components={(
              <Approve.Components>
                <Approve.Token
                  address={routerAddress}
                  amount={amountSpecified}
                  chainId={market.chainId}
                  className="whitespace-nowrap"
                  fullWidth
                  size="md"
                />
              </Approve.Components>
            )}
            onSuccess={createNotification}
            render={({ approved }) => {
              return (
                <Button className="mt-2" disabled={!approved || isWritePending} fullWidth onClick={() => sendTransaction?.()} size="md">
                  {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : <Trans>Add</Trans>}
                </Button>
              )
            }}
          />
        </Dialog.Content>
      </Dialog>
    </>
  )
}
