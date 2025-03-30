import axios from 'axios'
import { useConfirm } from '../useConfirm'
import { useToast } from '../useToast'

const { confirm } = useConfirm()
const { toast } = useToast()

const fetchServiceById = async (nodeId: number, serviceType: 'tcp' | 'http', serviceId: number) => {
  try {
    const { data } = await axios.get(`/api/services/${nodeId}/${serviceType}/${serviceId}`)

    return data
  } catch (e) {
    console.error(e)

    return null
  }
}

const enableService = async (nodeId: number, serviceType: 'tcp' | 'http', serviceId: number, callback: () => void) => {
  const confirmed = await confirm({
    icon: 'info',
    variant: 'info',
    acceptButtonText: 'Yes, enable public access!',
    title: 'Enable Public Access',
    description: 'Enabling public access will make this service reachable from external networks. Do you want to expose this service publicly?',
  })

  if (confirmed) {
    const { data } = await axios.patch(`/api/services/${nodeId}/${serviceType}/${serviceId}/enable`)
    if (data) {
      toast('Service exposed successfully!', 'success')
    }
    callback()
  }
}

const disableService = async (nodeId: number, serviceType: 'tcp' | 'http', serviceId: number, callback: () => void) => {
  const confirmed = await confirm({
    icon: 'danger',
    variant: 'danger',
    acceptButtonText: 'Yes, disable public access!',
    title: 'Disable Public Access',
    description: 'Disabling public access will make it unreachable from external networks. Do you want to stop exposing this service publicly?',
  })

  if (confirmed) {
    const { data } = await axios.patch(`/api/services/${nodeId}/${serviceType}/${serviceId}/disable`)
    if (data) {
      toast('Service disabled from public access successfully!', 'success')
    }
    callback()
  }
}

const deleteService = async (nodeId: number, serviceType: 'tcp' | 'http', serviceId: number, callback: () => void) => {
  const confirmed = await confirm({
    icon: 'danger',
    variant: 'danger',
    acceptButtonText: 'Yes, delete it!',
    title: 'Delete service',
    description: 'This action will permanently remove the service from the system. This cannot be undone. Are you sure you want to delete this service?',
  })

  if (confirmed) {
    const { data } = await axios.delete(`/api/services/${nodeId}/${serviceType}/${serviceId}`)
    if (data) {
      toast('Service deleted successfully!', 'success')
    }
    callback()
  }
}

export const useServiceActions = () => ({
  fetchServiceById,
  enableService,
  disableService,
  deleteService,
})
