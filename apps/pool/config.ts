import { ParachainId } from '@crypto-dex-sdk/chain'

export const STABLE_SWAP_ENABLED_NETWORKS = [
  ParachainId.ASTAR,
  ParachainId.MOONRIVER,
  ParachainId.MOONBEAM,
]

export const AMM_ENABLED_NETWORKS = [
  ParachainId.ASTAR,
  ParachainId.MOONRIVER,
  ParachainId.MOONBEAM,
  ParachainId.BIFROST_KUSAMA,
  ParachainId.BIFROST_POLKADOT,
  ParachainId.AMPLITUDE,
  ParachainId.PENDULUM,
]

export const SUPPORTED_CHAIN_IDS = Array.from(
  new Set([...AMM_ENABLED_NETWORKS, ...STABLE_SWAP_ENABLED_NETWORKS]),
)
