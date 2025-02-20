import type { FC } from 'react'
import { ParachainId } from '@crypto-dex-sdk/chain'
import { Checker, useAccount } from '@crypto-dex-sdk/compat'
import { Amount, DOT, ZLK } from '@crypto-dex-sdk/currency'
import { formatFullNumber } from '@crypto-dex-sdk/format'
import { ZERO } from '@crypto-dex-sdk/math'
import { Button, Currency, Dots, Tooltip, Typography } from '@crypto-dex-sdk/ui'
import { useClaimVotingRewardsReview, useVotingEscrow } from '@crypto-dex-sdk/wagmi'
import { BuildingLibraryIcon, HandRaisedIcon, InformationCircleIcon, WalletIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { useVotingRewards } from 'lib/hooks'
import { useMemo } from 'react'

export const VeDashboard: FC = () => {
  const { address } = useAccount()
  const { data: ve } = useVotingEscrow(ParachainId.MOONBEAM, { enabled: true })

  const [totalVeBalance, myVeBalance] = useMemo(
    () => [
      Amount.fromRawAmount(ZLK[ParachainId.MOONBEAM], ve?.totalSupplyAmount || '0'),
      Amount.fromRawAmount(ZLK[ParachainId.MOONBEAM], ve?.balance || '0'),
    ],
    [ve],
  )

  const { unClaimedDOTAmount, data } = useVotingRewards(address)

  const { sendTransaction, isWritePending } = useClaimVotingRewardsReview({
    chainId: ParachainId.MOONBEAM,
    rewardsData: data,
  })

  return (
    <div className="flex flex-col sm:flex-row mb-4 bg-slate-200 dark:bg-slate-800 rounded-xl divide-y sm:divide-x sm:divide-y-0 divide-dashed divide-slate-500/50">
      <div className="flex p-4 basis-1/4 justify-start sm:justify-center items-center">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <BuildingLibraryIcon height={20} width={20} />
            <Typography weight={500}>
              <Trans>Total veZLK</Trans>
            </Typography>
          </div>
          <Typography variant="lg" weight={600}>
            {formatFullNumber(totalVeBalance.toSignificant(4))}
          </Typography>
        </div>
      </div>
      <div className="flex p-4 basis-1/4 justify-start sm:justify-center items-center">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <BuildingLibraryIcon height={20} width={20} />
            <Typography weight={500}>
              <Trans>Total Locked ZLK</Trans>
            </Typography>
          </div>
          <Typography variant="lg" weight={600}>
            {formatFullNumber(ve?.totalLockedZLK.toSignificant(4) || '0')}
          </Typography>
        </div>
      </div>
      <div className="flex p-4 basis-1/4 justify-start sm:justify-center items-center">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <WalletIcon height={20} width={20} />
            <Typography weight={500}>
              <Trans>My veZLK</Trans>
            </Typography>
          </div>
          <Typography variant="lg" weight={600}>
            {formatFullNumber(myVeBalance.toSignificant(4))}
          </Typography>
        </div>
      </div>
      <div className="flex p-4 basis-1/4 justify-start sm:justify-center items-center">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <HandRaisedIcon height={20} width={20} />
            <Typography weight={500}>
              <Trans>Claimable Rewards</Trans>
            </Typography>
            <Tooltip content={(
              <Typography className="text-slate-700 dark:text-slate-300" variant="xs" weight={500}>
                <Trans>
                  DOT rewards distributed every 4-5 weeks.
                </Trans>
                <br />
                Last distribution: 25 Sep 2024
              </Typography>
            )}
            >
              <InformationCircleIcon height={14} width={14} />
            </Tooltip>
          </div>
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2">
              <Currency.Icon currency={DOT[ParachainId.MOONBEAM]} disableLink height={20} width={20} />
              <Typography variant="lg" weight={600}>
                {
                  Number(unClaimedDOTAmount.toExact()) > 0 && Number(unClaimedDOTAmount.toExact()) < 0.01
                    ? '<0.01'
                    : unClaimedDOTAmount.toSignificant(4)
                }
              </Typography>
            </div>
            <Checker.Network chainId={ParachainId.MOONBEAM} size="xs">
              <Button
                disabled={isWritePending || unClaimedDOTAmount.equalTo(ZERO)}
                onClick={() => sendTransaction?.()}
                size="xs"
              >
                {isWritePending ? <Dots><Trans>Confirm</Trans></Dots> : <Trans>Claim</Trans>}
              </Button>
            </Checker.Network>
          </div>
        </div>
      </div>
    </div>
  )
}
