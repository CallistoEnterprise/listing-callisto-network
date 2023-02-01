import { CALLISTO_CHAIN_ID } from '@callisto-enterprise/chain-constants'
import { Contract, ethers } from 'ethers'
import useTransactions from './web3/useTransactions'
import type { FormRequest } from '~/models/FormRequest'
import erc20Abi from '~/contracts/abi/erc20.json'

const { sendTransaction } = useTransactions()
const { toastSuccessTx } = useNotifications()
const { userAddress, signer, isMainnet } = useWallet()
const { soyPrice } = usePriceFeed()

export enum SecurityAudit {
  Audit = 'audit',
  Audited = 'audited',
  NoAudit = 'no-audit',
}

export const LISTING_PRICE = import.meta.env.VITE_LISTING_PRICE
export const AUDIT_PRICE = import.meta.env.VITE_AUDIT_PRICE

const request = ref({ securityAudit: SecurityAudit.Audit } as FormRequest)
const selectedRequestType = ref()
const soyBalance = ref<number>()

const soyContract = computed(() => new Contract(import.meta.env.VITE_SOY_ADDR, erc20Abi, signer.value!))

watch(userAddress, async () => {
  const balance = await soyContract.value.balanceOf(userAddress.value!)
  soyBalance.value = +ethers.utils.formatUnits(balance, 18)
})

watchEffect(() => {
  if (request.value.securityAudit === SecurityAudit.NoAudit) {
    if (request.value.includeSoy)
      request.value.includeSoy = false
    if (request.value.includeBridge)
      request.value.includeBridge = false
  }
})

export default function useRequest() {
  const isChainCallisto = computed(() => request.value.chainId === CALLISTO_CHAIN_ID.Mainnet)
  const finalPrice = computed(() => ((+LISTING_PRICE + (request.value.securityAudit === SecurityAudit.Audit ? +AUDIT_PRICE : 0)) / soyPrice.value).toFixed(0))
  const isSoyDisabled = computed(() => request.value.securityAudit === SecurityAudit.NoAudit)
  const hasBalance = computed(() => soyBalance.value === undefined ? true : soyBalance.value >= +finalPrice.value)

  const sendTx = async () => {
    // const soyAddr = isMainnet.value ? import.meta.env.VITE_SOY_ADDR : '0x4c20231BCc5dB8D805DB9197C84c8BA8287CbA92'
    const amount = finalPrice.value

    const destination = isMainnet.value ? import.meta.env.VITE_SOY_MULTISIG : userAddress.value
    const receipt = await sendTransaction(soyContract.value.transfer(destination, ethers.utils.parseUnits(`${amount}`, 18)), 'Preparing payment...')
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
    isChainCallisto,
    finalPrice,
    isSoyDisabled,
    hasBalance,
    soyBalance,
    sendTx,
  }
}
