import type { RouteLeg, SplitMultiRoute } from '@crypto-dex-sdk/amm'
import type { Address } from 'viem'
import type { IZiPool } from '../pools'
import { ParachainId } from '@crypto-dex-sdk/chain'
import invariant from 'tiny-invariant'
import { encodeAbiParameters, parseAbiParameters } from 'viem'
import { HEXer } from '../../HEXer'
import { PoolCode } from './PoolCode'

export class IZiPoolCode extends PoolCode {
  executor: { [chainId: number]: string } = {
    [ParachainId.SCROLL_ALPHA]: '0x9A25abd7F3044808fc2FB8aBc96f44437a96D212',
    [ParachainId.SCROLL]: '0x7B1128E610ae1d461B7B8227f9FBBB39e336c515',
  } as const

  public constructor(pool: IZiPool, providerName: string) {
    super(pool, providerName)
  }

  public getProtocolExecutor(): string {
    const chainId = this.pool.token0.chainId
    invariant(chainId !== undefined, 'IZiPoolCode: Unseted chainId')
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
