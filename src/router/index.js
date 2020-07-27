import Vue from 'vue'
import Router from 'vue-router'
import _ from 'lodash'

Router.prototype.openPage = function(link, query) {
  this.push({
    path: link,
    query: _.assignIn({
      time: new Date().getTime()
    }, query || {})
  })
}
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: resolve => require(['@/views/home/home.vue'], resolve),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/searchBlog',
    name: 'searchBlog',
    component: resolve => require(['@/views/home/searchBlog.vue'], resolve),
    meta: {
      title: '帖子列表'
    }
  },
  {
    path: '/circle',
    name: 'circle',
    component: resolve => require(['@/views/circle/circle.vue'], resolve),
    meta: {
      title: '我的圈子'
    }
  },
  {
    path: '/searchCircle',
    name: 'searchCircle',
    component: resolve => require(['@/views/circle/searchCircle.vue'], resolve),
    meta: {
      title: '搜索'
    }
  },
  {
    path: '/myCircle',
    name: 'myCircle',
    component: resolve => require(['@/views/circle/myCircle.vue'], resolve),
    meta: {
      title: '已有圈子'
    }
  },
  {
    path: '/joinCircle',
    name: 'joinCircle',
    component: resolve => require(['@/views/circle/joinCircle.vue'], resolve),
    meta: {
      title: '加入圈子'
    }
  },
  {
    path: '/addCircle',
    name: 'addCircle',
    component: resolve => require(['@/views/circle/addCircle.vue'], resolve),
    meta: {
      title: '创建圈子'
    }
  },
  {
    path: '/circleDetail',
    name: 'circleDetail',
    component: resolve => require(['@/views/circle/circleDetail.vue'], resolve),
    meta: {
      title: '圈子'
    }
  },
  {
    path: '/addBlog',
    name: 'addBlog',
    component: resolve => require(['@/views/circle/addBlog.vue'], resolve),
    meta: {
      title: '发帖'
    }
  },
  {
    path: '/blogDetail',
    name: 'blogDetail',
    component: resolve => require(['@/views/circle/blogDetail.vue'], resolve),
    meta: {
      title: '帖子详情'
    }
  },
  {
    path: '/member',
    name: 'member',
    component: resolve => require(['@/views/circle/member.vue'], resolve),
    meta: {
      title: '圈子成员'
    }
  },
  {
    path: '/circleUserInfo',
    name: 'circleUserInfo',
    component: resolve => require(['@/views/circle/circleUserInfo.vue'], resolve),
    meta: {
      title: '成员详情'
    }
  },
  {
    path: '/news',
    name: 'news',
    component: resolve => require(['@/views/news/news.vue'], resolve),
    meta: {
      title: '消息'
    }
  },
  {
    path: '/newComments',
    name: 'newComments',
    component: resolve => require(['@/views/news/newComments.vue'], resolve),
    meta: {
      title: '最新评论'
    }
  },
  {
    path: '/weMsg',
    name: 'weMsg',
    component: resolve => require(['@/views/news/weMsg.vue'], resolve),
    meta: {
      title: '消息记录'
    }
  },
  {
    path: '/mine',
    name: 'mine',
    component: resolve => require(['@/views/mine/mine.vue'], resolve),
    meta: {
      title: '我的'
    }
  },
  {
    path: '/myblog',
    name: 'myblog',
    component: resolve => require(['@/views/mine/myblog.vue'], resolve),
    meta: {
      title: '我的帖子'
    }
  },
  {
    path: '/friends',
    name: 'friends',
    component: resolve => require(['@/views/mine/friends.vue'], resolve),
    meta: {
      title: '我的好友'
    }
  },
  {
    path: '/vip',
    name: 'vip',
    component: resolve => require(['@/views/mine/vip.vue'], resolve),
    meta: {
      title: '我的VIP'
    }
  },
  {
    path: '/attest',
    name: 'attest',
    component: resolve => require(['@/views/mine/attest.vue'], resolve),
    meta: {
      title: '认证'
    }
  },
  {
    path: '/follow',
    name: 'follow',
    component: resolve => require(['@/views/mine/follow.vue'], resolve),
    meta: {
      title: '关注公众号'
    }
  },
  {
    path: '/wx',
    name: 'wx',
    component: resolve => require(['@/views/login/wx.vue'], resolve),
    meta: {
      title: '授权'
    }
  }
  ]
})
