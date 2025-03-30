import {
  ExpressMiddlewareInterface,
} from 'routing-controllers';
import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

export interface ResponseSSE extends Response {
  sendDataAsStream(data: any): void;
}

@Service()
export class SetupSSE implements ExpressMiddlewareInterface {
  constructor() {}

  async use(
    req: Request,
    res: ResponseSSE,
    next: (err?: any) => NextFunction,
  ) {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');

    if (res.hasOwnProperty('flushHeaders')) {
      res.flushHeaders();
    }

    res.sendDataAsStream = (data) => {
      try {
        if (!data) {
          return;
        }

        const payload = `data: ${JSON.stringify(data)}\n\n`;

        if (res.hasOwnProperty('flush')) {
          res.flush();
        }
        
        res.write(payload);
      } catch (e) {
        console.error("Error sending event stream", e);
      }
    }

    req.on('close', () => {
      res.end();
    });

    next();
  }
}
