<script lang="ts" setup>
const { isSoyDisabled } = useRequest()
</script>

<template>
  <div flex flex-wrap gap-16px>
    <div :class="{ 'opacity-50': isSoyDisabled }">
      <slot />
    </div>
    <p v-if="isSoyDisabled" text-red>
      This option is disabled due Security Audit
    </p>
  </div>
</template>
