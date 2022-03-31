import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Table, Typography } from 'antd';
import { usersGet } from '@/services/user';
import { User } from '@/types/user';
import style from './dashboard.less';

export default function () {
  const [users, setUsers] = useState<User[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    (async function() {
      const { data, meta } = await usersGet({ page })
      setTotal(meta.total)
      setUsers(data)
    })()
  }, [page])

  return (
    <div className={style.table}>
      <Typography.Title>USER LIST</Typography.Title>
      <Table pagination={{
        current: page,
        total: total,
        onChange: (page) => setPage(page )
      }} rowKey="id" dataSource={users} >
        <Table.Column title="Email" dataIndex="email" />
        <Table.Column title="Username" dataIndex="username" />
        <Table.Column title="Signed up At" dataIndex="createdAt" render={(text) => dayjs(text).format()}/>
        {/*<Table.Column title="Updated At" dataIndex="updatedAt" render={(text) => dayjs(text).format()}/>*/}
        <Table.Column title="Actived At" dataIndex="activedAt" render={(text) => text && dayjs(text).format()}/>
        <Table.Column title="Login Count" dataIndex="loginCount" />
      </Table>
    </div>
  );
}

// export default SignUp
