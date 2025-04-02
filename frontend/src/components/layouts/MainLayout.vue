<script setup lang="ts">
import { ref } from 'vue'
import SideBar from '@/components/partials/SideBar.vue'
import TopHeader from '@/components/partials/TopHeader.vue'
import Toast from '@/components/ui/Toast.vue'
import { ConfirmModal } from '@/components/ui/modal'
import NodeModalForm from '../nodes/NodeModalForm.vue'
import DomainModalForm from '@/components/domains/DomainModalForm.vue'
import HTTPServiceModalForm from '../services/HTTPServiceModalForm.vue'
import TCPServiceModalForm from '../services/TCPServiceModalForm.vue'
import ServiceInfo from '../services/ServiceInfo.vue'

const sidebarOpen = ref(false)
</script>

<template>
  <div class="flex h-[100dvh] overflow-hidden">
    <SideBar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />

    <div
      class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-white dark:bg-gray-900"
    >
      <TopHeader :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="grow">
        <slot></slot>
      </main>
    </div>

    <NodeModalForm />
    <DomainModalForm />
    <HTTPServiceModalForm />
    <TCPServiceModalForm />
    <ServiceInfo />
    <ConfirmModal />
    <Toast />
  </div>
</template>
