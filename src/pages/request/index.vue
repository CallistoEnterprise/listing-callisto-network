<script lang="ts" setup>
import { RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import type { FormRequest } from '~/models/FormRequest'
import type { OptionItem } from '~/models/OptionItem'

const requestTypes = [
  { name: 'Token Asset', price: 1000, soy: '104,189' },
]

const selectedRequestType = ref(requestTypes[0])

const chainOptions: Array<OptionItem> = [
  {
    label: 'Callisto Mainnet',
    value: 820,
    image: 'https://asset.callisto.network/images/chains/820.png',
  },
  {
    label: 'Callisto Testnet',
    value: 20729,
    image: 'https://asset.callisto.network/images/chains/20729.png',
  },
]
const request = ref({} as FormRequest)
</script>

<template>
  <div>
    <div flex flex-col items-center>
      <h1 app-h1>
        Send us request to list new Asset
      </h1>

      <RadioGroup v-model="selectedRequestType" mt="48px">
        <div mt-4 grid grid-cols-1 gap-y-6 sm:gap-x-4>
          <RadioGroupOption v-for="assetType in requestTypes" :key="assetType.name" v-slot="{ checked, active }" as="template" :value="assetType">
            <div class="relative block cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between" :class="[checked ? 'border-transparent' : 'border-gray-300', active ? 'border-app-blue ring-2 ring-app-blue' : '']">
              <span class="flex items-center">
                <span class="flex flex-col text-sm">
                  <RadioGroupLabel as="span" class="font-medium text-gray-900">{{ assetType.name }}</RadioGroupLabel>
                </span>
              </span>
              <RadioGroupDescription as="span" class="mt-2 flex text-sm sm:mt-0 sm:ml-4 sm:flex-col sm:text-right">
                <span class="font-medium text-gray-900">From ${{ assetType.price }}</span>
                <span class="ml-1 text-gray-500 sm:ml-0">{{ assetType.soy }} SOY</span>
              </RadioGroupDescription>
              <span class="pointer-events-none absolute -inset-px rounded-lg" :class="[active ? 'border' : 'border-2', checked ? 'border-app-blue' : 'border-transparent']" aria-hidden="true" />
            </div>
          </RadioGroupOption>
        </div>
      </RadioGroup>
    </div>

    <div space-y-8 divide-y divide-gray-200 mt="48px">
      <div space-y-6 sm:space-y-5>
        <div>
          <div font-medium text-lg text-gray-900>
            Asset
          </div>
          <div text-sm text-gray-500>
            This information will be displayed publicly so be careful what you share.
          </div>
        </div>
        <div grid grid-cols-1 sm:grid-cols-3 gap-4>
          <BaseInput
            v-model:value="request.name" col-span-1
            sm:col-span-2 type="text" w-full label="Name of the Token"
          />
          <BaseInput
            v-model:value="request.symbol" col-span-1
            type="text" w-full label="Abbreviation of the token"
          />
        </div>

        <div grid grid-cols-1 sm:grid-cols-3 gap-4>
          <BaseInput
            v-model:value="request.address" col-span-1
            sm:col-span-2 type="text" w-full label="Contract address"
          />
          <BaseSelect v-model:value="request.chainId" col-span-1 label="Chain" w-full :options="chainOptions" required />
        </div>

        <div class="sm:col-span-6">
          <label for="cover-photo" class="block text-sm font-medium text-gray-700">Token icon</label>
          <div class="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
            <div class="space-y-1 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="flex text-sm text-gray-600">
                <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-medium text-app-blue focus-within:outline-none focus-within:ring-2 focus-within:ring-app-blue focus-within:ring-offset-2 hover:text-app-blue">
                  <span>Upload an icon</span>
                  <input id="file-upload" name="file-upload" type="file" class="sr-only">
                </label>
                <p class="pl-1">
                  or drag and drop
                </p>
              </div>
              <p class="text-xs text-gray-500">
                64x64 | PNG | up to 1MB
              </p>
            </div>
          </div>
        </div>
      </div>
      <div space-y-6 sm:space-y-5 pt="24px">
        <div>
          <div font-medium text-lg text-gray-900>
            Project information
          </div>
          <div text-sm text-gray-500>
            Tell us more about your project
          </div>
        </div>

        <div>
          <BaseTextarea v-model:value="request.about" label="About" type="text" required />
          <p class="mt-2 text-sm text-gray-500">
            Write a few sentences about yourself.
          </p>
        </div>

        <BaseInput v-model:value="request.website" type="text" label="Project website" placeholder="www.example.com" w-full required>
          <template #prefix>
            https://
          </template>
        </BaseInput>

        <BaseInput v-model:value="request.email" type="email" label="Email address" placeholder="john@doe.co" w-full required />

        <div grid grid-cols-1 sm:grid-cols-2 gap-4>
          <BaseInput
            v-model:value="request.telegram" col-span-1 type="text" w-full label="Telegram username (optional)" placeholder="John Doe"
          >
            <template #prefix>
              @
            </template>
          </BaseInput>

          <BaseInput
            v-model:value="request.discord" col-span-1
            type="text" w-full label="Discord username (optional)"
            placeholder="John Doe#1111"
          >
            <template #prefix>
              @
            </template>
          </BaseInput>
        </div>
      </div>
      <div space-y-6 sm:space-y-5 pt="24px">
        <div>
          <div font-medium text-lg text-gray-900>
            Where should be listed
          </div>
          <div text-sm text-gray-500>
            We use assets across multiple platforms, please let us know what is your priority to be there.
          </div>
        </div>

        <div>
          <div font-medium text-base>
            By platforms
          </div>
          <div class="space-y-5" pt-16px>
            <BaseCheckbox v-model:value="request.includeHub" label="Callisto HUB (beta)" description="https://hub.callisto.network" />
            <BaseCheckbox v-model:value="request.includeSoy" label="Callisto SOY finance" description="https://soy.finance" />
            <BaseCheckbox v-model:value="request.includeBridge" label="Bridge (required wrapped version ERC223 of the token)" description="https://bridge.callisto.network" />
          </div>
        </div>

        <div>
          <div font-medium text-base>
            Additional services
          </div>
          <div class="space-y-5" pt-16px>
            <BaseCheckbox :value="true" label="Security Audit (+ $1 000)" description="Security Audit is necessary in order to list your token" />
            <BaseCheckbox v-model:value="request.createFarm" label="Create farm on SOY.Finance (starting at $250)" description="The price is based on the multiplier" />
          </div>
        </div>
      </div>
      <div flex flex-col sm:flex-row items-center justify-between gap-4 pt="24px">
        <div flex flex-col sm:flex-row items-center gap-4px>
          <span text-gray-400 text-sm>Your address:</span>
          <span text-black text-sm>0x93950Cb12f909A0268A455CfafD9952F4923A2dc</span>
        </div>
        <button type="button" w-auto app-btn>
          Pay 208,387 SOY and Send Request
        </button>
      </div>
    </div>
  </div>
</template>
