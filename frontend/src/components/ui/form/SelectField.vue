<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import ToolTip from '../ToolTip.vue'

const isOpen = ref(false)

const emit = defineEmits(['change', 'blur'])

interface Option {
  value: string | number
  label: string
}

const props = defineProps({
  field: {
    type: String,
    required: true,
  },
  label: String,
  description: String,
  message: String,
  placeholder: String,
  disabled: Boolean,
  tabindex: Number,
  options: {
    type: Array as PropType<Option[]>,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  errors: Object as PropType<Record<string, string>>,
})

const model = defineModel<string | number>()

const selectedOption = computed(() => {
  return props.options.find((option) => option.value === model.value)
})

const selectOption = (option: Option) => {
  model.value = option.value
  emit('change', model.value)
  isOpen.value = false
}

const handleBlur = () => {
  // wait for item selection before close dropdown
  setTimeout(() => {
    emit('blur')
    isOpen.value = false
  }, 150)
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
      <div class="select-field relative w-full" @focusout="handleBlur">
        <button
          @click.prevent="isOpen = !isOpen"
          :disabled="disabled"
          :tabindex="tabindex"
          class="form-select"
        >
          <span v-if="selectedOption && selectedOption.label" class="selected-item">
            {{ selectedOption.label }}
          </span>
          <span v-else class="select-placeholder">
            {{ placeholder || 'Select an option' }}
          </span>
          <span class="select-icon">▼</span>
        </button>
        <div
          v-if="isOpen"
          class="absolute z-10 left-0 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-sm shadow-lg max-h-60 overflow-y-auto"
        >
          <div
            v-for="option in options"
            :key="option.value"
            @click="selectOption(option)"
            class="font-medium text-sm flex items-center px-3 py-1 cursor-pointer hover:bg-gray-200 hover:dark:bg-gray-700"
            :class="{ 'bg-gray-100': option.value === model }"
          >
            {{ option.label }}
          </div>
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
