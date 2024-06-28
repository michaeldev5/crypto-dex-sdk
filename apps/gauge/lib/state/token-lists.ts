import { createTokenLists } from '@crypto-dex-sdk/redux-token-lists'

// Create a token lists instance with default settings
export const tokenLists: ReturnType<typeof createTokenLists> = createTokenLists()

export const {
  useAllLists,
  useActiveListNames,
  useCombinedActiveList,
  useIsListActive,
  useFetchListCallback,
  useTokens,
} = tokenLists.hooks
