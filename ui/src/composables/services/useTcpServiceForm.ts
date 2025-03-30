import { type Node } from '@/utils/validators/node-validator';
import { useFormModal } from '../useFormModal';
import { useServiceInfo } from './useServiceInfo';
import { useDomainActions } from '../domains/useDomainActions';
import type { Domain } from '@/utils/validators/domain-validator';
import { tcpServiceValidator, type TcpServiceForm } from '@/utils/validators/tcp-service';
import { ref } from 'vue';

let id: number | undefined = undefined
const node = ref<Node>()
const domainOptions = ref<{
  label: string
  value: string
}[]>()

const {
  isOpen,
  formData,
  errors,
  options,
  openDialog,
  closeDialog,
  submitDialog,
  validateField,
  validate
} = useFormModal<TcpServiceForm>(tcpServiceValidator)

export function useTcpServiceForm () {
  const { openServiceInfo } = useServiceInfo()
  const { fetchDomains } = useDomainActions()

  const openTcpServiceForm = async (
    serviceNode: Node,
    callback?: (form: TcpServiceForm, id: number | undefined) => void,
    initialData: Partial<TcpServiceForm> = { proto: 'tcp', backendPort: 1883 },
    rowId: number | undefined = undefined,
  ) => {
    id = rowId
    node.value = serviceNode

    domainOptions.value = (await fetchDomains({})).map((d: Domain) => ({ label: d.domain, value: d.domain }))

    openDialog({
      id,
      initialData,
      title: 'Expose TCP Service on Node',
      description: `This form allows you to expose an TCP service from a node connected to Wiredoor. The configuration will enable access through a public domain or wiredoor IP and specified port.`,
      endpoint: `/api/services/${node.value.id}/tcp`,
      onSubmit: async (form) => {
        openServiceInfo(form)
        if (!!callback) {
          callback(form, id)
        }
      },
    })
  }

  return { isOpen, formData, options, errors, closeDialog, submitDialog, validateField, validate, domainOptions, node, openTcpServiceForm }
}
