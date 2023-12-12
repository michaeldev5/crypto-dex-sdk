import defaultTheme from 'tailwindcss/defaultTheme'
import { useMediaQuery } from '@crypto-dex-sdk/hooks'

type Breackpoints = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export function useBreakpoint<K extends Breackpoints>(breakpointKey: K) {
  const bool = useMediaQuery({
    query: `(min-width: ${defaultTheme.screens[breakpointKey]})`,
  })
  const capitalizedKey = breakpointKey[0].toUpperCase() + breakpointKey.substring(1)
  type Key = `is${Capitalize<K>}`
  return {
    [`is${capitalizedKey}`]: bool,
  } as Record<Key, boolean>
}
