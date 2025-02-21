import type { PublicClient } from 'viem'
import { ParachainId } from '@crypto-dex-sdk/chain'
import { AlgebraBaseProvider } from './AlgebraBase'
import { LiquidityProviders } from './LiquidityProvider'

export class StellaSwapV3Provider extends AlgebraBaseProvider {
  public constructor(chainId: ParachainId, client: PublicClient) {
    const factory = {
      [ParachainId.MOONBEAM]: '0xabE1655110112D0E45EF91e94f8d757e4ddBA59C',
    } as const
    const stateMultiCall = {
      [ParachainId.MOONBEAM]: '0xed4777785e3021f61b391C01c56361e790fd8b19',
    } as const

    super(chainId, client, factory, stateMultiCall)
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.StellaSwapV3
  }

  public getPoolProviderName(): string {
    return 'StellaSwapV3'
  }
}
