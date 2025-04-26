import { ObjectSchema } from 'joi';
import Joi from './joi-validator';
import { FilterQueryDto } from '../repositories/filters/repository-query-filter';
import { nslookupResolvesServerIp } from './domain-validator';
import Container from 'typedi';
import { DomainRepository } from '../repositories/domain-repository';

export const validateServiceDomain = async (c: string): Promise<string> => {
  const domain = await Container.get(DomainRepository).getDomainByName(c);

  if (domain) {
    return c;
  }

  return nslookupResolvesServerIp(c);
};

export interface HttpServiceType {
  name: string;
  domain?: string;
  pathLocation?: string;
  backendHost?: string;
  backendPort?: number;
  backendProto?: string;
  allowedIps?: string[];
  blockedIps?: string[];
  enabled?: boolean;
}

export interface HttpServiceFilterQueryParams extends FilterQueryDto {
  limit?: number;
  page?: number;
  orderBy?: string;
  nodeId?: number;
  domain?: string;
}

export const httpServiceFilterValidator: ObjectSchema<HttpServiceFilterQueryParams> =
  Joi.object({
    limit: Joi.number().optional(),
    page: Joi.number().optional(),
    orderBy: Joi.string()
      .pattern(/,(asc|desc)$/)
      .optional(),
    nodeId: Joi.number().optional(),
    domain: Joi.string().domain().optional(),
  });

export const httpServiceValidator: ObjectSchema<HttpServiceType> = Joi.object({
  id: Joi.number().optional(),
  name: Joi.string().required(),
  domain: Joi.string()
    .domain()
    .allow(null, '')
    .external(validateServiceDomain)
    .optional(),
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
  requireAuth: Joi.boolean().when('domain', {
    is: Joi.string().domain(),
    then: Joi.boolean().allow(null).optional(),
    otherwise: Joi.boolean().valid(false).allow(null).optional(),
  }),
}).or('domain', 'pathLocation');
