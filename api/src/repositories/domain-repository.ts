import { Inject, Service } from 'typedi';
import { DataSource } from 'typeorm';
import { Domain } from '../database/models/domain';
import BaseRepository from './base-repository';

@Service()
export class DomainRepository extends BaseRepository<Domain> {
  constructor (@Inject('dataSource') dataSource: DataSource) {
    super(Domain, dataSource.createEntityManager());
  }

  getDomainByName(domainName: string): Promise<Domain> {
    return this.findOneBy({ domain: domainName });
  }
}
