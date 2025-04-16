<script setup lang="ts">
import { useRoute } from 'vue-router'
import SvgIcon from '@/components/SvgIcon'
import DataTable, { type ColumnDef, type Empty } from '@/components/ui/table/DataTable.vue'
import DropDown from '../ui/dropdown/DropDown.vue'
import Button from '../ui/button/Button.vue'
import { ref, type PropType } from 'vue'
import type { Node } from '@/utils/validators/node-validator'
import TokenModalForm from './TokenModalForm.vue'
import type { PAT, TokenForm } from '@/utils/validators/token-validator'
import TokenInfo from './TokenInfo.vue'
import TokenStatus from './TokenStatus.vue'
import { useTokenInfo } from '@/composables/tokens/useTokenInfo'
import { useTokenActions } from '@/composables/tokens/useTokenActions'

const route = useRoute()

const { openTokenInfo } = useTokenInfo()
const { revokeToken, deleteToken } = useTokenActions()

const table = ref()

const tokenFormRef = ref()

const props = defineProps({
  node: {
    type: Object as PropType<Node>,
    required: true
  }
})

const emptyServices: Empty = {
  title: 'No Access Tokens yet',
}

const columns: ColumnDef[] = [
  {
    label: 'Name',
    key: 'name',
    customSlot: 'name',
    head: {
      class: 'p-2 whitespace-nowrap text-left',
    },
  },
  {
    label: 'Status',
    key: 'status',
    customSlot: 'status',
    head: {
      class: 'p-2 whitespace-nowrap text-left',
    },
  },
  {
    label: '',
    key: 'id',
    customSlot: 'actions',
    class: 'w-px pr-5 relative',
  },
]

const thead = {
  class:
    'text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs',
}

const tbody = {
  class: 'text-sm divide-y divide-gray-100 dark:divide-gray-700/60',
}

const addToken = () => {
  tokenFormRef.value.openTokenForm(props.node)
}

const handleSubmit = (form: PAT, id?: number) => {
  openTokenInfo(form)
  if (id) {
    table.value.updateItem(id, form)
  } else {
    table.value.addItem(form)
  }
}
</script>
<template>
  <div class="h-full col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
    <TokenInfo />
    <TokenModalForm ref="tokenFormRef" @submit="handleSubmit"/>
    <header
      class="flex justify-between items-center px-5 py-4 border-b border-gray-100 dark:border-gray-700/60"
    >
      <h2 class="font-semibold text-gray-800 dark:text-gray-100">Node Access Tokens</h2>
      <Button variant="black" :disabled="node.isLocal" size="sm" @click="addToken">+ Add Token</Button>
    </header>
    <div class="p-3">
      <!-- Table -->
      <div class="overflow-x-auto">
        <DataTable
          ref="table"
          :columns="columns"
          :thead="thead"
          :tbody="tbody"
          :filters="{ limit: 5 }"
          :tableContainer="{ class: 'w-full min-h-[230px]' }"
          :empty="emptyServices"
          :endpoint="`/api/nodes/${route.params.id}/pats`"
        >
          <template #name="{ row }">
            <div class="font-medium text-gray-800 dark:text-gray-100">{{ row.name }}</div>
          </template>
          <template #status="{ row }">
            <TokenStatus :token="row as unknown as TokenForm" />
          </template>
          <template #actions="{ row }">
            <DropDown align="right">
              <template #trigger>
                <span class="sr-only">Actions</span>
                <SvgIcon name="more" class="w-8 h-8 fill-current" />
              </template>
              <template #overlay="{ close }">
                <li>
                  <a
                    class="font-medium text-sm flex items-center py-1 px-3 hover:bg-gray-100 hover:dark:bg-gray-700"
                    :href="`/nodes/${route.params.id}/revoke/token/${row.id}`"
                    @click.prevent="
                      () => {
                        revokeToken(props.node.id, row.id, () => table.updateItem(row.id, { ...row, revoked: true }))
                        close()
                      }
                    "
                  >
                    <SvgIcon
                      name="linkOff"
                      class="w-4 h-4 text-orange-500 fill-current shrink-0 mr-2"
                    />
                    <span>Revoke</span>
                  </a>
                </li>
                <hr class="border-gray-200 dark:border-gray-600" />
                <li>
                  <a
                    class="font-medium text-sm flex items-center py-1 px-3 hover:bg-gray-100 hover:dark:bg-gray-700"
                    :href="`/nodes/${route.params.id}/delete/token/${row.id}`"
                    @click.prevent="
                      () => {
                        deleteToken(props.node.id, row.id, () => table.removeItem(row.id))
                        close()
                      }
                    "
                  >
                    <SvgIcon name="delete" class="w-4 h-4 text-red-500 shrink-0 mr-2" />
                    <span>Delete</span>
                  </a>
                </li>
              </template>
            </DropDown>
          </template>
        </DataTable>
      </div>

      <!-- <div class="text-center border-t border-gray-100 dark:border-gray-700/60 px-2">
        <a
          class="block text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 pt-4 pb-1"
          href="#0"
          >View All -&gt;</a
        >
      </div> -->
    </div>
  </div>
</template>
