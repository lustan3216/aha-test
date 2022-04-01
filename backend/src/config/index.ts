import {config} from 'dotenv';
const envName = process.env.NODE_ENV === 'production' ? '.production' : '';
config({path: `.env${envName}.local`});

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
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
