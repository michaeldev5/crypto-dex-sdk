import type { RouteLeg, SplitMultiRoute } from '@crypto-dex-sdk/amm'
import type { Address } from 'viem'
import type { StablePool } from '../pools/StablePool'
import { ParachainId } from '@crypto-dex-sdk/chain'
import invariant from 'tiny-invariant'
import { encodeAbiParameters, parseAbiParameters } from 'viem'
import { CommandCode } from '../../CommandCode'
import { HEXer } from '../../HEXer'
import { PoolCode } from './PoolCode'

const NATIVE_POOLS = [
  '0xEEa640c27620D7C448AD655B6e3FB94853AC01e3', // Sirius-ASTR/nASTR
].map(p => p.toLowerCase())

export class StablePoolCode extends PoolCode {
  dispatcher: { [chainId: number]: string } = {
    [ParachainId.ASTAR]: '0xf3780EBbF5C0055c0951EC1c2Abc1b3D77713459',
  } as const

  executor: { [chainId: number]: string } = {
    [ParachainId.MOONBEAM]: '0xf6626F6a906DCA97C816c06DD32FFEC40761de34',
    [ParachainId.ASTAR]: '0xcC9543136e5Ed3eD601f94775563b6fDab8409A3',
  } as const

  public constructor(pool: StablePool, providerName: string) {
    super(pool, providerName)
  }

  public override getStartPoint(): string {
    const chainId = this.pool.token0.chainId
    invariant(chainId !== undefined, 'StablePoolCode: Unseted chainId')
    return this.dispatcher[Number(chainId)]
  }

  public getProtocolExecutor(): string {
    const chainId = this.pool.token0.chainId
    invariant(chainId !== undefined, 'AlgebraPoolCode: Unseted chainId')
    return this.executor[Number(chainId)]
  }

  public override getProtocolExecutorStartPoint(): string {
    return this.getProtocolExecutor()
  }

  public getSwapCodeForRouteProcessor(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    const tokenFromIndex
      = leg.tokenFrom.address?.toLowerCase() === this.pool.token0.address?.toLowerCase()
        ? (this.pool as StablePool).token0Index
        : (this.pool as StablePool).token1Index
    const tokenToIndex
      = leg.tokenTo.address?.toLowerCase() === this.pool.token0.address?.toLowerCase()
        ? (this.pool as StablePool).token0Index
        : (this.pool as StablePool).token1Index

    const poolData = encodeAbiParameters(
      parseAbiParameters('address, bool, uint8, uint8, address, address'),
      [
        leg.poolAddress as Address,
        NATIVE_POOLS.includes(leg.poolAddress.toLowerCase()),
        tokenFromIndex,
        tokenToIndex,
        leg.tokenFrom.address as Address,
        leg.tokenTo.address as Address,
      ],
    )

    const code = new HEXer()
      .uint8(CommandCode.SWAP_ZENLINK_STABLE_POOL)
      .bool(false) // isMetaSwap
      .address(to)
      .bytes(poolData)
      .toString()

    return code
  }

  public getSwapCodeForRouteProcessor2(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    const tokenFromIndex
      = leg.tokenFrom.address?.toLowerCase() === this.pool.token0.address?.toLowerCase()
        ? (this.pool as StablePool).token0Index
        : (this.pool as StablePool).token1Index
    const tokenToIndex
      = leg.tokenTo.address?.toLowerCase() === this.pool.token0.address?.toLowerCase()
        ? (this.pool as StablePool).token0Index
        : (this.pool as StablePool).token1Index

    const poolData = encodeAbiParameters(
      parseAbiParameters('address, bool, uint8, uint8, address'),
      [
        leg.poolAddress as Address,
        NATIVE_POOLS.includes(leg.poolAddress.toLowerCase()),
        tokenFromIndex,
        tokenToIndex,
        leg.tokenTo.address as Address,
      ],
    )

    const code = new HEXer()
      .uint8(3) // stableswap pool
      .bool(false) // isMetaSwap
      .address(to)
      .bytes(poolData)
      .toString()

    return code
  }

  public override getSwapCodeForAggregationRouter(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    const tokenFromIndex
      = leg.tokenFrom.address?.toLowerCase() === this.pool.token0.address?.toLowerCase()
        ? (this.pool as StablePool).token0Index
        : (this.pool as StablePool).token1Index
    const tokenToIndex
      = leg.tokenTo.address?.toLowerCase() === this.pool.token0.address?.toLowerCase()
        ? (this.pool as StablePool).token0Index
        : (this.pool as StablePool).token1Index

    const poolData = encodeAbiParameters(
      parseAbiParameters('address, bool, uint8, uint8, address'),
      [
        leg.poolAddress as Address,
        NATIVE_POOLS.includes(leg.poolAddress.toLowerCase()),
        tokenFromIndex,
        tokenToIndex,
        leg.tokenTo.address as Address,
      ],
    )

    const code = new HEXer()
      .address(this.getProtocolExecutor())
      .bytes(
        encodeAbiParameters(
          parseAbiParameters('uint8, address, bytes'),
          [
            0, // isMetaSwap
            to as Address,
            poolData,
          ],
        ),
      )
      .toString()
    return code
  }
}
