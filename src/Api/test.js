import { axiosGet, axiosPost } from './baseApi'
import apiHost from '@/Api/apiConfig'

let originApi = ''
if (process.env.NODE_ENV !== 'development') {
  originApi = apiHost.ORIGIN + '/api'
}
// 微信
export const getOpenId = (params) => axiosGet(originApi + '/mychat/getOpenid', params)

export const getUserInfo = (params) => axiosGet(originApi + '/mychat/getUserInfo', params)

export const updateMyInfo = (params) => axiosPost(originApi + '/mychat/updateMyInfo', params) // 是否置顶帖子

export const wxJssdk = (params) => axiosGet(originApi + '/mychat/config', params) // jssdk授权

export const addFeedback = (params) => axiosPost(originApi + '/feedback/add', params) // 新增反馈

export const uploadImg = (params) => axiosPost(originApi + '/img/upload', params)

export const userAddCircle = (params) => axiosGet(originApi + '/userCircle/userAddCircle', params)

export const isBan = (params) => axiosGet(originApi + '/userCircle/isBan', params) // 禁言解除禁言

export const getMyCircleInfo = (params) => axiosGet(originApi + '/userCircle/getMyCircleInfo', params) // 获取用户在圈子中的信息

export const updMyCircleInfo = (params) => axiosPost(originApi + '/userCircle/updMyCircleInfo', params) // 修改用户在圈子中的信息

//圈子

export const addCircle = (params) => axiosPost(originApi + '/circle/addCircle', params)

export const getMyCare = (params) => axiosGet(originApi + '/circle/getMyCare', params)

export const getCircleByName = (params) => axiosGet(originApi + '/circle/getByName', params)

export const getCircleDetailById = (params) => axiosGet(originApi + '/circle/getCircleDetailById', params) // 圈子详情

export const getCircleCode = (params) => axiosGet(originApi + '/circle/getCircleCode', params) // 生成圈子二维码

export const getMyCircles = (params) => axiosGet(originApi + '/circle/getMyCircles', params)

export const getCircleUsers = (params) => axiosGet(originApi + '/circle/getCircleUsers', params) // 查询圈子内的成员

export const updateCircle = (params) => axiosPost(originApi + '/circle/updateCircle', params) // 修改圈子介绍

export const getSuperCircle = (params) => axiosGet(originApi + '/circle/getSuperCircle', params)

export const getCircleDetail = (params) => axiosGet(originApi + '/circle/getCircleDetail', params)

export const getCircleRecomCircle = (params) => axiosGet(originApi + '/circle/recomCircle', params)

// 帖子

export const getBolgByCircle = (params) => axiosPost(originApi + '/blog/getBolgByCircle', params)

export const findBLogbypage = (params) => axiosPost(originApi + '/blog//findBlogByPage', params)

export const addBlog = (params) => axiosPost(originApi + '/blog/addBolg', params)

export const getBlogDetail = (params) => axiosGet(originApi + '/blog/blogDetail', params) // 帖子详情

export const isLike = (params) => axiosGet(originApi + '/blog/myLike', params) // 点赞

export const getMyBolg = (params) => axiosGet(originApi + '/blog/getMyBolg', params) // 我的帖子

export const dadPage = (params) => axiosGet(originApi + '/blog/dadPage', params) // 首页帖子查询

export const delBlog = (params) => axiosPost(originApi + '/blog/delBlog', params) // 群主或贴主删除帖子

export const isTop = (params) => axiosPost(originApi + '/blog/isTop', params) // 是否置顶帖子

export const myDadPage = (params) => axiosGet(originApi + '/blog/myDadPage', params) // 首页用户圈子情况

export const recomCircle = (params) => axiosGet(originApi + '/blog/recomCircle', params) // 获取推荐圈子列表

// 评论

export const onClickComment = (params) => axiosGet(originApi + '/comment/onClickComment', params) // 点赞

export const addComment = (params) => axiosPost(originApi + '/comment/addComment', params) // 发表评论

export const addNewReply = (params) => axiosPost(originApi + '/comment/addNewReply', params) // 发表评论

export const replyByCommentId = (params) => axiosGet(originApi + '/comment/replyByCommentId', params)

// 消息

export const getWeMsg = (params) => axiosGet(originApi + '/msginfo/getWeMsg', params) // 获取我与某人发送的消息列表

export const sendMsg = (params) => axiosPost(originApi + '/msginfo/sendMsg', params) // 发送消息

export const forMyMsg = (params) => axiosGet(originApi + '/msginfo/forMyMsg', params) // 我收到的消息

export const myFriend = (params) => axiosGet(originApi + '/friend/myFriend', params) // 我的好友

export const getNewComments = (params) => axiosGet(originApi + '/comment/getNewComments', params) // 最新评论

// 会员

export const vipAdd = (params) => axiosGet(originApi + '/vip/add', params)

export const vipDetail = (params) => axiosGet(originApi + '/vip/detail', params)

export const vipAddVipTime = (params) => axiosGet(originApi + '/vip/addVipTime', params)

export const addProve = (params) => axiosPost(originApi + '/prove/add', params)
