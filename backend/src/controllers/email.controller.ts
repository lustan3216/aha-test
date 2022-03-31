import {NextFunction, Request, Response} from 'express';
import {User} from '@prisma/client';
import {RequestWithCurrentUser} from '@/types/response';
import EmailService from '@services/email.service';
import {createAuthToken, verifyEmailToken} from '@utils/token';
import IndexController from '@controllers/index.controller';
import {FRONTEND_DOMAIN} from '@config';

const EXPIRES_IN = 60 * 60;

export default class AuthController extends IndexController {
  emailService = new EmailService();

  emailVerify = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const emailToken = req.params.token.toString();
      const {email} = await verifyEmailToken(emailToken);
      const user: User = await this.usersClient.update({
        where: {email},
        data: {isVerify: true},
      });

      const token = createAuthToken(user.id, EXPIRES_IN);

      res.cookie('Authorization', token, {
        maxAge: EXPIRES_IN,
        httpOnly: true,
        secure: true,
      });
      res.redirect(`${FRONTEND_DOMAIN}/dashboard/profile`);
    } catch (error) {
      next(error);
    }
  };

  emailVerifySend = async (
    req: RequestWithCurrentUser,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.emailService.sendVerifyEmail(req.currentUser.email);
      res.status(200).json({email: req.currentUser.email});
    } catch (error) {
      next(error);
    }
  };
}
