export type User = {
  createdAt: string;
  email: string;
  id: number;
  isVerify: boolean;
  loginCount: number;
  picture: string;
  provider: AccountProvider;
  updatedAt: string;
  username: string;
};

export enum AccountProvider {
  Local = 'LOCAL',
  Google = 'GOOGLE',
  Facebook = 'FACEBOOK',
}
