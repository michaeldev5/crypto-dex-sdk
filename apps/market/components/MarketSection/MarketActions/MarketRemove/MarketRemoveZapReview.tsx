import type { Amount, Type } from '@crypto-dex-sdk/currency'
import type { Market } from '@crypto-dex-sdk/market'
import type { FC, ReactNode } from 'react'
import { Approve, useAccount } from '@crypto-dex-sdk/compat'
import { useNotifications } from '@crypto-dex-sdk/shared'
import { Button, Dialog, Dots } from '@crypto-dex-sdk/ui'
import { useRemoveZapReview } from '@crypto-dex-sdk/wagmi'
import { Trans } from '@lingui/macro'
import { useState } from 'react'
import { MarketRemoveZapWidget } from './MarketRemoveZap'
import { useTrade } from './TradeProvider'

interface MarketRemoveZapModalProps {
  market: Market
  children: ({ isWritePending, setOpen }: { isWritePending: boolean, setOpen: (open: boolean) => void }) => ReactNode
  removeInput?: string
  lpToRemove: Amount<Type> | undefined
  outToken: Type
  onSuccess: () => void
}

export const MarketRemoveZapReviewModal: FC<MarketRemoveZapModalProps> = ({
  market,
  children,
  removeInput,
  lpToRemove,
  outToken,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false)
  const { address } = useAccount()
  const [, { createNotification }] = useNotifications(address)

  const { trade, outputAmount } = useTrade()

  const { isWritePending, sendTransaction, routerAddress } = useRemoveZapReview({
    chainId: market.chainId,
    market,
    lpToRemove,
    trade,
    outputAmount,
    setOpen,
    onSuccess,
  })

  return (
    <>
      {children({ isWritePending, setOpen })}
      <Dialog onClose={() => setOpen(false)} open={open}>
        <Dialog.Content className="max-w-sm !pb-4 !bg-slate-100 dark:!bg-slate-800">
          <Dialog.Header border={false} onClose={() => setOpen(false)} title={<Trans>Zap Out</Trans>} />
          <MarketRemoveZapWidget
            market={market}
            outToken={outToken}
            previewMode
            removeInput={removeInput}
          />
          <Approve
            chainId={market.chainId}
            className="flex-grow !justify-end"
            components={(
              <Approve.Components>
                <Approve.Token
                  address={routerAddress}
                  amount={lpToRemove}
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
                  {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : <Trans>Remove</Trans>}
                </Button>
              )
            }}
          />
        </Dialog.Content>
      </Dialog>
    </>
  )
}
