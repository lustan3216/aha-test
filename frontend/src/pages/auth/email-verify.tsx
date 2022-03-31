import React from 'react';
import { useSelector } from 'umi';
import { ModelType } from '@/models';
import style from './auth.less';
import { Typography, Button, message } from "antd";
import { userResendVerifyEmail } from "@/services/user";
import useCountDown from 'react-countdown-hook';

const initialTime = 60 * 1000; // initial time in milliseconds, defaults to 60000
const interval = 1000;

export default function () {
  const email = useSelector((state: ModelType) => state.user.email)
  const [timeLeft, { start, pause, resume, reset }] = useCountDown(initialTime, interval);
  const resend = async () => {
    start(initialTime)
    const data = await userResendVerifyEmail()
    message.success(`We sent an Email to ${email || data.email}, please check!`)
  }

  return (
    <div className={style.box}>
      <Typography.Title>Email Verify</Typography.Title>

      <Button disabled={timeLeft !== 0} onClick={resend}>
        Resend Email Verification { timeLeft === 0 ? null : (timeLeft / 1000) }
      </Button>
    </div>
  );
}

// export default SignUp
