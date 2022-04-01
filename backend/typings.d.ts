type Page = {
  page?: number;
};

declare namespace Express {
  interface Request {
    currentUser: import('@prisma/client').User;
    query: Page;
  }
}
