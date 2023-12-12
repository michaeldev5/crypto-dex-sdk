import { ParachainId } from '@crypto-dex-sdk/chain'
import type { FC } from 'react'
import { Profile as WagmiProfile } from '@crypto-dex-sdk/wagmi'
import { Profile as BifrostProfile } from '@crypto-dex-sdk/parachains-bifrost'
import { Profile as AmplitudeProfile } from '@crypto-dex-sdk/parachains-amplitude'
import { useSettings } from '@crypto-dex-sdk/shared'
import { isEvmNetwork, isSubstrateNetwork } from '../../config'

interface ProfileProps {
  supportedNetworks: ParachainId[]
  notifications: Record<number, string[]>

  clearNotifications(): void
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
    if (parachainId === ParachainId.AMPLITUDE) {
      return (
        <AmplitudeProfile
          clearNotifications={clearNotifications}
          notifications={notifications}
          parachainId={parachainId}
          supportedNetworks={supportedNetworks}
        />
      )
    }
    else {
      return (
        <BifrostProfile
          clearNotifications={clearNotifications}
          notifications={notifications}
          parachainId={parachainId}
          supportedNetworks={supportedNetworks}
        />
      )
    }
  }

  return <span />
}
