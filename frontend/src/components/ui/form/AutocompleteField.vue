<script setup lang="ts">
import { ref, watch, type PropType } from 'vue'
import ToolTip from '../ToolTip.vue'

const isOpen = ref(false)
const loading = ref(false)
const results = ref<Option[]>([])

const emit = defineEmits(['change', 'blur'])

interface Option {
  value: string
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
    default: () => ([])
  },
  fetchOptions: Function as PropType<(query: string) => Promise<Option[]>>,
  required: {
    type: Boolean,
    default: false,
  },
  allowCustomValue: {
    type: Boolean,
    default: false,
  },
  errors: Object as PropType<Record<string, string>>,
})

const model = defineModel<string>()

watch(model, (newQuery) => {
  fetchResults(newQuery as string)
})

watch(isOpen, (open) => {
  if (open) fetchResults(model.value || '')
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const fetchResults = (search: string) => {
  if (props.options) {
    if (!search) {
      results.value = props.options
    } else {
      results.value = props.options.filter((item) => {
        return item.value.toLowerCase().includes(search.toLowerCase())
      })
    }
  } else {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(async () => {
      if (!search.trim()) {
        results.value = []
        return
      }

      loading.value = true
      if (props.fetchOptions) {
        results.value = await props.fetchOptions(search)
      }
      loading.value = false
    }, 300) // Debounce de 300ms
  }
}

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
        <input
          v-model="model"
          class="form-input w-full"
          :class="{ 'border-red-300': !!props.errors?.[props.field] }"
          :placeholder="placeholder || 'Select an option...'"
          :disabled="disabled"
          :tabindex="tabindex"
          @focus="isOpen = true"
        />
        <div
          v-if="isOpen && (loading || results.length || props.allowCustomValue)"
          class="absolute z-10 left-0 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-sm shadow-lg max-h-60 overflow-y-auto"
        >
          <div v-if="loading">
            <span class="px-3 py-1 font-medium text-sm text-center">Loading...</span>
          </div>
          <div v-else>
            <div
              v-for="option in results"
              :key="option.value"
              @click="selectOption(option)"
              class="font-medium text-sm flex items-center px-3 py-1 cursor-pointer hover:bg-gray-200 hover:dark:bg-gray-700"
              :class="{ 'bg-gray-100': option.value === model }"
            >
              {{ option.label }}
            </div>
          </div>
          <div v-if="!loading && !results.length && !(allowCustomValue && model && model.trim())">
            <span class="px-3 py-1 font-medium flex items-center text-sm text-center w-full"
              >Nothing here</span
            >
          </div>
          <div
            v-if="
              allowCustomValue &&
              !loading &&
              model &&
              model.trim() &&
              !results.filter((i) => i.value === model).length
            "
            class="pl-6 font-medium text-sm flex items-center px-3 py-1 cursor-pointer hover:bg-gray-200 hover:dark:bg-gray-700"
          >
            Add "{{ model }}"
          </div>
        </div>
      </div>
    </div>
    <div class="form-message">
      <div v-if="props.errors?.[props.field]" class="text-xs mt-1 text-red-500">
        {{ props.errors[props.field] }}
      </div>
      <div v-else-if="props.message" class="text-xs mt-1 text-gray-600">
        {{ props.message }}
      </div>
    </div>
  </div>
</template>
