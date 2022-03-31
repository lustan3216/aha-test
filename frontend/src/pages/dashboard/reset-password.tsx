import React, { useState } from 'react';
import { Form, Input, Avatar, Switch, Button, Typography, message } from 'antd';
import { useDispatch, useSelector } from 'umi';
import axios from "axios";
import Help from "@/components/Help";
import { ModelType } from "@/models";
import { AccountProvider } from "@/types/user";
import { ErrorMessagesType } from "@/types/response";
import { ERROR_MESSAGE, FORM_ITEM_PAYOUT, TAIL_FORM_ITEM_LAYOUT } from "@/const";
import style from "@/pages/dashboard/dashboard.less";

const initErrors: ErrorMessagesType = {
  oldPassword: [],
  newPassword: [],
  newPasswordConfirm: []
}

export default function () {
  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const isLocalProvider = useSelector(({ user }: ModelType) => user.provider === AccountProvider.Local)
  const [errors, setErrors] = useState(initErrors);

  const onFinish = async (values: any) => {
    try {
      await dispatch({
        type: 'user/resetPassword',
        payload: {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
      })
      setErrors(initErrors)
      message.success('Update success')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrors(error.response.data?.errors)
      } else {
        message.error(ERROR_MESSAGE)
      }
    }
  };
  const onFieldsChange = () => {
    const formErrors = form.getFieldsError()
    const errors = formErrors.reduce((acc: ErrorMessagesType, current) => {
      acc[current.name[0]] = current.errors
      return acc
    }, {})
    setErrors(errors)
  }

  return (
    <Form
      {...FORM_ITEM_PAYOUT}
      form={form}
      labelAlign="left"
      layout="horizontal"
      onFinish={onFinish}
      onFieldsChange={onFieldsChange}
      scrollToFirstError
      className={style.form}
    >
      <Typography.Title>RESET PASSWORD</Typography.Title>

      <Form.Item
        name="oldPassword"
        label="Old Password"
        rules={[
          {
            pattern: /[a-z]+/,
            message: 'At least one lower character',
          },
          {
            pattern: /[A-Z]+/,
            message: 'At least one upper character',
          },
          {
            pattern: /\d+/,
            message: 'At least one digit character',
          },
          {
            pattern: /\W+/,
            message: 'At least one special character',
          },
          {
            min: 8,
            message: 'At least 8 characters',
          },
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        validateStatus={errors.oldPassword?.length ? 'error' : 'success'}
        help={<Help messages={errors.oldPassword}/>}
        hasFeedback
      >
        <Input.Password disabled={!isLocalProvider} />
      </Form.Item>

      <Form.Item
        name="newPassword"
        label="New Password"
        dependencies={['oldPassword']}
        rules={[
          {
            pattern: /[a-z]+/,
            message: 'At least one lower character',
          },
          {
            pattern: /[A-Z]+/,
            message: 'At least one upper character',
          },
          {
            pattern: /\d+/,
            message: 'At least one digit character',
          },
          {
            pattern: /\W+/,
            message: 'At least one special character',
          },
          {
            min: 8,
            message: 'At least 8 characters',
          },
          {
            required: true,
            message: 'Please input your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('oldPassword') !== value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The new password that you entered should not match old one!'));
            },
          }),
        ]}
        validateStatus={errors.newPassword?.length ? 'error' : 'success'}
        help={<Help messages={errors.newPassword}/>}
        hasFeedback
      >
        <Input.Password disabled={!isLocalProvider} />
      </Form.Item>

      <Form.Item
        name="newPasswordConfirm"
        label="New Password Confirm"
        dependencies={['newPassword']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password disabled={!isLocalProvider} />
      </Form.Item>

      <Form.Item {...TAIL_FORM_ITEM_LAYOUT}>
        <Button disabled={!isLocalProvider} type="primary" htmlType="submit" className="login-form-button">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
