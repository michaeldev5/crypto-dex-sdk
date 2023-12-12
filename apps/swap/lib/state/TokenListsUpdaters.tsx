import type { ParachainId } from '@crypto-dex-sdk/chain'
import { Updater } from './TokenListsUpdater'

interface Props {
  chainIds: ParachainId[]
}

export function Updaters({ chainIds }: Props) {
  return (
    <>
      {chainIds.map(chainId => (
        <Updater chainId={chainId} key={chainId} />
      ))}
    </>
  )
}
