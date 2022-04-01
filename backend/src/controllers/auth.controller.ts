import axios from 'axios';
import {compare, hash} from 'bcrypt';
import {NODE_ENV} from '@config';
import {NextFunction, Request, Response} from 'express';
import {User} from '@prisma/client';
import {CreateUserDto} from '@dtos/users.dto';
import {
  RequestWithCurrentUser,
  FacebookProfile,
  GoogleProfile,
} from '@/types/response';
import {createAuthToken} from '@utils/token';
import {Provider} from '@/types/user';
import {Exception} from '@utils/exception';
import IndexController from '@controllers/index.controller';

const EXPIRES_IN = 60 * 60;
const secure = NODE_ENV === 'production';

export default class AuthController extends IndexController {
  signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;

      const findUser = await this.usersClient.findUnique({
        where: {email: userData.email},
      });
      if (findUser) {
        next(
          new Exception(400, {
            email: [`This email ${userData.email} already exists`],
          })
        );
      }

      const hashedPassword = await hash(userData.password, 10);
      const createUserData: User = await this.usersClient.create({
        data: {...userData, password: hashedPassword},
      });
      this.emailService.sendVerifyEmail(email);
      const token = createAuthToken(createUserData.id, EXPIRES_IN);

      res.cookie('Authorization', token, {
        maxAge: EXPIRES_IN * 1000,
        httpOnly: true,
        secure,
      });
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

      const findUser = await this.usersClient.findUnique({
        where: {email: userData.email},
      });

      if (!findUser) {
        return next(
          new Exception(400, {
            email: [`You're email ${userData.email} not found`],
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
        next(new Exception(400, {password: ["You're password not matching"]}));
      }

      await this.usersClient.update({
        where: {email: userData.email},
        data: {
          loginCount: {
            increment: 1,
          },
        },
      });
      await this.emailService.sendVerifyEmail(req.currentUser.email);
      const token = createAuthToken(findUser.id, EXPIRES_IN);
      res.cookie('Authorization', token, {
        maxAge: EXPIRES_IN * 1000,
        httpOnly: true,
        secure,
      });
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
      const user: User = await this.usersClient.upsert({
        where: {email: data.email},
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
      res.cookie('Authorization', token, {
        maxAge: EXPIRES_IN * 1000,
        httpOnly: true,
        secure,
      });
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

      const user: User = await this.usersClient.upsert({
        where: {email: data.email},
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
      res.cookie('Authorization', token, {
        maxAge: EXPIRES_IN * 1000,
        httpOnly: true,
        secure,
      });
      res.status(200).json({token});
    } catch (error) {
      next(error);
    }
  };

  logOut = async (
    req: RequestWithCurrentUser,
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

      res.cookie('Authorization', '', {maxAge: 0});
      res.status(200).json({data: findUser});
    } catch (error) {
      next(error);
    }
  };
}
