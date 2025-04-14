import Joi from 'joi';
import os from 'os';

export default class IP_CIDR {
  static isValidIP(ip: string, version = ['ipv4', 'ipv6']): boolean {
    const { error } = Joi.string().ip({ version }).validate(ip);
    return !error;
  }

  static ipToLong(ip: string): number {
    return ip
      .split('.')
      .reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
  }

  static longToIp(long: number): string {
    return [
      long >>> 24,
      (long >>> 16) & 255,
      (long >>> 8) & 255,
      long & 255,
    ].join('.');
  }

  static cidrToRange(cidr: string): [number, number] {
    const [ip, subnet] = cidr.split('/');
    const ipLong = this.ipToLong(ip);
    const mask = ~(2 ** (32 - parseInt(subnet)) - 1);
    const network = ipLong & mask;
    const broadcast = network + ~mask;

    return [network, broadcast];
  }

  static getInterfaceIp(cidr: string): string {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [networkLong, broadcastLong] = this.cidrToRange(cidr);

    return this.longToIp(networkLong + 1);
  }

  static belongsToSubnet(ip: string, subnet: string): boolean {
    if (!this.isValidIP(ip) || !subnet.includes('/')) return false;

    try {
      const ipLong = this.ipToLong(ip);
      const [networkLong, broadcastLong] = this.cidrToRange(subnet);

      return ipLong >= networkLong && ipLong <= broadcastLong;
    } catch {
      return false;
    }
  }

  static getAvailableIP(cidr: string, bussyIPList: string[]): string | null {
    const [networkLong, broadcastLong] = this.cidrToRange(cidr);
    const bussyLong = bussyIPList.map(this.ipToLong);

    for (let i = networkLong + 2; i < broadcastLong; i++) {
      if (!bussyLong.includes(i)) {
        return this.longToIp(i);
      }
    }

    return null;
  }

  static getLocalSubnet(): string | null {
    const interfaces = os.networkInterfaces();
    const excluded = ['lo', 'wg0', 'docker0', 'tun0', 'virbr0'];

    for (const name of Object.keys(interfaces)) {
      if (excluded.includes(name)) continue;

      const iface = interfaces[name];
      if (!iface) continue;

      for (const net of iface) {
        if (net.family === 'IPv4' && !net.internal) {
          const ip = this.ipToLong(net.address);
          const mask = this.ipToLong(net.netmask);
          const network = ip & mask;
          const cidr = 32 - Math.clz32(~mask >>> 0);

          return `${this.longToIp(network)}/${cidr}`;
        }
      }
    }

    return null;
  }
}
