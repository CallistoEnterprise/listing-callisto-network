<script lang="ts" setup>
import { RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import { CALLISTO_CHAIN_CONSTANTS, CALLISTO_CHAIN_ID } from '@callisto-enterprise/chain-constants'

const listingTypes = [
  { name: 'Mainnet Listing', networks: [CALLISTO_CHAIN_CONSTANTS[CALLISTO_CHAIN_ID.Mainnet]], explorer: 'https://explorer.callisto.network', image: 'https://asset.callisto.network/images/chains/820.png' },
  // { name: 'Testnet Listing', assets: TOKENLIST[20729], explorer: 'https://testnet-explorer.callisto.network', image: 'https://asset.callisto.network/images/chains/20729.png' },
  {
    name: 'Other chains',
    networks: [
      CALLISTO_CHAIN_CONSTANTS[CALLISTO_CHAIN_ID.ETH],
      CALLISTO_CHAIN_CONSTANTS[CALLISTO_CHAIN_ID.ETC],
      CALLISTO_CHAIN_CONSTANTS[CALLISTO_CHAIN_ID.BSC],
      CALLISTO_CHAIN_CONSTANTS[CALLISTO_CHAIN_ID.BTT],
    ],
    image: 'https://asset.callisto.network/images/chains/61.png',
    secondaryImage: 'https://asset.callisto.network/images/chains/199.png',
  },
]

const selectedListing = ref(listingTypes[0])
</script>

<template>
  <div flex-col sm:flex sm:items-center>
    <h1 app-h1>
      Listed Assets
    </h1>
    <RadioGroup v-model="selectedListing" mt="48px">
      <div class="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
        <RadioGroupOption v-for="listing in listingTypes" :key="listing.name" v-slot="{ checked, active }" as="template" :value="listing">
          <div class="relative cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none flex justify-between items-center gap-4px" :class="[checked ? 'border-transparent' : 'border-gray-300', active ? 'border-app-blue ring-2 ring-app-blue' : '']">
            <span class="flex items-center">
              <RadioGroupLabel as="span" class="font-medium text-gray-900 flex items-center">
                <TokenImage :src="listing.image" />
                <TokenImage v-if="listing.secondaryImage" :src="listing.secondaryImage" ml="-12px" />
              </RadioGroupLabel>
            </span>
            <RadioGroupDescription as="span" class="text-sm ">
              <span class="font-medium text-gray-900 text-sm whitespace-nowrap">{{ listing.name }}</span>
            </RadioGroupDescription>
            <span class="pointer-events-none absolute -inset-px rounded-lg" :class="[active ? 'border' : 'border-2', checked ? 'border-app-blue' : 'border-transparent']" aria-hidden="true" />
          </div>
        </RadioGroupOption>
      </div>
    </RadioGroup>

    <div class="w-full overflow-x-auto  md:mx-0 mt-48px">
      <div class="inline-block min-w-full py-2 align-middle px-2px">
        <div v-for="network in selectedListing.networks" :key="network.general.chainId">
          <h2 v-if="network.general.chainId !== CALLISTO_CHAIN_ID.Mainnet" app-h2 mb-32px lg:text-center>
            {{ network.general.officialName }}
          </h2>
          <TableAssets :chain="network" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
img {
  height: 28px;
}
</style>
