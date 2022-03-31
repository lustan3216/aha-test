import { NextFunction, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Exception } from '@utils/exception';
import { RequestWithCurrentUser } from '@/types/response';
import { verifyAuthToken } from '@/utils/token';

const tokenWithVerifyMiddleware = async (req: RequestWithCurrentUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const verificationResponse = verifyAuthToken(Authorization);
      const userId = verificationResponse.userId;

      const users = new PrismaClient().user;
      const findUser = await users.update({
        where: { id: Number(userId) },
        data: { activedAt: new Date() },
      });

      if (findUser) {
        req.currentUser = findUser;
        next();
      } else {
        next(new Exception(401, 'Wrong authentication token'));
      }
    } else {
      next(new Exception(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new Exception(401, 'Wrong authentication token'));
  }
};

export default tokenWithVerifyMiddleware;
