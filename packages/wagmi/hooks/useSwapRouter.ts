import { TradeVersion } from '@crypto-dex-sdk/amm'
import { ParachainId } from '@crypto-dex-sdk/chain'
import { getAggregationRouterAddressForChainId, isAggregationRouter } from '@crypto-dex-sdk/smart-router'
import { aggregationRouter, legacySwapRouter, universalRouter } from '../abis'

const swapRouters: Record<TradeVersion, Record<number, string>> = {
  [TradeVersion.LEGACY]: {
    [ParachainId.ASTAR]: '0x4e231728d42565830157FFFaBBB9c78aD5152E94',
    [ParachainId.MOONBEAM]: '0x5711112f7bce2dbbC95cf946dB9eEf0Ca6572242',
    [ParachainId.MOONRIVER]: '0xFB45b575b66C99e0C8d2639aCf237807d4ea1508',
  },
  [TradeVersion.AGGREGATOR]: {
    [ParachainId.ARBITRUM_ONE]: '0x6A6FC6B4d33E27087410Ff5d5F15995dabDF4Ce7',
    [ParachainId.MOONBEAM]: getAggregationRouterAddressForChainId(ParachainId.MOONBEAM),
    [ParachainId.SCROLL_ALPHA]: getAggregationRouterAddressForChainId(ParachainId.SCROLL_ALPHA),
    [ParachainId.SCROLL]: getAggregationRouterAddressForChainId(ParachainId.SCROLL),
    [ParachainId.BASE]: getAggregationRouterAddressForChainId(ParachainId.BASE),
    [ParachainId.ASTAR]: getAggregationRouterAddressForChainId(ParachainId.ASTAR),
  },
}

export function getSwapRouterContractConfig(chainId: number | undefined, version: TradeVersion | undefined) {
  return {
    address: version ? swapRouters[version][chainId ?? -1] ?? '' : '',
    abi: version
      ? version === TradeVersion.LEGACY
        ? legacySwapRouter
        : isAggregationRouter(chainId) ? aggregationRouter : universalRouter
      : '',
  }
}
