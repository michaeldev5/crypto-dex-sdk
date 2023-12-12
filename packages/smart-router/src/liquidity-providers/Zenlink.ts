import { FACTORY_ADDRESS, INIT_CODE_HASH } from '@crypto-dex-sdk/amm'
import type { ParachainId } from '@crypto-dex-sdk/chain'
import type { PublicClient } from 'viem'
import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class ZenlinkProvider extends UniswapV2BaseProvider {
  factory = FACTORY_ADDRESS
  initCodeHash = INIT_CODE_HASH

  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.Zenlink
  }

  public getPoolProviderName(): string {
    return 'Zenlink'
  }
}
