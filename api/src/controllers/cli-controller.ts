import { Inject, Service } from 'typedi';
import { celebrate } from 'celebrate';
import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  Post,
  QueryParams,
  UseBefore,
} from 'routing-controllers';
import { NodesService } from '../services/nodes-service';
import { HttpServicesService } from '../services/http-services-service';
import { TcpServicesService } from '../services/tcp-services-service';
import {
  HttpServiceFilterQueryParams,
  httpServiceFilterValidator,
  HttpServiceType,
  httpServiceValidator,
} from '../validators/http-service-validator';
import {
  TcpServiceFilterQueryParams,
  TcpServiceType,
  tcpServiceValidator,
} from '../validators/tcp-service-validator';
import {
  AuthenticatedUser,
  AuthTokenHandler,
} from '../middlewares/auth-token-handler';
import BaseController from './base-controller';
import { Node } from '../database/models/node';
import { WGConfigObject } from '../services/wireguard/wireguard-service';
import { HttpService } from '../database/models/http-service';
import { PagedData } from '../repositories/filters/repository-query-filter';
import { TcpService } from '../database/models/tcp-service';

@Service()
@JsonController('/cli')
@UseBefore(AuthTokenHandler)
export default class CLiController extends BaseController {
  constructor(
    @Inject() private readonly nodesService: NodesService,
    @Inject() private readonly httpServicesService: HttpServicesService,
    @Inject() private readonly tcpServicesService: TcpServicesService,
  ) {
    super();
  }

  @Get('/node')
  async getCliNode(
    @CurrentUser({ required: true }) cli: AuthenticatedUser,
  ): Promise<Node> {
    return this.nodesService.getNode(+cli.nodeId);
  }

  @Get('/config')
  async getCliConfig(
    @CurrentUser({ required: true }) cli: AuthenticatedUser,
  ): Promise<string> {
    return this.nodesService.getNodeConfig(+cli.nodeId);
  }

  @Get('/wgconfig')
  async getCliWGConfig(
    @CurrentUser({ required: true }) cli: AuthenticatedUser,
  ): Promise<WGConfigObject> {
    return this.nodesService.getNodeWGConfig(+cli.nodeId);
  }

  @Get('/services/http')
  @UseBefore(
    celebrate({
      query: httpServiceFilterValidator,
    }),
  )
  async getCliServices(
    @CurrentUser({ required: true }) cli: AuthenticatedUser,
    @QueryParams() params: HttpServiceFilterQueryParams,
  ): Promise<HttpService | HttpService[] | PagedData<HttpService>> {
    return this.httpServicesService.getNodeHttpServices(+cli.nodeId, params);
  }

  @Get('/services/tcp')
  @UseBefore(
    celebrate({
      query: httpServiceFilterValidator,
    }),
  )
  async getCliTcpServices(
    @CurrentUser({ required: true }) cli: AuthenticatedUser,
    @QueryParams() params: TcpServiceFilterQueryParams,
  ): Promise<TcpService | TcpService[] | PagedData<TcpService>> {
    return this.tcpServicesService.getNodeTcpServices(+cli.nodeId, params);
  }

  @Post('/expose/http')
  @UseBefore(
    celebrate({
      body: httpServiceValidator,
    }),
  )
  async createNodeService(
    @CurrentUser({ required: true }) cli: AuthenticatedUser,
    @Body() params: HttpServiceType,
  ): Promise<HttpService> {
    return this.httpServicesService.createHttpService(+cli.nodeId, params);
  }

  @Post('/expose/tcp')
  @UseBefore(
    celebrate({
      body: tcpServiceValidator,
    }),
  )
  async createNodeTcpService(
    @CurrentUser({ required: true }) cli: AuthenticatedUser,
    @Body() params: TcpServiceType,
  ): Promise<TcpService> {
    return this.tcpServicesService.createTcpService(+cli.nodeId, params);
  }
}
