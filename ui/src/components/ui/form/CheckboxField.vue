<script setup lang="ts">
import ToolTip from '../ToolTip.vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  disabled: Boolean,
  tabindex: Number,
  description: String,
})

const model = defineModel<boolean>()
const emit = defineEmits(['change'])
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <!-- Start -->
      <label class="flex items-center">
        <input
          v-model="model"
          type="checkbox"
          name="allowInternet"
          class="form-checkbox"
          :tabindex="tabindex"
          :disabled="disabled"
          :true-value="true"
          :false-value="false"
          @change="emit('change', model)"
        />
        <slot>
          <span class="text-sm ml-2">{{ props.label }}</span>
        </slot>
      </label>
      <ToolTip v-if="props.description" class="ml-2" bg="dark" size="md" position="left">
        <slot name="tooltip">
          <div class="text-sm text-gray-200">{{ props.description }}</div>
        </slot>
      </ToolTip>
      <!-- End -->
    </div>
  </div>
</template>
