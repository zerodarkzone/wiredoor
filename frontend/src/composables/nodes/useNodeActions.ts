import axios from 'axios'
import { useConfirm } from '../useConfirm'
import { useToast } from '../useToast'

const { confirm } = useConfirm()
const { toast } = useToast()

const fetchNodeById = async (id: number) => {
  try {
    const { data } = await axios.get(`/api/nodes/${id}`)

    return data
  } catch (e) {
    console.error(e)

    return null
  }
}

const downloadConfig = async (id: number) => {
  const { data, headers } = await axios.get(`/api/nodes/${id}/download`, {
    responseType: 'blob',
  })

  const contentDisposition = headers['content-disposition']
  const fileNameMatch = contentDisposition?.match(/filename="(.+)"/)
  const fileName = fileNameMatch ? fileNameMatch[1] : 'config.conf'

  const blob = new Blob([data])
  const downloadUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(downloadUrl)
}

const enableNode = async (id: number, callback: () => void) => {
  const confirmed = await confirm({
    icon: 'info',
    variant: 'info',
    acceptButtonText: 'Yes, connect!',
    title: 'Connect node',
    description: 'Are you sure you want to keep connected this node?',
  })

  if (confirmed) {
    const { data } = await axios.patch(`/api/nodes/${id}/enable`)
    if (data) {
      toast('Node connected successfully!', 'success')
    }
    callback()
  }
}

const disableNode = async (id: number, callback: () => void) => {
  const confirmed = await confirm({
    icon: 'danger',
    variant: 'danger',
    acceptButtonText: 'Yes, disconnect!',
    title: 'Disconnect node',
    description: 'Are you sure you want to keep disconnected this node?',
  })

  if (confirmed) {
    const { data } = await axios.patch(`/api/nodes/${id}/disable`)
    if (data) {
      toast('Node disconnected successfully!', 'success')
    }
    callback()
  }
}

const deleteNode = async (id: number, callback: () => void) => {
  const confirmed = await confirm({
    icon: 'danger',
    variant: 'danger',
    acceptButtonText: 'Yes, delete it!',
    title: 'Delete node',
    description: 'Are you sure you want to delete this node? This action cannot be undone.',
  })

  if (confirmed) {
    const { data } = await axios.delete(`/api/nodes/${id}`)
    if (data) {
      toast('Node deleted successfully!', 'success')
    }
    callback()
  }
}

export const useNodeActions = () => ({
  fetchNodeById,
  downloadConfig,
  enableNode,
  disableNode,
  deleteNode,
})
