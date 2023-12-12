import { ParachainId } from '@crypto-dex-sdk/chain'
import type { Token, Type } from '@crypto-dex-sdk/currency'
import type { Fraction } from '@crypto-dex-sdk/math'
import type { FC, RefObject } from 'react'
import { TokenListFilterByQuery as WagmiTokenListFilterByQuery } from '@crypto-dex-sdk/wagmi'
import { TokenListFilterByQuery as BifrostTokenListFilterByQuery } from '@crypto-dex-sdk/parachains-bifrost'
import { TokenListFilterByQuery as AmplitudeTokenListFilterByQuery } from '@crypto-dex-sdk/parachains-amplitude'
import { isEvmNetwork } from '../../config'
import type { BalanceMap } from '../../hooks/useBalance/types'

interface RenderProps {
  currencies: Type[]
  inputRef: RefObject<HTMLInputElement>
  query: string
  onInput(query: string): void
  searching: boolean
  queryToken: [Token | undefined]
}

interface Props {
  chainId?: ParachainId
  tokenMap: Record<string, Token>
  pricesMap?: Record<string, Fraction>
  balancesMap?: BalanceMap
  children(props: RenderProps): JSX.Element
  includeNative?: boolean
}

export const TokenListFilterByQuery: FC<Props> = ({
  chainId,
  ...props
}) => {
  if (chainId && isEvmNetwork(chainId))
    return <WagmiTokenListFilterByQuery chainId={chainId} {...props} />

  if (chainId === ParachainId.AMPLITUDE)
    return <AmplitudeTokenListFilterByQuery chainId={chainId} {...props} />
  else
    return <BifrostTokenListFilterByQuery chainId={chainId} {...props} />
}
