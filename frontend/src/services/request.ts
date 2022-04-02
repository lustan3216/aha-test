import axios from 'axios';
import {objectCamelcase} from '@/utils/tool';
import {message} from 'antd';
import {history, getDvaApp} from 'umi';
import {ERROR_MESSAGE} from '@/const';

const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://aha-api.firstage.io'
    : 'https://localhost:3000';

const instance = axios.create({
  baseURL,
  withCredentials: true,
});

instance.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    console.log(error) /* eslint-disable-line */
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    return objectCamelcase(response.data);
  },
  async error => {
    if (!error.response) throw error;
    const {status, data} = error.response;
    const {pathname} = history.location;

    if (status === 401) {
      if (data.errorCode === 'needVerify') {
        history.push('/auth/email-verify');
      } else {
        const dvaApp = getDvaApp();
        dvaApp._store.dispatch({type: 'user/cleanUser'});
        if (pathname !== '/auth/login') {
          history.push('/auth/login');
        }
        if (/^\/dashboard/.test(pathname)) {
          message.error(data.message);
        }
      }
    } else if (status > 500) {
      message.error(ERROR_MESSAGE);
    }

    return Promise.reject(error);
  }
);

export default instance;
