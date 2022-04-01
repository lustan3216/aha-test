import {NextFunction, Response, Request} from 'express';
import {User} from '@prisma/client';
import userSerializer from '@serializers/user.serializer';
import {compare, hash} from 'bcrypt';
import {Exception} from '@utils/exception';
import IndexController from '@controllers/index.controller';

export default class UsersController extends IndexController {
  getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = req.query.page || 0;
      const per = 10;
      const currentPage = (page as number) - 1;
      const allUser: User[] = await this.usersClient.findMany({
        skip: per * currentPage,
        take: per,
      });
      const total = await this.usersClient.count();

      res.status(200).json({
        data: allUser.map(user => userSerializer(user)),
        meta: {currentPage: currentPage + 1, total},
      });
    } catch (error) {
      next(error);
    }
  };

  userMeGe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.status(200).json({data: userSerializer(req.currentUser)});
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const currentUser = req.currentUser;
      const updateUserData = await this.usersClient.update({
        where: {id: currentUser.id},
        data: {username: req.body.username || currentUser.username},
      });

      res.status(200).json({data: userSerializer(updateUserData)});
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const isPasswordMatching = await compare(
        req.body.oldPassword,
        req.currentUser.password || ''
      );
      if (isPasswordMatching) {
        const newHashedPassword = await hash(req.body.newPassword, 10);
        const updateUserData = await this.usersClient.update({
          where: {id: req.currentUser.id},
          data: {password: newHashedPassword},
        });

        res.status(200).json({data: userSerializer(updateUserData)});
      } else {
        next(new Exception(400, {oldPassword: ['Old password is invalid']}));
      }
    } catch (error) {
      next(error);
    }
  };
}
