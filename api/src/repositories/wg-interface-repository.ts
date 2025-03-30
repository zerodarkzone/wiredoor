import { Inject, Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';
import { WgInterface } from '../database/models/wg-interface';

@Service()
export class WgInterfaceRepository extends Repository<WgInterface> {
  constructor (@Inject('dataSource') dataSource: DataSource) {
    super(WgInterface, dataSource.createEntityManager());
  }
}
