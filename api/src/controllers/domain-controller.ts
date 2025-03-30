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
  UseBefore
} from 'routing-controllers';
import { AuthTokenHandler } from '../middlewares/auth-token-handler';
import BaseController from './base-controller';
import { DomainsService } from '../services/domains-service';
import { DomainFilterQueryParams, domainFilterValidator, DomainType, domainValidator } from '../validators/domain-validator';

@Service()
@JsonController('/domains')
@UseBefore(AuthTokenHandler)
export default class DomainController extends BaseController {
  constructor (
    @Inject() private readonly domainsService: DomainsService,
  ) {
    super();
  }

  @Get('/')
  @UseBefore(
    celebrate({
      query: domainFilterValidator
    })
  )
  async getDomains(@QueryParams() filters: DomainFilterQueryParams) {
    return this.domainsService.getDomains(filters);
  }

  @Post('/')
  @UseBefore(
    celebrate({
      body: domainValidator,
    })
  )
  async createNode(
    @Body() params: DomainType
  ) {
    return this.domainsService.createDomain(params);
  }

  @Get('/:id')
  @UseBefore(
    celebrate({
      params: Joi.object({ id: Joi.string().required() }),
    })
  )
  async getNode(@Param('id') id: string) {
    return this.domainsService.getDomain(+id);
  }

  @Patch('/:id')
  @UseBefore(
    celebrate({
      params: Joi.object({ id: Joi.string().required() }),
      body: domainValidator,
    })
  )
  async updateNode(@Param('id') id: string, @Body() params) {
    return this.domainsService.updateDomain(+id, params);
  }

  @Delete('/:id')
  @UseBefore(
    celebrate({
      params: Joi.object({ id: Joi.string().required() }),
    })
  )
  async deleteNode(@Param('id') id: string) {
    return this.domainsService.deleteDomain(+id);
  }
}
