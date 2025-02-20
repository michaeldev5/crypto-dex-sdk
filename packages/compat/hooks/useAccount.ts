import { useAccount as usePolkadotAccount } from '@crypto-dex-sdk/polkadot'
import { useSettings } from '@crypto-dex-sdk/shared'
import { useMemo } from 'react'
import { useAccount as useWagmiAccount } from 'wagmi'
import { isEvmNetwork } from '../config'

export function useAccount() {
  const [{ parachainId }] = useSettings()
  const wagmiAccount = useWagmiAccount()
  const polkadotAccount = usePolkadotAccount()

  return useMemo(() => {
    if (isEvmNetwork(parachainId)) {
      return {
        address: wagmiAccount.address?.toLowerCase(),
        isConnecting: wagmiAccount.isConnecting,
        isConnected: wagmiAccount.isConnected,
        select: () => {},
      }
    }
    else {
      return {
        address: polkadotAccount.address,
        isConnecting: polkadotAccount.isConnecting,
        isConnected: polkadotAccount.isConnected,
        select: polkadotAccount.select,
      }
    }
  }, [parachainId, polkadotAccount, wagmiAccount])
}
