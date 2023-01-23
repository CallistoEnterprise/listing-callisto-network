<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

interface Props {
  heading?: string
  subheading?: string
  isOpen?: boolean
  isClosable?: boolean
  size?: string
  bgColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  isClosable: false,
  size: '720px',
  bgColor: '',
})

const emits = defineEmits(['update:isOpen', 'ctaClicked'])

const isOpenLocal = computed({
  get: (): boolean => props.isOpen,
  set: (value: boolean): void => emits('update:isOpen', value),
})

const close = (): void => {
  if (!props.isClosable)
    return
  isOpenLocal.value = false
}
</script>

<template>
  <div>
    <slot name="trigger" />
    <TransitionRoot as="template" :show="isOpenLocal">
      <Dialog as="div" class="relative z-10" @close="close">
        <TransitionChild
          as="template" enter="ease-out duration-300" enter-from="opacity-0"
          enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed z-10 inset-0 overflow-y-auto">
          <div class="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <TransitionChild
              as="template" enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 w-full sm:p-6"
                :class="[`md:w-${props.size}`]" :style="{ 'background-color': bgColor }"
              >
                <div>
                  <slot name="heading" />
                  <div v-if="!!!$slots.heading" class="pb-5 border-b border-gray-200">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                      {{ heading }}
                    </h3>
                    <p v-if="subheading" class="mt-1 text-sm text-gray-500">
                      {{ subheading }}
                    </p>
                  </div>
                  <div class="mt-3 sm:mt-5">
                    <slot />
                  </div>
                </div>
                <div v-if="isClosable" class="absolute top-0 right-0 pt-4 pr-4">
                  <button type="button" app-icon-btn @click="close">
                    <span class="sr-only">Close</span>
                    <div i-heroicons-outline-x class="h-6 w-6" aria-hidden="false" />
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<style scoped>
</style>
