import type { Pair } from '@crypto-dex-sdk/amm'
import type { ParachainId } from '@crypto-dex-sdk/chain'
import { Amount } from '@crypto-dex-sdk/currency'
import { addressToZenlinkAssetId } from '@crypto-dex-sdk/format'
import { useApi, useCall } from '@crypto-dex-sdk/polkadot'
import type { ZenlinkAssetBalance, PairStatus as _PairStatus } from '@zenlink-types/bifrost/interfaces'
import { useMemo } from 'react'

interface PairStatus extends Omit<_PairStatus, 'asTrading'> {
  asTrading: {
    totalSupply: ZenlinkAssetBalance
  }
}

export function usePairTotalSupply(pair: Pair | undefined | null, chainId: ParachainId, enabled = true) {
  const api = useApi(chainId)
  const pairStatus = useCall<PairStatus>({
    chainId,
    fn: api?.query.zenlinkProtocol.pairStatuses,
    params: pair && enabled
      ? [
          [
            addressToZenlinkAssetId(pair.token0.address),
            addressToZenlinkAssetId(pair.token1.address),
          ],
        ]
      : [],
    options: { enabled: enabled && !!api },
  })

  return useMemo(() => {
    if (!pair || !pairStatus || pairStatus.isDisable || !pairStatus.isTrading)
      return undefined
    return Amount.fromRawAmount(pair.liquidityToken, pairStatus.asTrading.totalSupply.toHex())
  }, [pair, pairStatus])
}
