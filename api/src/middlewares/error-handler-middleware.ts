import { HttpError } from "routing-controllers";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/errors/validation-error";
import { isCelebrateError } from 'celebrate';

export function errorHandlerMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }

  if (isCelebrateError(err)) {
    const validation = {};

    for (const [segment, joiError] of err.details.entries()) {
      validation[segment] = joiError.details.map((detail) => {
        return {
          field: detail.path.join('.'),
          message: detail.message
        }
      });
    }

    return res.status(422).send({
      message: 'Validation failed',
      errors: validation,
    });
  }

  if (err instanceof ValidationError) {
    return res.status(422).send({
      message: 'Validation failed',
      errors: err.errors,
    });
  }

  if (err instanceof HttpError) {
    res.status(err.httpCode);
    if (err.httpCode >= 500) {
      console.error(err)
    }
  } else {
    res.status(400);
  }

  return res.json({
    status: 'error',
    message: err.message || err.name || 'Unknown error'
  });
}
