import axios from 'axios';
import {objectCamelcase} from '@/utils/tool';
import {getToken, TOKEN_KEY} from '@/utils/auth';
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
    const token = getToken();
    if (config.headers && token) {
      config.headers[TOKEN_KEY] = `Bearer ${token}`;
    }
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
      if (!/^\/dashboard/.test(pathname) && pathname !== '/auth/login') {
        return Promise.reject(error);
      }

      if (data.errorCode === 'needVerify') {
        history.push(`/auth/email-verify${history.location.search}`);
      } else {
        const dvaApp = getDvaApp();
        dvaApp._store.dispatch({type: 'user/cleanUser'});
        if (pathname === '/auth/login') {
          return Promise.reject(error);
        } else if (/^\/dashboard/.test(pathname)) {
          message.error(data.message);
        }
        history.push('/auth/login');
      }
    } else if (status > 500) {
      message.error(ERROR_MESSAGE);
    }

    return Promise.reject(error);
  }
);

export default instance;
