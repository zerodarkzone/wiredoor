<script setup lang="ts">
import FormModal from '@/components/ui/modal/FormModal.vue'
import { useFormModal } from '@/composables/useFormModal'
import { nodeValidator, type Node } from '@/utils/validators/node-validator'
import InputField from '../ui/form/InputField.vue'
import DatePickerField from '../ui/form/DatePickerField.vue'
import { tokenValidator, type TokenForm } from '@/utils/validators/token-validator'

const emit = defineEmits(['submit'])

let id: number | undefined = undefined

const {
  isOpen,
  formData,
  errors,
  options,
  openDialog,
  closeDialog,
  submitDialog,
  validateField
} = useFormModal<TokenForm>(tokenValidator)

const openTokenForm = (
  node: Node,
  initialData = { name: '', expireAt: undefined },
  ID = undefined,
) => {
  id = ID
  openDialog({
    id,
    initialData,
    title: 'Access Token Configuration',
    description: '',
    endpoint: `/api/nodes/${node.id}/pats`,
    onSubmit: async (form) => {
      emit('submit', form, id)
    },
  })
}

defineExpose({ openTokenForm })
</script>
<template>
  <FormModal
    :is-open="isOpen"
    :schema="nodeValidator"
    :close-dialog="closeDialog"
    :submit-dialog="submitDialog"
    :form-data="formData"
    :options="options"
    size="small"
  >
    <div v-if="formData">
      <div class="">
        <InputField
          v-model="formData.name"
          field="name"
          label="Name"
          placeholder="Enter a friendly name for this token"
          :errors="errors"
          required
          @input="(e) => validateField('name')"
        />
        <DatePickerField
          v-model="formData.expireAt"
          field="expireAt"
          label="Expire At (Optional)"
          description="Define when the token should be revoked automatically"
          :errors="errors"
        />
      </div>
    </div>
  </FormModal>
</template>
