import type { ParachainId } from '@crypto-dex-sdk/chain'
import type { Currency } from '@crypto-dex-sdk/currency'
import type { Address } from 'viem'
import { Native, Token } from '@crypto-dex-sdk/currency'
import { NATIVE_ADDRESS } from '@crypto-dex-sdk/smart-router'
import { ZENLINK_DEFAULT_TOKEN_LIST } from '@crypto-dex-sdk/token-lists'

import { erc20ABI } from '../../abis/erc20'
import { getClient, SUPPORTED_CHAINS } from './config'

export const DEFAULT_TOKENS_MAP = ZENLINK_DEFAULT_TOKEN_LIST
  .reduce<Map<ParachainId, Map<string, Token>>>((map, tokenList) => {
    const chainId = tokenList.tokens[0]?.parachainId
    if (map.get(chainId))
      return map

    map.set(
      chainId,
      tokenList.tokens.reduce<Map<string, Token>>(
        (tokenMap, { parachainId, address, decimals, name, symbol }) => {
          tokenMap.set(address.toLowerCase(), new Token({
            chainId: parachainId,
            decimals,
            name,
            symbol,
            address,
          }))
          return tokenMap
        },
        new Map(),
      ),
    )
    return map
  }, new Map())

async function fetchTokenInfo(chainId: ParachainId, tokenId: string): Promise<Token | undefined> {
  try {
    const client = getClient(chainId)
    if (!client)
      return undefined

    const results = await client
      .multicall({
        multicallAddress: client.chain?.contracts?.multicall3?.address,
        allowFailure: true,
        contracts: [
          {
            address: tokenId as Address,
            abi: erc20ABI,
            functionName: 'name',
          },
          {
            address: tokenId as Address,
            abi: erc20ABI,
            functionName: 'symbol',
          },
          {
            address: tokenId as Address,
            abi: erc20ABI,
            functionName: 'decimals',
          },
        ],
      })
      .catch((e) => {
        console.warn(`${e.message}`)
        return undefined
      })

    const name = results?.[0]?.result
    const symbol = results?.[1]?.result
    const decimals = results?.[2]?.result

    if (!name || !symbol || !decimals)
      return undefined

    return new Token({ chainId, decimals, name, symbol, address: tokenId })
  }
  catch {
    return undefined
  }
}

export async function getToken(chainId: ParachainId, tokenId: string): Promise<Currency | undefined> {
  if (!SUPPORTED_CHAINS.includes(chainId))
    return undefined

  if (tokenId === 'Native' || tokenId.toLowerCase() === NATIVE_ADDRESS.toLowerCase())
    return Native.onChain(chainId)

  const token = DEFAULT_TOKENS_MAP.get(chainId)?.get(tokenId.toLowerCase()) || (
    await fetchTokenInfo(chainId, tokenId)
  )

  return token
}
