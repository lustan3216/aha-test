import {Typography} from 'antd';
import style from './index.less';
import React from 'react';

export default function IndexPage() {
  return (
    <div className={style.content}>
      <Typography.Title>404</Typography.Title>
      <Typography.Text>No this page</Typography.Text>
    </div>
  );
}
