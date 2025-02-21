import type { Pair } from '@crypto-dex-sdk/graph-client'
import type { FC } from 'react'
import { Checker, PairState, usePair } from '@crypto-dex-sdk/compat'
import { tryParseAmount } from '@crypto-dex-sdk/currency'
import { useIsMounted } from '@crypto-dex-sdk/hooks'
import { Button, Dots } from '@crypto-dex-sdk/ui'
import { t, Trans } from '@lingui/macro'
import { useCallback, useMemo, useState } from 'react'
import { useTokensFromPair } from '../../lib/hooks'
import { AddSectionReviewModalStandard } from './AddSectionReviewModalStandard'
import { AddSectionWidgetStandard } from './AddSectionWidgetStandard'

export const AddSectionStandard: FC<{ pair: Pair }> = ({ pair }) => {
  const isMounted = useIsMounted()
  const { token0, token1 } = useTokensFromPair(pair)
  const [{ input0, input1 }, setTypedAmounts] = useState<{ input0: string, input1: string }>({ input0: '', input1: '' })
  const {
    data: [poolState, pool],
  } = usePair(pair.chainId, token0, token1)

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  }, [input0, input1, token0, token1])

  const onChangeToken0TypedAmount = useCallback(
    (value: string) => {
      if (poolState === PairState.NOT_EXISTS) {
        setTypedAmounts(prev => ({
          ...prev,
          input0: value,
        }))
      }
      else if (token0 && pool) {
        const parsedAmount = tryParseAmount(value, token0)
        setTypedAmounts({
          input0: value,
          input1: parsedAmount ? pool.priceOf(token0.wrapped).quote(parsedAmount.wrapped).toExact() : '',
        })
      }
    },
    [pool, poolState, token0],
  )

  const onChangeToken1TypedAmount = useCallback(
    (value: string) => {
      if (poolState === PairState.NOT_EXISTS) {
        setTypedAmounts(prev => ({
          ...prev,
          input1: value,
        }))
      }
      else if (token1 && pool) {
        const parsedAmount = tryParseAmount(value, token1)
        setTypedAmounts({
          input0: parsedAmount ? pool.priceOf(token1.wrapped).quote(parsedAmount.wrapped).toExact() : '',
          input1: value,
        })
      }
    },
    [pool, poolState, token1],
  )

  return useMemo(() => {
    return (
      <AddSectionReviewModalStandard
        chainId={pair.chainId}
        input0={parsedInput0}
        input1={parsedInput1}
        poolState={poolState}
        token0={token0}
        token1={token1}
      >
        {({ isWritePending, setOpen }) => (
          <AddSectionWidgetStandard
            chainId={pair.chainId}
            input0={input0}
            input1={input1}
            isFarm={false}
            onInput0={onChangeToken0TypedAmount}
            onInput1={onChangeToken1TypedAmount}
            token0={token0}
            token1={token1}
          >
            <Checker.Connected chainId={pair.chainId} fullWidth size="md">
              <Checker.Custom
                guard={(
                  <Button disabled={true} fullWidth size="md">
                    <Trans>Pool Not Found</Trans>
                  </Button>
                )}
                showGuardIfTrue={isMounted && [PairState.NOT_EXISTS, PairState.INVALID].includes(poolState)}
              >
                <Checker.Network chainId={pair.chainId} fullWidth size="md">
                  <Checker.Amounts
                    amounts={[parsedInput0, parsedInput1]}
                    chainId={pair.chainId}
                    fullWidth
                    size="md"
                  >
                    <Button disabled={isWritePending} fullWidth onClick={() => setOpen(true)} size="md">
                      {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : t`Add Liquidity`}
                    </Button>
                  </Checker.Amounts>
                </Checker.Network>
              </Checker.Custom>
            </Checker.Connected>
          </AddSectionWidgetStandard>
        )}
      </AddSectionReviewModalStandard>
    )
  }, [input0, input1, isMounted, onChangeToken0TypedAmount, onChangeToken1TypedAmount, pair.chainId, parsedInput0, parsedInput1, poolState, token0, token1])
}
