<script setup lang="ts">
import type { TokenForm } from '@/utils/validators/token-validator'
import { compareAsc } from 'date-fns'
import type { PropType } from 'vue'

const props = defineProps({
  token: {
    type: Object as PropType<TokenForm>,
    required: true,
  },
})
</script>
<template>
  <div>
    <div
      v-if="props.token.revoked"
      class="text-xs inline-flex font-medium bg-red-500/20 text-red-700 rounded-full text-center px-2.5 py-1"
    >
      Revoked
    </div>
    <div
      v-else-if="
        props.token.expireAt && compareAsc(Date.now(), new Date(props.token.expireAt)) === 1
      "
      class="text-xs inline-flex font-medium bg-orange-500/20 text-orange-700 rounded-full text-center px-2.5 py-1"
    >
      Expired
    </div>
    <div
      v-else
      class="text-xs inline-flex font-medium bg-green-500/20 text-green-700 rounded-full text-center px-2.5 py-1"
    >
      Active
    </div>
  </div>
</template>
