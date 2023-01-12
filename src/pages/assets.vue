<script lang="ts" setup>
import { RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import { AssetType, TOKENLIST } from '@callisto-enterprise/assetslist'
import metamaskImage from '~/assets/metamask.svg'

const listingTypes = [
  { name: 'Mainnet Listing', assets: TOKENLIST[820], explorer: 'https://explorer.callisto.network', image: 'https://asset.callisto.network/images/chains/820.png' },
  // { name: 'Testnet Listing', assets: TOKENLIST[20729], explorer: 'https://testnet-explorer.callisto.network', image: 'https://asset.callisto.network/images/chains/20729.png' },
  { name: 'Other chains', assets: [], image: 'https://asset.callisto.network/images/chains/61.png', secondaryImage: 'https://asset.callisto.network/images/chains/199.png' },
]

const selectedChain = ref(listingTypes[0])
const { addToken } = useWallet()
</script>

<template>
  <div flex-col sm:flex sm:items-center>
    <h1 app-h1>
      Listed Assets
    </h1>
    <RadioGroup v-model="selectedChain" mt="48px">
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
        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Name
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Address
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Platforms
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="asset in selectedChain.assets.filter((a) => a.category !== AssetType.NATIVE)" :key="asset.address">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                      <TokenImage :src="asset.image" />
                    </div>
                    <div class="ml-4">
                      <div class="font-medium text-gray-900">
                        {{ asset.name }}
                      </div>
                      <div class="text-gray-500">
                        <a v-if="asset.projectUrl" target="_blank" :href="asset.projectUrl">{{ asset.projectUrl }}</a>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div class="text-gray-900">
                    <a target="_blank" underline :href="`${selectedChain.explorer}/address/${asset.address}`">{{ asset.address }}
                    </a>
                  </div>
                  <div cursor-pointer class="text-gray-500" flex items-center gap-8px @click="addToken(asset)">
                    <img v-if="asset.address" :src="metamaskImage" alt="metamask" w-16px>
                    {{ asset.symbol }}
                  </div>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <a v-if="asset.audit.isAudited && asset.audit.reportUrl" target="_blank" :href="asset.audit.reportUrl" class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">Audited: {{ asset.audit.riskLevel }}</a>
                  <a v-if="asset.audit.isAudited && !asset.audit.reportUrl" target="_blank" :href="asset.audit.reportUrl" class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">Audited</a>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ asset.platforms?.join(', ') ?? '---' }}
                </td>
              </tr>
            </tbody>
          </table>
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
