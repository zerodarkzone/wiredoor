<script setup lang="ts">
import ToolTip from '@/components/ui/ToolTip.vue'
import type { Node } from '@/utils/validators/node-validator'

const props = defineProps<{
  node: Node
}>()
</script>

<template>
  <div>
    <ToolTip>
      <template #trigger>
        <span v-if="props.node.status === 'online'" class="relative flex h-3 w-3">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
          ></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>

        <span v-if="props.node.status === 'idle'" class="relative flex h-3 w-3">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"
          ></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
        </span>
        <span v-if="props.node.status === 'offline'" class="relative flex h-3 w-3">
          <span class="inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </template>
      <template #default>
        <span class="capitalize">{{ props.node.status }}</span>
      </template>
    </ToolTip>
  </div>
</template>
