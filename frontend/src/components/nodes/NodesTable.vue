<script setup lang="ts">
import { ref } from 'vue'
import DataTable, { type ColumnDef, type Empty } from '../ui/table/DataTable.vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SvgIcon from '../SvgIcon'
import DropDown from '../ui/dropdown/DropDown.vue'
import { type Node, type NodeForm } from '@/utils/validators/node-validator'
import DateColumn from '../ui/table/DateColumn.vue'
import { useNodeActions } from '@/composables/nodes/useNodeActions'
import { getLatestHS, getTraffic } from '@/utils/format'
import NodeStatus from './partials/NodeStatus.vue'
import NodeType from './partials/NodeType.vue'
import { Button } from '../ui/button'
import { useNodeForm } from '@/composables/nodes/useNodeForm'
import { useHttpServiceForm } from '@/composables/services/useHttpServiceForm'
import { useTcpServiceForm } from '@/composables/services/useTcpServiceForm'

const authStore = useAuthStore()

const { downloadConfig, enableNode, disableNode, deleteNode } = useNodeActions()

const { openNodeForm } = useNodeForm()
const { openHttpServiceForm } = useHttpServiceForm()
const { openTcpServiceForm } = useTcpServiceForm()

const table = ref()
const filters = ref({})
const typeFilter = ref<'all'|'gateways'|'nodes'>('all')

const emptyNodes: Empty = {
  title: 'No nodes yet',
  description:
    "You haven't added any node yet. Once you add nodes, they will appear here for easy management.",
  action: 'Add Node',
}

const nodeColumns: ColumnDef[] = [
  {
    label: '',
    key: 'status',
    customSlot: 'status',
  },
  {
    label: 'Name',
    key: 'name',
    customSlot: 'name',
  },
  {
    label: 'Type',
    key: 'isGateway',
    customSlot: 'type',
  },
  {
    label: 'Latest Handshake',
    key: 'latestHandshakeTimestamp',
    customSlot: 'latestHS',
  },
  {
    label: 'Received (KB)',
    key: 'transferRx',
    customSlot: 'transferRx',
  },
  {
    label: 'Transmitted (KB)',
    key: 'transferTx',
    customSlot: 'transferTx',
  },
  // {
  //   label: 'Created At',
  //   key: 'created_at',
  //   customSlot: 'created_at',
  // },
  {
    label: '',
    key: 'id',
    customSlot: 'actions',
    class: 'w-px pr-5 relative',
  },
]

const handleSubmit = (data: NodeForm, id: number | undefined = undefined) => {
  if (id) {
    table.value.updateItem(id, data)
  } else {
    table.value.addItem(data)
  }
}

const createNode = () => {
  openNodeForm(handleSubmit)
}

const editNode = (node: Node) => {
  openNodeForm(handleSubmit, node, node.id)
}

const addHttpService = (node: Node) => {
  openHttpServiceForm(node)
}

const addTcpService = (node: Node) => {
  openTcpServiceForm(node)
}

const handleTypeFilter = (type: 'all' | 'nodes' | 'gateways') => {
  typeFilter.value = type

  handleFilter({ type: type === 'all' ? undefined : type })
}

const handleFilter = async (newFilter: { [filter: string]: unknown }) => {
  filters.value = Object.assign(filters.value, newFilter)
  await table.value.fetchData()
}

defineExpose({ createNode })
</script>
<template>
  <div class="bg-white dark:bg-gray-900">
    <div class="mb-5">
      <ul class="flex flex-wrap -m-1">
        <li class="m-1">
          <Button :variant="typeFilter === 'all' ? 'black' : 'default'" class="rounded-full font-medium leading-5" size="sm" @click.prevent="handleTypeFilter('all')">
            View All
          </Button>
        </li>
        <li class="m-1">
          <Button :variant="typeFilter === 'nodes' ? 'black' : 'default'" class="rounded-full font-medium leading-5" size="sm" @click.prevent="handleTypeFilter('nodes')">
            Nodes
          </Button>
        </li>
        <li class="m-1">
          <Button :variant="typeFilter === 'gateways' ? 'black' : 'default'" class="rounded-full font-medium leading-5" size="sm" @click.prevent="handleTypeFilter('gateways')">
            Gateways
          </Button>
        </li>
      </ul>
    </div>
    <DataTable
      ref="table"
      endpoint="/api/nodes"
      :filters="filters"
      :columns="nodeColumns"
      :empty="emptyNodes"
      :data-stream="`/api/nodes/stream?token=${authStore.token}`"
      @add="createNode"
    >
      <template #status="{ row }">
        <NodeStatus :node="row as unknown as Node" />
      </template>
      <template #name="{ row }">
        <RouterLink :to="`/nodes/${row.id}`" class="text-blue-500 hover:underline">{{
          row.name
        }}</RouterLink>
      </template>
      <template #type="{ row }">
        <NodeType :node="row as unknown as Node" />
      </template>
      <template #transferRx="{ row }">
        {{ getTraffic(row.transferRx as string) }}
      </template>
      <template #transferTx="{ row }">
        {{ getTraffic(row.transferTx as string) }}
      </template>
      <template #latestHS="{ row }">
        {{ getLatestHS(row.latestHandshakeTimestamp as number) }}
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
                :to="{ name: 'node', params: { id: row.id } }"
                @click="close"
              >
                <SvgIcon name="eye" class="w-4 h-4 shrink-0 mr-2" />
                <span>View Node Details</span>
              </router-link>
            </li>
            <li>
              <a
                class="font-medium text-sm flex items-center py-1 px-3 hover:bg-gray-100 hover:dark:bg-gray-700"
                :href="`/nodes/${row.id}/edit`"
                @click.prevent="
                  () => {
                    editNode(row as unknown as Node)
                    close()
                  }
                "
              >
                <SvgIcon name="edit" class="w-4 h-4 shrink-0 mr-2" />
                <span>Edit Node</span>
              </a>
            </li>
            <li>
              <a
                class="font-medium text-sm flex items-center py-1 px-3 hover:bg-gray-100 hover:dark:bg-gray-700"
                :href="`/nodes/${row.id}/http`"
                @click.prevent="
                  () => {
                    addHttpService(row as unknown as Node)
                    close()
                  }
                "
              >
                <SvgIcon name="www" class="w-4 h-4 shrink-0 mr-2" />
                <span>Expose HTTP</span>
              </a>
            </li>
            <li>
              <a
                class="font-medium text-sm flex items-center py-1 px-3 hover:bg-gray-100 hover:dark:bg-gray-700"
                :href="`/nodes/${row.id}/tcp`"
                @click.prevent="
                  () => {
                    addTcpService(row as unknown as Node)
                    close()
                  }
                "
              >
                <SvgIcon name="expose" class="w-4 h-4 shrink-0 mr-2" />
                <span>Expose TCP</span>
              </a>
            </li>
            <li>
              <a
                class="font-medium text-sm flex items-center py-1 px-3 hover:bg-gray-100 hover:dark:bg-gray-700"
                :href="`/nodes/${row.id}/config`"
                @click.prevent="
                  () => {
                    downloadConfig(row.id)
                    close()
                  }
                "
              >
                <SvgIcon name="download" class="w-4 h-4 shrink-0 mr-2" />
                <span>Download Config</span>
              </a>
            </li>
            <hr class="border-gray-200 dark:border-gray-600" />
            <li v-if="row.enabled">
              <a
                class="font-medium text-sm flex items-center py-1 px-3 hover:bg-gray-100 hover:dark:bg-gray-700"
                :href="`/nodes/${row.id}/disable`"
                @click.prevent="
                  () => {
                    disableNode(row.id, () => table.updateItem(row.id, { ...row, enabled: false }))
                    close()
                  }
                "
              >
                <SvgIcon
                  name="disconnect"
                  class="w-4 h-4 text-orange-500 fill-current shrink-0 mr-2"
                />
                <span>Disconnect</span>
              </a>
            </li>
            <li v-else>
              <a
                class="font-medium text-sm flex items-center py-1 px-3 hover:bg-gray-100 hover:dark:bg-gray-700"
                :href="`/nodes/${row.id}/enable`"
                @click.prevent="
                  () => {
                    enableNode(row.id, table.updateItem(row.id, { ...row, enabled: true }))
                    close()
                  }
                "
              >
                <SvgIcon
                  name="connect"
                  class="w-4 h-4 text-orange-500 fill-current shrink-0 mr-2"
                />
                <span>Connect</span>
              </a>
            </li>
            <hr class="border-gray-200 dark:border-gray-600" />
            <li>
              <a
                class="font-medium text-sm flex items-center py-1 px-3 hover:bg-gray-100 hover:dark:bg-gray-700"
                :href="`/nodes/${row.id}/delete`"
                @click.prevent="
                  () => {
                    deleteNode(row.id, () => table.removeItem(row.id))
                    close()
                  }
                "
              >
                <SvgIcon name="delete" class="w-4 h-4 text-red-500 shrink-0 mr-2" />
                <span>Delete Node</span>
              </a>
            </li>
          </template>
        </DropDown>
      </template>
    </DataTable>
  </div>
</template>
