import type { FC } from 'react'
import { chainName } from '@crypto-dex-sdk/chain'
import { AppearOnMount, classNames, DEFAULT_INPUT_UNSTYLED, Link, NetworkIcon, Typography } from '@crypto-dex-sdk/ui'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { Trans } from '@lingui/macro'
import { REFERRALS_ENABLED_NETWORKS } from 'config'

interface ReferralsLinkButtonProps {
  chainId: number
}

export const ReferralsLinkButton: FC<ReferralsLinkButtonProps> = ({ chainId }) => {
  if (!REFERRALS_ENABLED_NETWORKS.includes(chainId))
    return null

  return (
    <AppearOnMount className="w-full max-w-[440px]">
      <Link.Internal href="https://app.zenlink.pro/referrals">
        <button
          className={classNames(
            DEFAULT_INPUT_UNSTYLED,
            'flex items-center justify-between mt-4 !bg-slate-900/[0.12] dark:!bg-white/[0.04] hover:!bg-slate-900/[0.16] hover:dark:!bg-white/[0.08] hover:text-slate-800 hover:dark:text-slate-200 rounded-2xl py-3 px-4 text-slate-700 dark:text-slate-300',
          )}
        >
          <div className="flex items-center gap-4">
            <NetworkIcon chainId={chainId} height={28} width={28} />
            <div>
              <Typography weight={600}>
                <Trans>
                  {chainName[chainId]} referral program
                </Trans>
              </Typography>
              <Typography variant="sm" weight={500}>
                <Trans>Get fee discounts and earn rebates.</Trans>
              </Typography>
            </div>
          </div>
          <ArrowTopRightOnSquareIcon height={20} width={20} />
        </button>
      </Link.Internal>
    </AppearOnMount>
  )
}
