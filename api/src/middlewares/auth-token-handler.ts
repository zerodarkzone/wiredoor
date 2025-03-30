import {
  ExpressMiddlewareInterface,
  ForbiddenError,
  UnauthorizedError,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';
import { Node } from '../database/models/node';
import { NodesService } from '../services/nodes-service';
import { PatService } from '../services/pat-service';
import jwt from 'jsonwebtoken';
import config from '../config';
import { PersonalAccessToken } from 'src/database/models/personal-access-token';

export interface AuthenticatedUser extends PersonalAccessToken {
  nodeName?: string;
  address?: string
}

@Service()
export class AuthTokenHandler implements ExpressMiddlewareInterface {
  constructor(
    @Inject() private readonly nodesService: NodesService,
    @Inject() private readonly patService: PatService
  ) {}

  async use(
    request: Request,
    response: Response,
    next: (err?: any) => NextFunction,
  ) {
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1] || request.query?.token;
    // @ts-ignore
    request.user = await this.getUserFromToken(token);
    next();
  }

  async getUserFromToken(token: string): Promise<AuthenticatedUser> {
    if (!token || token === 'None') {
      throw new UnauthorizedError();
    }

    let data = undefined;

    try {
      data = jwt.verify(
        token,
        config.jwt.secret
      );
    } catch (e) {
      throw new UnauthorizedError();
    }

    if (!data) {
      throw new UnauthorizedError();
    }

    if (data.type === 'client') {
      const pat = await this.patService.getPatById(data.id, ['node']);

      if (!pat || pat.revoked || pat.expireAt > new Date) {
        throw new ForbiddenError();
      }
  
      return {
        ...data,
        nodeId: pat.nodeId,
        nodeName: pat.node.name,
        address: pat.node.address,
        tokenName: pat.name
      };
    }
    
    return data;
  }
}
