import type { ZenlinkProtocolPrimitivesAssetId } from '@crypto-dex-sdk/format'
import type { NodePrimitivesCurrency } from '../types'
import { ParachainId } from '@crypto-dex-sdk/chain'
import { zenlinkAssetIdToAddress } from '@crypto-dex-sdk/format'
import { pairAddressToAssets } from './constants'
import { parseNodePrimitivesCurrency as bifrostParseNodePrimitivesCurrency } from './formats/currency'

export const NodeCurrencyId: Record<number, string> = {
  0: 'Native',
  1: 'XCM',
  2: 'Stellar',
  3: 'ZenlinkLPToken',
}

function parseAssetU8(assetIndex: number) {
  return (assetIndex & 0x0000_0000_0000_FF00) >> 8
}

function parseAssetType(assetIndex: number) {
  return assetIndex & 0x0000_0000_0000_000FF
}

export function parseNodePrimitivesCurrency(asset: ZenlinkProtocolPrimitivesAssetId): NodePrimitivesCurrency {
  const { chainId, assetIndex } = asset

  if (chainId === ParachainId.BIFROST_KUSAMA || chainId === ParachainId.BIFROST_POLKADOT)
    return bifrostParseNodePrimitivesCurrency(asset)

  const assetTypeU8 = parseAssetU8(assetIndex)
  const assetSymbol = parseAssetType(assetIndex)
  const nodeCurrencyId = NodeCurrencyId[assetTypeU8]

  if (!nodeCurrencyId)
    throw new Error('invalid asset')

  // LPToken
  if (nodeCurrencyId === 'ZenlinkLPToken') {
    const [asset0, asset1] = pairAddressToAssets[zenlinkAssetIdToAddress(asset)]
    const asset0Type = parseAssetType(asset0.assetIndex).toString()
    const asset0U8 = parseAssetU8(asset0.assetIndex)
    const asset1Type = parseAssetType(asset1.assetIndex).toString()
    const asset1U8 = parseAssetU8(asset1.assetIndex)
    return {
      [nodeCurrencyId]: [
        asset0Type,
        asset0U8,
        asset1Type,
        asset1U8,
      ],
    }
  }

  return { [nodeCurrencyId]: assetSymbol }
}
