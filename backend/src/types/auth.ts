export interface UserTokenType {
  userId: number;
}

export interface EmailTokenType {
  email: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}
