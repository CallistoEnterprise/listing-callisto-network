import { CALLISTO_CHAIN_ID } from '@callisto-enterprise/chain-constants'
import { Contract, ethers } from 'ethers'
import useTransactions from './web3/useTransactions'
import type { FormRequest } from '~/models/FormRequest'
import erc20Abi from '~/contracts/abi/erc20.json'

export enum SecurityAudit {
  Audit = 'audit',
  Audited = 'audited',
  NoAudit = 'no-audit',
}

const request = ref({ securityAudit: SecurityAudit.Audit } as FormRequest)
const selectedRequestType = ref()

export default function useRequest() {
  const { sendTransaction } = useTransactions()
  const { toastSuccessTx } = useNotifications()
  const { userAddress, signer } = useWallet()
  const { soyPrice } = usePriceFeed()

  const isMainnet = computed(() => import.meta.env.VITE_SOY_CHAIN_ID === 820)
  const isChainCallisto = computed(() => request.value.chainId === CALLISTO_CHAIN_ID.Mainnet)
  const finalPrice = computed(() => isMainnet.value ? ((2000 + (request.value.createFarm ? 250 : 0)) / soyPrice.value).toFixed(0) : '1')
  const isSoyDisabled = computed(() => request.value.securityAudit === SecurityAudit.NoAudit)

  const sendTx = async () => {
    const soyAddr = isMainnet.value ? import.meta.env.VITE_SOY_ADDR : '0x4c20231BCc5dB8D805DB9197C84c8BA8287CbA92'
    const contract = new Contract(soyAddr, erc20Abi, signer.value!)
    const amount = finalPrice.value

    const destination = isMainnet.value ? import.meta.env.VITE_SOY_MULTISIG : userAddress.value
    const receipt = await sendTransaction(contract.transfer(destination, ethers.utils.parseUnits(`${amount}`, 18)), 'Preparing payment...')
    if (!receipt)
      return null

    if (receipt?.status === 1) {
      toastSuccessTx({
        heading: 'Transaction success',
        content: 'Payment has been succesfull',
      }, receipt.transactionHash)
    }

    return receipt
  }

  return {
    request,
    selectedRequestType,
    isMainnet,
    isChainCallisto,
    finalPrice,
    isSoyDisabled,
    sendTx,
  }
}
