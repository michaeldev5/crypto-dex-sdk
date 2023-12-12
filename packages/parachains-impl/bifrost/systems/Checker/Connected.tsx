import { useIsMounted } from '@crypto-dex-sdk/hooks'
import { useAccount } from '@crypto-dex-sdk/polkadot'
import type { FC } from 'react'

import { Wallet } from '../../components'
import type { CheckerButton } from './types'

export const Connected: FC<CheckerButton> = ({ children, ...rest }) => {
  const isMounted = useIsMounted()
  const { address } = useAccount()

  if (isMounted && !address) {
    return (
      <Wallet.Button appearOnMount={false} {...rest}>
        Connect Wallet
      </Wallet.Button>
    )
  }

  return <>{children}</>
}
