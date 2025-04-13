<script setup lang="ts">
import { domainValidator } from '@/utils/validators/domain-validator'
import FormModal from '../ui/modal/FormModal.vue'
import InputField from '../ui/form/InputField.vue'
import SelectField from '../ui/form/SelectField.vue'
import CheckboxField from '../ui/form/CheckboxField.vue'
import { useDomainForm } from '@/composables/domains/useDomainForm'


const { isOpen, formData, errors, options, closeDialog, submitDialog, validateField } =
  useDomainForm()

const sslOptions = [
  {
    label: 'Self Signed',
    value: 'self-signed',
  },
  {
    label: "Let's Encrypt",
    value: 'certbot',
  },
]
</script>

<template>
  <FormModal
    :is-open="isOpen"
    :schema="domainValidator"
    :close-dialog="closeDialog"
    :submit-dialog="submitDialog"
    :form-data="formData"
    :options="options"
    size="small"
  >
    <div v-if="formData">
      <div class="">
        <InputField
          v-model="formData.domain"
          field="domain"
          label="Domain"
          placeholder="example.com"
          description="Enter the domain name that should resolve to the specified IP address."
          :errors="errors"
          required
          @blur="(e) => validateField('domain')"
        />

        <SelectField
          v-model="formData.ssl"
          field="ssl"
          label="SSL Certificate Type"
          description="Select the SSL certificate type for this domain. If validation is skipped, only self-signed certificates will be available."
          :options="sslOptions"
          :disabled="formData.skipValidation"
          :message="formData.skipValidation ? 'Self-Signed when skipping domain validation' : undefined"
          required
        />

        <CheckboxField
          v-model="formData.skipValidation"
          class="mt-4 mb-2"
          label="Skip Domain Validation"
          description="If you skip domain validation, Certbot (Let's Encrypt) certificates cannot be issued. Only self-signed certificates will be available."
          @change="
            (e) => {
              if (formData.skipValidation) {
                formData.ssl = 'self-signed'
              }
            }
          "
        />
      </div>
    </div>
  </FormModal>
</template>
