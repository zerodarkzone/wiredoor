<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full h-screen max-w-[96rem] mx-auto">
    <div class="max-w-2xl m-auto mt-16">
      <div class="text-center px-4">
        <div class="inline-flex mb-8">
          <SvgIcon name="wiredoor" class="w-48 h-48" />
        </div>
        <div class="mb-6">Hmm...this page doesn't exist. Try searching for something else!</div>
        <router-link
          to="/"
          class="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
          >Back To Home</router-link
        >
      </div>
    </div>
  </div>
</template>
