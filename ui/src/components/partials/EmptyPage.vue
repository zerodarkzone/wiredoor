<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
    <div class="max-w-2xl m-auto mt-10">
      <div class="text-center px-4">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-t from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 mb-4"
        >
          <SvgIcon name="cube" class="w-5 h-6 fill-current" />
        </div>
        <h2 class="text-2xl text-gray-800 dark:text-gray-100 font-bold mb-2">{{ props.title }}</h2>
        <div v-if="props.description" class="mb-6">
          {{ props.description }}
        </div>
        <button
          v-if="action"
          class="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
          @click="emit('action')"
        >
          {{ action }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import SvgIcon from '../SvgIcon'

const emit = defineEmits(['action'])

const props = defineProps({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  action: {
    type: String,
    required: false,
  },
})
</script>
