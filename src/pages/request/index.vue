<script lang="ts" setup>
import { CALLISTO_CHAIN_CONSTANTS, CALLISTO_CHAIN_ID } from '@callisto-enterprise/chain-constants'
import { RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import type { CallistoAssetChainId } from '@callisto-enterprise/assetslist'
import { CallistoTokenList } from '@callisto-enterprise/assetslist'
import SecurityAuditRequired from './SecurityAuditRequired.vue'
import useLoginModal from '~/composables/useLoginModal'
import usePriceFeed from '~/composables/usePriceFeed'
import useWallet from '~/composables/useWallet'
import type { FormRequest } from '~/models/FormRequest'
import type { OptionItem } from '~/models/OptionItem'
import useNotifications from '~/composables/useNotifications'
import { createBase64Image, isFormValid } from '~/utils/utils'

const { addressValidator, minLengthValidator, emailValidator, maxLengthValidator } = useValidators()
const { isLogged, userAddress } = useWallet()
const { connect } = useLoginModal()
const { soyPrice } = usePriceFeed()
const { toastError, toastSuccess, toastPending, dismissNotification } = useNotifications()
const {
  request,
  selectedRequestType,
  isChainCallisto,
  finalPrice,
  sendTx,
} = useRequest()

onMounted(() => {
  if (!isLogged.value)
    connect()
})

const requestTypes = computed(() => [
  { name: 'Token Asset', price: LISTING_PRICE, soy: soyPrice.value ? (LISTING_PRICE / soyPrice.value).toFixed(0) : '---' },
])

const auditOptions = computed(() => [
  { name: 'Token Audit', price: AUDIT_PRICE, value: SecurityAudit.Audit, soy: soyPrice.value ? (AUDIT_PRICE / soyPrice.value).toFixed(0) : '---', description: 'The audit includes the Token Smart Contract audit, which is also required to list the token on Soy.Finance and Soy Bridge' },
  { name: 'Already have Audit', price: 0, value: SecurityAudit.Audited, soy: '0', description: 'If you have already performed an Audit, you will be prompted to provide us with the URL of the Security Audit.' },
  { name: 'Don\'t need Audit', price: 0, value: SecurityAudit.NoAudit, soy: '0', description: 'If you don\'t want an Audit, the Token can only be listed on the Callisto HUB. This option is strongly discouraged' },
])

watch(requestTypes, () => selectedRequestType.value = requestTypes.value[0], { immediate: true })

const chainOptions = computed(() => [CALLISTO_CHAIN_ID.Mainnet, CALLISTO_CHAIN_ID.ETC, CALLISTO_CHAIN_ID.BTT, CALLISTO_CHAIN_ID.ETH, CALLISTO_CHAIN_ID.BSC].map<OptionItem>(id => ({
  label: CALLISTO_CHAIN_CONSTANTS[id].general.chainName,
  value: CALLISTO_CHAIN_CONSTANTS[id].general.chainId,
  image: CALLISTO_CHAIN_CONSTANTS[id].general.image,
})))

// const farmTokenOptions = computed(() => ['clo', 'soy', 'busdt'].map<OptionItem>(symbol => ({
//   label: symbol.toUpperCase(),
//   value: symbol.toUpperCase(),
//   image: `https://asset.callisto.network/images/coins/${symbol}.png`,
// })))

// const farmDurationOptions = computed(() => Array(12).fill(0).map((_, i) => ({
//   label: `${i + 1} month${i > 0 ? 's' : ''}`,
//   value: i + 1,
// })))

const fieldName = ref()
const fieldSymbol = ref()
const fieldAddress = ref()
const fieldChain = ref()
const fieldAbout = ref()
const fieldWebsite = ref()
const fieldEmail = ref()
const fieldFarmToken = ref()
const fieldFarmDuration = ref()
const fieldFarmMultiplier = ref()
const fieldAuditUrl = ref()
const fieldIcon = ref<HTMLInputElement>()

const onFileSelected = async (event: any) => {
  const files: any[] = event.target.files || event.dataTransfer.files
  if (!files.length)
    return
  // convert icon to base64
  request.value.icon = await createBase64Image(files[0])
}

const sendRequest = async () => {
  let fields = [fieldName, fieldSymbol, fieldAddress, fieldChain, fieldAbout, fieldWebsite, fieldEmail]

  if (request.value.createFarm)
    fields = [...fields, fieldFarmToken, fieldFarmDuration, fieldFarmMultiplier]

  if (request.value.securityAudit === SecurityAudit.Audited)
    fields = [...fields, fieldAuditUrl]

  if (!isFormValid(fields))
    return

  // check existed address
  if (CallistoTokenList[request.value.chainId as CallistoAssetChainId].map(a => a.address).includes(request.value.address)) {
    toastError({ heading: 'Form is not valid', content: 'This address is already listed' })
    return
  }

  const url = '/.netlify/functions/send-request'

  // Test server validation
  let toastId = toastPending({
    heading: 'Preparing your request',
    content: 'Validating the data...',
  })
  const { data: validationData, statusCode: validationStatus } = await useFetch(url).post({ ...request.value, vlidationOnly: true } as FormRequest).json()
  if (validationStatus.value !== 200) {
    if (validationData.value.error)
      toastError({ heading: 'Form is not valid', content: validationData.value.error, replaceID: toastId })
    else toastError({ heading: 'Form is not valid', content: 'Unhandled exception', replaceID: toastId })
    return
  }

  dismissNotification(toastId)

  // Proceed payment
  const txReceipt = await sendTx()
  if (!txReceipt)
    return

  request.value.payment = {
    destination: import.meta.env.VITE_SOY_MULTISIG,
    price: finalPrice.value,
    soyPrice: soyPrice.value,
    txHash: txReceipt.transactionHash,
  }

  // Sent request
  toastId = toastPending({
    heading: 'Sending your request',
    content: 'Please be patient...',
  })

  const { data, statusCode } = await useFetch(url).post(request.value).json()
  if (statusCode.value === 200) {
    toastSuccess({ heading: 'Success!', content: 'Your request has been sent. We will contact you within 14 days.', replaceID: toastId })
  }
  else {
    if (data.value.error)
      toastError({ heading: 'Request Failed', content: data.value.error, replaceID: toastId })
    else toastError({ heading: 'Request Failed', content: 'The request failed. Please copy the transcript of the form and contact support with the data', replaceID: toastId })
  }
}
</script>

<template>
  <ModalWrongNetwork />
  <div>
    <div flex flex-col items-center>
      <h1 app-h1>
        Send us request to list new Asset
      </h1>

      <RadioGroup v-model="selectedRequestType" mt="48px">
        <div mt-4 grid grid-cols-1 gap-y-6 sm:gap-x-4>
          <RadioGroupOption v-for="option in requestTypes" :key="option.name" v-slot="{ checked, active }" as="template" :value="option">
            <div class="relative block cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between" :class="[checked ? 'border-transparent' : 'border-gray-300', active ? 'border-app-blue ring-2 ring-app-blue' : '']">
              <span class="flex items-center">
                <span class="flex flex-col text-sm">
                  <RadioGroupLabel as="span" class="font-medium text-gray-900">{{ option.name }}</RadioGroupLabel>
                </span>
              </span>
              <RadioGroupDescription as="span" class="mt-2 flex text-sm sm:mt-0 sm:ml-4 sm:flex-col sm:text-right">
                <span class="font-medium text-gray-900">From ${{ option.price }}</span>
                <span class="ml-1 text-gray-500 sm:ml-0">{{ option.soy }} SOY</span>
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
            required :validators="[minLengthValidator(2), maxLengthValidator(8)]"
          />
        </div>

        <div grid grid-cols-1 sm:grid-cols-3 gap-4>
          <BaseSelect ref="fieldChain" v-model:value="request.chainId" col-span-1 label="Chain" w-full :options="chainOptions" required />
          <BaseInput
            ref="fieldAddress"
            v-model:value="request.address" col-span-1
            sm:col-span-2 type="text" w-full label="Contract address" required :validators="[addressValidator()]"
          />
        </div>

        <div class="sm:col-span-6">
          <label for="cover-photo" class="block text-sm font-medium text-gray-700">Token icon *</label>
          <div
            class="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6" @dragover.prevent
            @drop.prevent="onFileSelected"
          >
            <div v-if="request.icon" flex flex-col items-center gap-12px>
              <img w-64px h-64px :src="request.icon">
              <span text-sm text-gray-600 cursor-pointer @click="request.icon = ''">Remove icon</span>
            </div>
            <div v-else class="space-y-1 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="flex text-sm text-gray-600">
                <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-medium text-app-blue focus-within:outline-none focus-within:ring-2 focus-within:ring-app-blue focus-within:ring-offset-2 hover:text-app-blue">
                  <span>Upload an icon</span>
                  <input id="file-upload" ref="fieldIcon" name="file-upload" type="file" class="sr-only" @change="onFileSelected">
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
            Additional services & Platforms
          </div>
          <div text-sm text-gray-500>
            We use assets on a variety of platforms, please let us know what your priority is.
          </div>
        </div>

        <div>
          <div font-medium text-base>
            Security Audit
          </div>
          <div pt-16px space-y-5>
            <div v-for="option in auditOptions" :key="option.value" class="relative flex items-start" @click="request.securityAudit = option.value">
              <div class="flex h-5 items-center">
                <input :id="option.value" :aria-describedby="`${option.value}-description`" name="plan" type="radio" :checked="option.value === request.securityAudit" class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500">
              </div>
              <div class="ml-3 text-sm">
                <label :for="option.value" class="font-medium text-gray-700" cursor-pointer>{{ option.name }} (+ ${{ option.price }})</label>
                <p :id="`${option.value}-description`" cursor-pointer class="text-gray-500">
                  {{ option.description }}
                </p>
              </div>
            </div>
            <BaseInput v-if="request.securityAudit === SecurityAudit.Audited" ref="fieldAuditUrl" v-model:value="request.securityAuditUrl" type="text" label="Security Audit Report URL" placeholder="Provide Us Your Audit Report" w-360px required />
          </div>
          <!-- <div pt-16px space-y-5>
            <RadioGroup v-model="request.securityAudit">
              <div grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-y-6 sm:gap-x-4>
                <RadioGroupOption v-for="option in auditOptions" :key="option.name" v-slot="{ checked, active }" as="template" :value="option.value">
                  <div class="relative block cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between" :class="[checked ? 'border-transparent' : 'border-gray-300', active ? 'border-app-blue ring-2 ring-app-blue' : '']">
                    <span class="flex items-center">
                      <span class="flex flex-col text-sm">
                        <RadioGroupLabel as="span" class="font-medium text-gray-900">{{ option.name }}</RadioGroupLabel>
                      </span>
                    </span>
                    <RadioGroupDescription as="span" class="mt-2 flex text-sm sm:mt-0 sm:ml-4 sm:flex-col sm:text-right">
                      <span class="font-medium text-gray-900">+ ${{ option.price }}</span>
                      <span class="ml-1 text-gray-500 sm:ml-0">{{ option.soy }} SOY</span>
                    </RadioGroupDescription>
                    <span class="pointer-events-none absolute -inset-px rounded-lg" :class="[active ? 'border' : 'border-2', checked ? 'border-app-blue' : 'border-transparent']" aria-hidden="true" />
                  </div>
                </RadioGroupOption>
              </div>
            </RadioGroup>
            <div v-if="request.securityAudit === SecurityAudit.Audited" flex>
              <BaseInput ref="fieldAuditUrl" v-model:value="request.securityAuditUrl" type="text" label="Security Audit Report URL" placeholder="Provide Us Your Audit Report" w-360px required />
            </div>
          </div> -->
        </div>

        <!-- <div>
          <div font-medium text-base>
            Farm on Soy.Finance
          </div>
          <div pt-16px>
            <SecurityAuditRequired>
              <BaseCheckbox v-model:value="request.createFarm" label="Create farm on SOY.Finance (+ $250)" description="We will create a farm for you, you can specify the pair token" />
              <div v-if="request.createFarm" flex gap-16px ml-22px mt-5>
                <BaseSelect ref="fieldFarmToken" v-model:value="request.farmToken" w-160px label="Farm pair token" :options="farmTokenOptions" required />
                <BaseSelect ref="fieldFarmDuration" v-model:value="request.farmDuration" w-160px label="Farm Duration" :options="farmDurationOptions" required />
                <BaseInput ref="fieldFarmMultiplier" v-model:value="request.farmMultiplier" w-160px type="number" label="Farm Multiplier" placeholder="Multiplier 1" required />
              </div>
            </SecurityAuditRequired>
          </div>
        </div> -->

        <div>
          <div font-medium text-base>
            Platforms visibility
          </div>
          <div class="space-y-5" pt-16px>
            <BaseCheckbox v-if="isChainCallisto" v-model:value="request.includeHub" label="Callisto HUB (beta)" description="https://hub.callisto.network" />
            <SecurityAuditRequired>
              <BaseCheckbox v-model:value="request.includeBridge" label="Bridge (required wrapped version of the token)" description="https://bridge.callisto.network" />
            </SecurityAuditRequired>
            <SecurityAuditRequired>
              <BaseCheckbox v-model:value="request.includeSoy" label="SOY finance" description="https://soy.finance" />
            </SecurityAuditRequired>
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
