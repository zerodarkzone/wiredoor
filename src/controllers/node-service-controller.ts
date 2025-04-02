import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
  QueryParam,
  QueryParams,
  UseBefore,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import Joi from 'joi';
import { celebrate } from 'celebrate';
import BaseController from './base-controller';
import { AuthTokenHandler } from '../middlewares/auth-token-handler';
import {
  HttpServiceFilterQueryParams,
  httpServiceFilterValidator,
  HttpServiceType,
  httpServiceValidator,
} from '../validators/http-service-validator';
import {
  TcpServiceFilterQueryParams,
  tcpServiceFilterValidator,
  TcpServiceType,
  tcpServiceValidator,
} from '../validators/tcp-service-validator';
import { HttpServicesService } from '../services/http-services-service';
import { TcpServicesService } from '../services/tcp-services-service';
import { HttpService } from '../database/models/http-service';
import { PagedData } from '../repositories/filters/repository-query-filter';
import { TcpService } from '../database/models/tcp-service';

@Service()
@JsonController('/services')
@UseBefore(AuthTokenHandler)
export default class NodeServiceController extends BaseController {
  constructor(
    @Inject() private readonly httpServicesService: HttpServicesService,
    @Inject() private readonly tcpServicesService: TcpServicesService,
  ) {
    super();
  }

  @Get('/http')
  @UseBefore(
    celebrate({
      query: httpServiceFilterValidator,
    }),
  )
  async getHttpServices(
    @QueryParams() filters: HttpServiceFilterQueryParams,
  ): Promise<HttpService | HttpService[] | PagedData<HttpService>> {
    return this.httpServicesService.getHttpServices(filters);
  }

  @Get('/:nodeId/http')
  @UseBefore(
    celebrate({
      params: Joi.object({ nodeId: Joi.string().required() }),
      query: httpServiceFilterValidator,
    }),
  )
  async getNodeHttpServices(
    @Param('nodeId') nodeId: string,
    @QueryParams() params: HttpServiceFilterQueryParams,
  ): Promise<HttpService | PagedData<HttpService> | HttpService[]> {
    return this.httpServicesService.getNodeHttpServices(+nodeId, params);
  }

  @Post('/:nodeId/http')
  @UseBefore(
    celebrate({
      params: Joi.object({ nodeId: Joi.string().required() }),
      body: httpServiceValidator,
    }),
  )
  async createNodeService(
    @Param('nodeId') nodeId: string,
    @Body() params: HttpServiceType,
  ): Promise<HttpService> {
    return this.httpServicesService.createHttpService(+nodeId, params);
  }

  @Get('/:nodeId/http/:serviceId')
  async getService(
    @Param('nodeId') nodeId: string,
    @Param('serviceId') serviceId: string,
  ): Promise<HttpService> {
    return this.httpServicesService.getHttpService(+serviceId, ['node']);
  }

  @Patch('/:nodeId/http/:serviceId')
  @UseBefore(
    celebrate({
      params: Joi.object({
        nodeId: Joi.string().required(),
        serviceId: Joi.string().required(),
      }),
      body: httpServiceValidator,
    }),
  )
  async updateService(
    @Param('nodeId') nodeId: string,
    @Param('serviceId') serviceId: string,
    @Body() params,
  ): Promise<HttpService> {
    return this.httpServicesService.updateHttpService(+serviceId, params);
  }

  @Patch('/:nodeId/http/:serviceId/enable')
  @UseBefore(
    celebrate({
      params: Joi.object({
        nodeId: Joi.string().required(),
        serviceId: Joi.string().required(),
      }),
    }),
  )
  async enableService(
    @Param('nodeId') nodeId: string,
    @Param('serviceId') serviceId: string,
  ): Promise<HttpService> {
    return this.httpServicesService.enableService(+serviceId);
  }

  @Patch('/:nodeId/http/:serviceId/disable')
  @UseBefore(
    celebrate({
      params: Joi.object({
        nodeId: Joi.string().required(),
        serviceId: Joi.string().required(),
      }),
    }),
  )
  async disableService(
    @Param('nodeId') nodeId: string,
    @Param('serviceId') serviceId: string,
  ): Promise<HttpService> {
    return this.httpServicesService.disableService(+serviceId);
  }

  @Delete('/:nodeId/http/:serviceId')
  async deleteNodeService(
    @Param('nodeId') nodeId: string,
    @Param('serviceId') serviceId: string,
  ): Promise<string> {
    return this.httpServicesService.deleteHttpService(+serviceId);
  }

  @Get('/:nodeId/http/:serviceId/ping')
  async pingHttpService(
    @Param('nodeId') nodeId: string,
    @Param('serviceId') serviceId: string,
    @QueryParam('path') path?: string,
  ): Promise<{ status: number }> {
    return this.httpServicesService.pingHttpServiceBackend(+serviceId, path);
  }

  @Get('/tcp')
  @UseBefore(
    celebrate({
      query: tcpServiceFilterValidator,
    }),
  )
  async getTcpServices(
    @QueryParams() filters: TcpServiceFilterQueryParams,
  ): Promise<TcpService | TcpService[] | PagedData<TcpService>> {
    return this.tcpServicesService.getTcpServices(filters);
  }

  @Get('/:nodeId/tcp')
  @UseBefore(
    celebrate({
      params: Joi.object({ nodeId: Joi.string().required() }),
      query: tcpServiceFilterValidator,
    }),
  )
  async getNodeTcpServices(
    @Param('nodeId') nodeId: string,
    @QueryParams() params: TcpServiceFilterQueryParams,
  ): Promise<TcpService | PagedData<TcpService> | TcpService[]> {
    return this.tcpServicesService.getNodeTcpServices(+nodeId, params);
  }

  @Post('/:nodeId/tcp')
  @UseBefore(
    celebrate({
      params: Joi.object({ nodeId: Joi.string().required() }),
      body: tcpServiceValidator,
    }),
  )
  async createNodeTcpService(
    @Param('nodeId') nodeId: string,
    @Body() params: TcpServiceType,
  ): Promise<TcpService> {
    return this.tcpServicesService.createTcpService(+nodeId, params);
  }

  @Get('/:nodeId/tcp/:serviceId')
  async getTcpService(
    @Param('nodeId') nodeId: string,
    @Param('serviceId') serviceId: string,
  ): Promise<TcpService> {
    return this.tcpServicesService.getTcpService(+serviceId, ['node']);
  }

  @Patch('/:nodeId/tcp/:serviceId')
  @UseBefore(
    celebrate({
      params: Joi.object({
        nodeId: Joi.string().required(),
        serviceId: Joi.string().required(),
      }),
      body: tcpServiceValidator,
    }),
  )
  async updateTcpService(
    @Param('nodeId') nodeId: string,
    @Param('serviceId') serviceId: string,
    @Body() params: TcpServiceType,
  ): Promise<TcpService> {
    return this.tcpServicesService.updateTcpService(+serviceId, params);
  }

  @Patch('/:nodeId/tcp/:serviceId/enable')
  @UseBefore(
    celebrate({
      params: Joi.object({
        nodeId: Joi.string().required(),
        serviceId: Joi.string().required(),
      }),
    }),
  )
  async enableTcpService(
    @Param('nodeId') nodeId: string,
    @Param('serviceId') serviceId: string,
  ): Promise<TcpService> {
    return this.tcpServicesService.enableTcpService(+serviceId);
  }

  @Patch('/:nodeId/tcp/:serviceId/disable')
  @UseBefore(
    celebrate({
      params: Joi.object({
        nodeId: Joi.string().required(),
        serviceId: Joi.string().required(),
      }),
    }),
  )
  async disableTcpService(
    @Param('nodeId') nodeId: string,
    @Param('serviceId') serviceId: string,
  ): Promise<TcpService> {
    return this.tcpServicesService.disableTcpService(+serviceId);
  }

  @Delete('/:nodeId/tcp/:serviceId')
  async deleteNodeTcpService(
    @Param('nodeId') nodeId: string,
    @Param('serviceId') serviceId: string,
  ): Promise<string> {
    return this.tcpServicesService.deleteTcpService(+serviceId);
  }
}
