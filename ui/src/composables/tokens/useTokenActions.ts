import axios from 'axios'
import { useConfirm } from '../useConfirm'
import { useToast } from '../useToast'

const { confirm } = useConfirm()
const { toast } = useToast()

const revokeToken = async (nodeId: number, tokenId: number, callback: () => void) => {
  const confirmed = await confirm({
    icon: 'danger',
    variant: 'danger',
    acceptButtonText: 'Yes, revoke token!',
    title: 'Revoke Personal Access Token',
    description: 'Revoking this token will immediately disable its access to the system, preventing authentication for any services or applications using it. However, this does not necessarily terminate an active WireGuard tunnel. If the token has been compromised, you should disable the node to fully revoke access. Are you sure you want to revoke this token?',
  })

  if (confirmed) {
    const { data } = await axios.patch(`/api/nodes/${nodeId}/pats/${tokenId}/revoke`)
    if (data) {
      toast('Personal Access Token revoked successfully!', 'success')
    }
    callback()
  }
}

const deleteToken = async (nodeId: number, tokenId: number, callback: () => void) => {
  const confirmed = await confirm({
    icon: 'danger',
    variant: 'danger',
    acceptButtonText: 'Yes, delete it!',
    title: 'Delete Personal Access Token',
    description: 'Deleting this token will permanently remove it from the system and cannot be undone. However, this does not necessarily disconnect an active WireGuard tunnel. If the token has been compromised, you should disable the node to fully revoke access. Are you sure you want to delete this token?',
  })

  if (confirmed) {
    const { data } = await axios.delete(`/api/nodes/${nodeId}/pats/${tokenId}`)
    if (data) {
      toast('Personal Access Token deleted successfully!', 'success')
    }
    callback()
  }
}

export const useTokenActions = () => ({
  revokeToken,
  deleteToken
})
