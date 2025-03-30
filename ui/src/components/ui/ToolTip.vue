<template>
  <div
    class="relative"
    @mouseenter="tooltipOpen = true"
    @mouseleave="tooltipOpen = false"
    @focusin="tooltipOpen = true"
    @focusout="tooltipOpen = false"
  >
    <button class="block" aria-haspopup="true" @click.prevent>
      <slot name="trigger">
        <SvgIcon
          name="info"
          class="fill-current text-gray-400 dark:text-gray-500"
          width="16"
          height="16"
        />
      </slot>
    </button>
    <div class="z-10 absolute" :class="positionOuterClasses(props.position)">
      <transition
        enter-active-class="transition ease-out duration-200 transform"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-out duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-show="tooltipOpen"
          class="rounded-lg border overflow-hidden shadow-lg"
          :class="[
            colorClasses(props.bg),
            sizeClasses(props.size),
            positionInnerClasses(props.position),
          ]"
        >
          <slot />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SvgIcon from '@/components/SvgIcon'

const props = defineProps(['bg', 'size', 'position'])

const tooltipOpen = ref(false)

const positionOuterClasses = (position: string) => {
  switch (position) {
    case 'right':
      return 'left-full top-1/2 -translate-y-1/2'
    case 'left':
      return 'right-full top-1/2 -translate-y-1/2'
    case 'bottom':
      return 'top-full left-1/2 -translate-x-1/2'
    default:
      return 'bottom-full left-1/2 -translate-x-1/2'
  }
}

const sizeClasses = (size: string) => {
  switch (size) {
    case 'lg':
      return 'min-w-72 px-3 py-2'
    case 'md':
      return 'min-w-56 px-3 py-2'
    case 'sm':
      return 'min-w-44 px-3 py-2'
    default:
      return 'px-3 py-2'
  }
}

const colorClasses = (bg: string) => {
  switch (bg) {
    case 'light':
      return 'bg-white text-gray-600 border-gray-200'
    case 'dark':
      return 'bg-gray-800 text-gray-100 border-gray-700/60'
    default:
      return 'text-gray-600 bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700/60'
  }
}

const positionInnerClasses = (position: string) => {
  switch (position) {
    case 'right':
      return 'ml-2'
    case 'left':
      return 'mr-2'
    case 'bottom':
      return 'mt-2'
    default:
      return 'mb-2'
  }
}
</script>
