import { Body, CurrentUser, Get, JsonController, Post, UseBefore } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { AdminAuthService } from '../services/admin-auth-service';
import { celebrate, Joi } from 'celebrate';
import rateLimit from 'express-rate-limit';
import { AuthTokenHandler } from '../middlewares/auth-token-handler';

@Service()
@JsonController('/auth')
export default class AuthController {
  constructor (
    @Inject() private readonly authService: AdminAuthService,
  ) {}

  @Get('/me')
  @UseBefore(
    rateLimit({
      windowMs: 60 * 1000, // 1min
      max: 60,
      message: 'Rate Limit exceeded'
    }),
    AuthTokenHandler
  )
  async getUser(@CurrentUser({ required: true }) user) {
    return user;
  }

  @Post('/login')
  @UseBefore(
    celebrate({
      body: {
        username: Joi.string().required(),
        password: Joi.string().required(),
      }
    }),
    rateLimit({
      windowMs: 10 * 60 * 1000, // 10min
      max: 5,
      message: 'Rate Limit exceeded'
    })
  )
  async authenticate(@Body() params: { username: string, password: string }) {
    return this.authService.auth(params.username, params.password);
  }
}