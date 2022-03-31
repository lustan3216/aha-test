import { NextFunction, Request, Response } from 'express';
import IndexController from '@/controllers/index.controller';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export default class StatisticsController extends IndexController {
  statistics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const total = await this.usersClient.count();
      const todayActiveUser = await this.usersClient.count({
        where: {
          activedAt: {
            gte: dayjs.utc().subtract(1, 'day').format(),
          },
        },
      });
      const averageIn7 = await this.usersClient.count({
        where: {
          activedAt: {
            gte: dayjs.utc().subtract(7, 'day').format(),
          },
        },
      });

      res.status(200).json({
        total,
        todayActiveUser,
        averageIn7,
      });
    } catch (error) {
      next(error);
    }
  };
}
