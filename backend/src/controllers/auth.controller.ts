import axios from 'axios';
import {compare, hash} from 'bcrypt';
import {
  COOKIES_EXPIRES_IN,
  AUTH_COOKIES_OPTION,
  AUTH_CLEAN_COOKIES_OPTION,
} from '@config';
import {NextFunction, Request, Response} from 'express';
import {User} from '@prisma/client';
import {CreateUserDto} from '@dtos/users.dto';
import {FacebookProfile, GoogleProfile} from '@/types/response';
import {createAuthToken} from '@utils/token';
import {Provider} from '@/types/user';
import {Exception} from '@utils/exception';
import IndexController from '@controllers/index.controller';

export default class AuthController extends IndexController {
  signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const email = userData.email;
      const findUser = await this.usersClient.findUnique({
        where: {email},
      });

      if (findUser && findUser.isVerify) {
        next(
          new Exception(400, {
            email: [`This email ${email} already exists`],
          })
        );
      }

      const hashedPassword = await hash(userData.password, 10);
      const createUserData: User = await this.usersClient.upsert({
        where: {email: email},
        update: {email: email, password: hashedPassword},
        create: {email: email, password: hashedPassword},
      });

      const token = createAuthToken(createUserData.id, COOKIES_EXPIRES_IN);

      res.cookie('Authorization', token, AUTH_COOKIES_OPTION);
      res.status(200).json({token});
    } catch (error) {
      next(error);
    }
  };

  logIn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const email = userData.email;
      const findUser = await this.usersClient.findUnique({
        where: {email},
      });

      if (!findUser) {
        return next(
          new Exception(400, {
            email: [`You're email ${email} not found`],
          })
        );
      }

      if (!findUser.password && findUser.provider !== Provider.LOCAL) {
        return next(
          new Exception(400, {
            email: [`This email signed up with ${findUser.provider}`],
          })
        );
      }

      const isPasswordMatching = await compare(
        userData.password,
        findUser.password || ''
      );
      if (!isPasswordMatching) {
        return next(
          new Exception(400, {password: ["You're password not matching"]})
        );
      }

      if (findUser.isVerify) {
        await this.usersClient.update({
          where: {email},
          data: {
            loginCount: {
              increment: 1,
            },
          },
        });
      }

      const token = createAuthToken(findUser.id, COOKIES_EXPIRES_IN);
      res.cookie('Authorization', token, AUTH_COOKIES_OPTION);
      res.status(200).json({token});
    } catch (error) {
      next(error);
    }
  };

  logInFacebook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {data} = await axios.get<FacebookProfile>(
        `https://graph.facebook.com/me?access_token=${req.body.accessToken}&fields=email,name,id,gender,picture`
      );
      const email = data.email;
      const findUser = await this.usersClient.findUnique({where: {email}});
      const user: User = await this.usersClient.upsert({
        where: {email},
        update: {
          isVerify: true,
          picture: data.picture.data.url,
          loginCount: {
            increment: 1,
          },
          username: findUser?.username || data.name,
        },
        create: {
          email,
          username: data.name,
          provider: Provider.FACEBOOK,
          isVerify: true,
          picture: data.picture.data.url,
          loginCount: 1,
        },
      });

      const token = createAuthToken(user.id, COOKIES_EXPIRES_IN);
      res.cookie('Authorization', token, AUTH_COOKIES_OPTION);
      res.status(200).json({token});
    } catch (error) {
      next(error);
    }
  };

  logInGoogle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {data} = await axios.get<GoogleProfile>(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${req.body.accessToken}`
      );

      const email = data.email;
      const findUser = await this.usersClient.findUnique({where: {email}});
      const user: User = await this.usersClient.upsert({
        where: {email},
        update: {
          isVerify: true,
          picture: data.picture,
          loginCount: {
            increment: 1,
          },
          username: findUser?.username || data.name,
        },
        create: {
          email,
          username: data.name,
          provider: Provider.GOOGLE,
          isVerify: true,
          picture: data.picture,
          loginCount: 1,
        },
      });

      const token = createAuthToken(user.id, COOKIES_EXPIRES_IN);
      res.cookie('Authorization', token, AUTH_COOKIES_OPTION);
      res.status(200).json({token});
    } catch (error) {
      next(error);
    }
  };

  logOut = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData = req.currentUser;

      const findUser = await this.usersClient.findFirst({
        where: {email: userData.email, password: userData.password},
      });
      if (!findUser) {
        next(new Exception(400, "You're not user"));
      }

      res.cookie('Authorization', '', AUTH_CLEAN_COOKIES_OPTION);
      res.status(200).json({data: findUser});
    } catch (error) {
      next(error);
    }
  };
}
