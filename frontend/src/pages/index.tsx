import { history } from 'umi';
import { Button, Typography } from 'antd';
import style from './index.less';
import React from "react";

export default function IndexPage() {
  return (
    <div className={style.content}>
      <Typography.Title>HOMEPAGE</Typography.Title>

      <Button onClick={() => history.push('/auth/signup')}>
        Sign Up
      </Button>

      <Button onClick={() => history.push('/auth/login')}>
        Login
      </Button>
    </div>
  );
}
