import {NextFunction, Request, Response} from 'express';
import IndexController from '@/controllers/index.controller';
import dayjs from 'dayjs';

export default class StatisticsController extends IndexController {
  statistics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const total = await this.usersClient.count();
      const todayActiveUser = await this.usersClient.count({
        where: {
          activedAt: {
            gte: dayjs().subtract(1, 'day').format(),
          },
        },
      });
      const averageIn7 = await this.usersClient.count({
        where: {
          activedAt: {
            gte: dayjs().subtract(7, 'day').format(),
          },
        },
      });

      res.status(200).json({
        total,
        todayActiveUser,
        averageIn7: Math.ceil(averageIn7 / 7),
      });
    } catch (error) {
      next(error);
    }
  };
}
