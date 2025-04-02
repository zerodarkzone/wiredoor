<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

const props = defineProps({
  items: Array<{ label: string, to?: RouteLocationRaw }>
})
</script>

<template>
  <div class="my-5">
    <ul v-if="props.items && props.items.length" class="inline-flex flex-wrap text-sm font-medium">
      <li v-for="(item, key) in props.items" :key="key" class="flex items-center">
        <RouterLink
          v-if="item.to"
          class="text-blue-500 hover:text-blue-800 dark:hover:text-blue-200 hover:underline"
          :to="item.to">
          {{ item.label }}
        </RouterLink>
        <span v-else class="text-gray-500 dark:text-gray-400 font-semibold">{{ item.label }}</span>
        <svg
          v-if="key < props.items.length - 1"
          class="fill-current text-gray-400 dark:text-gray-600 mx-3"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path d="M6.6 13.4L5.2 12l4-4-4-4 1.4-1.4L12 8z" />
        </svg>
      </li>
    </ul>
  </div>
</template>
