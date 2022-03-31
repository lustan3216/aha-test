import { UserTokenType, EmailTokenType } from '@/types/auth';
import { SECRET_KEY } from '@config';
import { sign, verify } from 'jsonwebtoken';

export function createAuthToken(userId: number, expiresIn: number): string {
  const dataStoredInToken: UserTokenType = { userId };

  return sign(dataStoredInToken, SECRET_KEY, { expiresIn });
}

export function verifyAuthToken(token: string): UserTokenType {
  return verify(token, SECRET_KEY) as UserTokenType;
}

export function createEmailToken(email: string, expiresIn = '1h'): string {
  const dataStoredInToken: EmailTokenType = { email };

  return sign(dataStoredInToken, SECRET_KEY, { expiresIn });
}

export function verifyEmailToken(token: string): EmailTokenType {
  return verify(token, SECRET_KEY) as EmailTokenType;
}
