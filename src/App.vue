<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Callisto Listing',
  meta: [
    { name: 'description', content: 'CE listing microsite' },
    {
      name: 'theme-color',
      content: computed(() => '#ffffff'),
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: computed(() => '/favicon.png'),
    },
  ],
})
</script>

<template>
  <RouterView />
</template>
