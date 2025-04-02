<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon'
import { Button } from '@/components/ui/button'
import type { FormModalOptions } from '@/composables/useFormModal'
import { ref, type PropType } from 'vue'

const loading = ref(false)

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  schema: { type: Object as PropType<any>, required: true },
  formData: { type: Object as PropType<any>, required: true },
  options: { type: Object as PropType<FormModalOptions<any> | undefined>, required: true },
  closeDialog: { type: Function, required: true },
  submitDialog: { type: Function, required: true },
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'medium',
  },
})

const sizeClass = {
  small: ' max-w-sm',
  medium: 'max-w-lg',
  large: ' max-w-2xl',
}

const submit = async () => {
  loading.value = true
  try {
    await props.submitDialog()
  } catch {
    // console.error(e)
  } finally {
    loading.value = false
  }
}
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
      v-show="props.isOpen"
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
      v-show="props.isOpen"
      class="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center px-4 sm:px-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        v-if="props.options"
        ref="modalContent"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-h-full"
        :class="sizeClass[props.size]"
      >
        <div class="px-5 py-3 border-b border-gray-200 dark:border-gray-700/60">
          <div class="flex justify-between items-center">
            <div class="font-semibold text-gray-800 dark:text-gray-100">
              {{ props.options.title }}
            </div>
            <button
              class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 cursor-pointer"
              :disabled="loading"
              @click.prevent="props.closeDialog()"
            >
              <div class="sr-only">Close</div>
              <SvgIcon name="close" class="fill-current" width="16" height="16" />
            </button>
          </div>
        </div>
        <form id="modalForm">
          <div class="p-5">
            <slot></slot>
          </div>

          <!-- Modal footer -->
          <div class="px-5 py-4 border-t border-gray-200 dark:border-gray-700/60">
            <div class="flex flex-wrap justify-end space-x-5">
              <Button :disabled="loading" @click.prevent="props.closeDialog()"> Cancel </Button>
              <Button type="submit" variant="black" :loading="loading" @click.prevent="submit">
                Save
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>
