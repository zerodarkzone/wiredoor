import { faker } from '@faker-js/faker';
import { CreateNodeType } from '../../../validators/node-validators';

export const makeNodeData = (params?: any): CreateNodeType => {
  return {
    name: params?.name || faker.internet.domainWord(),
    address: params?.address || faker.internet.ipv4(),
    interface: params?.interface || 'wg0',
    allowInternet: params?.allowInternet || false,
    isGateway: params?.isGateway || false,
    gatewayNetwork: params?.gatewayNetwork || null,
    enabled: params?.enabled !== undefined ? params.enabled : true,
  }
}