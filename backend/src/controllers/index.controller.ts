import { PrismaClient } from '@prisma/client';

class IndexController {
  public usersClient = new PrismaClient().user;
}

export default IndexController;
