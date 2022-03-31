import { Router } from 'express';
import StatisticsController from '@controllers/statistics.controller';
import { Routes } from '@/types/routes.interface';
import tokenWithVerifyMiddleware from '@middlewares/tokenWithVerify.middleware';
import userVerifyMiddleware from '@middlewares/token.middleware';

class IndexRoute implements Routes {
  public path = '/';
  public router = Router();
  public statisticsController = new StatisticsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/statistics`, tokenWithVerifyMiddleware, userVerifyMiddleware, this.statisticsController.statistics);
  }
}

export default IndexRoute;
