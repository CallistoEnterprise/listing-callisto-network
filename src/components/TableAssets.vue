<script lang="ts" setup>
import type { ChainConstants } from '@callisto-enterprise/chain-constants/dist/types'
import type { CallistoAsset } from '@callisto-enterprise/assetslist'
import { CallistoAssetChainId, CallistoAssetType, CallistoTokenList } from '@callisto-enterprise/assetslist'
import metamaskImage from '~/assets/metamask.svg'

defineProps<{
  chain: ChainConstants
}>()

const { addToken } = useWallet()

const getPlatforms = (asset: CallistoAsset) => (asset.platforms?.map((p) => {
  if (p === 'hub')
    return '<a target="_blank" href="https://hub.callisto.network/">Hub</a>'
  if (p === 'soy')
    return '<a target="_blank" href="https://bridge.soy.finance/">Soy</a>'
  if (p === 'bridge')
    return '<a target="_blank" href="https://bridge.callisto.network/">Bridge</a>'

  return p
}).join(', ') ?? '---')
</script>

<template>
  <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg" mb-56px>
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
        <tr v-for="asset in CallistoTokenList[chain.general.chainId as CallistoAssetChainId].filter((a) => a.category !== CallistoAssetType.NATIVE)" :key="asset.address">
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
              <a target="_blank" underline :href="`${chain.explorer.url}/address/${asset.address}`">{{ asset.address }}
              </a>
            </div>
            <div cursor-pointer class="text-gray-500" flex items-center gap-8px @click="addToken(asset, chain)">
              <img v-if="asset.address" :src="metamaskImage" alt="metamask" w-16px>
              {{ asset.symbol }}
            </div>
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            <div flex flex-col gap-8px items-start>
              <div v-if="asset.audit.isAudited" class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                Audited{{ asset.audit?.riskLevel ? `: ${asset.audit?.riskLevel}` : '' }}
              </div>
              <a v-if="asset.audit.reportUrl" hover:underline flex ml-6px gap-2px text-gray text-xs target="_blank" :href="asset.audit.reportUrl">Open Report <div i-heroicons-outline-arrow-top-right-on-square /></a>
            </div>
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500" v-html="getPlatforms(asset)" />
        </tr>
      </tbody>
    </table>
  </div>
</template>
