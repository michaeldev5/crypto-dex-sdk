import type { TokenList } from '@crypto-dex-sdk/token-lists'
import { DEFULT_TOKEN_LIST_MAP } from '@crypto-dex-sdk/token-lists'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import type { TokenListsContext } from '../context'

export function useFetchListCallback(
  context: TokenListsContext,
): (listName: string, sendDispatch?: boolean) => Promise<TokenList> {
  const { actions } = context
  const dispatch = useDispatch()

  // note: prevent dispatch if using for list search or unsupported list
  return useCallback(
    async (listName: string, sendDispatch = true) => {
      const timestamp = Date.now.toString()
      sendDispatch && dispatch(actions.pending({ timestamp, name: listName }))
      return Promise.resolve(DEFULT_TOKEN_LIST_MAP[listName])
        .then((tokenList) => {
          sendDispatch && dispatch(actions.fulfilled({ name: listName, tokenList, timestamp }))
          return tokenList
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.debug(`Failed to get list at url ${listName}`, error)
          sendDispatch
            && dispatch(
              actions.rejected({
                name: listName,
                timestamp,
                errorMessage: error.message,
              }),
            )
          throw error
        })
    },
    [actions, dispatch],
  )
}
