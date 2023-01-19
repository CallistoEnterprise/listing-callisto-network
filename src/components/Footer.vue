<script lang="ts" setup>
import callistoLogoUrl from '~/assets/callisto-logo.png'

const navigation = {
  platforms: [
    { name: 'Callisto HUB', href: 'https://hub.callisto.network/' },
    { name: 'Soy.Finance', href: 'https://soy.finance/' },
    { name: 'Callisto Bridge', href: 'https://bridge.soy.finance/' },
  ],
  callisto: [
    { name: 'Homepage', href: 'https://callisto.network/' },
    { name: 'GitHub', href: 'https://github.com/' },
    { name: 'Contact us', href: 'https://callisto.network/contact-us/' },
  ],
  social: [
    { name: 'Telegram', icon: 'i-cib-telegram', href: 'https://t.me/CallistoNet' },
    { name: 'Twitter', icon: 'i-cib-twitter', href: 'https://twitter.com/CallistoSupport' },
    { name: 'Reddit', icon: 'i-cib-reddit', href: 'https://www.reddit.com/r/CallistoCrypto/' },
    { name: 'Youtube', icon: 'i-cib-youtube', href: 'https://www.youtube.com/c/CallistoNetwork' },
  ],
}
</script>

<template>
  <footer class="bg-app-deepBlue" aria-labelledby="footer-heading">
    <h2 id="footer-heading" class="sr-only">
      Footer
    </h2>
    <div class="app-container pb-8 pt-16 sm:pt-24 lg:pt-32">
      <div class="md:grid md:grid-cols-3 md:gap-8">
        <img class="h-12" md:ml-12px :src="callistoLogoUrl" alt="Callisto Network">
        <div class="mt-16 grid grid-cols-2 gap-8 md:col-span-2 md:mt-0">
          <div class="hidden md:grid md:grid-cols-2 md:gap-8" />
          <div class="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 class="text-sm font-semibold leading-6 text-white">
                Platforms
              </h3>
              <ul role="list" class="mt-6 space-y-4">
                <li v-for="item in navigation.platforms" :key="item.name">
                  <a :href="item.href" class="text-sm leading-6 text-gray-300 hover:text-white">{{ item.name }}</a>
                </li>
              </ul>
            </div>
            <div class="mt-10 md:mt-0">
              <h3 class="text-sm font-semibold leading-6 text-white">
                Callisto Network
              </h3>
              <ul role="list" class="mt-6 space-y-4">
                <li v-for="item in navigation.callisto" :key="item.name">
                  <a :href="item.href" class="text-sm leading-6 text-gray-300 hover:text-white">{{ item.name }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-8 border-t border-white/10 pt-8 md:flex md:items-center md:justify-between">
        <div class="flex space-x-6 md:order-2">
          <a v-for="item in navigation.social" :key="item.name" :href="item.href" class="text-gray-500 hover:text-gray-400">
            <span class="sr-only">{{ item.name }}</span>
            <div :class="item.icon" class="h-6 w-6" aria-hidden="true" />
          </a>
        </div>
        <p class="mt-8 text-xs leading-5 text-gray-400 md:order-1 md:mt-0">
          &copy; All rights reserved by Callisto Network
        </p>
      </div>
    </div>
  </footer>
</template>
