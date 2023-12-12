import type { ZenlinkProtocolPrimitivesAssetId } from '@crypto-dex-sdk/format'

export interface NodePrimitivesCurrency {
  [currencyId: string]: string | number | [string, number, string, number]
}

export type PairPrimitivesAssetId = [ZenlinkProtocolPrimitivesAssetId, ZenlinkProtocolPrimitivesAssetId]
