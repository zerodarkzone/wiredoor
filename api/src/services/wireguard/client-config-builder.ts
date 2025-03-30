import config from '../../config';
import { WgInterface } from '../../database/models/wg-interface';
import { Node } from '../../database/models/node';

export default class ClientConfigBuilder {
  private config: string;

  constructor(serverConfig: WgInterface, node: Node) {
    this.setConfig(serverConfig, node);
  }

  private setConfig(serverConfig: WgInterface, node: Node) {
    this.config = `[Interface]
PrivateKey = ${node.privateKey}
Address = ${node.address}/32
${node.isGateway ? `PostUp = iptables -t nat -A POSTROUTING -s ${serverConfig.subnet} -o eth0 -j MASQUERADE
PostDown = iptables -t nat -D POSTROUTING -s ${serverConfig.subnet} -o eth0 -j MASQUERADE` : ''}

[Peer]
PublicKey = ${serverConfig.publicKey}
PresharedKey = ${node.preSharedKey}
AllowedIPs = ${node.allowInternet ? '0.0.0.0/0, ::/0' : serverConfig.subnet}
PersistentKeepalive = 25
Endpoint = ${config.wireguard.host}:${serverConfig.port}`
  }

  public build(): string {
    return this.config;
  }
}