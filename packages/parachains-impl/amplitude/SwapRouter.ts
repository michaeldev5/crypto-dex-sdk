import type { Trade } from '@crypto-dex-sdk/amm'
import type { ZenlinkProtocolPrimitivesAssetId } from '@crypto-dex-sdk/format'
import type { Percent } from '@crypto-dex-sdk/math'
import type { ApiPromise } from '@polkadot/api'
import type { SubmittableExtrinsic } from '@polkadot/api/types'
import { addressToZenlinkAssetId } from '@crypto-dex-sdk/format'

export interface TradeOptions {
  api: ApiPromise
  /**
   * How much the execution price is allowed to move unfavorably from the trade execution price.
   */
  allowedSlippage: Percent
  /**
   * The account that should receive the output of the swap.
   */
  recipient: string
}

export interface TradeOptionsDeadline extends TradeOptions {
  /**
   * When the transaction expires.
   * This is an atlernate to specifying the ttl, for when you do not want to use local time.
   */
  deadline: number
}

export interface SwapParameters {
  extrinsic: SubmittableExtrinsic<'promise'>[] | null
}

export abstract class SwapRouter {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static swapCallParameters(
    trade: Trade,
    options: TradeOptionsDeadline,
  ): SwapParameters {
    const methodName = 'swapExactAssetsForAssets'
    const args: [string, string, ZenlinkProtocolPrimitivesAssetId[], string, number] = [
      trade.inputAmount.quotient.toString(),
      trade.minimumAmountOut(options.allowedSlippage).quotient.toString(),
      trade.route.tokenPath.map(token => addressToZenlinkAssetId(token.address)),
      options.recipient,
      options.deadline,
    ]

    return {
      extrinsic: [
        options.api.tx.zenlinkProtocol[methodName](...args),
      ],
    }
  }
}
