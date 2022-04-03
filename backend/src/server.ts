import fs from 'fs';
import https from 'https';
import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import EmailRoute from '@routes/email.route';
import validateEnv from '@utils/validateEnv';
import {PORT, NODE_ENV} from '@config';
import PrismaClient from '@utils/prisma';

validateEnv();

const prisma = PrismaClient;
const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new EmailRoute(),
]);

if (NODE_ENV === 'production') {
  app.listen();
} else {
  const hskey = fs.readFileSync('pillaAuth-key.pem', 'utf8');
  const hscert = fs.readFileSync('pillaAuth-cert.pem', 'utf8');

  const credentials = {
    key: hskey,
    cert: hscert,
  };

  https.createServer(credentials, app.app).listen(PORT);
}

process.on('SIGINT', () => {
  prisma.$on('beforeExit', async () => {
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  });
});

process.on('uncaughtException', exception => {
  console.log(exception); // to see your exception details in the console
  // if you are on production, maybe you can send the exception details to your
  // email as well ?
});
