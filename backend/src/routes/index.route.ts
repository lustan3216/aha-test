import {Router} from 'express';
import StatisticsController from '@controllers/statistics.controller';
import {Routes} from '@/types/routes';
import tokenWithVerifyMiddleware from '@middlewares/tokenWithVerify.middleware';

class IndexRoute implements Routes {
  path = '/';
  router = Router();
  statisticsController = new StatisticsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      '/statistics',
      tokenWithVerifyMiddleware,
      this.statisticsController.statistics
    );
  }
}

export default IndexRoute;
