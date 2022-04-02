import {PrismaClient} from '@prisma/client';
import {SENDGRID_API_KEY, API_DOMAIN} from '@config';
import sgMail from '@sendgrid/mail';
import {verifyTemplate} from '@utils/email';
import {createEmailToken} from '@utils/token';
import {logger} from '@utils/logger';

sgMail.setApiKey(SENDGRID_API_KEY);

class AuthService {
  users = new PrismaClient().user;

  async sendVerifyEmail(email: string) {
    const token = createEmailToken(email);
    const verifyLink = API_DOMAIN + '/v1/email-verify/' + token;

    const msg = {
      to: email,
      from: 'aha-test@firstage.io', // Use the email address or domain you verified above
      subject: 'Aha-project verify email - expire in a hour',
      html: verifyTemplate(verifyLink),
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      logger.error(error);
    }
  }
}

export default AuthService;
