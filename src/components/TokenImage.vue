<script lang="ts" setup>
const props = defineProps<{
  src: string
  size?: number
}>()

const wrapperStyle = computed(() => ({
  width: `${props.size ?? 36}px`,
  height: `${props.size ?? 36}px`,
}))

const imgStyle = computed(() => ({
  maxWidth: `${(props.size ?? 36) - 12}px`,
  maxHeight: `${(props.size ?? 36) - 12}px`,
}))
</script>

<template>
  <div flex gap-12px items-center>
    <div :style="wrapperStyle" bg-white p-8px border="1px gray-200" rounded-full flex items-center justify-center>
      <img :src="src" :style="imgStyle">
    </div>
    <slot />
  </div>
</template>
