import axios from 'axios';
import React, {useState} from 'react';
import {Form, Input, Button, Typography, message} from 'antd';
import {useDispatch, useSelector} from 'umi';
import {ModelType} from '@/models';
import {UserOutlined} from '@ant-design/icons';
import {FORM_ITEM_PAYOUT, TAIL_FORM_ITEM_LAYOUT, ERROR_MESSAGE} from '@/const';
import style from './dashboard.less';
import {ErrorMessagesType} from '@/types/response';
import Help from '@/components/Help';

const initErrors: ErrorMessagesType = {
  username: [],
};

export default function () {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState(initErrors);
  const user = useSelector(({user}: ModelType) => user);

  const onFinish = async (values: any) => {
    try {
      await dispatch({
        type: 'user/userUpdate',
        payload: {
          username: values.username,
        },
      });

      message.success('Update success');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrors(error.response.data?.errors);
      } else {
        message.error(ERROR_MESSAGE);
      }
    }
  };

  const onFieldsChange = () => {
    const formErrors = form.getFieldsError();
    const errors = formErrors.reduce((acc: ErrorMessagesType, current) => {
      acc[current.name[0]] = current.errors;
      return acc;
    }, {});
    setErrors(errors);
  };

  return (
    <Form
      {...FORM_ITEM_PAYOUT}
      layout="horizontal"
      form={form}
      initialValues={user}
      className={style.form}
      onFinish={onFinish}
      onFieldsChange={onFieldsChange}
    >
      <Typography.Title>PROFILE</Typography.Title>

      <Form.Item name="email" label="Email">
        <Input
          disabled
          prefix={<UserOutlined className="site-form-item-icon" />}
        />
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
        validateStatus={errors.username?.length ? 'error' : 'success'}
        help={<Help messages={errors.username} />}
        hasFeedback
        rules={[{required: true, message: 'Please input your Username!'}]}
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
}
