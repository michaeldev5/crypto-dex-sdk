import type { FC } from 'react'
import { ParachainId } from '@crypto-dex-sdk/chain'
import { Checker as WagmiChecker } from '@crypto-dex-sdk/wagmi'
import { Checker as BifrostChecker } from '@crypto-dex-sdk/parachains-bifrost'
import { Checker as AmplitudeChecker } from '@crypto-dex-sdk/parachains-amplitude'
import { isEvmNetwork } from '../../config'
import type { CheckerButton } from './types'

export interface ConnectedProps extends CheckerButton {
  chainId: number | undefined
}

export const Connected: FC<ConnectedProps> = ({ children, chainId, ...rest }) => {
  if (chainId && isEvmNetwork(chainId)) {
    return (
      <WagmiChecker.Connected {...rest}>
        {children}
      </WagmiChecker.Connected>
    )
  }

  if (chainId === ParachainId.AMPLITUDE) {
    return (
      <AmplitudeChecker.Connected {...rest}>
        {children}
      </AmplitudeChecker.Connected>
    )
  }
  else {
    return (
      <BifrostChecker.Connected {...rest}>
        {children}
      </BifrostChecker.Connected>
    )
  }
}
