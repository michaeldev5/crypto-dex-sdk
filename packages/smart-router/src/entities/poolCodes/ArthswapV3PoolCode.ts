import type { RouteLeg, SplitMultiRoute } from '@crypto-dex-sdk/amm'
import type { Address } from 'viem'
import type { UniV3Pool } from '../pools'
import { ParachainId } from '@crypto-dex-sdk/chain'
import invariant from 'tiny-invariant'
import { encodeAbiParameters, parseAbiParameters } from 'viem'
import { HEXer } from '../../HEXer'
import { PoolCode } from './PoolCode'

export class ArthswapV3PoolCode extends PoolCode {
  executor: { [chainId: number]: string } = {
    [ParachainId.ASTAR]: '0x98a3729bd82Bd1dd8A572fd1Bdeac9e5fb5Acf07',
  } as const

  public constructor(pool: UniV3Pool, providerName: string) {
    super(pool, providerName)
  }

  public override getStartPoint(): string {
    return PoolCode.RouteProcessorAddress
  }

  public getProtocolExecutor(): string {
    const chainId = this.pool.token0.chainId
    invariant(chainId !== undefined, 'ArthswapV3PoolCode: Unseted chainId')
    return this.executor[Number(chainId)]
  }

  public override getProtocolExecutorStartPoint(): string {
    return this.getProtocolExecutor()
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
