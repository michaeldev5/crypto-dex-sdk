import type { JSBI } from '@crypto-dex-sdk/math'
import type { SYBase } from './SYBase'
import type { YT } from './YT'
import { Token } from '@crypto-dex-sdk/currency'
import { isCurrentExpired } from '../utils'

export class PT extends Token {
  public readonly SY: SYBase
  public YT: YT | undefined
  public readonly expiry: JSBI

  public constructor(
    token: {
      chainId: number | string
      address: string
      decimals: number
      symbol?: string
      name?: string
    },
    SY: SYBase,
    expiry: JSBI,
  ) {
    super(token)
    this.SY = SY
    this.expiry = expiry
  }

  public initializeYT(YT: YT) {
    this.YT = YT
  }

  public get isExpired(): boolean {
    return isCurrentExpired(this.expiry)
  }
}
