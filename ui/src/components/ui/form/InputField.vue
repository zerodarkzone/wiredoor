<script setup lang="ts">
import type { PropType } from 'vue'
import ToolTip from '../ToolTip.vue'
import SvgIcon from '@/components/SvgIcon'

const props = defineProps({
  field: {
    type: String,
    required: true,
  },
  label: String,
  description: String,
  placeholder: String,
  message: String,
  action: String,
  disabled: Boolean,
  tabindex: Number,
  type: {
    type: String as PropType<'text' | 'password' | 'email' | 'number'>,
    default: 'text',
  },
  required: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  errors: Object as PropType<Record<string, string>>,
})

const model = defineModel<string | number>()

const emit = defineEmits(['change', 'input', 'blur', 'action'])
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
        <input
          :id="field"
          v-model="model"
          class="form-input w-full"
          :placeholder="props.placeholder"
          :class="{ 'border-red-300': !!props.errors?.[props.field], 'pr-[35px]': !!props.action }"
          :type="props.type"
          :disabled="disabled"
          :tabindex="tabindex"
          :readonly="readonly"
          @input="emit('input', model)"
          @blur="emit('blur', model)"
          @change="emit('change', model)"
        />
        <div class="absolute inset-y-0 right-2 h-full flex justify-center items-center">
          <button
            v-if="props.action"
            @click.prevent="emit('action')"
            class="rounded-full w-7 h-7 flex justify-center items-center hover:cursor-pointer hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800"
          >
            <SvgIcon :name="props.action" class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
    <div v-if="props.label || props.errors || props.message" class="form-message">
      <div v-if="props.errors?.[props.field]" class="text-xs mt-1 text-red-500">
        {{ props.errors[props.field] }}
      </div>
      <div v-else-if="props.message" class="text-xs mt-1 text-gray-600 dark:text-gray-400">
        {{ props.message }}
      </div>
    </div>
  </div>
</template>
