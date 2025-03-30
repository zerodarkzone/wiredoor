<script setup lang="ts">
import type { DateOption, Options } from 'flatpickr/dist/types/options'
import { ref, type PropType } from 'vue'
import flatPickr from 'vue-flatpickr-component'
import ToolTip from '../ToolTip.vue'

const props = defineProps({
  field: {
    type: String,
    required: true,
  },
  label: String,
  description: String,
  placeholder: String,
  message: String,
  disabled: Boolean,
  tabindex: Number,
  required: {
    type: Boolean,
    default: false,
  },
  align: {
    type: String,
    default: 'left',
  },
  errors: Object as PropType<Record<string, string>>,
})

const date = ref<DateOption | null>(null)

const model = defineModel<string | Date>()

const config: Options = {
  mode: 'single',
  static: true,
  monthSelectorType: 'static',
  defaultDate: undefined,
  altInput: false,
  minDate: Date.now(),
  prevArrow:
    '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
  nextArrow:
    '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
  // onReady: (selectedDates, dateStr, instance) => {
  //   instance.element.value = dateStr.replace('to', '-')
  //   const customClass = props.align ? props.align : ''
  //   instance.calendarContainer.classList.add(`flatpickr-${customClass}`)
  // },
  onChange: (dates: Date[]) => {
    if (dates[0]) {
      model.value = dates[0].toISOString()
    } else {
      model.value = undefined
    }
  },
}
</script>

<template>
  <div class="form-field">
    <div>
      <div v-if="props.label" class="flex items-center justify-between">
        <label class="block text-sm font-medium mb-1" :for="field">
          {{ props.label }} <span v-if="props.required" class="text-red-500">*</span>
        </label>
        <ToolTip v-if="props.description" class="ml-2" bg="dark" size="md" position="left">
          <slot name="tooltip">
            <div class="text-sm text-gray-200">{{ props.description }}</div>
          </slot>
        </ToolTip>
      </div>
      <div class="relative">
        <flat-pickr
          v-model="date"
          :config="config"
          :disabled="props.disabled"
          placeholder="Select a date"
          class="form-input pl-9 dark:bg-gray-800 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 font-medium w-full"
        ></flat-pickr>
        <div class="absolute inset-0 right-auto flex items-center pointer-events-none">
          <svg
            class="fill-current text-gray-400 dark:text-gray-500 ml-3"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path d="M5 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z" />
            <path
              d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z"
            />
          </svg>
        </div>
      </div>
    </div>
    <div v-if="props.label || props.errors || props.message" class="form-message">
      <div v-if="props.errors?.[props.field]" class="text-xs mt-1 text-red-500">
        {{ props.errors[props.field] }}
      </div>
      <div v-else-if="props.message" class="text-xs mt-1 text-gray-600">
        {{ props.message }}
      </div>
    </div>
  </div>
</template>
