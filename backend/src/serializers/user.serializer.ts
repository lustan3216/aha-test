import {User} from '@prisma/client';

function exclude<User, Key extends keyof User>(
  user: User,
  ...keys: Key[]
): Omit<User, Key> {
  for (const key of keys) {
    delete user[key];
  }
  return user;
}

export default function (user: User) {
  return exclude(user, 'password');
}
