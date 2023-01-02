<script setup lang="ts">
import type BaseValidator from '~/models/BaseValidator'

interface Props {
  label?: string
  labelHint?: string
  value?: string
  placeholder?: string
  required?: boolean
  validators?: BaseValidator[]
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  rows: 5,
})
const emits = defineEmits(['update:value'])

const isValid = ref(true)
const errMessage = ref('')

const modelValue = computed({
  get: (): string => props.value ?? props.placeholder ?? '',
  set: (val: string) => emits('update:value', val),
})

// check validators
const validate = () => {
  if (props.required && ([undefined, null, '', ' '].includes(modelValue.value))) {
    isValid.value = false
    errMessage.value = 'This field is required'
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

const stopWatch = watch(modelValue, () => {
  validate()
})

onUnmounted(stopWatch)

defineExpose({ validate, isValid })
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
      flex items-center rounded-md shadow-sm bg-white border-gray-300 border-1px mt-4px
      :class="{ 'focus:ring-red-500! focus:border-red-500! focus:outline-none! border-red-300 text-red-900': errMessage }"
    >
      <textarea
        v-model="modelValue" sm:text-sm rounded-md flex-grow self-stretch p-8px
        :rows="rows" :class="{ 'rounded-r-0': !!$slots.suffix || errMessage, 'rounded-l-0': !!$slots.prefix }"
        border-white :placeholder="placeholder"
      />
    </div>
    <p v-if="errMessage" mt-4px text-sm text-red-600>
      {{ errMessage }}
    </p>
    <p v-if="!!$slots.hint && !errMessage" mt-4px text-sm text-gray-500>
      <slot name="hint" />
    </p>
  </div>
</template>
