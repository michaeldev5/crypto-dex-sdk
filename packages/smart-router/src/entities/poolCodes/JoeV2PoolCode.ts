import type { RouteLeg, SplitMultiRoute } from '@crypto-dex-sdk/amm'
import type { JoeV2Pool } from '../pools'
import { HEXer } from '../../HEXer'
import { PoolCode } from './PoolCode'

export class JoeV2PoolCode extends PoolCode {
  public constructor(pool: JoeV2Pool, providerName: string) {
    super(pool, providerName)
  }

  public getSwapCodeForRouteProcessor(_leg: RouteLeg, _route: SplitMultiRoute, _to: string): string {
    return 'unsupported'
  }

  public override getSwapCodeForRouteProcessor2(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    const code = new HEXer()
      .uint8(5) // joev2 pool
      .address(this.pool.address)
      .bool(leg.tokenFrom.address === this.pool.token0.address)
      .address(to)
      .toString()
    return code
  }
}
