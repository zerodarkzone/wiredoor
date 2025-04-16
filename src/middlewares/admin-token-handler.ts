import {
  ExpressMiddlewareInterface,
  ForbiddenError,
  UnauthorizedError,
} from 'routing-controllers';
import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';
import { PersonalAccessToken } from '../database/models/personal-access-token';
import { getDataFromToken } from './auth-token-handler';

export interface AuthenticatedUser extends PersonalAccessToken {
  nodeName?: string;
  address?: string;
}

@Service()
export class AdminTokenHandler implements ExpressMiddlewareInterface {
  constructor() {}

  async use(
    request: Request,
    response: Response,
    next: (err?: unknown) => NextFunction,
  ): Promise<void> {
    const authHeader = request.headers.authorization;
    const token =
      (authHeader && authHeader.split(' ')[1]) || request.query?.token;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    request.user = await this.getUserFromToken(token);
    next();
  }

  async getUserFromToken(token: string): Promise<AuthenticatedUser> {
    const data = await getDataFromToken(token);

    if (!data) {
      throw new UnauthorizedError();
    }

    if (data.type === 'admin') {
      return data;
    } else {
      throw new ForbiddenError();
    }
  }
}
