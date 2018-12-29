// 返回一个封装后的 axios对象 , 执行了拦截器  ,   可以直接使用  
import Vue from 'vue'
import axios from 'axios'

// enable mock
import mock from '@/mock'
if (process.env.NODE_ENV === 'production') {
  mock.restore()
}

var http = axios.create({
  baseURL: "`process.env.NODE_ENV === 'production' ? '' : ''`",
  timeout: 1000
  // headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
})
http.interceptors.request.use(function (request) {
  return request
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
http.interceptors.response.use(function (response) {
  const request = response.config
  if (true) {
    console.log(
      '>>>', request.method.toUpperCase(), request.url, request.params,
      '\n   ', response.status, response.data
    )
  }
  return response
}, function (error) {
  if (true) {
    let { response, config: request } = error
    if (request) {
      console.log(
        '>>>', request.method.toUpperCase(), request.url, request.params,
        '\n   ', response.status, response.data
      )
    }
  }
  // Do something with response error
  return Promise.reject(error)
})
Vue.prototype.$http = http

export default http