import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import { HttpException } from '@exceptions/http.exception';
import { ErrorMap } from '@/types/response.interface';

const validationMiddleware = (
  type: any,
  value: string | 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
): RequestHandler => {
  return (req, res, next) => {
    validate(plainToInstance(type, req[value]), { skipMissingProperties, whitelist, forbidNonWhitelisted }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(',');
        const errorsMap: ErrorMap = errors.reduce((acc, current) => {
          acc[current.property] = Object.values(current.constraints);
          return acc;
        }, {});

        next(new HttpException(400, message, errorsMap));
      } else {
        next();
      }
    });
  };
};

export default validationMiddleware;
