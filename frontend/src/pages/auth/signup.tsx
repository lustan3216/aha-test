import axios from 'axios';
import React, { useState } from 'react';
import {
  Form,
  Input,
  Button, Typography, message,
} from 'antd';
import { history, Link, useDispatch } from 'umi';
import Help from "@/components/Help";
import { ErrorMessagesType } from "@/types/response";
import style from "@/pages/auth/auth.less";
import { ERROR_MESSAGE, FORM_ITEM_PAYOUT, TAIL_FORM_ITEM_LAYOUT } from "@/const";
import { LockOutlined } from "@ant-design/icons";

const initErrors: ErrorMessagesType = {
  email: [],
  password: [],
  passwordConfirm: []
}

export default function () {
  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const [errors, setErrors] = useState(initErrors);

  const onFinish = async (values: any) => {
    try {
      await dispatch({
        type: 'user/signUp',
        payload: {
          email: values.email,
          password: values.password,
        },
      })
      setErrors(initErrors)
      message.success(`We sent a verify email to ${values.email}, please check!`)
      history.push('/auth/email-verify')
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
      name="signup"
      className={style.box}
      onFieldsChange={onFieldsChange}
      onFinish={onFinish}
      scrollToFirstError
    >
      <Typography.Title>SIGN UP</Typography.Title>

      <Form.Item
        name="email"
        label="E-mail"
        validateStatus={errors.email?.length ? 'error' : 'success'}
        help={<Help messages={errors.email}/>}
        hasFeedback
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
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
        validateStatus={errors.password?.length ? 'error' : 'success'}
        help={<Help messages={errors.password}/>}
        hasFeedback
      >
        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
      </Form.Item>

      <Form.Item
        name="passwordConfirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
      </Form.Item>

      {/*<Form.ErrorList errors={[errorMessage]} />*/}

      <Form.Item {...TAIL_FORM_ITEM_LAYOUT}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
        <span className={style.or}>Or</span>
        <Link to="/auth/login">Log in</Link>
      </Form.Item>
    </Form>
  );
}

// export default SignUp
