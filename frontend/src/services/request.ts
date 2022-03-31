import axios from 'axios'
import { objectCamelcase } from '@/utils/tool'
import { message } from 'antd'
import { history } from 'umi'
import * as path from "path";

const baseURL = process.env.NODE_ENV === 'production'
                ? 'https://api.blockplayer.io'
                : 'https://localhost:3000'

// const instance = axios.create({ baseURL: 'http://localhost:3000' })
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
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    return objectCamelcase(response.data)
  },
  function (error) {
    if (!error.response) throw error
    const { status, data } = error.response
    const { pathname } = history.location

    if (status === 401) {
      message.error(data.message)

      if (data.message === 'Need Verify') {
        history.push('/auth/email-verify')
      } else {
        if (pathname !== '/auth/login') history.push('/auth/login')
      }
    }
    else if (status > 500) {
      message.error("server error, we're fixing it")
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

export default instance
