import { history } from 'umi';
import { Button, Typography } from 'antd';
import style from './index.less';
import React from "react";
import { Provider, ErrorBoundary } from '@rollbar/react';

const rollbarConfig = {
  accessToken: process.env.ROLLBAR_KEY,
  environment: process.env.NODE_ENV,
  enable: process.env.NODE_ENV === 'production',
}

export default function IndexPage() {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <div className={style.content}>
          <Typography.Title>HOMEPAGE</Typography.Title>

          <Button onClick={() => history.push('/auth/signup')}>
            Sign Up
          </Button>

          <Button onClick={() => history.push('/auth/login')}>
            Login
          </Button>
        </div>
      </ErrorBoundary>
    </Provider>
  );
}
