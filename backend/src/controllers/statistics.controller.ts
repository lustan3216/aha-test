import {NextFunction, Request, Response} from 'express';
import IndexController from '@/controllers/index.controller';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import {Exception} from '@utils/exception';
dayjs.extend(timezone);
dayjs.extend(utc);

export default class StatisticsController extends IndexController {
  statistics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const total = await this.usersClient.count();
      const timezone = req.query.timezone as string;
      let date = dayjs.tz(new Date());
      try {
        date = dayjs.tz(new Date(), timezone || '');
      } catch (e) {
        return next(new Exception(400, {timezone: ['timezone invalid']}));
      }

      const startOfToday = date.startOf('day');

      const todayActiveUser = await this.usersClient.count({
        where: {
          activedAt: {
            gte: startOfToday.utc().format(),
          },
        },
      });

      const averageIn7 = await this.usersClient.count({
        where: {
          activedAt: {
            gte: startOfToday.subtract(6, 'day').utc().format(),
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
