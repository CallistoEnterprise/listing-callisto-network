<script setup lang="ts">
const props = defineProps<{
  value: Boolean
  label?: string
  description?: string
}>()

const emits = defineEmits(['update:value'])
</script>

<template>
  <div>
    <div flex items-start gap-6px cursor-pointer @click="emits('update:value', !props.value)">
      <div
        w-16px h-16px border-zc-greyStroke border-1px mt-2px flex-shrink-0 rounded-sm
        :class="{ 'bg-app-blue border-2px! border-white! outline outline-gray-300 outline-1!': props.value }"
      />
      <div>
        <div v-if="label" text-sm font-medium text-gray-700>
          {{ label }}
        </div>
        <div text-xs text-gray-500>
          {{ description }}
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>
