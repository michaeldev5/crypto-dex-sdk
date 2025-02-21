import type { FC, ReactElement } from 'react'
import type { CheckerButton } from './types'
import { ParachainId } from '@crypto-dex-sdk/chain'
import { Checker as WagmiChecker } from '@crypto-dex-sdk/wagmi'
import { isEvmNetwork } from '../../config'

export interface NetworkProps extends CheckerButton {
  chainId: number | undefined
}

export const Network: FC<NetworkProps> = ({ chainId, children, ...rest }): ReactElement<any, any> | null => {
  if (!chainId)
    return null

  if (isEvmNetwork(chainId)) {
    return (
      <WagmiChecker.Network chainId={chainId} {...rest}>
        {children}
      </WagmiChecker.Network>
    )
  }

  if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM) {
    return (
      <>
        {children}
      </>
    )
  }
  else {
    return (
      <>
        {children}
      </>
    )
  }
}
