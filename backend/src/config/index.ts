import {config} from 'dotenv';
import {CookieOptions} from 'express';
const envName = process.env.NODE_ENV === 'production' ? '.production' : '';
config({path: `.env${envName}.local`});

const isProd = process.env.NODE_ENV === 'production';

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const COOKIES_SECURE = isProd;
export const COOKIES_EXPIRES_IN = 60 * 60;

export const AUTH_COOKIES_OPTION: CookieOptions = {
  maxAge: COOKIES_EXPIRES_IN * 1000,
  sameSite: isProd ? 'none' : undefined,
  secure: COOKIES_SECURE,
};

export const AUTH_CLEAN_COOKIES_OPTION: CookieOptions = {
  maxAge: 0,
  sameSite: isProd ? 'none' : undefined,
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
