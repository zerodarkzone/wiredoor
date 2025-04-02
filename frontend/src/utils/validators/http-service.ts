import type { ObjectSchema } from 'joi'
import Joi from './joi-validator'
import type { Node } from './node-validator'

export interface HttpService {
  id?: number
  name: string
  domain?: string
  pathLocation?: string
  backendHost?: string
  backendPort?: number
  backendProto?: string
  allowedIps?: string[]
  blockedIps?: string[]
  node?: Node
  publicAccess?: string
}

export interface HttpServiceForm {
  id?: number
  name: string
  domain?: string
  pathLocation?: string
  backendHost?: string
  backendPort?: number
  backendProto?: string
  allowedIps?: string[]
  blockedIps?: string[]
}

export const httpServiceValidator: ObjectSchema<HttpServiceForm> = Joi.object({
  name: Joi.string().required(),
  domain: Joi.string().domain().optional(),
  pathLocation: Joi.string().pattern(/^\/.*/).optional(),
  backendProto: Joi.string().valid('http', 'https').allow(null).optional(),
  backendHost: Joi.string().allow(null).optional(),
  backendPort: Joi.number().port().optional(),
  allowedIps: Joi.array()
    .items(Joi.string().ip({ cidr: 'optional' }).optional())
    .allow(null)
    .optional(),
  blockedIps: Joi.array()
    .items(Joi.string().ip({ cidr: 'optional' }).optional())
    .allow(null)
    .optional(),
}).or('domain', 'pathLocation')
