import rateLimit from 'express-rate-limit';
import { CurrentUser, Get, JsonController, UseBefore } from 'routing-controllers';
import { Service } from 'typedi';
import { AuthTokenHandler } from '../middlewares/auth-token-handler';
import config from '../config';

export interface PublicServerConfig {
  VPN_HOST: string
  TCP_SERVICES_PORT_RANGE: string
}

@Service()
@JsonController('/config')
export default class ConfigController {
  constructor () {}

  @Get('/')
  @UseBefore(
    rateLimit({
      windowMs: 60 * 1000, // 1min
      max: 60,
      message: 'Rate Limit exceeded'
    }),
    AuthTokenHandler
  )
  async getPublicConfig(): Promise<PublicServerConfig> {
    return {
      VPN_HOST: config.wireguard.host,
      TCP_SERVICES_PORT_RANGE: config.server.port_range
    };
  }
}