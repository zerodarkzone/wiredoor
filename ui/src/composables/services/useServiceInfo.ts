import type { HttpService } from '@/utils/validators/http-service'
import type { TcpService } from '@/utils/validators/tcp-service'
import { ref } from 'vue'

const isOpen = ref<boolean>(false)
const service = ref<HttpService | TcpService | undefined>()

export function useServiceInfo() {

  const closeDialog = (): void => {
    isOpen.value = false
    service.value = undefined
  }

  const openServiceInfo = (n: HttpService | TcpService) => {
    isOpen.value = true
    service.value = n
  }

  return { isOpen, service, closeDialog, openServiceInfo }
}
