<template>
  <div class="searchBlog">
    <div class="search">
      <div class="search-input">
        <van-icon style="position: absolute;left: 18px;top: 15px;" name="search" size="20" color="#969799" />
        <input type="text" placeholder="请输入帖子内容" v-model="searchVal" />
      </div>
      <van-button plain type="info" @click="searchBlog">搜索</van-button>
    </div>
    <ul class="cardList">
      <li class="cardList-item" v-for="(item, index) in blogList" :key="index">
        <div class="user" @click="goBlogDetail(item)">
          <div class="headImg" @click.stop="goUserDetail(item)"><img :src="item.headImgUrl" alt="" /></div>
          <div class="name">
          	<p :class="item.isVip === 1 ? 'isVip' : ''">
              {{ item.nickName }}
              <img v-if="item.isVip === 1" src="../../assets/images/vip1.png" alt="">
              <span class="icon" v-if="item.proveStatus < 3">{{item.proveStatus === 1 ? '个人实名' : item.proveStatus === 2 ? '企业认证' : ''}}</span>
            </p>
          	<span>{{ item.createTime }}</span>
          </div>
          <van-button type="primary" v-if="circleId && isMaster === 1 && item.isTop != 1" @click.stop="isTop(item)">置顶</van-button>
          <van-button type="danger" v-if="circleId && isMaster === 1 && item.isTop === 1" @click.stop="isTop(item)">取消置顶</van-button>
          <van-button type="danger" v-if="circleId && isMaster === 1" @click.stop="delBlog(item)">删除</van-button>
          <!-- <van-icon class="icon" name="arrow" /> -->
        </div>
        <div class="text">
          <div class="con" v-html="item.content"></div>
          <div class="imgList" v-if="item.imgs && item.imgs.length > 0">
            <div class="imgItem" v-for="(imgObj, index) in item.imgs" :key="index" @click="checkImg(imgObj.imgUrl, item.imgs)"><img :src="imgObj.imgUrl" alt="" /></div>
          </div>
          <div class="bot">
            <div class="comment" @click.stop="onComment(item)">
              <van-icon class="icon" name="comment-o" />
              评论（{{ item.totalComment }}）
            </div>
            <div class="fabulous" @click.stop="onLike(item)">
              <van-icon class="icon" name="like" :class="item.isLike === 1 ? 'active' : ''" />
              点赞（{{ item.totalLike }}）
            </div>
          </div>
        </div>
      </li>
    </ul>
    <van-overlay :show="show" @click="show = false">
      <div class="reply" @click.stop>
        <div class="reply-input"><input type="text" v-model="commentValue" placeholder="发表评论" /></div>
        <van-button plain type="info" @click="addComment">发送</van-button>
      </div>
    </van-overlay>
  </div>
</template>
<script>
import { userInfo } from '@/Api/test';
import wx from 'weixin-js-sdk';
export default {
  name: 'searchBlog',
  data() {
    return {
      circleId: this.$route.query.circleId ? this.$route.query.circleId : '',
      searchVal: '',
      blogList: [],
      isMaster: 1,
      show: false,
      commentValue: '',
      commentBlogId: ''
    };
  },
  computed: {
    userId() {
      return this.$store.state.user.userId;
    }
  },
  created() {
    if (this.circleId) {
      let time = setInterval(() => {
        if (this.userId) {
          this.getCircleUsers();
          this.searchBlog();
          clearInterval(time);
        }
      }, 500);
    }
  },
  methods: {
    wxJssdk() {
      let url = encodeURIComponent(location.href.split('#')[0])
      this.Api.wxJssdk({configUrl: url}).then(res => {
        wx.config({
          debug: false,
          appId: res.data.appid,
          timestamp: res.data.timestamp,
          nonceStr: res.data.nonceStr,
          signature: res.data.signature,
          jsApiList: ['previewImage']
        });
      });
    },
    checkImg(src, list) {
      let lists = [];
      list.forEach(elem => {
        lists.push(elem.imgUrl);
      });
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: lists // 需要预览的图片http链接列表
      });
    },
    getCircleUsers() {
      this.Api.getCircleUsers({ circleId: this.circleId, userId: this.userId }).then(res => {
        if (res.success) {
          this.isMaster = res.data.isMaster;
        } else {
          this.$toast(res.msg);
        }
      });
    },
    searchBlog() {
      if (!this.circleId) {
        this.Api.myDadPage({ userId: this.userId, content: this.searchVal }).then(res => {
          if (res.success) {
            this.blogList = res.data.circleBlog;
          } else {
            this.$toast(res.msg);
          }
        });
      } else {
        this.Api.getBolgByCircle({ circleId: this.circleId, userId: this.userId, content: this.searchVal }).then(res => {
          if (res.success) {
            this.blogList = res.data;
          } else {
            this.$toast(res.msg);
          }
        });
      }
    },
    goUserDetail(userInfo) {
      if (this.circleId) {
        this.$router.push({ path: 'circleUserInfo', query: { toUserId: userInfo.creater, circleId: this.circleId } });
      } else {
        this.$router.push({ path: 'circleUserInfo', query: { toUserId: userInfo.creater, circleId: userInfo.circleId } });
      }
    },
    goBlogDetail(item) {
      this.$router.push({ path: 'blogDetail', query: { blogId: item.blogId } });
    },
    onComment(item) {
      (this.show = true), (this.commentValue = '');
      this.commentBlogId = item.blogId;
    },
    addComment() {
      let params = {
        blogId: this.commentBlogId,
        byUserId: this.userId,
        commentType: 1,
        content: this.commentValue
      };
      this.Api.addComment(params).then(res => {
        if (res.success) {
          this.$toast('成功！');
          this.show = false;
          this.searchBlog();
        } else {
          this.$toast(res.msg);
        }
      });
    },
    onLike(item) {
      let params = {
        blogId: item.blogId,
        isLike: 1,
        userId: this.$store.state.user.userId
      };
      if (item.isLike === 1) {
        params.isLike = 2;
      }
      this.Api.isLike(params).then(res => {
        if (res.success) {
          item.isLike = params.isLike;
          if (item.isLike === 1) {
            item.totalLike++;
            this.$toast('点赞成功！');
          } else {
            item.totalLike--;
            this.$toast('取消成功！');
          }
        }
      });
    },
    isTop(item) {
      let params = {
        blogId: item.blogId,
        isTop: 1,
        userId: this.userId
      };
      let text = '您确定置顶该帖子吗？';
      if (item.isTop === 1) {
        params.isTop = 2;
        text = '您确定取消置顶该帖子吗？';
      }
      this.$dialog
        .confirm({
          title: '置顶帖子',
          message: text
        })
        .then(() => {
          this.Api.isTop(params).then(res => {
            if (res.success) {
              item.isTop = params.isTop;
              this.$toast('成功！');
            } else {
              this.$toast(res.msg);
            }
          });
        })
        .catch(() => {});
    },
    delBlog(item) {
      let params = {
        blogId: item.blogId,
        userId: this.userId
      };
      this.$dialog
        .confirm({
          title: '删除帖子',
          message: '您确定删除该帖子吗？'
        })
        .then(() => {
          this.Api.delBlog(params).then(res => {
            if (res.success) {
              this.getBolgByCircle();
              this.$toast('删除成功！');
            } else {
              this.$toast(res.msg);
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.searchBlog {
  .search {
    margin-bottom: 0.1rem;
    background: #fff;
    padding: 10px;
    display: flex;
    .search-input {
      flex: 1;
      background: #f7f7f7;
      border-radius: 15px;
      height: 30px;
      padding-left: 35px;
      padding-right: 10px;
      line-height: 30px;
      font-size: 12px;
      color: #232326;
      input {
        background: none;
        width: 100%;
      }
    }
    .van-button {
      padding: 0;
      border: none;
      height: 30px;
      line-height: 30px;
      margin-left: 10px;
    }
  }
}
</style>
