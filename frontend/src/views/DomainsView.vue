<script setup lang="ts">
import DomainsTable from '@/components/domains/DomainsTable.vue'
import MainLayout from '@/components/layouts/MainLayout.vue'
import { Button } from '@/components/ui/button'
import { ref } from 'vue'

const domainsTable = ref()

const createDomain = () => {
  domainsTable.value.createDomain()
}
</script>

<template>
  <MainLayout>
    <div class="relative">
      <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <div class="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2">
          <div class="mb-4 sm:mb-0">
            <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Domains</h1>
          </div>
          <div class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            <!-- <DeleteButton :selectedItems="selectedItems" /> -->
            <div class="hidden sm:block">
              <SearchForm />
            </div>
            <Button variant="black" @click="createDomain">Add Domain</Button>
          </div>
        </div>

        <DomainsTable ref="domainsTable" />
      </div>
    </div>
  </MainLayout>
</template>
