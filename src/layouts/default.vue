<script setup>
import logo from '~/assets/logo.svg'

const navigation = [
  { name: 'Introduction', href: '/' },
  { name: 'Assets', href: '/assets' },
  { name: 'CDN', href: '/cdn' },
]
</script>

<template>
  <header class="bg-app-darkBlue">
    <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
      <div class="flex w-full items-center justify-between border-b border-app-darkBlue-800 lg:border-none">
        <div class="flex items-center">
          <RouterLink to="/" py-16px>
            <img class="h-10 w-auto" :src="logo" alt="Logo">
          </RouterLink>
          <div class="ml-10 hidden space-x-8 lg:block">
            <RouterLink v-for="item in navigation" :key="item.name" v-slot="{ href, isActive, navigate }" :to="item.href" custom>
              <a :href="href" :class="{ 'border-b-2 border-app-blue text-app-blue!': isActive }" class="text-base font-medium text-white hover:text-app-blue py-24px" @click="navigate">{{ item.name }}</a>
            </RouterLink>
          </div>
        </div>
        <RouterLink to="/list-asset" class="inline-block rounded-3xl border border-transparent bg-app-blue py-8px px-12px text-sm font-medium text-black hover:bg-opacity-75">
          List new Asset
        </RouterLink>
      </div>
      <div class="flex flex-wrap justify-center space-x-6 py-4 lg:hidden">
        <RouterLink v-for="item in navigation" :key="item.name" v-slot="{ href, isActive, navigate }" :to="item.href" custom>
          <a :href="href" :class="{ 'border-b-2 border-app-blue text-app-blue!': isActive }" class="text-base font-medium text-white hover:text-app-blue py-4px" @click="navigate">{{ item.name }}</a>
        </RouterLink>
      </div>
    </nav>
  </header>
  <section app-section>
    <div app-container>
      <RouterView />
    </div>
  </section>
</template>
