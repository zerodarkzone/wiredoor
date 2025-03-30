import { faker } from '@faker-js/faker';
import { DomainType } from '../../../validators/domain-validator';

export const makeDomainData = (params?: any): DomainType => {
  return {
    domain: params?.domain || faker.internet.domainName(),
    ssl: params?.ssl || 'self-signed',
  }
}