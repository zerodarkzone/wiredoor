import Joi from 'joi';

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
}
