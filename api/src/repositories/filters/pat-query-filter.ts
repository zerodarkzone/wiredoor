import { Inject, Service } from 'typedi';
import { RepositoryQueryFilter } from './repository-query-filter';
import { PersonalAccessToken } from '../../database/models/personal-access-token';
import { PersonalAccessTokenRepository } from '../personal-access-token-repository';

@Service()
export class PatQueryFilter extends RepositoryQueryFilter<PersonalAccessToken> {
  constructor(@Inject() repository: PersonalAccessTokenRepository) {
    super(repository);
  }

  protected allowedRelations(): string[] {
    return ['node'];
  }

  nodeId(param = null) {
    if (param !== null) {
      return this.builder.where({
        nodeId: param,
      });
    }
  }
}