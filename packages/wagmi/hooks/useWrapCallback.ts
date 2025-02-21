import type { ParachainId } from '@crypto-dex-sdk/chain'
import type { Amount, Type } from '@crypto-dex-sdk/currency'
import type { NotificationData } from '@crypto-dex-sdk/ui'
import type { Dispatch, SetStateAction } from 'react'
import type { SendTransactionData } from 'wagmi/query'
import type { WagmiTransactionRequest } from '../types'
import { ZERO } from '@crypto-dex-sdk/math'
import { useCallback } from 'react'
import { encodeFunctionData } from 'viem'
import { useAccount } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { config } from '../client'
import { useSendTransaction } from './useSendTransaction'
import { getWNATIVEContractConfig, useWNATIVEContract } from './useWNATIVEContract'

export enum WrapType {
  Wrap = 'Wrap',
  Unwrap = 'Unwrap',
}

interface UseWrapCallbackParams {
  chainId: ParachainId | undefined
  wrapType: WrapType
  onSuccess?: (data: NotificationData) => void
  amount: Amount<Type> | undefined
}

type UseWrapCallback = (params: UseWrapCallbackParams) => ReturnType<typeof useSendTransaction>

export const useWrapCallback: UseWrapCallback = ({ chainId, wrapType, amount, onSuccess }) => {
  const { address } = useAccount()
  const { abi, address: contractAddress } = getWNATIVEContractConfig(chainId)
  const contract = useWNATIVEContract(chainId)

  const onSettled = useCallback(
    (hash: SendTransactionData | undefined) => {
      if (hash && onSuccess && amount && chainId) {
        const ts = new Date().getTime()
        onSuccess({
          type: wrapType === WrapType.Wrap ? 'enterBar' : 'leaveBar',
          chainId,
          txHash: hash,
          promise: waitForTransactionReceipt(config, { hash }),
          summary: {
            pending: `${wrapType === WrapType.Wrap ? 'Wrapping' : 'Unwrapping'} ${amount.toSignificant(6)} ${amount.currency.symbol
            }`,
            completed: `Successfully ${wrapType === WrapType.Wrap ? 'wrapped' : 'unwrapped'} ${amount.toSignificant(
              6,
            )} ${amount.currency.symbol}`,
            failed: `Something went wrong when trying to ${wrapType === WrapType.Wrap ? 'wrap' : 'unwrap'}`,
          },
          groupTimestamp: ts,
          timestamp: ts,
        })
      }
    },
    [amount, chainId, onSuccess, wrapType],
  )

  const prepare = useCallback(
    (setRequest: Dispatch<SetStateAction<WagmiTransactionRequest | undefined>>) => {
      if (!contract || !chainId || !address || !amount || !amount.greaterThan(ZERO))
        return

      if (wrapType === WrapType.Wrap) {
        setRequest({
          account: address,
          to: contractAddress,
          data: encodeFunctionData({ abi, functionName: 'deposit' }),
          value: BigInt(amount.quotient.toString()),
        })
      }

      if (wrapType === WrapType.Unwrap) {
        setRequest({
          account: address,
          to: contractAddress,
          data: encodeFunctionData({ abi, functionName: 'withdraw', args: [BigInt(amount.quotient.toString())] }),
          value: BigInt(0),
        })
      }
    },
    [abi, address, amount, chainId, contract, contractAddress, wrapType],
  )

  return useSendTransaction({
    chainId,
    prepare,
    mutation: {
      onSettled,
    },
    enabled: (contract && chainId && address && amount && amount?.greaterThan(ZERO)) ?? undefined,
  })
}
