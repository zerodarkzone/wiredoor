import { reactive } from 'vue'

interface ConfirmOptions {
  title?: string
  description?: string
  icon?: string
  variant?: 'info' | 'danger' | 'success'
  cancelButtonText?: string
  acceptButtonText?: string
}
interface ConfirmState {
  open: boolean
  options: ConfirmOptions
  resolve: (value: boolean) => void
}

const confirmState = reactive<ConfirmState>({
  open: false,
  options: { title: '', description: '' },
  resolve: () => {},
})

export function useConfirm() {
  const confirm = (options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      confirmState.open = true
      confirmState.options = options
      confirmState.resolve = resolve
    })
  }

  const closeConfirm = (result: boolean) => {
    confirmState.open = false
    confirmState.resolve(result)
  }

  return { confirmState, confirm, closeConfirm }
}
