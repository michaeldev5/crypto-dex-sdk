import type { ParachainId } from '@crypto-dex-sdk/chain'

import { tokenLists } from './token-lists'

interface Props {
  chainId: ParachainId
}

// Wagmi wrapper for redux token lists
export function Updater({ chainId }: Props) {
  return <tokenLists.Updater chainId={chainId} />
}
