import { hash } from 'bcrypt';
import { PrismaClient, User } from '@prisma/client';
import { CreateUserDto } from '@dtos/users.dto';
import { Exception } from '@utils/exception';
import { isEmpty } from '@utils/util';

class AuthService {
  users = new PrismaClient().user;

  async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new Exception(400, "You're not userData");

    const findUser: User = await this.users.findUnique({ where: { email: userData.email } });
    if (findUser) {
      throw new Exception(400, { email: [`This email ${userData.email} already exists`] });
    }

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({ data: { ...userData, password: hashedPassword } });

    return createUserData;
  }
}

export default AuthService;
