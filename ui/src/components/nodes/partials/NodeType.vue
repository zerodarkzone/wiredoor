<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon'
import ToolTip from '@/components/ui/ToolTip.vue'
import type { Node } from '@/utils/validators/node-validator'

const props = defineProps<{
  node: Node
}>()
</script>

<template>
  <div class="pl-2">
    <ToolTip>
      <template #trigger>
        <SvgIcon v-if="props.node.isGateway" name="gateway" class="w-5 h-5 text-blue-800" />
        <SvgIcon v-else name="node" class="w-5 h-5 text-gray-600" />
      </template>
      <template #default>
        <div v-if="props.node.isGateway" class="text-sm">
          This node is a gateway, <br />
          forwarding traffic to: <span class="font-bold">{{ props.node.gatewayNetwork }}</span>
          <br />
          and handling external connections.
        </div>
        <div v-else class="text-sm">
          This node is a standard client and only routes traffic to itself.
        </div>
      </template>
    </ToolTip>
  </div>
</template>
