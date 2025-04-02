<script setup lang="ts">
import MainLayout from '@/components/layouts/MainLayout.vue'
import NodeDetails from '@/components/nodes/NodeDetails.vue'
</script>
<template>
  <MainLayout>
    <div class="relative bg-gray-100 dark:bg-gray-900 min-h-full">
      <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <NodeDetails />
      </div>
    </div>
  </MainLayout>
</template>
