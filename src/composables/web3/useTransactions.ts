import type { ContractReceipt, ContractTransaction } from 'ethers'
import useNotifications from '../useNotifications'
import to from '~/utils/await-to-js'
import { getTxUrl, indexOfEnd } from '~/utils/utils'

export enum TransactionStatus {
  Failed,
  Success,
}

export default function useTransactions() {
  const { toastPending, toastError, dismissNotification } = useNotifications()

  const extractErrorMessage = (error: string) => {
    const indexOfStartErrorMessage = indexOfEnd(error, '"message":"')
    if (indexOfStartErrorMessage === -1)
      return error

    const errorFormatted = error.substring(indexOfStartErrorMessage)
    return errorFormatted.substring(0, errorFormatted.indexOf('"'))
  }

  const sendTransaction = async (
    contractMethodOrTx: Promise<ContractTransaction>, methodDescription: string): Promise<ContractReceipt | null> => {
    const toastId = toastPending({
      heading: 'Waiting for signature',
      content: methodDescription,
    })

    const [sendTxError, response] = await to(contractMethodOrTx)
    if (sendTxError) {
      let errorMessage = `Error: ${sendTxError.message.includes('execution reverted') ? extractErrorMessage(sendTxError.message) : sendTxError.message}`
      if (errorMessage === 'Error: Internal JSON-RPC error.')
        errorMessage += '<br> Please check your balance.'

      toastError({
        heading: 'Transaction error',
        content: errorMessage,
        replaceID: toastId,
      })
      return null
    }

    toastPending({
      heading: 'Transaction pending',
      content: methodDescription,
      actions: [
        {
          label: 'View in explorer',
          url: getTxUrl(response.hash),
        },
      ],
      replaceID: toastId,
    })

    const [confirmTxError, receipt] = await to(response.wait(1))

    dismissNotification(toastId)

    if (confirmTxError || receipt?.status === TransactionStatus.Failed) {
      toastError({
        heading: 'Transaction error',
        content: confirmTxError?.message ? extractErrorMessage(confirmTxError.message) : 'Transacion Error',
      })

      return null
    }

    return receipt
  }

  return {
    sendTransaction,
    extractErrorMessage,
  }
}
