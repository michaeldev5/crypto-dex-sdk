import { ParachainId } from '@crypto-dex-sdk/chain'

import { Native } from './Native'

export function useNativeCurrency({ chainId = ParachainId.ASTAR }: { chainId?: number }): Native {
  return Native.onChain(chainId)
}
