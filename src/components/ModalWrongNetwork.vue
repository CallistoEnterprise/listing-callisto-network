<script setup lang="ts">
import { CALLISTO_CHAIN_CONSTANTS } from '@callisto-enterprise/chain-constants'
import useWallet from '~/composables/useWallet'

const { switchNetwork, connectedChain } = useWallet()

const supportedChain = computed(() => {
  const chainId = +import.meta.env.VITE_CHAIN_ID
  return CALLISTO_CHAIN_CONSTANTS[chainId as keyof typeof CALLISTO_CHAIN_CONSTANTS]
})

const isOpen = computed(() => !!connectedChain.value && connectedChain.value !== supportedChain.value.general.chainId)
</script>

<template>
  <BaseModal
    v-model:is-open="isOpen" heading="Wrong Network" :is-closable="false"
  >
    <div mb-24px>
      <div grid grid-cols-2 gap-24px>
        <button app-btn-alt type="button" flex flex-wrap items-center gap-12px @click="switchNetwork(supportedChain)">
          <img w-36px :src="supportedChain.general.image">
          Switch network to<b>{{ supportedChain.general.officialName }}</b>
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
</style>
