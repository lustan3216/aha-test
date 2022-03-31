import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { PasswordResetDto, UpdateUserDto } from '@dtos/users.dto';
import { Routes } from '@/types/routes';
import tokenWithVerifyMiddleware from '@middlewares/tokenWithVerify.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class UsersRoute implements Routes {
  path = '/';
  router = Router();
  usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/me`, tokenWithVerifyMiddleware, this.usersController.userMeGe);
    this.router.get(`/users`, tokenWithVerifyMiddleware, this.usersController.getUsers);
    this.router.patch(`/me`, tokenWithVerifyMiddleware, validationMiddleware(UpdateUserDto, 'body', true), this.usersController.updateUser);
    this.router.patch(
      `/me/reset-password`,
      tokenWithVerifyMiddleware,
      validationMiddleware(PasswordResetDto, 'body', true),
      this.usersController.resetPassword,
    );
  }
}

export default UsersRoute;
