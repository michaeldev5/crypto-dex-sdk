import type { ParachainId } from '@crypto-dex-sdk/chain'
import type { Token, Type } from '@crypto-dex-sdk/currency'
import type { FC } from 'react'
import { useIsMounted } from '@crypto-dex-sdk/hooks'
import { usePrices } from '@crypto-dex-sdk/shared'
import { memo, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useBalances } from '../../hooks'
import { TokenSelectorDialog } from './TokenSelectorDialog'
import { TokenSelectorOverlay } from './TokenSelectorOverlay'

export interface TokenSelectorProps {
  variant: 'overlay' | 'dialog'
  currency?: Type
  open: boolean
  chainId: ParachainId | undefined
  tokenMap: Record<string, Token>
  customTokenMap?: Record<string, Token>
  onClose: () => void
  onSelect?: (currency: Type) => void
  onAddToken?: (token: Token) => void
  onRemoveToken?: ({ chainId, address }: { chainId: ParachainId, address: string }) => void
  includeNative?: boolean
}

export const TokenSelector: FC<TokenSelectorProps> = memo(
  ({
    variant,
    tokenMap,
    chainId,
    onSelect,
    open,
    customTokenMap = {},
    includeNative,
    ...props
  }) => {
    const { address } = useAccount()
    const isMounted = useIsMounted()

    const _tokenMap: Record<string, Token> = useMemo(
      () => ({ ...tokenMap, ...customTokenMap }),
      [tokenMap, customTokenMap],
    )

    const _tokenMapValues = useMemo(() => {
      return Object.values(_tokenMap)
    }, [_tokenMap])

    const { data: balances } = useBalances({
      account: address,
      chainId,
      currencies: _tokenMapValues,
      enabled: open,
    })

    const { data: pricesMap } = usePrices({ chainId })

    return useMemo(() => {
      if (!isMounted)
        return <></>

      if (variant === 'overlay') {
        return (
          <TokenSelectorOverlay
            account={address}
            balancesMap={balances}
            chainId={chainId}
            includeNative={includeNative}
            onSelect={onSelect}
            open={open}
            pricesMap={pricesMap}
            tokenMap={_tokenMap}
            {...props}
          />
        )
      }

      return (
        <TokenSelectorDialog
          account={address}
          balancesMap={balances}
          chainId={chainId}
          includeNative={includeNative}
          onSelect={onSelect}
          open={open}
          pricesMap={pricesMap}
          tokenMap={_tokenMap}
          {...props}
        />
      )
    }, [_tokenMap, address, balances, chainId, isMounted, onSelect, open, props, variant, includeNative, pricesMap])
  },
  (prevProps, nextProps) => {
    return (
      prevProps.variant === nextProps.variant
      && prevProps.currency === nextProps.currency
      && prevProps.open === nextProps.open
      && prevProps.tokenMap === nextProps.tokenMap
      && prevProps.customTokenMap === nextProps.customTokenMap
    )
  },
)
