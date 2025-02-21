import type { Currency, Token } from '@crypto-dex-sdk/currency'
import type { JSBI } from '@crypto-dex-sdk/math'
import { Amount } from '@crypto-dex-sdk/currency'
import { SYBase } from '../SYBase'

export class VDOT extends SYBase {
  public readonly xcDOT: Token
  public readonly vDOT: Token

  public constructor(
    token: {
      chainId: number | string
      address: string
      decimals: number
      symbol?: string
      name?: string
    },
    xcDOT: Token,
    vDOT: Token,
    tokensIn: Currency[],
    tokensOut: Currency[],
  ) {
    super(token, vDOT, [], tokensIn, tokensOut)
    this.xcDOT = xcDOT
    this.vDOT = vDOT
  }

  public updateExchangeRate(exchageRate: JSBI) {
    super.updateExchangeRate(exchageRate)
  }

  protected _previewDeposit(_tokenIn: Currency, amountTokenToDeposit: Amount<Currency>): Amount<Token> {
    return Amount.fromRawAmount(this, amountTokenToDeposit.quotient)
  }

  protected _previewRedeem(_tokenOut: Currency, amountSharesToRedeem: Amount<Currency>): Amount<Token> {
    return Amount.fromRawAmount(this.vDOT, amountSharesToRedeem.quotient)
  }
}
