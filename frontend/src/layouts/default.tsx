import React, {useEffect} from 'react';
import {Layout, Typography} from 'antd';
import style from './index.less';
import {Link, useSelector, history} from 'umi';
import {ModelType} from '@/models';
const {Content} = Layout;

const IndexPage: React.FC = ({children}) => {
  const hasAuth = useSelector(
    ({user}: ModelType) => user.email && user.isVerify
  );
  const {pathname} = history.location;

  useEffect(() => {
    if (hasAuth && /^\/auth/.test(pathname)) {
      history.push('/dashboard/profile');
    }
  }, [hasAuth, pathname]);

  return (
    <Layout style={{background: 'white'}}>
      <Content className={style.container}>
        <Link to="/" style={{fontSize: 24, fontWeight: 'bold'}} className="ant-typography">
          HOMEPAGE
        </Link>
        {children}
      </Content>
    </Layout>
  );
};

export default IndexPage;
