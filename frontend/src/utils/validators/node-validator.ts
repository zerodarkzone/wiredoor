import Joi from './joi-validator'
import type { PAT } from './token-validator'

export interface Node {
  clientIp?: string
  id: number
  name: string
  address: string
  wgInterface: string
  allowedIPs: string
  enabled: boolean
  isGateway: boolean
  isLocal?: boolean
  allowInternet?: boolean
  gatewayNetwork?: string
  latestHandshakeTimestamp?: number
  transferRx?: number
  transferTx?: number
  status?: string
  token?: string
  personalAccessTokens?: PAT[]
  created_at: string
  updated_at: string
}

export interface NodeForm {
  id?: number
  name: string
  address?: string
  allowInternet?: boolean
  isGateway?: boolean
  gatewayNetwork?: string
}

export const nodeValidator = Joi.object<NodeForm>({
  id: Joi.number().optional(),
  name: Joi.string().required(),
  address: Joi.string().allow('').ip({ version: 'ipv4', cidr: 'forbidden' }).optional(),
  allowInternet: Joi.boolean().optional(),
  isGateway: Joi.boolean().optional(),
  gatewayNetwork: Joi.string().when('isGateway', {
    is: true,
    then: Joi.string().ip({ cidr: 'required' }).required(),
    otherwise: Joi.valid(null, '').optional(),
  }),
})
