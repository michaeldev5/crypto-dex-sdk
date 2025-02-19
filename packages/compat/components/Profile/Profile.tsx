import { ParachainId } from '@crypto-dex-sdk/chain'
import type { FC } from 'react'
import { Profile as WagmiProfile } from '@crypto-dex-sdk/wagmi'
import { useSettings } from '@crypto-dex-sdk/shared'
import { isEvmNetwork, isSubstrateNetwork } from '../../config'

interface ProfileProps {
  supportedNetworks: ParachainId[]
  notifications: Record<number, string[]>

  clearNotifications: () => void
}

export const Profile: FC<ProfileProps> = ({
  supportedNetworks,
  notifications,
  clearNotifications,
}) => {
  const [{ parachainId }] = useSettings()

  if (isEvmNetwork(parachainId)) {
    return (
      <WagmiProfile
        clearNotifications={clearNotifications}
        notifications={notifications}
        supportedNetworks={supportedNetworks}
      />
    )
  }

  if (isSubstrateNetwork(parachainId)) {
    if (parachainId === ParachainId.AMPLITUDE || parachainId === ParachainId.PENDULUM) {
      return (
        <></>
      )
    }
    else {
      return (
        <></>
      )
    }
  }

  return <span />
}
