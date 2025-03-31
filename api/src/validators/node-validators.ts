import { ObjectSchema } from 'joi';
import Joi from './joi-validator';
import { FilterQueryDto } from '../repositories/filters/repository-query-filter';

export interface NodeFilterQueryParams extends FilterQueryDto {
  limit?: number;
  page?: number;
  orderBy?: string;
  type?: 'nodes' | 'gateways';
}

export interface NodeFilterStreamParams extends NodeFilterQueryParams {
  token?: string;
}

export interface CreateNodeType {
  name: string;
  address?: string;
  interface?: string;
  allowInternet?: boolean;
  enabled?: boolean;
  gatewayNetwork?: string;
  isGateway?: boolean;
}

export interface NodeClientParams extends CreateNodeType {
  wgInterface: string;
  preSharedKey: string;
  publicKey: string;
  privateKey: string;
  clientIp?: string;
  latestHandshakeTimestamp?: number;
  transferRx?: number;
  transferTx?: number;
  status?: 'online' | 'offline' | 'idle';
}

export const nodeFilterValidator: ObjectSchema<NodeFilterQueryParams> =
  Joi.object({
    limit: Joi.number().optional(),
    page: Joi.number().optional(),
    orderBy: Joi.string()
      .pattern(/,(asc|desc)$/)
      .optional(),
    type: Joi.string().valid('nodes', 'gateways').optional(),
  });

export const createNodeValidator: ObjectSchema<CreateNodeType> = Joi.object({
  id: Joi.number().optional(),
  name: Joi.string().required(),
  address: Joi.string()
    .allow('')
    .ip({ version: 'ipv4', cidr: 'forbidden' })
    .optional(),
  allowInternet: Joi.boolean().optional(),
  isGateway: Joi.boolean().optional(),
  gatewayNetwork: Joi.string().when('isGateway', {
    is: true,
    then: Joi.string().ip({ cidr: 'required' }).required(),
    otherwise: Joi.valid(null, '').optional(),
  }),
  // interface: Joi.string().optional(),
  // enabled: Joi.boolean().optional(),
});
