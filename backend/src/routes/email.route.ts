import { Router } from 'express';
import EmailController from '@controllers/email.controller';
import { Routes } from '@/types/routes.interface';
import tokenMiddleware from '@middlewares/token.middleware';

class AuthRoute implements Routes {
  path = '/';
  router = Router();
  emailController = new EmailController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/email-verify/:token`, this.emailController.emailVerify);
    this.router.post(`/email-verify`, tokenMiddleware, this.emailController.emailVerifySend);
  }
}

export default AuthRoute;
