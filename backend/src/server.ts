import fs from 'fs';
import https from 'https';
import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import EmailRoute from '@routes/email.route';
import validateEnv from '@utils/validateEnv';
import {PORT, NODE_ENV} from '@config';

validateEnv();

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
