import { Inject, Service } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
  QueryParams,
  UseBefore,
} from 'routing-controllers';
import BaseController from './base-controller';
import { DomainsService } from '../services/domains-service';
import {
  DomainFilterQueryParams,
  domainFilterValidator,
  DomainType,
  domainValidator,
} from '../validators/domain-validator';
import { Domain } from '../database/models/domain';
import { PagedData } from '../repositories/filters/repository-query-filter';
import { AdminTokenHandler } from '../middlewares/admin-token-handler';

@Service()
@JsonController('/domains')
@UseBefore(AdminTokenHandler)
export default class DomainController extends BaseController {
  constructor(@Inject() private readonly domainsService: DomainsService) {
    super();
  }

  @Get('/')
  @UseBefore(
    celebrate({
      query: domainFilterValidator,
    }),
  )
  async getDomains(
    @QueryParams() filters: DomainFilterQueryParams,
  ): Promise<Domain | Domain[] | PagedData<Domain>> {
    return this.domainsService.getDomains(filters);
  }

  @Post('/')
  @UseBefore(
    celebrate({
      body: domainValidator,
    }),
  )
  async createDomain(@Body() params: DomainType): Promise<Domain> {
    return this.domainsService.createDomain(params);
  }

  @Get('/:id')
  @UseBefore(
    celebrate({
      params: Joi.object({ id: Joi.string().required() }),
    }),
  )
  async getDomain(@Param('id') id: string): Promise<Domain> {
    return this.domainsService.getDomain(+id);
  }

  @Patch('/:id')
  @UseBefore(
    celebrate({
      params: Joi.object({ id: Joi.string().required() }),
      body: domainValidator,
    }),
  )
  async updateDomain(@Param('id') id: string, @Body() params): Promise<Domain> {
    return this.domainsService.updateDomain(+id, params);
  }

  @Delete('/:id')
  @UseBefore(
    celebrate({
      params: Joi.object({ id: Joi.string().required() }),
    }),
  )
  async deleteDomain(@Param('id') id: string): Promise<string> {
    return this.domainsService.deleteDomain(+id);
  }
}
