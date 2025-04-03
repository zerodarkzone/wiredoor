import type { Node } from '@/utils/validators/node-validator'
import { ref } from 'vue'

const isOpen = ref<boolean>(false)
const node = ref<Node | undefined>()

export function useNodeInfo() {
  const closeDialog = (): void => {
    isOpen.value = false
    node.value = undefined
  }

  const openNodeInfo = (n: Node) => {
    isOpen.value = true
    node.value = n
  }

  return { isOpen, node, closeDialog, openNodeInfo }
}
