<script setup lang="ts">
import { format } from 'date-fns'

const props = defineProps({
  date: {
    type: String,
    required: true,
  },
})
</script>
<template>
  <div>
    {{ format(props.date, 'MM/dd/yyyy') }}
  </div>
</template>
