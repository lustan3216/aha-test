import {history} from 'umi';
import {Button, Typography, Divider} from 'antd';
import style from './index.less';
import React from 'react';
import {Provider, ErrorBoundary} from '@rollbar/react';

const rollbarConfig = {
  accessToken: process.env.ROLLBAR_KEY,
  environment: process.env.NODE_ENV,
  enable: process.env.NODE_ENV === 'production',
};

export default function IndexPage() {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <div className={style.content}>
          <Typography.Title>AUTH</Typography.Title>

          <Button onClick={() => history.push('/auth/signup')}>Sign Up</Button>

          <Button onClick={() => history.push('/auth/login')}>Login</Button>

          <Divider />

          <Typography.Title>API DOCS</Typography.Title>

          <Button
            onClick={() => window.open('https://aha-api.firstage.io/api-docs')}
          >
            API docs
          </Button>

          <Button
            onClick={() => window.open('https://studio1.firstage.io/')}
          >
            Database Grid
          </Button>

          <Button
            onClick={() =>
              window.open('https://github.com/lustan3216/aha-test')
            }
          >
            Repository
          </Button>

          <Divider />

          <Typography.Title>Resume</Typography.Title>

          <Button
            onClick={() =>
              window.open(
                'https://www.cakeresume.com/s--DzXhm_vjCigPjl-bqfCGXA--/776848-50517e'
              )
            }
          >
            中文履歷(含做過的專案)
          </Button>

          <Button
            onClick={() => window.open('https://www.cakeresume.com/04d467')}
          >
            English Resume
          </Button>
        </div>
      </ErrorBoundary>
    </Provider>
  );
}
