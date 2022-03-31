import { Request } from 'express';
import { User } from '@prisma/client';
import * as core from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export interface UserTokenType {
  userId: number;
}

export interface EmailTokenType {
  email: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithCurrentUser<Q = any> extends Omit<Request, 'query'> {
  currentUser: User;
  query: ParsedQs & Q;
}

export interface FacebookProfile extends Request {
  email: string;
  name: string;
  id: string;
  picture: {
    data: {
      height: number;
      is_silhouette: number;
      url: string;
      width: number;
    };
  };
}

export interface GoogleProfile extends Request {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}
