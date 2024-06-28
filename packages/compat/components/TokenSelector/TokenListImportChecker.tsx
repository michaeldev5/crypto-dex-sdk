import { ParachainId } from '@crypto-dex-sdk/chain'
import type { Token } from '@crypto-dex-sdk/currency'
import type { FC, ReactNode } from 'react'
import { TokenListImportChecker as WagmiTokenListImportChecker } from '@crypto-dex-sdk/wagmi'
import { isEvmNetwork } from '../../config'

interface TokenListImportCheckerProps {
  chainId: ParachainId
  children: ReactNode
  onAddTokens: (tokens: Token[]) => void
  tokens?: { address: string, chainId: number }[]
  tokenMap: Record<string, Token>
  customTokensMap: Record<string, Token>
}

export const TokenListImportChecker: FC<TokenListImportCheckerProps> = ({
  chainId,
  children,
  ...props
}) => {
  if (isEvmNetwork(chainId))
    return <WagmiTokenListImportChecker {...props}>{children}</WagmiTokenListImportChecker>

  if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
    return <></>
  else
    return <></>
}
