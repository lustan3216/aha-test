import request from '@/services/request';
import {getTimezone} from '@/utils/date';

type Statistics = {
  total: number;
  todayActiveUser: number;
  averageIn7: number;
};

export function getStatistics(): Promise<Statistics> {
  const timezone = getTimezone();
  return request.get(`/v1/statistics?timezone=${timezone || ''}`);
}
