<script lang="ts" setup>
import { NotificationVariant } from '~/composables/useNotifications'
import type { NotificationLink } from '~/composables/useNotifications'

defineProps<{
  heading?: string
  content?: string
  actions?: NotificationLink[]
  permanent?: boolean
  variant: NotificationVariant
}>()

const emits = defineEmits(['close-toast'])
</script>

<template>
  <div>
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <div v-if="variant === NotificationVariant.Success" i-heroicons-outline-check-circle class="h-6 w-6 text-app-blue" aria-hidden="true" />
        <div v-else-if="variant === NotificationVariant.Pending" i-eos-icons-loading class="h-6 w-6 text-orange" aria-hidden="true" />
        <div v-else-if="variant === NotificationVariant.Warning" i-heroicons-solid-exclamation-triangle class="h-6 w-6 text-orange" aria-hidden="true" />
        <div v-else-if="variant === NotificationVariant.Error" i-heroicons-solid-exclamation-triangle class="h-6 w-6 text-red" aria-hidden="true" />
        <div v-else i-heroicons-outline-information-circle class="h-6 w-6 text-app-blue" aria-hidden="true" />
      </div>
      <div class="ml-3 w-0 flex-1 pt-0.5">
        <p class="text-sm font-medium text-gray-900">
          {{ heading }}
        </p>
        <p v-if="content" class="mt-1 text-sm text-gray-500" v-html="content" />
        <div class="mt-3 flex space-x-7">
          <a v-for="a in (actions ?? [])" :key="a.url" :href="a.url" target="_blank" app-text-btn text-orange :class="{ 'text-app-blue!': variant === NotificationVariant.Success }">
            {{ a.label }}
          </a>
        </div>
      </div>
      <div v-if="!permanent" class="ml-4 flex flex-shrink-0">
        <button type="button" class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" @click="emits('close-toast')">
          <span class="sr-only">Close</span>
          <div i-heroicons-solid-x class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>
