import React, {useEffect} from 'react';
import styles from './index.less';
import {Layout, Menu} from 'antd';
const {Content, Sider} = Layout;
import {history, useSelector} from 'umi';
import {ModelType} from '@/models';

const IndexPage: React.FC = ({children}) => {
  const {pathname} = history.location;
  const noAuth = useSelector(
    ({user}: ModelType) => user.email && !user.isVerify
  );

  useEffect(() => {
    if (noAuth) {
      history.push('/auth/login');
    }
  }, [noAuth, pathname]);

  return (
    <Layout style={{background: 'white'}}>
      <Sider theme="light" width="300">
        <Menu selectedKeys={[history.location.pathname]}>
          <Menu.Item key="/" onClick={() => history.push('/')}>
            HOMEPAGE
          </Menu.Item>

          <Menu.Item
            key="/dashboard/profile"
            onClick={() => history.push('/dashboard/profile')}
          >
            Profile
          </Menu.Item>

          <Menu.Item
            key="/dashboard/reset-password"
            onClick={() => history.push('/dashboard/reset-password')}
          >
            Reset Password
          </Menu.Item>

          <Menu.Item
            key="/dashboard/user-list"
            onClick={() => history.push('/dashboard/user-list')}
          >
            User List
          </Menu.Item>
        </Menu>
      </Sider>
      <Content style={{padding: '0 50px'}}>
        <div className={styles.container}>{children}</div>
      </Content>
    </Layout>
  );
};

export default IndexPage;
