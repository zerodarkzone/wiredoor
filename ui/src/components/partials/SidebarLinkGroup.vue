<template>
  <li
    class="pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r"
    :class="activeCondition && 'from-blue-800/[0.12] dark:from-blue-800/[0.24] to-blue-800/[0.04]'"
  >
    <slot :handleClick="handleClick" :expanded="expanded" />
  </li>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  activeCondition: {
    type: Boolean,
    default: false,
  },
})

const expanded = ref(props.activeCondition)

const handleClick = () => {
  expanded.value = !expanded.value
}
</script>
