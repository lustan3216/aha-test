declare namespace Express {
  export interface Request {
    [key: string]: any;
    currentUser: any;
  }
}

declare interface Asd {
  asd: number;
}