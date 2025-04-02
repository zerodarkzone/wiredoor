<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useConfirm } from '@/composables/useConfirm'
import SvgIcon from '@/components/SvgIcon'

const { confirmState, closeConfirm } = useConfirm()

const emit = defineEmits(['close-modal'])

// @ts-expect-error: Unreachable code error
const keyHandler = ({ keyCode }) => {
  if (!confirmState.open || keyCode !== 27) return
  closeConfirm(false)
  emit('close-modal')
}

onMounted(() => {
  document.addEventListener('keydown', keyHandler)
})

onUnmounted(() => {
  document.removeEventListener('keydown', keyHandler)
})
</script>

<template>
  <!-- Modal backdrop -->
  <transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-out duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-show="confirmState.open"
      class="fixed inset-0 bg-gray-900/30 z-50 transition-opacity"
      aria-hidden="true"
    ></div>
  </transition>
  <!-- Modal dialog -->
  <transition
    enter-active-class="transition ease-in-out duration-200"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in-out duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-show="confirmState.open"
      class="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center px-4 sm:px-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref="modalContent"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-auto max-w-lg w-full max-h-full"
      >
        <div class="p-5 flex space-x-4">
          <!-- Icon -->
          <div
            v-if="confirmState.options.icon"
            class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-gray-100 dark:bg-gray-700"
          >
            <SvgIcon
              class="shrink-0 fill-current"
              :class="{
                'text-red-500': confirmState.options.variant === 'danger',
                'text-green-500': confirmState.options.variant === 'success',
                'text-blue-800':
                  !confirmState.options.variant || confirmState.options.variant === 'info',
              }"
              width="16"
              height="16"
              :name="confirmState.options.icon"
            />
          </div>
          <!-- Content -->
          <div class="w-full">
            <!-- Modal header -->
            <div class="mb-2">
              <div class="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {{ confirmState.options.title }}
              </div>
            </div>
            <!-- Modal content -->
            <div class="text-sm mb-10">
              <div class="space-y-2">
                <p>{{ confirmState.options.description }}</p>
              </div>
            </div>
            <!-- Modal footer -->
            <div class="flex flex-wrap justify-end space-x-2">
              <button
                class="btn-sm border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300"
                @click.stop="closeConfirm(false)"
              >
                {{ confirmState.options.cancelButtonText || 'Cancel' }}
              </button>
              <button
                class="btn-sm text-white"
                :class="{
                  'bg-red-500 hover:bg-red-600': confirmState.options.variant === 'danger',
                  'bg-green-500 hover:bg-green-600': confirmState.options.variant === 'success',
                  'bg-blue-800 hover:bg-blue-900':
                    !confirmState.options.variant || confirmState.options.variant === 'info',
                }"
                @click.prevent="closeConfirm(true)"
              >
                {{ confirmState.options.acceptButtonText || 'Accept' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
