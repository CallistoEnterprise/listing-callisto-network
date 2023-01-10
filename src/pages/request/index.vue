<script lang="ts" setup>
import { CALLISTO_CHAIN_CONSTANTS, CALLISTO_CHAIN_ID } from '@callisto-enterprise/chain-constants'
import { RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import { Contract, ethers } from 'ethers'
import useLoginModal from '~/composables/useLoginModal'
import usePriceFeed from '~/composables/usePriceFeed'
import useWallet from '~/composables/useWallet'
import type { FormRequest } from '~/models/FormRequest'
import type { OptionItem } from '~/models/OptionItem'
import erc20Abi from '~/contracts/abi/erc20.json'
import useTransactions from '~/composables/web3/useTransactions'
import useNotifications from '~/composables/useNotifications'
import { isFormValid } from '~/utils/utils'

const { addressValidator, minLengthValidator, emailValidator } = useValidators()
const { isLogged, userAddress, signer } = useWallet()
const { connect } = useLoginModal()
const { soyPrice } = usePriceFeed()
const { sendTransaction } = useTransactions()
const { toastSuccessTx, toastError, toastSuccess } = useNotifications()

const requestTypes = computed(() => [
  { name: 'Token Asset', price: 1000, soy: soyPrice.value ? (1000 / soyPrice.value).toFixed(0) : '---' },
])

const selectedRequestType = ref()
watch(requestTypes, () => selectedRequestType.value = requestTypes.value[0], { immediate: true })

const mainnet = CALLISTO_CHAIN_CONSTANTS[CALLISTO_CHAIN_ID.Mainnet]
const etc = CALLISTO_CHAIN_CONSTANTS[CALLISTO_CHAIN_ID.ETC]
const btt = CALLISTO_CHAIN_CONSTANTS[CALLISTO_CHAIN_ID.BTT]

const chainOptions: Array<OptionItem> = [
  {
    label: mainnet.general.chainName,
    value: mainnet.general.chainId,
    image: mainnet.general.image,
  },
  {
    label: etc.general.chainName,
    value: etc.general.chainId,
    image: etc.general.image,
  },
  {
    label: btt.general.chainName,
    value: btt.general.chainId,
    image: btt.general.image,
  },
]

const farmTokenOptions: Array<OptionItem> = [
  {
    label: 'CLO',
    value: 'CLO',
    image: 'https://asset.callisto.network/images/coins/clo.png',
  },
  {
    label: 'SOY',
    value: 'SOY',
    image: 'https://asset.callisto.network/images/coins/soy.png',
  },
  {
    label: 'BUSDT',
    value: 'BUSDT',
    image: 'https://asset.callisto.network/images/coins/busdt.png',
  },
]

const fieldName = ref()
const fieldSymbol = ref()
const fieldAddress = ref()
const fieldChain = ref()
const fieldAbout = ref()
const fieldWebsite = ref()
const fieldEmail = ref()

const request = ref({} as FormRequest)

const isChainCallisto = computed(() => request.value.chainId === CALLISTO_CHAIN_ID.Mainnet)

const finalPrice = computed(() => ((2000 + (request.value.createFarm ? 250 : 0)) / soyPrice.value).toFixed(0))

const sendTx = async () => {
  const contract = new Contract(import.meta.env.VITE_SOY_ADDR, erc20Abi, signer.value!)
  const amount = finalPrice.value

  const receipt = await sendTransaction(contract.transfer(import.meta.env.VITE_SOY_MULTISIG, ethers.utils.parseUnits(`${amount}`, 18)), 'Preparing payment...')
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

const sendRequest = async () => {
  if (!isFormValid([
    fieldName, fieldSymbol, fieldAddress, fieldChain, fieldAbout, fieldWebsite, fieldEmail,
  ]))
    return

  // const txReceipt = await sendTx()
  // if (!txReceipt)
  //   return

  const url = '/.netlify/functions/send-request'
  request.value.payment = {
    destination: import.meta.env.VITE_SOY_MULTISIG,
    price: finalPrice.value,
    soyPrice: soyPrice.value,
    txHash: '',
    // txHash: txReceipt.transactionHash,
  }
  const { data, statusCode } = await useFetch(url).post(request.value).json()
  if (statusCode.value === 200) {
    toastSuccess({ heading: 'Success!', content: 'Your request has been sent. We will contact you in 14 days.' })
  }
  else {
    if (data.value.error)
      toastError({ heading: 'Request Failed', content: data.value.error })
    else toastError({ heading: 'Request Failed', content: 'The request failed. Please copy the transcript of the form and contact support with the data' })
  }
}
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
            ref="fieldName"
            v-model:value="request.name" col-span-1
            sm:col-span-2 type="text" w-full label="Name of the Token" required
          />
          <BaseInput
            ref="fieldSymbol"
            v-model:value="request.symbol" col-span-1
            type="text" w-full label="Symbol of the token"
            required :validators="[minLengthValidator(2)]"
          />
        </div>

        <div grid grid-cols-1 sm:grid-cols-3 gap-4>
          <BaseInput
            ref="fieldAddress"
            v-model:value="request.address" col-span-1
            sm:col-span-2 type="text" w-full label="Contract address" required :validators="[addressValidator()]"
          />
          <BaseSelect ref="fieldChain" v-model:value="request.chainId" col-span-1 label="Chain" w-full :options="chainOptions" required />
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
          <BaseTextarea ref="fieldAbout" v-model:value="request.about" label="About" type="text" required :validators="[minLengthValidator(120, request.about?.length)]" />
          <p class="mt-2 text-sm text-gray-500">
            Write a few sentences about yourself, your project, your additional requirements, etc
          </p>
        </div>

        <BaseInput ref="fieldWebsite" v-model:value="request.website" type="text" label="Project website" placeholder="www.example.com" w-full required>
          <template #prefix>
            https://
          </template>
        </BaseInput>

        <BaseInput ref="fieldEmail" v-model:value="request.email" type="email" label="Email address" placeholder="john@doe.co" w-full required :validators="[emailValidator()]" />

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
            We use assets on a variety of platforms, please let us know what your priority is.
          </div>
        </div>

        <div>
          <div font-medium text-base>
            By platforms
          </div>
          <div class="space-y-5" pt-16px>
            <BaseCheckbox v-if="isChainCallisto" v-model:value="request.includeHub" label="Callisto HUB (beta)" description="https://hub.callisto.network" />
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
            <BaseCheckbox v-model:value="request.createFarm" label="Create farm on SOY.Finance (+ $250)" description="We will create a farm for you, you can specify the pair token" />
            <div v-if="request.createFarm" flex ml-22px>
              <BaseSelect v-model:value="request.farmToken" w-160px label="Farm pair token" :options="farmTokenOptions" required />
            </div>
            <div flex />
          </div>
        </div>
      </div>
      <div flex flex-col sm:flex-row items-center justify-between gap-4 pt="24px">
        <div flex flex-col sm:flex-row items-center gap-4px>
          <template v-if="isLogged">
            <span text-gray-400 text-sm>Your address:</span>
            <span text-black text-sm>{{ userAddress }}</span>
          </template>
        </div>
        <button v-if="isLogged" type="button" w-auto app-btn @click="sendRequest()">
          Pay {{ finalPrice }} SOY and Send Request
        </button>
        <button v-else app-btn w-auto type="button" @click="connect()">
          Connect wallet
        </button>
      </div>
    </div>
  </div>
</template>
