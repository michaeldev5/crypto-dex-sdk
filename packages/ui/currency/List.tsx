import type { Type } from '@crypto-dex-sdk/currency'
import type { CSSProperties, FC, ReactElement } from 'react'
import { memo, useCallback } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'

interface RendererPayload {
  currency: Type
  style: CSSProperties
}

export interface ListProps {
  className?: string
  currencies: Type[]
  rowHeight?: number
  rowRenderer: (payload: RendererPayload) => ReactElement
  deps?: any[]
}

export const List: FC<ListProps> = memo(
  ({ className, currencies, rowHeight, rowRenderer }: ListProps) => {
    const Row = useCallback(
      ({ index, style }: { index: number, style: CSSProperties }) => {
        const currency = currencies[index]
        return rowRenderer({ currency, style })
      },
      [currencies, rowRenderer],
    )

    return (
      <AutoSizer disableWidth>
        {({ height }) => (
          <FixedSizeList
            className={className}
            height={height}
            itemCount={currencies.length}
            itemSize={rowHeight || 56}
            width="100%"
          >
            {Row}
          </FixedSizeList>
        )}
      </AutoSizer>
    )
  },
  (prevProps, nextProps) => prevProps.className === nextProps.className
    && prevProps.currencies === nextProps.currencies
    && prevProps.rowHeight === nextProps.rowHeight,
)
