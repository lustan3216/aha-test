import {NextFunction, Response, Request} from 'express';
import {PrismaClient} from '@prisma/client';
import {Exception} from '@utils/exception';
import {verifyAuthToken} from '@/utils/token';

const tokenWithVerifyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const headerAuthorization = req.header('Authorization');
    const header = headerAuthorization
      ? headerAuthorization.split('Bearer ')[1]
      : null;
    const Authorization = req.cookies['Authorization'] || header;

    if (!Authorization) {
      res.cookie('Authorization', '', {maxAge: 0});
      next(new Exception(401, 'Authentication token missing'));
      return;
    }

    const verificationResponse = verifyAuthToken(Authorization);
    const userId = verificationResponse.userId;

    const users = new PrismaClient().user;
    const findUser = await users.findUnique({
      where: {id: Number(userId)},
    });

    if (findUser) {
      req.currentUser = findUser;
      next();
    } else {
      res.cookie('Authorization', '', {maxAge: 0});
      next(new Exception(401, 'Wrong authentication token'));
    }
  } catch (error) {
    res.cookie('Authorization', '', {maxAge: 0});
    next(new Exception(401, 'Wrong authentication token'));
  }
};

export default tokenWithVerifyMiddleware;
