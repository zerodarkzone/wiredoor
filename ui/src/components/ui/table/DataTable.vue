<script setup lang="ts">
import axios from '@/plugins/axios'
import { computed, onMounted, onUnmounted, ref, type PropType } from 'vue'
import EmptyPage from '@/components/partials/EmptyPage.vue'
import { Button } from '@/components/ui/button'

let eventSource: EventSource | undefined

interface ColumnHead {
  class?: string
}

interface TableContainer {
  class?: string
}

interface TableHead {
  class?: string
}

interface TableBody {
  class?: string
}

export interface ColumnDef {
  label: string
  key: string
  class?: string
  head?: ColumnHead
  width?: string
  customSlot?: string
}

export interface Empty {
  title: string
  description?: string
  action?: string
}

const props = defineProps({
  columns: {
    type: Array<ColumnDef>,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  limit: {
    type: Number,
    default: 10,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  showCheckbox: {
    type: Boolean,
    default: false,
  },
  expandable: {
    type: Boolean,
    default: false,
  },
  tableContainer: {
    type: Object as PropType<TableContainer>,
  },
  thead: {
    type: Object as PropType<TableHead>,
  },
  tbody: {
    type: Object as PropType<TableBody>,
  },
  empty: {
    type: Object as PropType<Empty>,
  },
  dataStream: String,
  filters: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

onUnmounted(() => {
  if (props.dataStream && eventSource) {
    eventSource.close()
  }
})

const emit = defineEmits(['select', 'add', 'expand'])

const selectAll = ref(false)
const selected = ref<number[]>([])

const expandedRows = ref<Record<number, boolean>>({})

const loading = ref<boolean>(false)
const rows = ref<{ id: number; [key: string]: unknown }[]>([])
const pagination = ref({
  current: 1,
  pageSize: props.limit,
  total: 0,
})

onMounted(async () => {
  await fetchData()
})

const fetchData = async () => {
  loading.value = true
  try {
    const filters = {
      page: pagination.value.current,
      limit: props.limit,
      ...props.filters,
    }
    const { data } = await axios.get(props.endpoint, {
      params: filters,
    })
    rows.value = data.data
    pagination.value.current = data.page
    pagination.value.pageSize = data.limit
    pagination.value.total = data.total
    dataMonitor(filters)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const dataMonitor = (filters?: { [key: string]: string | number | undefined }) => {
  if (props.dataStream) {
    if (eventSource) {
      eventSource.close()
    }

    let cleanFilters = undefined

    if (filters) {
      cleanFilters = Object.fromEntries(
        Object.entries(filters).filter((entry) => entry[1] !== undefined)
      );
    }

    // @ts-expect-error: Unreachable code error
    const params = new URLSearchParams(cleanFilters).toString()
    const qsChar = props.dataStream.indexOf('?') ? '&' : '?'
    eventSource = new EventSource(props.dataStream + `${qsChar}${params}`)

    eventSource.onopen = ({}) => {
      console.log('Monitoring started')
    }

    eventSource.onmessage = (event) => {
      rows.value = JSON.parse(event.data)
    }

    eventSource.onerror = (error) => {
      console.error('Error en SSE:', error)
    }
  }
}

const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.pageSize))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const checkAll = (e: any) => {
  if (e.target.checked) {
    if (!selectAll.value) {
      selected.value = rows.value.map((row) => row.id)
    }
  } else {
    selected.value = []
  }
  emit('select', selected.value)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const checkRow = (e: any) => {
  if (e.target.checked) {
    selected.value.push(e.target.value)
  } else {
    selected.value.splice(selected.value.indexOf(e.target.value), 1)
  }
  emit('select', selected.value)
}

const nextPage = async () => {
  if (pagination.value.current < totalPages.value) {
    pagination.value.current++
    await fetchData()
  }
}

const prevPage = async () => {
  if (pagination.value.current > 1) {
    pagination.value.current--
    await fetchData()
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addItem = async (values: any) => {
  rows.value = [...rows.value, values]
  if (props.dataStream) {
    await fetchData()
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateItem = async (id: number | string, values: any) => {
  const index = rows.value.findIndex((row) => row.id === id)
  if (index !== -1) {
    Object.assign(rows.value[index], values)
  }
  if (props.dataStream) {
    await fetchData()
  }
}

const removeItem = async (id: number | string) => {
  rows.value = rows.value.filter((i) => i.id !== id)

  if (rows.value.length === 0 && pagination.value.current > 1) {
    pagination.value.current--
  }

  await fetchData()
}

const toggleExpand = (index: number) => {
  expandedRows.value[index] = !expandedRows.value[index]

  if (expandedRows.value[index]) {
    emit('expand', index, rows.value[index])
  }
}

defineExpose({ addItem, updateItem, removeItem, fetchData })
</script>

<template>
  <div>
    <div v-if="props.empty && rows.length === 0 && !loading">
      <EmptyPage
        :title="props.empty.title"
        :description="props.empty.description"
        :action="props.empty.action"
        @action="emit('add')"
      />
    </div>
    <div v-else>
      <!-- overflow-x-auto not working with dropdown -->
      <div :class="props.tableContainer?.class || 'w-full'">
        <table class="table-auto w-full dark:text-gray-300 overflow-x-auto">
          <!-- Table Head -->
          <thead
            :class="
              props.thead?.class ||
              'text-xs uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-t border-gray-100 dark:border-gray-700/60'
            "
          >
            <tr>
              <th
                v-if="props.showCheckbox"
                class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px"
              >
                <div class="flex items-center">
                  <label class="inline-flex">
                    <span class="sr-only">Select all</span>
                    <input
                      id="parent-checkbox"
                      class="form-checkbox"
                      type="checkbox"
                      @change="checkAll"
                    />
                  </label>
                </div>
              </th>
              <th
                v-if="props.expandable"
                class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px"
              >
                <div class="flex items-center">
                  <label class="inline-flex">
                    <span class="sr-only">Expand</span>
                  </label>
                </div>
              </th>
              <th
                v-for="(column, index) in props.columns"
                :key="index"
                :class="
                  column.head?.class || 'text-left px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap'
                "
                :style="column.width ? { width: column.width } : {}"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <!-- Table Body -->
          <tbody
            :class="
              props.tbody?.class ||
              'text-sm divide-y divide-gray-100 dark:divide-gray-700/60 border-b border-gray-200 dark:border-gray-700/60'
            "
          >
            <template v-for="(row, rowIndex) in rows" :key="rowIndex">
              <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td
                  v-if="props.showCheckbox"
                  class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px"
                >
                  <div class="flex items-center">
                    <label class="inline-flex">
                      <span class="sr-only">Select</span>
                      <input
                        :id="`checkbox${row.id}`"
                        class="form-checkbox"
                        type="checkbox"
                        :value="row.id"
                        :checked="selected.includes(row.id)"
                        @change="checkRow"
                      />
                    </label>
                  </div>
                </td>
                <td
                  v-if="props.expandable"
                  class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px"
                >
                  <div class="flex items-center">
                    <label class="inline-flex">
                      <span class="sr-only">Expand</span>
                      <div class="flex items-center">
                        <button
                          class="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transform"
                          :class="expandedRows[rowIndex] && 'rotate-180'"
                          :aria-expanded="expandedRows[rowIndex]"
                          @click.prevent="toggleExpand(rowIndex)"
                          :aria-controls="`description-${rowIndex}`"
                        >
                          <span class="sr-only">Menu</span>
                          <svg class="w-8 h-8 fill-current" viewBox="0 0 32 32">
                            <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z" />
                          </svg>
                        </button>
                      </div>
                    </label>
                  </div>
                </td>
                <td
                  v-for="(column, colIndex) in columns"
                  :key="colIndex"
                  :class="
                    column.class ? column.class : 'px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap'
                  "
                >
                  <div v-if="column.customSlot">
                    <slot
                      :name="column.customSlot"
                      :text="row[column.key]"
                      :row="row"
                      :rowIndex="rowIndex"
                    >
                      {{ row[column.key] || '' }}
                    </slot>
                  </div>
                  <div v-else>
                    {{ row[column.key] || '' }}
                  </div>
                </td>
              </tr>
              <Transition name="slide-row">
                <tr v-if="props.expandable && expandedRows[rowIndex]" role="region">
                  <td :colspan="props.columns.length + 1" class="px-2 first:pl-5 last:pr-5 py-3">
                    <slot name="expandedRow" :row="row" :rowIndex="rowIndex"></slot>
                  </td>
                </tr>
              </Transition>
            </template>
          </tbody>
        </table>
      </div>

      <div v-if="props.showPagination && totalPages > 1" class="mt-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <nav class="mb-4 sm:mb-0 sm:order-1" role="navigation" aria-label="Navigation">
            <ul class="flex justify-center">
              <li class="ml-3 first:ml-0">
                <Button
                  variant="black"
                  :disabled="pagination.current === 1 || loading"
                  @click="prevPage"
                  >&lt;- Previous</Button
                >
              </li>
              <li class="ml-3 first:ml-0">
                <Button
                  variant="black"
                  :disabled="pagination.current === totalPages || loading"
                  @click="nextPage"
                  >Next -&gt;</Button
                >
              </li>
            </ul>
          </nav>
          <div class="text-sm text-gray-500 text-center sm:text-left">
            Showing
            <span class="font-medium text-gray-600 dark:text-gray-300">{{
              (pagination.current - 1) * pagination.pageSize
            }}</span>
            to
            <span class="font-medium text-gray-600 dark:text-gray-300">
              {{
                pagination.current * pagination.pageSize > pagination.total
                  ? pagination.total
                  : pagination.current * pagination.pageSize
              }}
            </span>
            of
            <span class="font-medium text-gray-600 dark:text-gray-300">{{ pagination.total }}</span>
            results
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-row-enter-active,
.slide-row-leave-active {
  transition:
    transform 0.3s ease-out,
    opacity 0.3s ease-out;
}

.slide-row-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-row-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
