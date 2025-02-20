import type { FC } from 'react'
import type { CheckerButton } from './types'
import { useIsMounted } from '@crypto-dex-sdk/hooks'
import { Trans } from '@lingui/macro'
import { useAccount } from 'wagmi'
import { Wallet } from '../../components'

export const Connected: FC<CheckerButton> = ({ children, ...rest }) => {
  const isMounted = useIsMounted()
  const { address } = useAccount()

  if (isMounted && !address) {
    return (
      <Wallet.Button appearOnMount={false} {...rest}>
        <Trans>Connect Wallet</Trans>
      </Wallet.Button>
    )
  }

  return <>{children}</>
}
