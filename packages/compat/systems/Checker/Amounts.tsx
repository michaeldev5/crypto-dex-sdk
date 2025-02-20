import type { Amount, Type } from '@crypto-dex-sdk/currency'
import type { FC } from 'react'
import type { CheckerButton } from './types'
import { ParachainId } from '@crypto-dex-sdk/chain'
import { Checker as WagmiChecker } from '@crypto-dex-sdk/wagmi'
import { isEvmNetwork } from '../../config'

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
