import type { Amount, Type } from '@crypto-dex-sdk/currency'
import type { FC } from 'react'

import { Checker as WagmiChecker } from '@crypto-dex-sdk/wagmi'
import { Checker as BifrostChecker } from '@crypto-dex-sdk/parachains-bifrost'
import { Checker as AmplitudeChecker } from '@crypto-dex-sdk/parachains-amplitude'
import { ParachainId } from '@crypto-dex-sdk/chain'
import { isEvmNetwork } from '../../config'
import type { CheckerButton } from './types'

export interface AmountsProps extends CheckerButton {
  chainId: number | undefined
  amounts: (Amount<Type> | undefined)[]
}

export const Amounts: FC<AmountsProps> = ({
  chainId,
  children,
  ...rest
}) => {
  if (chainId && isEvmNetwork(chainId)) {
    return (
      <WagmiChecker.Amounts chainId={chainId} {...rest}>
        {children}
      </WagmiChecker.Amounts>
    )
  }

  if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM) {
    return (
      <AmplitudeChecker.Amounts chainId={chainId} {...rest}>
        {children}
      </AmplitudeChecker.Amounts>
    )
  }
  else {
    return (
      <BifrostChecker.Amounts chainId={chainId} {...rest}>
        {children}
      </BifrostChecker.Amounts>
    )
  }
}
