import type { FC } from 'react'
import type { CellProps } from './types'
import { CopyHelper, IconButton, Typography } from '@crypto-dex-sdk/ui'
import { CheckIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'

export const CodeCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex items-center gap-2">
      <Typography className="text-slate-800 dark:text-slate-200 flex gap-2 items-center" variant="sm" weight={500}>
        {row.id}
      </Typography>
      <CopyHelper hideIcon toCopy={`https://app.zenlink.pro/referrals?chainId=${row.chainId}&referralCode=${row.code}`}>
        {isCopied => (
          <IconButton className="p-0.5">
            {isCopied
              ? <CheckIcon className="text-green" height={18} width={18} />
              : <DocumentDuplicateIcon height={18} width={18} />}
          </IconButton>
        )}
      </CopyHelper>
    </div>
  )
}
