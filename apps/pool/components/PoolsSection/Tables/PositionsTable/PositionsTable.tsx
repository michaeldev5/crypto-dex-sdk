import type { LiquidityPosition, POOL_TYPE } from '@crypto-dex-sdk/graph-client'
import type { SortingState } from '@tanstack/react-table'
import type { FC } from 'react'
import { useAccount } from '@crypto-dex-sdk/compat'
import { GenericTable, useBreakpoint } from '@crypto-dex-sdk/ui'
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { usePoolFilters } from 'components/PoolsFiltersProvider'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { APR_COLUMN, NAME_COLUMN, NETWORK_COLUMN, VALUE_COLUMN } from './Cells/columns'

const COLUMNS = [NETWORK_COLUMN, NAME_COLUMN, VALUE_COLUMN, APR_COLUMN]

async function fetcher({ url, args }: {
  url: string | null
  args: {
    sorting: SortingState
    query: string
    extraQuery: string
  }
}): Promise<LiquidityPosition<POOL_TYPE>[]> {
  if (!url)
    return Promise.resolve([])
  const _url = new URL(url, window.location.origin)

  if (args.sorting[0]) {
    _url.searchParams.set('orderBy', args.sorting[0].id)
    _url.searchParams.set('orderDirection', args.sorting[0].desc ? 'desc' : 'asc')
  }

  const where: { [key: string]: any } = {}
  if (args.query)
    where.name_contains_nocase = args.query

  if (Object.keys(where).length > 0)
    _url.searchParams.set('where', JSON.stringify(where))

  return fetch(_url.href)
    .then(res => res.json())
    .catch()
}

export const PositionsTable: FC = () => {
  const { query, extraQuery } = usePoolFilters()
  const { address } = useAccount()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'value', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})

  const args = useMemo(
    () => ({ sorting, query, extraQuery }),
    [sorting, query, extraQuery],
  )

  const swrArgs = useMemo(() => ({
    url: address ? `/pool/api/user/${address}` : null,
    args,
  }), [address, args])

  const { data: userPools, isValidating } = useSWR(
    swrArgs,
    fetcher,
  )

  const tableOptions = useMemo(() => ({
    data: userPools || [],
    state: {
      sorting,
      columnVisibility,
    },
    columns: COLUMNS,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  }), [columnVisibility, sorting, userPools])

  const table = useReactTable<LiquidityPosition<POOL_TYPE>>(tableOptions)

  useEffect(() => {
    if (isSm && !isMd)
      setColumnVisibility({ volume: false, network: false })

    else if (isSm)
      setColumnVisibility({})

    else
      setColumnVisibility({ volume: false, network: false, apr: false, liquidityUSD: false })
  }, [isMd, isSm])

  const rowLink = useCallback((row: LiquidityPosition<POOL_TYPE>) => {
    return `/${row.id}`
  }, [])

  return (
    <GenericTable<LiquidityPosition<POOL_TYPE>>
      linkFormatter={rowLink}
      loading={!userPools && isValidating}
      pageSize={Math.max(userPools?.length || 0, 5)}
      placeholder="No positions found"
      table={table}
    />
  )
}
