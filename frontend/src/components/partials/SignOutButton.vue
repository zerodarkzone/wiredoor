<template>
  <div class="relative inline-flex">
    <a
      class="w-8 h-8 flex items-center justify-center hover:cursor-pointer hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800 rounded-full"
      title="Sign Out"
      @click="logout"
    >
      <SvgIcon
        v-if="loggingOut"
        name="spin"
        height="16"
        width="16"
        class="dark:block text-gray-500/80 dark:text-gray-400/80 animate-spin"
      />
      <SvgIcon
        v-else
        name="logout"
        height="16"
        width="16"
        class="dark:block text-gray-500/80 dark:text-gray-400/80"
      />
    </a>
  </div>
</template>
<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.tsx'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const authStore = useAuthStore()

const loggingOut = ref(false)

const logout = async () => {
  loggingOut.value = true
  await authStore.logout()
  loggingOut.value = false
}
</script>
