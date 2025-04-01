import { faker } from '@faker-js/faker';
import { DomainType } from '../../../validators/domain-validator';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const makeDomainData = (params?: any): DomainType => {
  return {
    domain: params?.domain || faker.internet.domainName(),
    ssl: params?.ssl || 'self-signed',
  };
};
