import axios from 'axios';
import { compare, hash } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { User } from '@prisma/client';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithCurrentUser, FacebookProfile, GoogleProfile } from '@/types/auth.interface';
import EmailService from '@services/email.service';
import { createAuthToken, verifyEmailToken } from '@utils/token';
import { Provider } from '@/types/provider.enum';
import { Exception } from '@utils/exception';
import IndexController from '@controllers/index.controller';
import { FRONTEND_DOMAIN } from '@config';

const EXPIRES_IN = 60 * 60 * 1000;

export default class AuthController extends IndexController {
  emailService = new EmailService();

  signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;

      const findUser: User = await this.usersClient.findUnique({ where: { email: userData.email } });
      if (findUser) {
        next(new Exception(400, { email: [`This email ${userData.email} already exists`] }));
      }

      const hashedPassword = await hash(userData.password, 10);
      const createUserData: User = await this.usersClient.create({ data: { ...userData, password: hashedPassword } });

      const token = createAuthToken(createUserData.id, EXPIRES_IN);

      res.cookie('Authorization', token, { maxAge: EXPIRES_IN, httpOnly: true });
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  };

  logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;

      const findUser: User = await this.usersClient.findUnique({ where: { email: userData.email } });
      if (!findUser) {
        next(new Exception(400, { email: [`You're email ${userData.email} not found`] }));
      }

      if (!findUser.password && findUser.provider != Provider.LOCAL) {
        next(new Exception(400, { password: [`You should login with ${findUser.provider}`] }));
      }

      const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
      if (!isPasswordMatching) {
        next(new Exception(400, { password: ["You're password not matching"] }));
      }

      await this.usersClient.update({
        where: { email: userData.email },
        data: {
          loginCount: {
            increment: 1,
          },
        },
      });

      const token = createAuthToken(findUser.id, EXPIRES_IN);
      res.cookie('Authorization', token, { maxAge: EXPIRES_IN });
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  };

  logInFacebook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { data } = await axios.get<FacebookProfile>(
        `https://graph.facebook.com/me?access_token=${req.body.accessToken}&fields=email,name,id,gender,picture`,
      );
      const user: User = await this.usersClient.upsert({
        where: { email: data.email },
        update: {
          isVerify: true,
          picture: data.picture.data.url,
          loginCount: {
            increment: 1,
          },
        },
        create: {
          email: data.email,
          username: data.name,
          provider: Provider.FACEBOOK,
          isVerify: true,
          picture: data.picture.data.url,
        },
      });

      const token = createAuthToken(user.id, EXPIRES_IN);
      res.cookie('Authorization', token, { maxAge: EXPIRES_IN });
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  };

  logInGoogle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { data } = await axios.get<GoogleProfile>(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${req.body.accessToken}`);

      const user: User = await this.usersClient.upsert({
        where: { email: data.email },
        update: {
          isVerify: true,
          picture: data.picture,
          loginCount: {
            increment: 1,
          },
        },
        create: {
          email: data.email,
          username: data.name,
          provider: Provider.GOOGLE,
          isVerify: true,
          picture: data.picture,
        },
      });

      const token = createAuthToken(user.id, EXPIRES_IN);
      res.cookie('Authorization', token, { maxAge: EXPIRES_IN });
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  };

  logOut = async (req: RequestWithCurrentUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.currentUser;

      const findUser: User = await this.usersClient.findFirst({ where: { email: userData.email, password: userData.password } });
      if (!findUser) {
        next(new Exception(400, "You're not user"));
      }

      res.cookie('Authorization', '', { maxAge: 0 });
      res.status(200).json({ data: findUser });
    } catch (error) {
      next(error);
    }
  };

  emailVerify = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const emailToken = req.params.token.toString();
      const { email } = await verifyEmailToken(emailToken);
      const user: User = await this.usersClient.update({ where: { email }, data: { isVerify: true } });

      const token = createAuthToken(user.id, EXPIRES_IN);

      res.cookie('Authorization', token, { maxAge: EXPIRES_IN, httpOnly: true, secure: true });
      res.redirect(`${FRONTEND_DOMAIN}/dashboard/profile`);
    } catch (error) {
      next(error);
    }
  };

  sendEmailVerify = async (req: RequestWithCurrentUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.emailService.sendVerifyEmail(req.currentUser.email);
      res.status(200).json({ email: req.currentUser.email });
    } catch (error) {
      next(error);
    }
  };
}
