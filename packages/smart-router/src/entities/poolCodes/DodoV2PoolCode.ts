import type { RouteLeg, SplitMultiRoute } from '@crypto-dex-sdk/amm'
import type { Address } from 'viem'
import type { DodoV2Pool } from '../pools'
import { ParachainId } from '@crypto-dex-sdk/chain'
import invariant from 'tiny-invariant'
import { encodeAbiParameters, parseAbiParameters } from 'viem'
import { HEXer } from '../../HEXer'
import { PoolCode } from './PoolCode'

export class DodoV2PoolCode extends PoolCode {
  executor: { [chainId: number]: string } = {
    [ParachainId.SCROLL_ALPHA]: '0xF98fF8ec7e62e5fe33223f542f7f73202e197cFC',
  } as const

  public constructor(pool: DodoV2Pool, providerName: string) {
    super(pool, providerName)
  }

  public override getStartPoint(): string {
    return PoolCode.RouteProcessorAddress
  }

  public getProtocolExecutor(): string {
    const chainId = this.pool.token0.chainId
    invariant(chainId !== undefined, 'DodoV2PoolCode: Unseted chainId')
    return this.executor[Number(chainId)]
  }

  public override getProtocolExecutorStartPoint(): string {
    return this.pool.address
  }

  public getSwapCodeForRouteProcessor(_leg: RouteLeg, _route: SplitMultiRoute, _to: string): string {
    return 'unsupported'
  }

  public override getSwapCodeForRouteProcessor2(_leg: RouteLeg, _route: SplitMultiRoute, _to: string): string {
    return 'unsupported'
  }

  public override getSwapCodeForAggregationRouter(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    const code = new HEXer()
      .address(this.getProtocolExecutor())
      .bytes(
        encodeAbiParameters(
          parseAbiParameters('address, bool, address'),
          [
            this.pool.address as Address,
            leg.tokenFrom.address === this.pool.token0.address,
            to as Address,
          ],
        ),
      )
      .toString()
    return code
  }
}
