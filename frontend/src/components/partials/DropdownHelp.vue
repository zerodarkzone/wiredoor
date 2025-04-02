<template>
  <div class="relative inline-flex">
    <button
      ref="trigger"
      class="w-8 h-8 flex items-center justify-center hover:cursor-pointer hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800 rounded-full"
      :class="{ 'bg-gray-200 dark:bg-gray-800': dropdownOpen }"
      aria-haspopup="true"
      @click.prevent="dropdownOpen = !dropdownOpen"
      :aria-expanded="dropdownOpen"
    >
      <span class="sr-only">Info</span>
      <SvgIcon
        name="info"
        class="fill-current text-gray-500/80 dark:text-gray-400/80"
        width="16"
        height="16"
      />
    </button>
    <transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-out duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="dropdownOpen"
        class="absolute min-w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg mt-1"
        :class="props.align === 'right' ? 'right-0' : 'left-0'"
      >
        <div
          class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase pt-1.5 pb-2 px-3"
        >
          Need help?
        </div>
        <ul ref="dropdown" @focusin="dropdownOpen = true" @focusout="dropdownOpen = false">
          <li>
            <a
              class="font-medium text-sm text-blue-800 hover:text-blue-900 dark:hover:text-blue-700 flex items-center py-1 px-3"
              href="https://www.wiredoor.net/docs"
              target="_blank"
              @click="dropdownOpen = false"
            >
              <SvgIcon name="docs" class="w-4 h-4 fill-current text-blue-800 shrink-0 mr-2" />
              <span>Documentation</span>
            </a>
          </li>
          <li>
            <router-link
              class="font-medium text-sm text-blue-800 hover:text-blue-900 dark:hover:text-blue-700 flex items-center py-1 px-3"
              to="#0"
              @click="dropdownOpen = false"
            >
              <SvgIcon name="contact" class="w-4 h-4 text-blue-800 shrink-0 mr-2" />
              <span>Contact us</span>
            </router-link>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import SvgIcon from '@/components/SvgIcon'

const props = defineProps({
  align: {
    type: String,
    default: 'left',
  },
})

const dropdownOpen = ref(false)
const trigger = ref<HTMLElement>()
const dropdown = ref<HTMLElement>()

// @ts-expect-error: Unreachable code error
const clickHandler = ({ target }) => {
  if (!dropdownOpen.value || dropdown.value?.contains(target) || trigger.value?.contains(target))
    return
  dropdownOpen.value = false
}

// @ts-expect-error: Unreachable code error
const keyHandler = ({ keyCode }) => {
  if (!dropdownOpen.value || keyCode !== 27) return
  dropdownOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', clickHandler)
  document.addEventListener('keydown', keyHandler)
})

onUnmounted(() => {
  document.removeEventListener('click', clickHandler)
  document.removeEventListener('keydown', keyHandler)
})
</script>
