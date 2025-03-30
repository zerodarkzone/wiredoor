import { Inject, Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';
import { PersonalAccessToken } from '../database/models/personal-access-token';

@Service()
export class PersonalAccessTokenRepository extends Repository<PersonalAccessToken> {
  constructor (@Inject('dataSource') dataSource: DataSource) {
    super(PersonalAccessToken, dataSource.createEntityManager());
  }
}
