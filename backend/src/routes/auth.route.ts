import {Router} from 'express';
import AuthController from '@controllers/auth.controller';
import {CreateUserDto, AccessTokenDto} from '@dtos/users.dto';
import {Routes} from '@/types/routes';
import tokenWithVerifyMiddleware from '@middlewares/tokenWithVerify.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class AuthRoute implements Routes {
  path = '/';
  router = Router();
  authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/signup',
      validationMiddleware(CreateUserDto, 'body'),
      this.authController.signUp
    );
    this.router.post(
      '/login',
      validationMiddleware(CreateUserDto, 'body'),
      this.authController.logIn
    );
    this.router.post(
      '/login/google',
      validationMiddleware(AccessTokenDto, 'body'),
      this.authController.logInGoogle
    );
    this.router.post(
      '/login/facebook',
      validationMiddleware(AccessTokenDto, 'body'),
      this.authController.logInFacebook
    );
    this.router.post(
      '/logout',
      tokenWithVerifyMiddleware,
      this.authController.logOut
    );
  }
}

export default AuthRoute;
