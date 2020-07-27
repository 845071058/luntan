import router from './router'
// import { getToken, removeToken } from '@/utils/auth' // getToken from cookie
// const whiteList = ['/login', '/wx']// 这里 没有重定向白名单

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

router.afterEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
})
