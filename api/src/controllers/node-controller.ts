import { Inject, Service } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import { Request, Response } from 'express';
import { 
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
  QueryParams,
  Req,
  Res,
  UseBefore
} from 'routing-controllers';
import { createNodeValidator, CreateNodeType, nodeFilterValidator, NodeFilterQueryParams, NodeFilterStreamParams } from '../validators/node-validators';
import { CreatePATType, createPATValidator, PatFilterQueryParams, patFilterValidator } from '../validators/pat-validator';
import { NodesService } from '../services/nodes-service';
import { PatService } from '../services/pat-service';
import { AuthTokenHandler } from '../middlewares/auth-token-handler';
import { ResponseSSE, SetupSSE } from '../middlewares/setup-sse';
import BaseController from './base-controller';

@Service()
@JsonController('/nodes')
@UseBefore(AuthTokenHandler)
export default class NodeController extends BaseController {
  constructor (
    @Inject() private readonly nodesService: NodesService,
    @Inject() private readonly patService: PatService,
  ) {
    super();
  }

  @Get('/')
  @UseBefore(
    celebrate({
      query: nodeFilterValidator
    })
  )
  async getNodes(@QueryParams() filters: NodeFilterQueryParams) {
    const nodesFiltered = await this.nodesService.getNodes(filters);

    const nodes = await this.nodesService.getNodesRuntime(nodesFiltered.data);

    return {
      ...nodesFiltered,
      data: nodes,
    }
  }

  @Get('/stream')
  @UseBefore(SetupSSE)
  async getNodesAsStream(@QueryParams() filters: NodeFilterStreamParams, @Req() req: Request, @Res() res: ResponseSSE): Promise<ResponseSSE> {
    if (filters.token) {
      delete filters.token
    }

    if (filters.id) {
      const node = await this.nodesService.getNode(+filters.id);

      return this.responseDataAtInterval(req, res, async () => {
        return this.nodesService.getNodeRuntime(node);
      }, 1000);
    } else {
      const nodes = await this.nodesService.getNodes(filters);

      return this.responseDataAtInterval(req, res, async () => {
        return this.nodesService.getNodesRuntime(nodes.data);
      }, 1000);
    }
  }

  @Post('/')
  @UseBefore(
    celebrate({
      body: createNodeValidator,
    })
  )
  async createNode(
    @Body() params: CreateNodeType
  ) {
    return this.nodesService.createNode(params);
  }

  @Get('/:id')
  @UseBefore(
    celebrate({
      params: Joi.object({ id: Joi.string().required() }),
    })
  )
  async getNode(@Param('id') id: string) {
    return this.nodesService.getNodeInfo(+id);
  }

  @Get('/:id/config')
  @UseBefore(
    celebrate({
      params: Joi.object({ id: Joi.string().required() }),
    })
  )
  async getNodeClientConfig(@Param('id') id: string) {
    return this.nodesService.getNodeConfig(+id);
  }

  @Get('/:id/download')
  @UseBefore(
    celebrate({
      params: Joi.object({ id: Joi.string().required() }),
    })
  )
  async downloadNodeClientConfig(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    return this.nodesService.downloadNodeConfig(+id, res);
  }

  @Patch('/:id')
  @UseBefore(
    celebrate({
      params: Joi.object({ id: Joi.string().required() }),
      body: createNodeValidator,
    })
  )
  async updateNode(@Param('id') id: string, @Body() params) {
    return this.nodesService.updateNode(+id, params);
  }

  @Patch('/:id/disable')
  @UseBefore(
    celebrate({
      params: Joi.object({ id: Joi.string().required() })
    })
  )
  async disableNode(@Param('id') id: string) {
    return this.nodesService.disableNode(+id);
  }

  @Patch('/:id/enable')
  @UseBefore(
    celebrate({
      params: Joi.object({ id: Joi.string().required() })
    })
  )
  async enableNode(@Param('id') id: string) {
    return this.nodesService.enableNode(+id);
  }

  @Delete('/:id')
  @UseBefore(
    celebrate({
      params: Joi.object({ id: Joi.string().required() }),
    })
  )
  async deleteNode(@Param('id') id: string) {
    return this.nodesService.deleteNode(+id);
  }

  @Get('/:id/pats')
  @UseBefore(
    celebrate({
      params: Joi.object({ id: Joi.string().required() }),
      query: patFilterValidator,
    })
  )
  async getPats(@Param('id') id: string, @QueryParams() params: PatFilterQueryParams) {
    return this.patService.getPATs(+id, params);
  }

  @Post('/:id/pats')
  @UseBefore(
    celebrate({
      params: Joi.object({ id: Joi.string().required() }),
      body: createPATValidator,
    })
  )
  async createTokenForNode(@Param('id') id: string, @Body() params: CreatePATType) {
    // ensure that node exists
    const node = await this.nodesService.getNode(+id);
    return this.patService.createNodePAT(node.id, params);
  }

  @Delete('/:id/pats/:patId')
  @UseBefore(
    celebrate({
      params: Joi.object({ 
        id: Joi.string().required(),
        patId: Joi.string().required(),
      })
    })
  )
  async deletePat(@Param('id') id: string, @Param('patId') patId: string) {
    return this.patService.deletePat(+patId);
  }

  @Patch('/:id/pats/:patId/revoke')
  @UseBefore(
    celebrate({
      params: Joi.object({ 
        id: Joi.string().required(),
        patId: Joi.string().required(),
      })
    })
  )
  async revokePat(@Param('id') id: string, @Param('patId') patId: string) {
    return this.patService.revokeToken(+patId);
  }
}