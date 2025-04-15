import { Inject, Service } from 'typedi';
import {
  Get,
  JsonController,
  QueryParams,
  Req,
  Res,
  UseBefore,
} from 'routing-controllers';
import { AccessLogsService } from '../services/access-logs-service';
import BaseController from './base-controller';
import {
  logParamsValidator,
  LogStreamQueryParams,
} from '../validators/log-validator';
import { Request, Response } from 'express';
import { SetupSSE } from '../middlewares/setup-sse';
import { celebrate } from 'celebrate';
import { AdminTokenHandler } from '../middlewares/admin-token-handler';

@Service()
@JsonController('/logs')
@UseBefore(AdminTokenHandler)
export default class LogController extends BaseController {
  constructor(@Inject() private readonly accessLogsService: AccessLogsService) {
    super();
  }

  @Get('/stream')
  @UseBefore(
    celebrate({
      params: logParamsValidator,
    }),
    SetupSSE,
  )
  async getLogsAsStream(
    @QueryParams() filters: LogStreamQueryParams,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    if (filters.token) {
      delete filters.token;
    }

    return this.accessLogsService.responseRealTimeLogs(filters, res);
  }
}
