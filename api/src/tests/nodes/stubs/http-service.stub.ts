import { faker } from '@faker-js/faker';
import { HttpServiceType } from '../../../validators/http-service-validator';

export const makeHttpServiceData = (params?: any): HttpServiceType => {
  return {
    name: params?.name || faker.internet.domainWord(),
    domain: params?.domain || faker.internet.domainName(),
    pathLocation: params?.pathLocation || '/',
    backendProto: params?.backendProto || 'http',
    backendPort: params?.backendPort || 80,
    allowedIps: params?.allowedIps || []
  }
}