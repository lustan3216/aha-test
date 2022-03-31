import axios from "axios";
import React from 'react';
import { Form, Input, Avatar, Switch, Button, Typography, message } from 'antd';
import { useDispatch, useSelector } from 'umi';
import { ModelType } from "@/models";
import { UserOutlined } from "@ant-design/icons";
import { FORM_ITEM_PAYOUT, TAIL_FORM_ITEM_LAYOUT } from "@/const";
import style from "./dashboard.less";

export default function () {
  const user = useSelector(({ user }: ModelType) => user)
  const dispatch = useDispatch()

  const onFinish = async (values: any) => {
    console.log(values)
    try {
      await dispatch({
        type: 'user/userUpdate',
        payload: {
          username: values.username,
        },
      })

      message.success('Update username success')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
      } else {
        console.error(error)
        message.error('Has server error, I will fix it in a hour')
      }
    }
  };

  return (
    <Form
      {...FORM_ITEM_PAYOUT}
      layout="horizontal"
      onFinish={onFinish}
      initialValues={user}
      className={style.form}
    >
      <Typography.Title>PROFILE</Typography.Title>

      <Form.Item
        name="email"
        label="Email"
      >
        <Input disabled prefix={<UserOutlined className="site-form-item-icon" />} />
      </Form.Item>

      {/*<Form.Item*/}
      {/*  name="provider"*/}
      {/*  label="Provider"*/}
      {/*>*/}
      {/*  <Input disabled />*/}
      {/*</Form.Item>*/}

      {/*<Form.Item*/}
      {/*  name="isVerify"*/}
      {/*  label="Verify"*/}
      {/*>*/}
      {/*  <Switch disabled checked />*/}
      {/*</Form.Item>*/}

      <Form.Item
        name="username"
        label="Username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} />
      </Form.Item>

      <Form.Item {...TAIL_FORM_ITEM_LAYOUT}>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
