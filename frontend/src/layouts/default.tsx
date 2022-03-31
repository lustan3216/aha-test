import React, { useEffect } from 'react';
import { Layout } from 'antd';
import style from './index.less';
import { useSelector, history } from "umi";
import { ModelType } from "@/models";
const { Content } = Layout;

const IndexPage: React.FC = ({ children }) => {
  const hasAuth = useSelector(({ user }: ModelType) => user.tryFetched && user.isVerify)
  const { pathname } = history.location

  useEffect(() => {
    if (hasAuth && /^\/auth/.test(pathname)) {
      history.push('/dashboard/profile')
    }
  }, [hasAuth, pathname])

  return (
    <Layout style={{ background: 'white' }}>
      <Content className={style.container}>
        {children}
      </Content>
    </Layout>
  );
}

export default IndexPage
