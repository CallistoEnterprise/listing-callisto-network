import { ethers } from 'ethers'
import type { Signer } from 'ethers'
import { readonly, ref, watch } from 'vue'
import type { Web3Provider } from '@ethersproject/providers'
import type { MetaMaskInpageProvider } from '@metamask/providers'
// import type WalletConnectProvider from '@walletconnect/web3-provider' //can't resolve import (any is used for SupportedProvider so far)
// import useLoading from './useLoading'
import { nodeProvider } from './web3/nodeProvider'
import useLoginModal from './useLoginModal'

export type SupportedProvider = any | MetaMaskInpageProvider
const rawWalletProvider = ref<SupportedProvider>()
const walletProvider = ref<Web3Provider>()
const userAddress = ref<string>()
const connectedChain = ref<number>()
const signer = ref<Signer>()
const ensName = ref<string | null>()
const avatar = ref<string | null>()
// const { loadingCreditLines } = useLoading()

const setWalletProvider = async (newWalletProvider: SupportedProvider | undefined): Promise<void> => {
  rawWalletProvider.value = newWalletProvider
}

const disconnectWallet = (): void => {
  // if (loadingCreditLines.value)
  //   return
  setWalletProvider(undefined)
  userAddress.value = undefined
  useLoginModal().web3Modal.value.clearCachedProvider()
}

// watch(userAddress, async (newUserAddress) => {
//   if (!newUserAddress)
//     return
//   nodeProvider.value.lookupAddress(newUserAddress).then(name => ensName.value = name)
//   avatar.value = await nodeProvider.value.getAvatar(newUserAddress)
// })

watch(rawWalletProvider, (provider, oldProvider) => {
  if (provider === oldProvider || !provider)
    return

  // remove listeners
  oldProvider?.removeAllListeners()
  nodeProvider.value.removeAllListeners()

  // ts-expect-error this is needed until this will be resolved: https://github.com/MetaMask/providers/issues/200
  // this is the reason why I have originalWalletProvider as well
  // walletProvider.value = newWalletProvider ? markRaw(new ethers.providers.Web3Provider(newWalletProvider)) : undefined
  walletProvider.value = provider ? markRaw(new ethers.providers.Web3Provider(provider)) : undefined

  // Subscribe to accounts change
  provider?.on('accountsChanged', (accounts: string[]) => {
    userAddress.value = accounts?.length > 0 ? ethers.utils.getAddress(accounts[0]) : undefined
  })

  // Subscribe to chainId change
  provider?.on('chainChanged', () => {
    window.location.reload()
  })

  // Subscribe to provider connection
  // provider?.on('connect', (info: { chainId: number }) => {

  // })

  // Subscribe to provider disconnection
  provider?.on('disconnect', () => {
    disconnectWallet()
  })
})

watch(walletProvider, async (provider, oldProvider) => {
  if (provider === oldProvider || !provider)
    return

  signer.value = provider.getSigner()
  const network = await provider.getNetwork()
  connectedChain.value = network.chainId as number
  userAddress.value = await signer.value.getAddress()
})

export default function useWallet() {
  const isLogged = computed(() => userAddress.value !== undefined)

  return {
    walletProvider: readonly(walletProvider),
    connectedChain: readonly(connectedChain),
    signer: readonly(signer),
    userAddress: readonly(userAddress),
    ensName: readonly(ensName),
    avatar: readonly(avatar),
    isLogged,
    setWalletProvider,
    disconnectWallet,
  }
}
