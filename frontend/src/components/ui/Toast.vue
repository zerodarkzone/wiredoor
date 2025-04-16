<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import Alert from './Alert.vue';
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<template>
  <div class="fixed top-20 right-5 space-y-2 z-50">
    <TransitionGroup name="slide">
      <div v-for="toast in toasts" :key="toast.id" role="alert">
        <Alert :id="toast.id" :type="toast.type" :message="toast.message" closable @close="removeToast" />
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition:
    transform 0.2s ease-in-out,
    opacity 0.2s ease-in-out;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
