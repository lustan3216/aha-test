import {config} from 'dotenv';
import {CookieOptions} from 'express';
const envName = process.env.NODE_ENV === 'production' ? '.production' : '';
config({path: `.env${envName}.local`});

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const COOKIES_SECURE = process.env.NODE_ENV === 'production';
export const COOKIES_EXPIRES_IN = 60 * 60;
export const AUTH_COOKIES_OPTION: CookieOptions = {
  maxAge: COOKIES_EXPIRES_IN * 1000,
  httpOnly: COOKIES_SECURE,
  sameSite: 'none',
  secure: COOKIES_SECURE,
};

export const {
  ROLLBAR_KEY,
  FRONTEND_DOMAIN,
  API_DOMAIN,
  NODE_ENV,
  PORT,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  SENDGRID_API_KEY,
} = process.env;
