import axios from 'axios'
import { objectCamelcase } from '@/utils/tool'
import { message } from 'antd'
import { history } from 'umi'
import { ERROR_MESSAGE } from "@/const";

const baseURL = process.env.NODE_ENV === 'production'
                ? 'https://api.blockplayer.io'
                : 'https://localhost:3000'

const instance = axios.create({
  baseURL,
  withCredentials: true
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.log(error) /* eslint-disable-line */
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  function (response) {
    return objectCamelcase(response.data)
  },
  function (error) {
    if (!error.response) throw error
    const { status, data } = error.response
    const { pathname } = history.location

    if (status === 401) {
      if (data.message === 'Need Verify') {
        message.error('Your account have not verified yet!')
        history.push('/auth/email-verify')
      } else {
        message.error(data.message)
        if (pathname !== '/auth/login') history.push('/auth/login')
      }
    }
    else if (status > 500) {
      message.error(ERROR_MESSAGE)
    }

    return Promise.reject(error)
  }
)

export default instance
