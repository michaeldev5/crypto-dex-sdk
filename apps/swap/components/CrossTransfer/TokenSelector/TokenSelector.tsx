import type { Token, Type } from '@crypto-dex-sdk/currency'
import { useIsMounted } from '@crypto-dex-sdk/hooks'
import type { FC } from 'react'
import { memo, useMemo } from 'react'
import { TokenSelectorDialog } from './TokenSelectorDialog'

export interface TokenSelectorProps {
  variant: 'overlay' | 'dialog'
  currency?: Type
  open: boolean
  tokenMap: Record<string, Token>
  onClose: () => void
  onSelect?: (currency: Type) => void
  includeNative?: boolean
}

export const TokenSelector: FC<TokenSelectorProps> = memo(function TokenSelector({
  tokenMap,
  onSelect,
  open,
  ...props
}) {
  const isMounted = useIsMounted()

  return useMemo(() => {
    if (!isMounted)
      return <></>

    return (
      <TokenSelectorDialog
        onSelect={onSelect}
        open={open}
        tokenMap={tokenMap}
        {...props}
      />
    )
  }, [isMounted, onSelect, open, props, tokenMap])
}, (prevProps, nextProps) => {
  return (
    prevProps.variant === nextProps.variant
    && prevProps.currency === nextProps.currency
    && prevProps.open === nextProps.open
    && prevProps.tokenMap === nextProps.tokenMap
  )
})
