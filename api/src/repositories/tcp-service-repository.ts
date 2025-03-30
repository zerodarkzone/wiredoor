import { Inject, Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';
import { TcpService } from '../database/models/tcp-service';
import config from '../config';
import { ValidationError } from '../utils/errors/validation-error';

@Service()
export class TcpServiceRepository extends Repository<TcpService> {
  constructor (@Inject('dataSource') dataSource: DataSource) {
    super(TcpService, dataSource.createEntityManager());
  }

  
  async getAvailablePort() {
    if (!config.server.port_range) {
      throw new ValidationError({
        body: [
          {
            field: 'port',
            message: 'Your servers needs TCP_SERVICES_PORT_RANGE env variable defined.'
          }
        ]
      });
    }

    const min = +config.server.port_range.split('-')[0];
    const max = +config.server.port_range.split('-').length == 2 ? +config.server.port_range.split('-')[1] : min;

    const servicePorts = await this.createQueryBuilder('tcpService')
      .select('tcpService.port')
      .getRawMany();

    const usedPorts = new Set(servicePorts.map((s) => s.port));

    const rangeSize = max - min + 1;

    if (usedPorts.size >= rangeSize) {
      throw new ValidationError({
        body: [
          {
            field: 'port',
            message: `No ports avaliable in range from ${min} to ${max} to expose your service.`
          }
        ]
      });
    }
    
    let port = null;

    for (let i = min; i <= max; i++) {
      if (!usedPorts.has(i)) {
        port = i;
        break;
      }
    }

    return port;
  }
}
