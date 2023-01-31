<script lang="ts" setup>
const { isSoyDisabled } = useRequest()
</script>

<template>
  <div flex flex-col flex-wrap gap-8px>
    <div :class="{ 'opacity-50': isSoyDisabled }">
      <slot />
    </div>
    <p v-if="isSoyDisabled" text-red text-12px>
      This option is disabled due Security Audit
    </p>
  </div>
</template>
