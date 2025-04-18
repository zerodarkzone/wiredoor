<script setup lang="ts">
import { InfoModal } from '@/components/ui/modal'
import { useNodeInfo } from '@/composables/nodes/useNodeInfo'
import TerminalWindow from '@/components/TerminalWindow.vue'
import { Button }  from '@/components/ui/button'
import InputField from '../ui/form/InputField.vue'
import { useNodeActions } from '@/composables/nodes/useNodeActions'
import { computed, ref } from 'vue'

const { isOpen, closeDialog, node } = useNodeInfo()

const { downloadConfig } = useNodeActions()

const copyIcon = ref('copy')

const copyToken = async () => {
  if (node.value?.token) {
    copyIcon.value = 'copyCheck'
    try {
      await navigator.clipboard.writeText(node.value?.token)
      setTimeout(() => (copyIcon.value = 'copy'), 2000)
    } catch (err) {
      copyIcon.value = 'copy'
      console.error('Error copying text: ', err)
    }
  }
}

const publicUrl = computed(() => window.location.origin)

const copyCommand = async () => {
  try {
    if (node.value?.token)
      await navigator.clipboard.writeText(`wiredoor connect --url=${publicUrl.value} --token=${node.value?.token}`)
  } catch {}
}
</script>
<template>
  <InfoModal title="Your Node is Ready" :is-open="isOpen" :close-dialog="closeDialog" size="large">
    <article v-if="node" class="prose m-auto">
      <h1 class="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">
        Your node is ready! You can connect using one of the following methods:
      </h1>

      <div class="my-6">
        <h2 class="font-medium text-lg">1. Recommended: Using Wiredoor-CLI tool</h2>

        <p>
          The easiest and most secure way to connect is by using the
          <a class="text-blue-500 hover:underline cursor-pointer" target="_blank" href="https://github.com/wiredoor/wiredoor-cli">wiredoor-cli</a>
          tool with your unique token:
        </p>

        <div class="mt-5">
          <InputField
            v-if="node.token"
            v-model="node.token"
            field="token"
            :action="copyIcon"
            message="The token is only visible once. Make sure to store it securely."
            readonly
            @action="copyToken"
          ></InputField>
        </div>


        <div class="my-10">
          <TerminalWindow
            title="Wiredoor CLI"
            :entries="[
              {
                command: 'wiredoor connect',
                flags: [`--url=${publicUrl}`, '--token=SECRET'],
                results: ['Configuring wiredoor...', 'Connecting node...', 'Connection established!'],
                copy: true,
              },
            ]"
            @copy="copyCommand"
          />
        </div>

        <p class="mt-4">
          The token will be securely stored in <span class="rounded-md border-1 p-1 bg-gray-100 dark:bg-gray-700">/etc/wiredoor/config.ini</span> after running this command. If you lose the token, you will need to generate a new one.
        </p>
      </div>

      <div class="my-5">
        <h2 class="font-medium text-lg">2. Using WireGuard Configuration</h2>

        <p>
          Alternatively, you can download the WireGuard node configuration file and use it with any
          <a class="text-blue-500 hover:underline cursor-pointer" href="https://www.wireguard.com/install/" target="_blank">
            WireGuard client
          </a>.
        </p>

        <div class="flex justify-center my-5">
          <Button variant="info" @click="downloadConfig(node.id)">Download Configuration</Button>
        </div>

        <p>Import this file into your WireGuard client to establish a connection.</p>
      </div>
    </article>
  </InfoModal>
</template>
