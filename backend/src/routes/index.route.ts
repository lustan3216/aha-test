import { Router } from 'express';
import StatisticsController from '@controllers/statistics.controller';
import { Routes } from '@/types/routes';
import tokenWithVerifyMiddleware from '@middlewares/tokenWithVerify.middleware';
import userVerifyMiddleware from '@middlewares/token.middleware';

class IndexRoute implements Routes {
  path = '/';
  router = Router();
  statisticsController = new StatisticsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/statistics`, tokenWithVerifyMiddleware, userVerifyMiddleware, this.statisticsController.statistics);
  }
}

export default IndexRoute;
