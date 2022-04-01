import request from '@/services/request';

type Statistics = {
  total: number;
  todayActiveUser: number;
  averageIn7: number;
};

export function getStatistics(): Promise<Statistics> {
  return request.get('/v1/statistics');
}
