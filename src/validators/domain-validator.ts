import { ObjectSchema, ValidationError } from 'joi';
import Joi from './joi-validator';
import config from '../config';
import { FilterQueryDto } from '../repositories/filters/repository-query-filter';
import Net from '../utils/net';

export const nslookupResolvesServerIp = async (c: string): Promise<string> => {
  if (c) {
    const lookup = await Net.lookupIncludesThisServer(c);

    if (!lookup) {
      throw new ValidationError(
        `nslookup failed`,
        [
          {
            path: ['domain'],
            message: `nslookup doesn't resolves your server IP: ${config.wireguard.host}`,
            type: 'Error',
          },
        ],
        null,
      );
    }
  }

  return c;
};

export interface DomainType {
  domain: string;
  ssl?: string;
  validation?: boolean;
}

export interface DomainFilterQueryParams extends FilterQueryDto {
  limit?: number;
  page?: number;
  orderBy?: string;
}

export const domainFilterValidator: ObjectSchema<DomainFilterQueryParams> =
  Joi.object({
    limit: Joi.number().optional(),
    page: Joi.number().optional(),
    orderBy: Joi.string()
      .pattern(/,(asc|desc)$/)
      .optional(),
  });

export const domainValidator: ObjectSchema<DomainType> = Joi.object({
  domain: Joi.string()
    .domain()
    .when('skipValidation', {
      is: true,
      then: Joi.string().domain().required(),
      otherwise: Joi.string()
        .domain()
        .external(nslookupResolvesServerIp)
        .required(),
    }),
  ssl: Joi.string().when('skipValidation', {
    is: true,
    then: Joi.valid('self-signed').allow(null).optional(),
    otherwise: Joi.valid('self-signed', 'certbot').allow(null).optional(),
  }),
  enableOauth2: Joi.boolean().optional(),
  allowedEmails: Joi.string().when('enableOauth2', {
    is: true,
    then: Joi.valid(null).allow(null).optional(),
    otherwise: Joi.valid('self-signed', 'certbot').allow(null).optional(),
  }),
  skipValidation: Joi.boolean().optional(),
});
