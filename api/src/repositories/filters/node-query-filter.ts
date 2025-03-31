import { Inject, Service } from 'typedi';
import { Node } from '../../database/models/node';
import { RepositoryQueryFilter } from './repository-query-filter';
import { NodeRepository } from '../node-repository';
import { SelectQueryBuilder } from 'typeorm';

@Service()
export class NodeQueryFilter extends RepositoryQueryFilter<Node> {
  constructor(@Inject() repository: NodeRepository) {
    super(repository);
  }

  // protected allowedRelations(): string[] {
  //   return ['httpServices', 'tcpServices'];
  // }

  type(
    param: 'nodes' | 'gateways' | undefined = undefined,
  ): SelectQueryBuilder<Node> {
    if (param) {
      console.log(param, typeof param);
      console.log(`Filtering by type of node ${param}...`);
      return this.builder.where({
        isGateway: param === 'gateways',
      });
    }
  }
}
