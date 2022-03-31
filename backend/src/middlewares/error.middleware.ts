import { NextFunction, Request, Response } from 'express';
import { Exception } from '@utils/exception';
import { logger } from '@utils/logger';

const errorMiddleware = (error: Exception, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';
    const errors: Record<string, object> = error.errors || {};

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    res.status(status).json({ message, errors });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
