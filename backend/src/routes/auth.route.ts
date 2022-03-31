import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto, AccessTokenDto } from '@dtos/users.dto';
import { Routes } from '@/types/routes.interface';
import tokenWithVerifyMiddleware from '@middlewares/tokenWithVerify.middleware';
import tokenMiddleware from '@middlewares/token.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/email-verify/:token`, this.authController.emailVerify);
    this.router.post(`/email-verify`, tokenMiddleware, this.authController.sendEmailVerify);
    this.router.post(`/signup`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);
    this.router.post(`/login`, validationMiddleware(CreateUserDto, 'body'), this.authController.logIn);
    this.router.post(`/login/google`, validationMiddleware(AccessTokenDto, 'body'), this.authController.logInGoogle);
    this.router.post(`/login/facebook`, validationMiddleware(AccessTokenDto, 'body'), this.authController.logInFacebook);
    this.router.post(`/logout`, tokenWithVerifyMiddleware, this.authController.logOut);
  }
}

export default AuthRoute;
