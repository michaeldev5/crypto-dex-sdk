import type { ParachainId } from '@crypto-dex-sdk/chain'
import { chains, isSubstrateNetwork } from '@crypto-dex-sdk/chain'
import { encodeAddress } from '@polkadot/util-crypto'

export function encodeChainAddress(address: string, chainId: ParachainId) {
  return isSubstrateNetwork(chainId) ? encodeAddress(address, chains[chainId]?.prefix) : address
}
