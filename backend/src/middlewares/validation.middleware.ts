import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import { Exception } from '@utils/exception';
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
        const errorsMap: ErrorMap = errors.reduce((acc, current) => {
          acc[current.property] = Object.values(current.constraints);
          return acc;
        }, {});

        next(new Exception(400, errorsMap));
      } else {
        next();
      }
    });
  };
};

export default validationMiddleware;
