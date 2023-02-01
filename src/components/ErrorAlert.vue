<script lang="ts" setup>
defineProps<{
  title: string
  errors: string[]
}>()
</script>

<template>
  <div class="rounded-md bg-red-50 p-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <div i-heroicons-outline-exclamation class="h-6 w-6 text-red-500" aria-hidden="true" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800">
          {{ title }}
        </h3>
        <div class="mt-2 text-sm text-red-700">
          <ul role="list" class="list-disc space-y-1 pl-5">
            <li v-for="err in errors" :key="err" v-html="err" />
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
