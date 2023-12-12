import { Chain } from '@crypto-dex-sdk/chain'
import { useSettings } from '@crypto-dex-sdk/shared'
import { Button } from '@crypto-dex-sdk/ui'
import type { FC, ReactElement } from 'react'

import type { CheckerButton } from './types'

export interface NetworkProps extends CheckerButton {
  chainId: number | undefined
}

export const Network: FC<NetworkProps> = ({ chainId, children, ...rest }): ReactElement<any, any> | null => {
  const [{ parachainId }, { updateParachainId }] = useSettings()

  if (!chainId)
    return null

  if (parachainId !== chainId) {
    return (
      <Button onClick={() => updateParachainId(chainId)} {...rest}>
        Switch to
        {' '}
        {Chain.from(chainId).name}
      </Button>
    )
  }

  return <>{children}</>
}
