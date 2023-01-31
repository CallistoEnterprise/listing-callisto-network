<script lang="ts" setup>
import Multiselect from '@vueform/multiselect'
import type { OptionItem } from '~/models/OptionItem'

interface Props {
  name?: string
  label?: string
  placeholder?: string
  value?: any
  required?: boolean
  options: OptionItem[]
  multiple?: boolean
  searchable?: boolean
  closeOnSelect?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '---',
  required: false,
  multiple: false,
  searchable: true,
  closeOnSelect: true,
})

const emits = defineEmits(['update:value'])

const isValid = ref(true)
const errMessage = ref('')

const modelValue = computed({
  get: () => props.value ?? (props.multiple ? [] : ''),
  set: val => emits('update:value', val),
})

const validate = () => {
  if (props.required && ([undefined, null, '', ' '].includes(modelValue.value))) {
    isValid.value = false
    errMessage.value = 'This field is required'
    return
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
    <label v-if="label" block text-sm font-medium text-gray-700 :class="{ 'text-red-500': errMessage }" mb-4px>
      {{ label }}{{ required ? ' *' : '' }}
    </label>

    <div min-h-38px flex>
      <Multiselect
        v-model="modelValue"
        :can-clear="!required"
        :can-deselect="false"
        :name="name" :placeholder="placeholder" :options="options"
        :mode="multiple ? 'tags' : 'single'" :searchable="searchable" :close-on-select="closeOnSelect"
      >
        <template #option="{ option }">
          <div flex items-center gap-12px>
            <img v-if="option.image" w-28px :src="option.image">
            <div v-if="option.icon" text-28px :class="option.icon" />
            <video v-if="option.video" w-28px :src="option.video" autoplay loop muted />
            <div flex flex-col>
              <span>{{ option.label }}</span>
              <span v-if="option.desc" text="xs">
                {{ option.desc }}
              </span>
            </div>
          </div>
        </template>
      </Multiselect>
    </div>
    <p v-if="errMessage" mt-4px text-sm text-red-600>
      {{ errMessage }}
    </p>
    <p v-if="!!$slots.hint && !errMessage" mt-4px text-sm text-gray-500>
      <slot name="hint" />
    </p>
  </div>
</template>

<style>
:root {
    --ms-max-height: 350px;
}
</style>
