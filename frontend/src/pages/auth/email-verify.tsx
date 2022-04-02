import React, {useEffect, useState} from 'react';
import {useSelector, history} from 'umi';
import {ModelType} from '@/models';
import style from './auth.less';
import {Typography, Button, message} from 'antd';
import {userResendVerifyEmail} from '@/services/user';
import useCountDown from 'react-countdown-hook';
import Logout from '@/components/Logout';
const initialTime = 15 * 1000; // initial time in milliseconds, defaults to 60000
const interval = 1000;

export default function () {
  const email = useSelector((state: ModelType) => state.user.email);
  const [sentTo, setSentTo] = useState('');
  const [timeLeft, {start}] = useCountDown(initialTime, interval);
  const resend = async () => {
    start(initialTime);
    const data = await userResendVerifyEmail();

    message.success(
      `We sent a verify email to ${email || data.email}, please check!`
    );
  };

  useEffect(() => {
    const state = history.location.state as unknown as {
      sentTo: string | undefined;
    };
    const email = state?.sentTo;
    if (email) {
      setSentTo(email);
      start(initialTime);
    }
  }, []);
  const error = history.location.query?.error;
  const text = error
    ? 'Verify fail, please try again'
    : sentTo
    ? `We sent a verify email to ${sentTo}, please check!`
    : 'Your account have not verified yet!';

  return (
    <div className={style.box}>
      <Typography.Title>Email Verify</Typography.Title>
      <p>{text}</p>
      <Button disabled={timeLeft !== 0} onClick={resend}>
        Resend Email Verification {timeLeft === 0 ? null : timeLeft / 1000}
      </Button>

      <Logout />
    </div>
  );
}
