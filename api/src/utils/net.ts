import { readFile } from 'fs/promises';
import net from 'net';
import dns from 'dns';
import CLI from './cli';
import config from '../config';

export default class Net {
  static async addRoute(
    subnet: string,
    via: string,
    i = 'wg0',
  ): Promise<boolean> {
    try {
      await CLI.exec(`ip route add ${subnet} via ${via} dev ${i}`);

      return true;
    } catch {
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async delRoute(subnet: string, via?: string): Promise<boolean> {
    try {
      await CLI.exec(`ip route del ${subnet}`);

      return true;
    } catch {
      return false;
    }
  }

  static async isReachable(ip: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const pingCmd = `ping -q -c 1 -4 -s 8 -W 3 ${ip}`;
      try {
        const { stdout } = await CLI.exec(pingCmd);
        if (
          stdout &&
          stdout.indexOf(
            '1 packets transmitted, 1 packets received, 0% packet loss',
          ) !== -1
        ) {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch {
        resolve(false);
      }
    });
  }

  static async isIPForwardEnabled(): Promise<boolean> {
    try {
      const data = await readFile('/proc/sys/net/ipv4/ip_forward', 'utf8');
      return data.trim() === '1';
    } catch {
      return false;
    }
  }

  static async nslookup(domain: string, resolver?: string): Promise<string[]> {
    try {
      if (resolver) {
        const nsResolver = new dns.Resolver();

        nsResolver.setServers([resolver]);

        return new Promise((resolve) => {
          nsResolver.resolve(domain, (err, addresses) => {
            if (err) {
              resolve(null);
            }
            if (!addresses || !addresses.length) {
              resolve(null);
            }
            resolve(addresses);
          });
        });
      }

      return new Promise((resolve) => {
        dns.resolve(domain, (err, addresses) => {
          if (err) {
            resolve(null);
          }
          if (!addresses || !addresses.length) {
            resolve(null);
          }
          resolve(addresses);
        });
      });
    } catch {
      return null;
    }
  }

  static async checkCNAME(domain: string): Promise<string[]> {
    try {
      return new Promise((resolve) => {
        dns.resolve(domain, (err, addresses) => {
          if (err) {
            resolve(null);
          }
          if (!addresses || !addresses.length) {
            resolve(null);
          }
          resolve(addresses);
        });
      });
    } catch {
      return null;
    }
  }

  static async lookupIncludesThisServer(domain: string): Promise<boolean> {
    const lookup = await Promise.all([
      this.nslookup(domain),
      this.checkCNAME(domain),
    ]);

    return (
      (lookup[0] || lookup[1]) && lookup.flat().includes(config.wireguard.host)
    );
  }

  static async checkPort(
    host: string,
    port: number,
    resolver?: string,
    timeout = 3000,
  ): Promise<boolean> {
    let customResolver = null;

    if (resolver) {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      customResolver = (hostname, options, callback) => {
        dns.resolve4(hostname, (err, addresses) => {
          if (err) {
            return callback(err);
          }

          callback(null, addresses[0], 4);
        });
      };
    }

    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(timeout);

      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });

      socket.on('error', () => {
        socket.destroy();
        resolve(false);
      });

      socket.connect({
        host,
        port,
        lookup: customResolver,
      });
    });
  }
}
