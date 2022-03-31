import { Request } from 'express';
import { User } from '@prisma/client';
import { ParsedQs } from 'qs';

export interface ErrorMap {
  [key: string]: string[];
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
