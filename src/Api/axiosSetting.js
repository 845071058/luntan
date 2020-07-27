import router from '../router'
import axios from 'axios'
import store from '../store'
import { Toast } from 'vant'
import { getToken, setToken, removeToken } from '@/utils/auth'

const AxiosIns = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 300000,
  ContentType: 'application/x-www-form-urlencoded;application/json;charset=UTF-8',
  withCredentials: true // axios 默认不发送cookie，跨域也是一个原因，需要全局设置
})

const timer = []
const delay = 300
AxiosIns.interceptors.request.use(config => {
  if (getToken()) {
    config.headers.authorization = getToken()
  }
  if (navigator.onLine === false) {
    Toast('当前未连接网络，连接网络后请刷新页面!')
  } else {
    // if (config.method === 'post') store.commit('setLoading', true)
    return config
  }
}, function(error) {
  return Promise.reject(error)
})

AxiosIns.interceptors.response.use(response => {
  // console.log('response.headers',response.headers.authorization)
  if (response.headers.authorization) {
    setToken(response.headers.authorization)
  }
  for (const t of timer) {
    clearTimeout(t)
  }
  // 请求结束 清除菊花
  // store.commit('setLoading', false)
  try {
    if (response.data) {
      if (response.data.success !== true) {
        if (response.data.msg.length) {
          Toast(response.data.msg)
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
  return response.data
}, (error) => {
  for (const t of timer) {
    clearTimeout(t)
  }
  // 关闭菊花
  // store.commit('setLoading', false)
  try {
    if (error.response) {
      // store.commit('setLoading', false)
      if (error && error.response) {
        switch (error.response.status) {
          case 400:
            Toast('请求错误！')
            break
          case 401:
            removeToken()
            Toast('用户登录过期,请重新登录！')
            break
          case 402:

            break
          case 403:
            Toast('拒绝访问！')
            break
          case 404:
            Toast(`请求地址出错: ${error.response.config.url}`)
            break
          case 500:
            Toast("数据异常，请联系管理员!',！")
            break
          default:
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
  return Promise.reject(error)
})
export default AxiosIns
