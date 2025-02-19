import type { Amount, Currency } from '@crypto-dex-sdk/currency'
import type { FC } from 'react'
import type { Permit2Actions } from '@crypto-dex-sdk/wagmi'
import { Approve as WagmiApprove } from '@crypto-dex-sdk/wagmi'
import { ParachainId } from '@crypto-dex-sdk/chain'
import { isEvmNetwork } from '../../config'
import type { ApprovalButtonRenderProp, ApproveButton } from './types'

type RenderPropPayload = ApprovalButtonRenderProp

export interface TokenApproveButtonProps extends ApproveButton<RenderPropPayload> {
  chainId: number | undefined
  watch?: boolean
  amount?: Amount<Currency>
  address?: string
  enablePermit2?: boolean
  permit2Actions?: Permit2Actions
  setPermit2Actions?: (actions: Permit2Actions) => void
}

export const TokenApproveButton: FC<TokenApproveButtonProps> = ({
  chainId,
  enablePermit2,
  permit2Actions,
  setPermit2Actions,
  ...props
}) => {
  if (!chainId)
    return <></>
  if (isEvmNetwork(chainId)) {
    return (
      <WagmiApprove.Token
        enablePermit2={enablePermit2}
        permit2Actions={permit2Actions}
        setPermit2Actions={setPermit2Actions}
        {...props}
      />
    )
  }

  if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
    return <></>
  else
    return <></>
}
