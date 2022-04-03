import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {Statistic, Table, Typography} from 'antd';
import {usersGet} from '@/services/user';
import {User} from '@/types/user';
import style from './dashboard.less';
import {getStatistics} from '@/services/statistics';

export default function () {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async function () {
      const {data, meta} = await usersGet({page});
      setTotal(meta.total);
      setUsers(data);
    })();
  }, [page]);

  const [statistics, setStatistics] = useState({
    total: 0,
    todayActiveUser: 0,
    averageIn7: 0,
  });

  useEffect(() => {
    (async function () {
      const data = await getStatistics();
      setStatistics(data);
    })();
  }, []);

  return (
    <div className={style.table}>
      <Typography.Title>USER LIST</Typography.Title>

      <div style={{display: 'flex'}}>
        <Statistic
          title="Total Users"
          value={statistics.total}
          style={{flex: 1}}
        />
        <Statistic
          title="Today Active User"
          value={statistics.todayActiveUser}
          style={{flex: 1}}
        />
        <Statistic
          title="Average In 7 days"
          value={statistics.averageIn7}
          style={{flex: 1}}
        />
      </div>

      <Table
        pagination={{
          current: page,
          total: total,
          onChange: page => setPage(page),
        }}
        rowKey="id"
        dataSource={users}
      >
        <Table.Column title="Email" dataIndex="email" />
        <Table.Column title="Username" dataIndex="username" />
        <Table.Column
          title="Signed up At"
          dataIndex="createdAt"
          render={text => dayjs(text).format()}
        />
        {/*<Table.Column title="Updated At" dataIndex="updatedAt" render={(text) => dayjs(text).format()}/>*/}
        <Table.Column
          title="Last session at"
          dataIndex="activedAt"
          render={text => text && dayjs(text).format()}
        />
        <Table.Column title="Login Count" dataIndex="loginCount" />
      </Table>
    </div>
  );
}

// export default SignUp
