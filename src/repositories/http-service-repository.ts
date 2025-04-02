import { Inject, Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';
import { HttpService } from '../database/models/http-service';

@Service()
export class HttpServiceRepository extends Repository<HttpService> {
  constructor(@Inject('dataSource') dataSource: DataSource) {
    super(HttpService, dataSource.createEntityManager());
  }
}
