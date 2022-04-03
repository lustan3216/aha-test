import {NextFunction, Request, Response} from 'express';
import {User} from '@prisma/client';
import EmailService from '@services/email.service';
import {createAuthToken, verifyEmailToken} from '@utils/token';
import IndexController from '@controllers/index.controller';
import {
  AUTH_COOKIES_OPTION,
  FRONTEND_DOMAIN,
  COOKIES_EXPIRES_IN,
} from '@config';

export default class AuthController extends IndexController {
  emailService = new EmailService();

  emailVerify = async (req: Request, res: Response): Promise<void> => {
    try {
      const emailToken = req.params.token.toString();
      const {email} = await verifyEmailToken(emailToken);
      const user = await this.usersClient.findUnique({
        where: {email},
      });

      if (!user.isVerify) {
        await this.usersClient.update({
          where: {email},
          data: {
            isVerify: true,
            loginCount: {
              increment: 1,
            },
          },
        });
      }

      const token = createAuthToken(user.id, COOKIES_EXPIRES_IN);

      res.cookie('Authorization', token, AUTH_COOKIES_OPTION);
      res.redirect(`${FRONTEND_DOMAIN}/dashboard/profile`);
    } catch (error) {
      res.redirect(`${FRONTEND_DOMAIN}/auth/email-verify?error=fail`);
    }
  };

  emailVerifySend = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      this.emailService.sendVerifyEmail(req.currentUser.email);
      res.status(200).json({email: req.currentUser.email});
    } catch (error) {
      next(error);
    }
  };
}
