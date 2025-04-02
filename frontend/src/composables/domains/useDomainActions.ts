import axios from '@/plugins/axios'
import { useConfirm } from '../useConfirm'
import { useToast } from '../useToast'

const { confirm } = useConfirm()
const { toast } = useToast()

const fetchDomainById = async (id: number) => {
  try {
    const { data } = await axios.get(`/api/domains/${id}`)

    return data
  } catch (e) {
    console.error(e)

    return null
  }
}

const fetchDomains = async (filters: unknown) => {
  const { data } = await axios.get('/api/domains', {
    params: filters,
  })

  return data
}

const deleteDomain = async (id: number, callback?: () => void) => {
  const confirmed = await confirm({
    icon: 'danger',
    variant: 'danger',
    acceptButtonText: 'Yes, delete it!',
    title: 'Remove domain',
    description: 'Are you sure you want to delete this domain?',
  })

  if (confirmed) {
    const { data } = await axios.delete(`/api/domains/${id}`)
    if (data) {
      toast('Domain deleted successfully!', 'success')
    }
    if (callback) callback()
  }
}

export const useDomainActions = () => ({ fetchDomainById, fetchDomains, deleteDomain })
