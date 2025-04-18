<script setup lang="ts">
import MainLayout from '@/components/layouts/MainLayout.vue'
import BreadCrumb from '@/components/ui/BreadCrumb.vue';
import { useAuthStore } from '@/stores/auth';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const authStore = useAuthStore();

const logContainer = ref<HTMLElement | null>(null)
const logs = ref<string[]>([]);
const streamUrl = ref('');
const breadCrumbItems= ref()

let eventSource: EventSource | undefined

const appendLogs = (lines: string[]) => {
  const MAX_LOGS = 1000

  logs.value.push(...lines)

  if (logs.value.length > MAX_LOGS) {
    logs.value.splice(0, logs.value.length - MAX_LOGS)
  }
}

const logMonitor = () => {
  if (eventSource) {
    eventSource.close()
  }
  if (streamUrl.value) {
    eventSource = new EventSource(streamUrl.value)

    eventSource.onopen = ({}) => {
      console.log('Monitoring started')
    }

    eventSource.onmessage = (event) => {
      appendLogs(JSON.parse(event.data))
    }

    eventSource.onerror = (error) => {
      console.error('SSE ERROR:', error)
      setTimeout(() => {
        console.log('reconnecting...')
        logMonitor()
      }, 1000)
    }
  }
}

onMounted(async () => {
  if (route.name === 'domain-logs') {
    streamUrl.value = `/api/logs/stream?domain=${route.params.domain}&token=${authStore.token}`
    breadCrumbItems.value = [
      { label: 'Domains', to: { name: 'domains' } },
      { label: route.params.domain, to: { name: 'domains' } },
      { label: 'Real Time Logs' }
    ]
  }

  if (route.name === 'service-logs') {
    streamUrl.value = `/api/logs/stream?type=${route.params.type}&id=${route.params.id}&token=${authStore.token}`
    breadCrumbItems.value = [
      { label: 'Nodes', to: { name: 'nodes' } },
      { label: (route.params.type as string).toUpperCase() + ' Services', to: { name: 'node', params: { id: route.params.nodeId } } },
      { label: 'Real Time Logs' }
    ]
  }

  logMonitor()
});

onBeforeUnmount(() => {
  if (eventSource) {
    eventSource.close()
  }
})

const logClass = (log: string) => {
  if (log.includes('[ERROR]')) return 'text-red-600 dark:text-red-400'
  if (log.includes('[WARN]') || log.includes('[WARNING]')) return 'text-yellow-600 dark:text-yellow-400'
  if (log.includes('[INFO]')) return 'text-blue-600 dark:text-blue-400'
  if (log.includes('[DEBUG]')) return 'text-green-600 dark:text-green-400'
  return 'text-gray-800 dark:text-gray-300'
}
</script>

<template>
  <MainLayout>
    <div class="relative bg-gray-100 dark:bg-gray-900 h-full flex flex-col">
      <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto flex-1 flex flex-col min-h-0">
        <BreadCrumb :items="breadCrumbItems" />
        <div class="flex-1 border rounded-xl shadow-md overflow-hidden
                bg-white text-gray-900 border-gray-300
                dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 flex flex-col min-h-0 max-h-[85vh]">
          <div ref="logContainer" class="text-sm font-mono leading-snug text-start p-4 overflow-auto flex-1 min-h-0">
            <div v-for="(log, index) in logs" :key="index" :class="logClass(log)" class="whitespace-pre">{{ log }}</div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
