import type { ParachainId } from '@crypto-dex-sdk/chain'
import type { FC, ReactElement } from 'react'
import type { CheckerButton } from './types'
import { Chain, chainsParachainIdToChainId } from '@crypto-dex-sdk/chain'
import { useSettings } from '@crypto-dex-sdk/shared'
import { Button } from '@crypto-dex-sdk/ui'
import { Trans } from '@lingui/macro'
import { useCallback } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'

export interface NetworkProps extends CheckerButton {
  chainId: number | undefined
}

export const Network: FC<NetworkProps> = ({ chainId, children, ...rest }): ReactElement<any, any> | null => {
  const { switchChain } = useSwitchChain()
  const { chain } = useAccount()
  const [, { updateParachainId }] = useSettings()
  const onSwitchNetwork = useCallback((chainId: ParachainId) => {
    updateParachainId(chainId)
    switchChain && switchChain({ chainId: chainsParachainIdToChainId[chainId] })
  }, [switchChain, updateParachainId])

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
