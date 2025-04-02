<script setup lang="ts">
import type { PropType } from 'vue'
import ToolTip from '../ToolTip.vue'

const props = defineProps({
  field: {
    type: String,
    required: true,
  },
  label: String,
  description: String,
  message: String,
  required: {
    type: Boolean,
    default: false,
  },
  errors: Object as PropType<Record<string, string>>,
})
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
      <slot />
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
