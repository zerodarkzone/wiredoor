import type { PAT } from '@/utils/validators/token-validator'
import { ref } from 'vue'

const isOpen = ref<boolean>(false)
const accessToken = ref<PAT | undefined>()

export function useTokenInfo() {

  const closeDialog = (): void => {
    isOpen.value = false
    accessToken.value = undefined
  }

  const openTokenInfo = (n: PAT) => {
    isOpen.value = true
    accessToken.value = n
  }

  return { isOpen, accessToken, closeDialog, openTokenInfo }
}
