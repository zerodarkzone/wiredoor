<template>
  <div class="relative inline-flex">
    <a
      class="w-8 h-8 flex items-center justify-center hover:cursor-pointer hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800 rounded-full"
      title="GitHub"
      href="https://github.com/wiredoor/wiredoor"
    >
      <SvgIcon
        name="github"
        height="16"
        width="16"
        class="dark:block fill-current text-gray-500/80 dark:text-gray-400/80"
      />
    </a>
  </div>
</template>
<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.tsx'
</script>
