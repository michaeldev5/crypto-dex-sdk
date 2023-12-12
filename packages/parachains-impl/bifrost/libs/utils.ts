import type { Type } from '@crypto-dex-sdk/currency'
import { addressToZenlinkAssetId } from '@crypto-dex-sdk/format'

export function isNativeCurrency(currency: Type): boolean {
  // BNC
  const { assetType, assetIndex } = addressToZenlinkAssetId(currency.wrapped.address)
  return assetType === 0 && assetIndex === 0
}
