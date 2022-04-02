import PrismaClient from '@utils/prisma';
import EmailService from '@services/email.service';

class IndexController {
  usersClient = PrismaClient.user;
  emailService = new EmailService();
}

export default IndexController;
