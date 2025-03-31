import { Request } from 'express';
import { ResponseSSE } from '../middlewares/setup-sse';

export default class BaseController {
  protected async responseDataAtInterval(
    req: Request,
    res: ResponseSSE,
    callback: () => Promise<unknown>,
    interval: number,
  ): Promise<ResponseSSE> {
    const intervalId = setInterval(async () => {
      try {
        const data = await callback();
        res.sendDataAsStream(data);
      } catch {
        res.end();
      }
    }, interval);

    res.on('close', () => {
      clearInterval(intervalId);
    });

    return res;
  }
}
