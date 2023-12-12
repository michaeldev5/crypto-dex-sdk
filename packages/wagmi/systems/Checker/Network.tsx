import { Trans } from '@lingui/macro'
import type { ParachainId } from '@crypto-dex-sdk/chain'
import { Chain, chainsParachainIdToChainId } from '@crypto-dex-sdk/chain'
import { useSettings } from '@crypto-dex-sdk/shared'
import { Button } from '@crypto-dex-sdk/ui'
import type { FC, ReactElement } from 'react'
import { useCallback } from 'react'
import { useNetwork, useSwitchNetwork } from 'wagmi'

import type { CheckerButton } from './types'

export interface NetworkProps extends CheckerButton {
  chainId: number | undefined
}

export const Network: FC<NetworkProps> = ({ chainId, children, ...rest }): ReactElement<any, any> | null => {
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const [, { updateParachainId }] = useSettings()
  const onSwitchNetwork = useCallback((chainId: ParachainId) => {
    updateParachainId(chainId)
    switchNetwork && switchNetwork(chainsParachainIdToChainId[chainId])
  }, [switchNetwork, updateParachainId])

  if (!chainId)
    return null

  if (chain?.id !== chainsParachainIdToChainId[chainId]) {
    return (
      <Button onClick={() => onSwitchNetwork(chainId)} {...rest}>
        <Trans>
          Switch to {Chain.from(chainId).name}
        </Trans>
      </Button>
    )
  }

  return <>{children}</>
}
