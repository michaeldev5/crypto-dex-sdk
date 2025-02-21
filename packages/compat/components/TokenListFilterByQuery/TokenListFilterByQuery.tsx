import type { Token, Type } from '@crypto-dex-sdk/currency'
import type { Fraction } from '@crypto-dex-sdk/math'
import type { FC, JSX, RefObject } from 'react'
import type { BalanceMap } from '../../hooks/useBalance/types'
import { ParachainId } from '@crypto-dex-sdk/chain'
import { TokenListFilterByQuery as WagmiTokenListFilterByQuery } from '@crypto-dex-sdk/wagmi'
import { isEvmNetwork } from '../../config'

interface RenderProps {
  currencies: Type[]
  inputRef: RefObject<HTMLInputElement | null>
  query: string
  onInput: (query: string) => void
  searching: boolean
  queryToken: [Token | undefined]
}

interface Props {
  chainId?: ParachainId
  tokenMap: Record<string, Token>
  pricesMap?: Record<string, Fraction>
  balancesMap?: BalanceMap
  children: (props: RenderProps) => JSX.Element
  includeNative?: boolean
}

export const TokenListFilterByQuery: FC<Props> = ({
  chainId,
  ...props
}) => {
  if (chainId && isEvmNetwork(chainId))
    return <WagmiTokenListFilterByQuery chainId={chainId} {...props} />

  if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
    return <></>
  else
    return <></>
}
