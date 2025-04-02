<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon'
import type { PropType } from 'vue'

const disabledClasses = {
  default:
    'disabled:border-gray-200 dark:disabled:border-gray-700 disabled:cursor-not-allowed disabled:text-gray-400 dark:disabled:text-gray-500',
  black:
    'disabled:bg-gray-800 dark:disabled:bg-gray-800 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:cursor-not-allowed',
  info:
    'disabled:bg-blue-500 disabled:text-blue-100 disabled:cursor-not-allowed',
  danger:
    'disabled:bg-red-400 disabled:text-red-100 disabled:cursor-not-allowed',
  success:
    'disabled:bg-green-400 disabled:text-green-100 disabled:cursor-not-allowed',
  warning:
    'disabled:bg-orange-400 disabled:text-orange-100 disabled:cursor-not-allowed',
}

const colors = {
  default:
    'border-gray-200 shadow-xs dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300',
  black:
    'bg-gray-900 shadow-xs active:bg-gray-950 text-gray-200 hover:bg-gray-800 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-gray-100 dark:active:bg-white',
  info:
    'bg-blue-800 shadow-xs hover:bg-blue-900 active:bg-blue-950 text-white',
  danger:
    'bg-red-500 shadow-xs hover:bg-red-600 active:bg-red-700 text-white',
  success:
    'bg-green-500 shadow-xs hover:bg-green-600 active:bg-green-700 text-white',
  warning:
    'bg-orange-500 shadow-xs hover:bg-orange-600 active:bg-orange-700 text-white',
}

const sizes = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  default: 'btn',
  lg: 'btn-lg',
  icon: 'btn w-8 h-8',
}

const props = defineProps({
  type: {
    type: String as PropType<'submit' | 'reset' | 'button' | undefined>,
    default: undefined,
  },
  form: {
    type: String,
  },
  icon: {
    type: String,
  },
  variant: {
    type: String as PropType<keyof typeof colors>,
    default: 'default',
  },
  size: {
    type: String as PropType<keyof typeof sizes>,
    default: 'default',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button
    :type="props.type"
    :form="props.form"
    :disabled="disabled || loading"
    :class="[
      sizes[props.size],
      colors[props.variant],
      disabledClasses[props.variant],
    ]"
  >
    <SvgIcon
      v-if="loading"
      name="spin"
      class="animate-spin fill-current mr-2"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    />
    <SvgIcon
      v-else-if="props.icon"
      :name="props.icon"
      class="w-4 h-4 mr-2"
    />
    <slot />
  </button>
</template>
