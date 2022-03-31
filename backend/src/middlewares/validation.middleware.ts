import {plainToInstance} from 'class-transformer';
import {validate, ValidationError} from 'class-validator';
import {RequestHandler} from 'express';
import {Exception} from '@utils/exception';
import {ErrorMap} from '@/types/response';

interface Request extends Express.Request {
  [key: string]: any;
}

const validationMiddleware = (
  type: any,
  value: string | 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true
): RequestHandler => {
  return (req: Request, res, next) => {
    validate(plainToInstance(type, req[value]), {
      skipMissingProperties,
      whitelist,
      forbidNonWhitelisted,
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const initMap: ErrorMap = {};
        const errorsMap = errors.reduce((acc, current) => {
          if (current.constraints) {
            acc[current.property] = Object.values(current.constraints);
          }

          return acc;
        }, initMap);

        next(new Exception(400, errorsMap));
      } else {
        next();
      }
    });
  };
};

export default validationMiddleware;
