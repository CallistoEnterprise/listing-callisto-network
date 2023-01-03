import type { IProviderOptions } from 'web3modal'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { computed } from 'vue'
// import ethProvider from 'eth-provider'
// import { ethers } from 'ethers'
// import ethProvider from 'eth-provider'
// import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import { CALLISTO_CHAIN_CONSTANTS } from '@callisto-enterprise/chain-constants'
import { promiseTimeout } from '@vueuse/core'
import useWallet from './useWallet'
// import { hubConstants } from '~/constants/constants'
// import { SupportedChain } from '~/constants/chains/types'
// import TESTNET_CONSTANTS from '~/constants/chains/testnet'
// import MAINNET_CONSTANTS from '~/constants/chains/mainnet'
// import { getBestRpc } from '~/utils/utils'

// import { chainConstants } from '~/constants/constants'

interface RpcList {
  [key: number]: string[]
}

const RPC_URLS: RpcList = {}

Object.values(CALLISTO_CHAIN_CONSTANTS).forEach((chain) => {
  RPC_URLS[chain.general.chainId] = chain.rpcs
})

const web3Modal = computed(() => {
  const providerOptions: IProviderOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: RPC_URLS,
      },
    },
  }

  return new Web3Modal({
    providerOptions,
    cacheProvider: true,
  })
})

watch(web3Modal, (w3m) => {
  if (!w3m)
    return
  if (w3m.cachedProvider) {
    // todo: doesn't work
    // console.log('autoconnect now')
    w3m.connect()
  }
}, { immediate: true })

export default function useLoginModal() {
  const { setWalletProvider } = useWallet()

  const connect = async () => {
    const instance = await web3Modal.value.connect()
    // const provider = new ethers.providers.Web3Provider(instance)
    setWalletProvider(instance)
  }

  const autologin = async () => {
    const cachedProvider = web3Modal.value.cachedProvider
    if (cachedProvider) {
      const instance = await web3Modal.value.connectTo(cachedProvider)
      await setWalletProvider(instance)
      await promiseTimeout(500)
    }
  }

  return {
    connect,
    autologin,
    web3Modal,
  }
}
