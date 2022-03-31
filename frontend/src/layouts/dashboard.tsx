import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Layout, Menu, Breadcrumb, Statistic, Row, Col } from 'antd';
const { Content, Sider } = Layout;
import { history, useDispatch, useSelector } from "umi";
import { ModelType } from "@/models";
import { getStatistics } from "@/services/statistics";

const IndexPage: React.FC = ({ children }) => {
  const dispatch = useDispatch()
  const { pathname } = history.location
  const noAuth = useSelector(({ user }: ModelType) => user.tryFetched && !user.isVerify)
  const [statistics, setStatistics] = useState({
    total: 0,
    todayActiveUser: 0,
    averageIn7: 0,
  })

  useEffect(() => {
    if (noAuth) {
      history.push('/auth/login')
    }
  }, [noAuth, pathname])

  useEffect(() => {
    (async function () {
      console.log(6)
      const data = await getStatistics()
      setStatistics(data)
    })()
  }, [])

  return (
    <Layout style={{ background: 'white' }}>
      <Sider theme="light" width="300">
        <Menu selectedKeys={[history.location.pathname]}>
          <Menu.Item key="/dashboard/profile" onClick={() => history.push('/dashboard/profile')}>
            Profile
          </Menu.Item>

          <Menu.Item key="/dashboard/reset-password" onClick={() => history.push('/dashboard/reset-password')}>
            Reset Password
          </Menu.Item>

          <Menu.Item key="/dashboard/user-list" onClick={() => history.push('/dashboard/user-list')}>
            User List
          </Menu.Item>

          <Menu.Item key="logout" onClick={() => dispatch({ type: 'user/logout' })}>
            Log Out
          </Menu.Item>

          <Menu.Item key="static" style={{ height: 230, marginTop: 100, paddingTop: 20 }}>
            <Statistic title="Total Users" value={statistics.total} />
            <Statistic title="Today Active User" value={statistics.todayActiveUser} />
            <Statistic title="Average In 7" value={statistics.averageIn7} />
          </Menu.Item>
        </Menu>
      </Sider>
      <Content style={{ padding: '0 50px' }}>
        <div className={styles.container}>
          { children }
        </div>
      </Content>

    </Layout>
  );
}

export default IndexPage
