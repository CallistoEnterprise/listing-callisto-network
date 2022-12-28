<script setup lang="ts">
import Popper from 'vue3-popper'
import type BaseValidator from '~/models/BaseValidator'

interface Props {
  type: string
  label?: string
  labelHint?: string
  value?: any
  placeholder?: string
  required?: boolean
  validators?: BaseValidator[]
  disabled?: boolean
  showSuffixOnError?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
})
const emits = defineEmits(['update:value'])

const isValid = ref(true)
const errMessage = ref('')

const modelValue = computed({
  get: (): string => props.value ?? '',
  set: (val: string) => emits('update:value', (typeof val === 'string') ? val.trim() : val),
})

// check validators
const validate = () => {
  if (props.required && ([undefined, null, '', ' '].includes(modelValue.value))) {
    isValid.value = false
    errMessage.value = 'form.validator.required'
    return
  }

  if (props.validators && modelValue.value) {
    for (const v of props.validators) {
      if (!v.validator(modelValue.value)) {
        isValid.value = false
        errMessage.value = v.message
        return
      }
    }
  }

  isValid.value = true
  errMessage.value = ''
}

const clearError = () => {
  isValid.value = true
  errMessage.value = ''
}

const stopWatch = watch(modelValue, validate)
onUnmounted(stopWatch)

defineExpose({ validate, isValid, clearError })
</script>

<template>
  <div>
    <div v-if="label || !!$slots.hint" text-gray-700 text-sm flex font-medium flex-wrap gap-8px justify-between items-end :class="{ 'text-red-500': errMessage }">
      <h2>
        {{ label }}
        <span v-if="required">*</span>
        <Popper v-if="labelHint" hover>
          <div i-heroicons-outline-information-circle text-18px />
          <template #content>
            <div app-hint v-html="labelHint" />
          </template>
        </Popper>
      </h2>
      <div v-if="!!$slots.hint" text-gray-700>
        <slot name="hint" />
      </div>
    </div>

    <div
      flex items-center rounded-md shadow-sm bg-white border-gray-300 border-1px mt-4px min-h-40px
      :class="{ 'focus:ring-red-500! focus:border-red-500! focus:outline-none! border-red-300 text-red-900': errMessage }"
    >
      <div v-if="!!$slots.prefix" px-10px text-gray-400 text-sm>
        <slot name="prefix" />
      </div>

      <input
        v-model="modelValue" :type="type" px-8px text-sm rounded-md w-full
        self-stretch :class="{ 'rounded-r-0': !!$slots.suffix || errMessage, 'rounded-l-0': !!$slots.prefix }"
        border-white :placeholder="placeholder" :disabled="disabled" :readonly="disabled"
      >

      <div v-if="!!$slots.suffix && (!errMessage || showSuffixOnError)" px-10px whitespace-nowrap>
        <slot name="suffix" />
      </div>
      <div v-if="errMessage" px-10px whitespace-nowrap>
        <div i-heroicons-solid-exclamation-circle text-red-500 text-20px />
      </div>
    </div>
    <p v-if="errMessage" mt-4px text-sm text-red-600>
      {{ errMessage }}
    </p>
  </div>
</template>

<style scoped>
.input {
  &[type="number"] {
    -moz-appearance: textfield;
  }

  &[type="number"]::-webkit-outer-spin-button,
  &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  &::placeholder {
    --at-apply: "text-16px md:18px";
  }
}
</style>
