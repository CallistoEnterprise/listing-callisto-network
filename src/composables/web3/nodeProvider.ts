// import { sample } from 'cypress/types/lodash'
import { ethers } from 'ethers'
import { computed } from 'vue'
import { CALLISTO_CHAIN_CONSTANTS } from '@callisto-enterprise/chain-constants'

// nodeProvider = provider that does not hold user private keys (in contrary to walletProvider in userWallet())
// export const nodeProvider = computed(() => new ethers.providers.JsonRpcProvider(chainConstants.value?.rpcs[0]))
export const nodeProvider = computed(() => new ethers.providers.JsonRpcProvider(CALLISTO_CHAIN_CONSTANTS[820].rpcs[0]))
// export const nodeProvider = computed(() => new ethers.providers.JsonRpcProvider('https://rpc.callisto.network/'))
