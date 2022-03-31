import { PrismaClient } from '@prisma/client';

class IndexController {
  usersClient = new PrismaClient().user;
}

export default IndexController;
