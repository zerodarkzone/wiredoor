import Container from 'typedi';
import WireguardService from '../services/wireguard/wireguard-service';
import { SSLManager } from '../services/proxy-server/ssl-manager';
import { HttpServicesService } from '../services/http-services-service';
import { TcpServicesService } from '../services/tcp-services-service';
import { DomainsService } from '../services/domains-service';
import { NginxManager } from '../services/proxy-server/nginx-manager';

export default async (): Promise<void> => {
  await SSLManager.generateDefaultCerts();

  try {
    await Container.get(WireguardService).initialize();
  } catch (e) {
    console.warn(`Unable to initialize VPN server`);
    console.error(e);
  }

  try {
    await Container.get(DomainsService).initialize();
  } catch (e) {
    console.warn(`Unable to initialize Domains`);
    console.error(e);
  }

  try {
    await Container.get(HttpServicesService).initialize();
  } catch (e) {
    console.warn(`Unable to initialize HTTP Services`);
    console.error(e);
  }

  try {
    await Container.get(TcpServicesService).initialize();
  } catch (e) {
    console.warn(`Unable to initialize TCP Services`);
    console.error(e);
  }

  await NginxManager.reloadServer();
};
