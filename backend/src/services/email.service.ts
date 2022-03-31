import { PrismaClient, User } from '@prisma/client';
import { SENDGRID_API_KEY, CURRENT_API_DOMAIN } from '@config';
import sgMail from '@sendgrid/mail';
import { verifyTemplate } from '@utils/email';
import { createEmailToken } from '@utils/token';

sgMail.setApiKey(SENDGRID_API_KEY);

class AuthService {
  public users = new PrismaClient().user;

  public async sendVerifyEmail(email: string) {
    const token = createEmailToken(email);
    const verifyLink = CURRENT_API_DOMAIN + '/email-verify/' + token;
    console.log(verifyLink);
    const msg = {
      to: 'et3216@gmail.com',
      from: 'aha-test@firstage.io', // Use the email address or domain you verified above
      subject: 'aha Verify email',
      html: verifyTemplate(verifyLink),
    };

    try {
      // await sgMail.send(msg);
      console.log(verifyLink);
    } catch (error) {
      console.log(1113231312);
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  }
}

export default AuthService;
