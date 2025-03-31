import { NginxConf } from './nginx-conf';

export class NginxLocationConf extends NginxConf {
  constructor(config = []) {
    super(config);
  }

  setResolver(resolver: string): NginxLocationConf {
    this.addBlock('resolver', `${resolver} valid=30s`);
    this.addBlock('resolver_timeout', '10s');

    return this;
  }

  setProxyPass(streamOrEndpoint: string): NginxLocationConf {
    this.addBlock('proxy_pass', streamOrEndpoint);
    this.addBlock('include', 'partials/proxy.conf');

    return this;
  }

  setProxySslVerify(verify: 'on' | 'off'): NginxLocationConf {
    this.addBlock('proxy_ssl_verify', verify);

    return this;
  }

  setClientMaxBodySize(size: string): NginxLocationConf {
    this.addBlock('client_max_body_size', size);

    return this;
  }

  setNetworkAccess(
    allowedIps: string[],
    blockedIps: string[] = [],
  ): NginxLocationConf {
    if (allowedIps && allowedIps.length) {
      allowedIps.forEach((ip) => {
        this.addBlock('allow', ip);
      });
      this.addBlock('deny', 'all');
    }

    if (blockedIps && blockedIps.length) {
      blockedIps.forEach((ip) => {
        this.addBlock('deny', ip);
      });
    }

    return this;
  }

  setRoot(path: string): NginxLocationConf {
    this.addBlock('root', path);

    return this;
  }

  public getLocationNginxConf(path: string = '/'): string {
    const nginxConf = new NginxConf();

    nginxConf.addLocation(path, this);

    return nginxConf.getNginxConf();
  }
}
