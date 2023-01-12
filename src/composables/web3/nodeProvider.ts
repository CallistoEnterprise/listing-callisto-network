// import { sample } from 'cypress/types/lodash'
import { ethers } from 'ethers'
import { computed } from 'vue'
import { CALLISTO_CHAIN_CONSTANTS } from '@callisto-enterprise/chain-constants'

// nodeProvider.value = provider that does not hold user private keys (in contrary to walletProvider in userWallet())
// export const nodeProvider.value = computed(() => new ethers.providers.JsonRpcProvider(chainConstants.value?.rpcs[0]))
export const nodeProvider = computed(() => {
  const chainId = +import.meta.env.VITE_CHAIN_ID
  return new ethers.providers.JsonRpcProvider(CALLISTO_CHAIN_CONSTANTS[chainId as keyof typeof CALLISTO_CHAIN_CONSTANTS].rpcs[0])
})
// export const nodeProvider.value = computed(() => new ethers.providers.JsonRpcProvider('https://rpc.callisto.network/'))
