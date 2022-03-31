import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch, Link, history } from "umi";
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { ErrorMessagesType } from "@/types/response";
import style from "./auth.less";
import facebookIcon from "./facebook.svg";
import { FORM_ITEM_PAYOUT, TAIL_FORM_ITEM_LAYOUT } from "@/const";
import Help from "@/components/Help";

const initErrors: ErrorMessagesType = {
  email: [],
  password: []
}

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState(initErrors);

  const onFinish = async (values: any) => {
    try {
      await dispatch({
        type: 'user/login',
        payload: {
          email: values.email,
          password: values.password,
        },
      })
      setErrors(initErrors)
      setErrorMessage('')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrors(error.response.data?.errors)
        setErrorMessage(error.response.data?.message)
      } else {

      }
    }
  };

  function responseGoogle(payload: any) {
    if (payload.accessToken) {
      dispatch({
        type: 'user/loginGoogle',
        payload: { accessToken: payload.accessToken }
      })
    }
  }

  function responseFacebook(payload: any) {
    if (payload.accessToken) {
      dispatch({
        type: 'user/loginFacebook',
        payload: { accessToken: payload.accessToken }
      })
    }
  }

  const onFieldsChange = () => {
    const formErrors = form.getFieldsError()
    const errors = formErrors.reduce((acc: ErrorMessagesType, current) => {
      acc[current.name[0]] = current.errors
      return acc
    }, {})
    setErrorMessage('')
    setErrors(errors)
  }

  return (
    <Form
      {...FORM_ITEM_PAYOUT}
      form={form}
      name="login"
      labelAlign="left"
      className={style.box}
      initialValues={{
        email: 'et3216@gmail.com',
        password: 'asd!@#123eE',
      }}
      onFinish={onFinish}
      onFieldsChange={onFieldsChange}
    >
      <Typography.Title>LOG IN</Typography.Title>

      <Form.Item
        name="email"
        label="Email"
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
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
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

      <Form.Item {...TAIL_FORM_ITEM_LAYOUT}>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        <span className={style.or}>Or</span>
        <Link to="/auth/signup">Sign up</Link>
      </Form.Item>

      <Form.Item {...TAIL_FORM_ITEM_LAYOUT}>
        <GoogleLogin
          className={style.googleButton}
          clientId="498694304994-3emt7c06sqdvmnlb5nptilfaesq08522.apps.googleusercontent.com"
          buttonText="LOGIN WITH GOOGLE"
          onSuccess={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />

        <FacebookLogin
          cssClass={style.facebookButton}
          appId="852279066170147"
          fields="name,email,picture"
          callback={responseFacebook}
          icon={<img src={facebookIcon} className={style.facebookIcon} />}
          size="small"
        />
      </Form.Item>
    </Form>
  );
};

export default Login
