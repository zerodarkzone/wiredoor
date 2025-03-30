import { faker } from '@faker-js/faker';
import { CreatePATType } from 'src/validators/pat-validator';

export const makePATData = (params?: any): CreatePATType => {
  return {
    name: params?.name || faker.internet.domainWord(),
    exapireAt: params?.expireAt || null,
    revoked: params?.revoked || false,
  };
}