<script setup lang="ts">
import { ref } from 'vue'
import DataTable from '@/components/ui/table/DataTable.vue'
import DateColumn from '@/components/ui/table/DateColumn.vue'
import DropDown from '@/components/ui/dropdown/DropDown.vue'
import SvgIcon from '@/components/SvgIcon'
import type { Domain, DomainForm } from '@/utils/validators/domain-validator'
import type { ColumnDef, Empty } from '@/components/ui/table/DataTable.vue'
import { useDomainActions } from '@/composables/domains/useDomainActions'
import { useDomainForm } from '@/composables/domains/useDomainForm'

const { openDomainForm } = useDomainForm()
const { deleteDomain } = useDomainActions()

const emptyDomains: Empty = {
  title: 'No domains yet',
  description:
    "You haven't added any domain yet. Once you add domains or services, they will appear here for easy management.",
  action: 'Add Domain',
}

const domainColumns: ColumnDef[] = [
  {
    label: 'Domain',
    key: 'domain',
    customSlot: 'domain',
  },
  {
    label: 'SSL Certs',
    key: 'ssl',
    customSlot: 'ssl',
  },
  {
    label: 'Created At',
    key: 'created_at',
    customSlot: 'created_at',
  },
  {
    label: '',
    key: 'id',
    customSlot: 'actions',
    class: 'w-px pr-5',
  },
]

const table = ref()

const createDomain = () => {
  openDomainForm(handleSubmit)
}

const editNode = (domain: Domain) => {
  openDomainForm(handleSubmit, domain, domain.id)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleSubmit = (data: DomainForm, id: number | undefined = undefined) => {
  if (id) {
    table.value.updateItem(id, data)
  } else {
    table.value.addItem(data)
  }
}

defineExpose({ createDomain })
</script>

<template>
  <div class="bg-white dark:bg-gray-900">
    <DataTable
      ref="table"
      :columns="domainColumns"
      :empty="emptyDomains"
      endpoint="/api/domains"
      @add="createDomain"
      expandable
    >
      <template #expandedRow="{ row }">
        <div class="flex items-center dark:text-gray-400 p-3">
          Example expanded row for domain {{ row.domain }}
        </div>
      </template>
      <template #domain="{ row }">
        <a :href="`https://${row.domain}`" class="text-blue-500 hover:underline">{{
          row.domain
        }}</a>
      </template>

      <template #ssl="{ row }">
        {{ row.ssl }}
      </template>

      <template #created_at="{ row }">
        <DateColumn :date="`${row.created_at}`" />
      </template>

      <template #actions="{ row }">
        <DropDown align="right">
          <template #trigger>
            <span class="sr-only">Actions</span>
            <SvgIcon name="more" class="w-8 h-8 fill-current" />
          </template>
          <template #overlay="{ close }">
            <li>
              <router-link
                class="font-medium text-sm flex items-center py-1 px-3 hover:bg-gray-100 hover:dark:bg-gray-700"
                :to="{ name: 'domain-logs', params: { domain: row.domain as string } }"
                @click="close"
              >
                <SvgIcon name="eye" class="w-4 h-4 shrink-0 mr-2" />
                <span>Logs Monitor</span>
              </router-link>
            </li>
            <li>
              <a
                class="font-medium text-sm flex items-center py-1 px-3 hover:bg-gray-100 hover:dark:bg-gray-700"
                :href="`/domains/${row.id}/edit`"
                @click.prevent="
                  () => {
                    editNode(row as unknown as Domain)
                    close()
                  }
                "
              >
                <SvgIcon name="edit" class="w-4 h-4 shrink-0 mr-2" />
                <span>Edit Domain</span>
              </a>
            </li>
            <hr class="border-gray-200 dark:border-gray-600" />
            <li>
              <a
                class="font-medium text-sm flex items-center py-1 px-3 hover:bg-gray-100 hover:dark:bg-gray-700"
                :href="`/domains/${row.id}/delete`"
                @click.prevent="
                  () => {
                    deleteDomain(row.id, () => table.removeItem(row.id))
                    close()
                  }
                "
              >
                <SvgIcon name="delete" class="w-4 h-4 shrink-0 mr-2" />
                <span>Delete Domain</span>
              </a>
            </li>
          </template>
        </DropDown>
      </template>
    </DataTable>
  </div>
</template>
