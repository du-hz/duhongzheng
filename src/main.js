// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/reset.css'
import './assets/css/common.css'
import axios from 'axios'
import Global from './assets/js/global'
import faCommon from 'assets/js/faCommon'
import VueCkeditor from 'vue-ckeditor2'
import store from 'vuex'
Vue.prototype.$store = store
const Config = process.env.NODE_ENV === 'production' ? require('../config/prod.env') : require('../config/dev.env')

console.log(faCommon)
axios.defaults.baseURL = Config.SERVER_URL
if (window.location.hostname === 'localhost') {
  // axios.defaults.baseURL = 'http://10.200.11.97:9190'
}
axios.withCredentials = true
axios.defaults.headers['Accept'] = 'application/vnd.mooreelite+json'
axios.defaults.headers['Content-Type'] = 'application/json'

const instance = axios.create({
  baseURL: Config.IT_SERVER_URL,
  headers: {
    'Accept': 'application/vnd.mooreelite+json',
    'Content-Type': 'application/json'
  }
})

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueCkeditor)
Vue.prototype.$http = axios
Vue.prototype.$itServerHttp = instance

//  axios拦截器 如果本地有缓存token信息，请求时添加上headers参数
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  // token 缓存2个小时有效期
  let tokenExpired = Global.getItem('tokenexpired') || ''
  let token = Global.getItem('token') || ''
  if (token !== '') {
    if (tokenExpired === '') {
      Global.setItem('tokenexpired', new Date().getTime())
    } else {
      let nowTime = new Date().getTime()
      if (nowTime - tokenExpired * 1 >= 1000 * 60 * 60 * 2) {
        Global.removeItem('tokenexpired')
        Global.removeItem('token')
        window.alert('登录已过期，请重新登录')
        window.location.href = 'http://' + window.location.host + '/#/login'
      } else {
        Global.setItem('tokenexpired', nowTime)
      }
    }
  }
  if (Global.getItem('token') !== null && Global.getItem('token') !== '') {
    config.headers['Authorization'] = 'Bearer ' + Global.getItem('token')
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

//  axios拦截器 如果本地有缓存token信息，请求时添加上headers参数
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  if (Global.getItem('token') !== null && Global.getItem('token') !== '') {
    config.headers['Authorization'] = 'Bearer ' + Global.getItem('token')
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// axios拦截器 统一处理请求出错  TODO: 拦截Permit头部信息出错，权限错误提示
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response
}, function (error) {
  if (error.response.data && error.response.data.code === 403) {
    // token出错或为空，需要重新登录 TODO
    // Global.removeItem('token')
    // window.location.href = Config.FRONT_URL + '/#/signin?action=resign'
  } else {
    return Promise.reject(error)
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
