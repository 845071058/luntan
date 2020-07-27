// 引入babel编译环境
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import localStorage from './store/localStorage'
import sessionStorage from './store/sessionStorage'
import Api from '@/Api'
import '@/assets/js/rem'
import $ from 'jquery'
import './permission' // 登录拦截
import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)

Vue.config.productionTip = false

Vue.prototype.$ = $ // Vue全局使用jquery
Vue.prototype.Api = Api.testApi // Vue全局使用Api
Vue.prototype.local = localStorage // Vue全局使用localStorage
Vue.prototype.session = sessionStorage // Vue全局使用sessionStorage

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
