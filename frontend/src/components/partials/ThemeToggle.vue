<template>
  <div>
    <input type="checkbox" name="light-switch" id="light-switch" v-model="isDark" class="light-switch sr-only" />
    <label
      class="flex items-center justify-center cursor-pointer w-8 h-8 hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800 rounded-full"
      for="light-switch">
      <SvgIcon name="sun" class="dark:hidden fill-current text-gray-500/80 dark:text-gray-400/80" width="16" height="16" />
      <SvgIcon name="moon" class="hidden dark:block fill-current text-gray-500/80 dark:text-gray-400/80" width="16" height="16" />
      <span class="sr-only">Switch to light / dark version</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { useDark } from "@vueuse/core";
import SvgIcon from "../SvgIcon";
const isDark = useDark({
  selector: 'html',
})
</script>
