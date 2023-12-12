import { ParachainId } from '@crypto-dex-sdk/chain'
import { useMemo } from 'react'

import { Native } from './Native'

export function useNativeCurrency({ chainId = ParachainId.ASTAR }: { chainId?: number }): Native {
  return useMemo(() => Native.onChain(chainId), [chainId])
}
