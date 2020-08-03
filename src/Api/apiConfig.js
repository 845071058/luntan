// 配置接口信息

// 这里写的是vue页面所用到的接口地址，静态页面像注册、登录等页面的接口需要修改static/lib/js/common.js里面的接口地址

// 配置后台接口地址
// 182.48.119.121:8081
// 192.168.0.105:8081
const ORIGIN = process.env.NODE_ENV === 'production'
  ? 'https://www.limmil.cn'
  : process.env.NODE_ENV === 'test-production'
    ? 'https://www.limmil.cn'
    : process.env.NODE_ENV === 'development-test'
      ? 'http://test.limmil.cn'
      : 'http://test.limmil.cn'

const WXAPPID = process.env.NODE_ENV === 'production'
  ? 'wxd5f70448139982de'
  : process.env.NODE_ENV === 'test-production'
    ? 'wxd5f70448139982de'
    : process.env.NODE_ENV === 'development-test'
      ? 'wx3f18ee0004a6a700'
      : 'wx3f18ee0004a6a700'

const WXURL = process.env.NODE_ENV === 'production'
  ? 'https://www.limmil.cn/#/wx'
  : process.env.NODE_ENV === 'test-production'
    ? 'https://www.limmil.cn/#/wx'
    : process.env.NODE_ENV === 'development-test'
      ? 'http://mmiztc.natappfree.cc/#/wx'
      : 'http://mmiztc.natappfree.cc/#/wx'

const apiHost = {
  ORIGIN: ORIGIN,
  WXAPPID: WXAPPID,
  WXURL: WXURL
}
export default apiHost
