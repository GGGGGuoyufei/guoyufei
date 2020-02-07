import axios from 'axios'
import { getToken,removeToken } from './cookie'
// import {router} from "@/router"  
// create an axios instance
const service = axios.create({
  baseURL: '/cmp',
  // withCredentials: true, // 跨域请求时发送 cookies
  timeout: 15000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // 判断是否有登陆态
    if (getToken()) {
      // 让每个请求携带token
      config.headers['accessToken'] = getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const data = response.data
    // if(data.code===401){
    //   removeToken()
    //   window.reload()
    // }
    return data
  },
  error => {
    return Promise.reject(error)
  }
)

export default service



