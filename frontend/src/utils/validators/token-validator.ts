import type { ObjectSchema } from 'joi'
import Joi from './joi-validator'

export interface PAT {
  id?: number
  name?: string
  token: string
  expireAt?: string
  revoked?: boolean
  nodeId?: number
}

export interface TokenForm {
  id?: number
  name: string
  expireAt?: string
  revoked?: boolean
}

export const tokenValidator: ObjectSchema<TokenForm> = Joi.object({
  id: Joi.number().optional(),
  name: Joi.string().required(),
  expireAt: Joi.string().optional(),
  revoked: Joi.boolean().optional(),
})
