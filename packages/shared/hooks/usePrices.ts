import { getAddress, isAddress } from '@crypto-dex-sdk/format'
import { Fraction } from '@crypto-dex-sdk/math'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { parseUnits } from 'viem'

export function usePrices({
  chainId,
}: {
  chainId?: number
}) {
  const queryKey = useMemo(() => [`https://token-price.zenlink.pro/v0/${chainId}`], [chainId])
  const {
    data: pricesMap,
    isError,
    isLoading,
  } = useQuery({
    queryKey,
    queryFn: () => fetch(`https://token-price.zenlink.pro/v0/${chainId}`).then(response => response.json()),
    staleTime: 20000,
    enabled: Boolean(chainId),
  })

  return useMemo(() => ({
    isError,
    isLoading,
    data:
      pricesMap && !isError && !isLoading
        ? Object.entries<number>(pricesMap).reduce<Record<string, Fraction>>((acc, [address, price]) => {
            if (isAddress(address)) {
              acc[getAddress(address)] = new Fraction(
                parseUnits(price.toFixed(18) as `${number}`, 18).toString(),
                parseUnits('1', 18).toString(),
              )
            }

            return acc
          }, {})
        : undefined,
  }), [isError, isLoading, pricesMap])
}
