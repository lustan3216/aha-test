import {PrismaClient} from '@prisma/client';
import EmailService from '@services/email.service';

class IndexController {
  usersClient = new PrismaClient().user;
  emailService = new EmailService();
}

export default IndexController;
