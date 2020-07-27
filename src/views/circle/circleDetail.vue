<template>
  <div class="circleDetail">
    <div class="head">
      <div class="head-img">
        <img :src="circleInfo.circleImg" alt />
        <van-button type="default" class="visit-btn" @click="share">邀请</van-button>
      </div>
      <h5>{{ circleInfo.circleName }}</h5>
      <p class="member-number">成员：{{ circleInfo.totalUser }}人</p>
      <div class="member-info">
        <p>{{ circleInfo.circleDesc }}</p>
        <img v-if="isMaster === 1" src="../../assets/images/xg.png" alt="" @click="onUpInfo">
      </div>
      <div class="memberd-list" @click.stop="goMember">
        <div class="member-head-list"><img v-for="(item, index) in circleInfo.userHeadImg" :key="index" :src="item"
            v-if="index < 8" alt /></div>
        <div class="circle-addressBook">
          圈内通讯录
          <van-icon name="arrow" size="14" color="#969799" />
        </div>
      </div>
    </div>
    <div class="card">
      <h4 class="post-total">
        圈内帖子
        <i>{{ pageTotal }}</i>
      </h4>
      <div v-if="!blogList || blogList.length < 1" class="blogNone">
        <img src="../../assets/images/img_6.png" alt="" />
        <p>还没有人来发帖，快来占据第一个沙发…</p>
      </div>
      <ul class="cardList">
        <li class="cardList-item" v-for="(item, index) in blogList" :key="index">
          <div class="user" @click="goBlogDetail(item)">
            <div class="headImg" @click.stop="goUserDetail(item)"><img :src="item.headImgUrl" alt /></div>
            <div class="post-detail">
              <div class="name">
                <p :class="{active:item.isVip === 1}">
                  {{ item.nickName }}
                  <img class="vipImg" v-if="item.isVip === 1" src="../../assets/images/vip1.png" alt />
                  <img class="attestImg" v-if="item.proveStatus === 1" src="../../assets/images/grsm.png" alt="" />
                  <img class="attestImg" v-if="item.proveStatus === 2" src="../../assets/images/qysm.png" alt="" />
                </p>
                <img v-if="isMaster === 1" src="../../assets/images/dian.png" alt="" class="card-hide" @click.stop="selectBlog(item)" />
              </div>
              <div class="text">
                <div class="con" v-html="item.content"></div>
                <div class="imgList" v-if="item.imgs && item.imgs.length > 0">
                  <div class="imgItem" v-for="(imgObj, imgIndex) in item.imgs" :key="imgIndex" @click.stop="checkImg(imgObj.imgUrl, item.imgs)">
                    <!-- <img :src="imgObj.imgUrl" alt /> -->
                    <div class="img" :style="{'backgroundImage': 'url(' + imgObj.imgUrl + ')'}"></div>
                  </div>
                </div>
                <div class="bot">
                  <p class="bot-time"><span v-if="item.isTop === 1" style="color: #FF4A33;margin-right: 0.1rem;">置顶</span>{{ item.createTime }}</p>
                  <div class="fabulous" :class="item.isLike === 1 ? 'active' : ''" @click.stop="onLike(item)">
                    <img v-if="item.isLike === 1" src="../../assets/images/xin.png" alt="" />
                    <img v-else src="../../assets/images/xin1.png" alt="" />
                    {{ item.totalLike }}
                  </div>
                  <div class="comment" @click.stop="onComment(item)">
                    <img src="../../assets/images/pl.png" alt="" />
                    {{ item.totalComment }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
        <div class="cardBtn" v-if="pageTotal > blogList.length" @click="nextPage">查看更多帖子</div>
      </ul>
    </div>
    <div class="addPost" @click="addBlog">发帖</div>
    <van-dialog v-model="vanDialog" title="修改圈子介绍" show-cancel-button @confirm="updateCircle">
      <div class="circleImg" @click="upCircleImg">
        <img :src="circleInfoParams.circleImg" alt="">
        <van-uploader ref="upCircleImg" :after-read="afterRead" />
      </div>
      <van-field placeholder="圈子名称" maxlength="4" v-model="circleInfoParams.sonName" />
      <van-field type="textarea" placeholder="输入圈子介绍" maxlength="50" show-word-limit v-model="circleInfoParams.circleDesc" />
    </van-dialog>
    <van-overlay :show="show" z-index="999" :lock-scroll="false">
      <div class="commentBox" @click.stop>
        <div class="commentTit">
          <van-icon name="arrow-down" class="icon-down" @click="show = false" />
          全部评论（{{ commentList.length }}）
        </div>
        <div class="commentList">
          <div class="commentListItem" v-for="(item, index) in commentList" :key="index">
            <div class="user">
              <div class="headImg" @click.stop="goUserDetail(item)"><img :src="item.headImg" alt /></div>
              <div class="post-detail">
                <div class="name">
                  <p :class="{active:item.isVip === 1}">
                    {{ item.createrName }}
                    <img class="vipImg" v-if="item.isVip === 1" src="../../assets/images/vip1.png" alt />
                    <img class="attestImg" v-if="item.proveStatus === 1" src="../../assets/images/grsm.png" alt="" />
                    <img class="attestImg" v-if="item.proveStatus === 2" src="../../assets/images/qysm.png" alt="" />
                  </p>
                </div>
                <div class="text">
                  <div class="con" v-html="item.content"></div>
                  <div class="bot">
                    <p class="bot-time">{{ item.createTime }}</p>
                    <div class="bot-but" @click="replyCommit(item)">回复</div>
                  </div>
                </div>
                <div class="reply" v-if="item.replys && item.replys.length > 0">
                  <div class="replyList">
                    <div class="replyListItem" v-for="(obj, keys) in item.replys" :key="keys" v-if="keys<2">
                      <div class="name">{{obj.createName}}:</div>
                      <p>{{obj.content}}</p>
                    </div>
                    <div class="replyMore" @click="checkMoreReplay(item)">
                      共{{ item.replys.length }}条回复
                      <van-icon name="arrow" size="14" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="commentFrame" @click.stop>
          <div class="commentInput">
            <input type="text" v-model="commentValue" :placeholder="commentInputText" />
            <van-icon v-if="commentToUserId" @click.stop="initCommentData" name="close" color="#C7C7C7" size="16" />
          </div>
          <van-button plain type="info" round @click="addComment(1)">发送</van-button>
        </div>
      </div>
    </van-overlay>
    <!-- 查看回复详情 -->
    <van-overlay :show="replyShowDetail" :lock-scroll="false" z-index="1000">
      <div class="commentBox" @click.stop>
        <div class="commentTit">
          <van-icon name="arrow-down" class="icon-down" @click="replyShowDetail = false" />
          {{commentInfo.replys.length}}条回复
        </div>
        <div class="commentList replyCommitList">
          <!-- 第一条回复 -->
          <div class="commentListItem reply-commit">
            <div class="user">
              <div class="headImg" @click.stop="goUserDetail(commentInfo)"><img :src="commentInfo.headImg" alt /></div>
              <div class="post-detail">
                <div class="name">
                  <p :class="{active:commentInfo.isVip === 1}">
                    {{ commentInfo.createrName }}
                    <img class="vipImg" v-if="commentInfo.isVip === 1" src="../../assets/images/vip1.png" alt />
                    <img class="attestImg" v-if="commentInfo.proveStatus === 1" src="../../assets/images/grsm.png" alt="" />
                    <img class="attestImg" v-if="commentInfo.proveStatus === 2" src="../../assets/images/qysm.png" alt="" />
                  </p>
                </div>
                <div class="text">
                  <div class="con" v-html="commentInfo.content"></div>
                  <div class="bot">
                    <p class="bot-time">{{ commentInfo.createTime }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 回复的评论 -->
          <div class="commentListItem reply-commit reply-commit-repeat" v-for="(item, index) in commentInfo.replys"
            :key="index">
            <div class="user">
              <div class="headImg" @click.stop="goUserDetail(item)"><img :src="item.headImg" alt /></div>
              <div class="post-detail">
                <div class="name">
                  <p :class="{active:item.isVip === 1}">
                    {{ item.createName }}
                    <img class="vipImg" v-if="item.isVip === 1" src="../../assets/images/vip1.png" alt />
                    <img class="attestImg" v-if="item.proveStatus === 1" src="../../assets/images/grsm.png" alt="" />
                    <img class="attestImg" v-if="item.proveStatus === 2" src="../../assets/images/qysm.png" alt="" />
                  </p>
                </div>
                <div class="text">
                  <div class="con" v-html="item.content"></div>
                  <div class="bot">
                    <p class="bot-time">{{ item.createTime }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="commentFrame">
          <div class="commentInput"><input type="text" v-model="commentValues" placeholder="回复评论..." /></div>
          <van-button plain type="info" round @click="addComment">发送</van-button>
        </div>
      </div>
    </van-overlay>
    <!-- 分享 -->
    <div class="shareBox" v-if="isShareBox" @click="isShareBox = false">
      <div class="shareBox-con">
        <div class="head">
          <div class="headImg"><img :src="userInfo.headimgurl" alt="" /></div>
          <div class="text">
            <p>{{ userInfo.nickname }}</p>
            <span>邀请你加入{{ circleInfo.circleName }}微信万人群</span>
          </div>
        </div>
        <div class="con">
          <p>长按保存二维码</p>
          <img :src="shareImg" alt="" />
          <p>万人注目，丰富人脉资源</p>
        </div>
      </div>
    </div>
    <!-- 操作 -->
    <van-action-sheet v-model="shows" :actions="actions" cancel-text="取消" close-on-click-action @select="onSelect" />
  </div>
</template>
<script>
  import wx from 'weixin-js-sdk'
  import {
    assign
  } from '@/utils'

  function initCommentInfo() {
    return {
      nickName: '',
      headImgUrl: '',
      isVip: '',
      proveStatus: '',
      content: '',
      createTime: '',
      replys: []
    };
  }

  function initCircleInfo() {
    return {
      circleId: '',
      circleImg: '',
      circleName: '',
      circleDesc: '',
      sonName: '',
      totalBlog: 0,
      totalUser: 0,
      userHeadImg: ''
    }
  }

  function initCircleInfoParams() {
    return {
      circleImg: '',
      imgId: '',
      sonName: '',
      circleDesc: ''
    }
  }
  export default {
    name: 'circleDetail',
    data() {
      return {
        isMyCircle: false,
        recomCircle: [],
        circleId: '',
        circleInfo: initCircleInfo(),
        circleInfoParams: initCircleInfoParams(),
        pageNum: 1,
        pageSize: 10,
        pageTotal: 0,
        blogList: [],
        show: false,
        commentBlogId: '',
        isMaster: 2,
        isShareBox: false,
        shareImg: '',
        shows: false,
        selectBlogObj: '',
        commentList: [],
        commentInputText: '发表评论...',
        commentValue: '',
        commentValues: '',
        commentId: '',
        commentIds: '',
        commentToUserId: '',
        commentToUserIds: '',
        actions: [{
          key: 1,
          name: '置顶'
        }, {
          key: 2,
          name: '删除',
          color: '#FF3B30'
        }],
        commentInfo: initCommentInfo(),
        replyShowDetail: false,
        vanDialog: false
      };
    },
    computed: {
      userInfo() {
        return this.$store.state.user;
      },
      userId() {
        return this.$store.state.user.userId;
      }
    },
    created() {
      this.circleId = this.$route.query.circleId;
      document.title = this.$route.query.circleName;
      let time = setInterval(() => {
        if (this.userId) {
          this.wxJssdk();
          this.getCircleDetail(2);
          this.getBolgsByCircle();
          clearInterval(time);
        }
      }, 500);
    },
    methods: {
      wxJssdk() {
        let url = encodeURIComponent(location.href.split('#')[0]);
        this.Api.wxJssdk({
          configUrl: url
        }).then(res => {
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
        this.Api.getCircleUsers({
          circleId: this.circleId,
          userId: this.userId
        }).then(res => {
          if (res.success) {
            this.isMaster = res.data.isMaster;
            this.circleUsers = res.data.list;
          } else {
            this.$toast(res.msg);
          }
        });
      },
      getCircleDetail(type) {
        this.Api.getCircleDetail({
          circleId: this.circleId,
          userId: this.userId,
          type:type
        }).then(res => {
          if (res.success) {
            this.isMaster = res.data.isMaster;
            this.circleInfo = res.data;
          } else {
            this.$toast(res.msg);
          }
        });
      },
      initPage() {
        this.blogList = []
        this.pageNum = 1
        this.pageSize = 10
        this.getBolgsByCircle()
      },
      getBolgsByCircle() {
        this.Api.findBLogbypage({
          userId: this.userId,
          circleId: this.circleId,
          page: this.pageNum,
          size: this.pageSize
        }).then(res => {
          if (res.success) {
            this.blogList = [...this.blogList, ...res.data.data];
            this.pageTotal = res.data.total;
          } else {
            this.$toast(res.msg);
          }
        });
      },
      nextPage() {
        this.pageNum = this.pageNum + 1;
        this.getBolgsByCircle();
      },
      goBlogDetail(item) {
        this.$router.push({
          path: 'blogDetail',
          query: {
            circleId: this.circleId,
            blogId: item.blogId
          }
        });
      },
      addBlog() {
        this.$router.push({
          path: 'addBlog',
          query: {
            circleId: this.circleId
          }
        });
      },
      onLike(item) {
        let params = {
          blogId: item.blogId,
          isLike: 1,
          userId: this.userId
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
                this.getBolgsByCircle();
                this.$toast('删除成功！');
              } else {
                this.$toast(res.msg);
              }
            });
          })
          .catch(() => {});
      },
      initCommentData() {
        this.commentValue = '';
        this.commentInputText = '发表评论...';
        this.commentId = '';
        this.commentToUserId = '';
      },
      onComment(item) {
        this.initCommentData()
        this.show = true;
        this.commentBlogId = item.blogId;
        this.onClickComment()
      },
      onClickComment(){
        this.Api.onClickComment({
          blogId: this.commentBlogId
        }).then(res => {
          if (res.success) {
            this.commentList = res.data;
          } else {
            this.$toast(res.msg);
          }
        });
      },
      replyCommit(item) {
        this.commentId = item.commentId;
        this.commentToUserId = item.createrId;
        this.commentInputText = `@${item.createrName}`;
      },
      checkMoreReplay(item) {
        this.replyShowDetail = true;
        this.commentIds = item.commentId;
        this.commentToUserIds = item.createrId;
        this.commentInfo = item;
        this.replyByCommentId();
      },
      replyByCommentId() {
        this.Api.replyByCommentId({
          commentId: this.commentInfo.commentId
        }).then(res => {
          if (res.success) {
            this.commentInfo.replys = res.data
          } else {
            this.$toast(res.msg);
          }
        })
      },
      addComment(type) {
        if(!this.commentValue) {
          this.$toast('内容不能为空！');
        }
        let params = {
          blogId: this.commentBlogId,
          userId: this.userId
        };
        if(type === 1) {
          params.content = this.commentValue
          params.commentId = this.commentId
          params.toUserId = this.commentToUserId
        } else {
          params.content = this.commentValues
          params.commentId = this.commentIds
          params.toUserId = this.commentToUserIds
        }
        this.Api.addNewReply(params).then(res => {
          if (res.success) {
            if (this.commentInfo.commentId) this.replyByCommentId();
            if(type === 1) {
              this.initCommentData()
            } else {
              this.commentValues = ''
            }
            this.$toast('成功！');
            this.onClickComment();
            this.initPage();
          } else {
            this.$toast(res.msg);
          }
        });
      },
      share() {
        if (this.shareImg) return (this.isShareBox = true);
        this.Api.getCircleCode({
          circleId: this.circleId,
          shareId: this.userId
        }).then(res => {
          this.isShareBox = true;
          this.shareImg = 'data:image/png;base64,' + res.data;
        });
      },
      goMember() {
        this.$router.push({
          path: 'member',
          query: {
            circleId: this.circleId
          }
        });
      },
      goUserDetail(userInfo) {
        let userId = userInfo.userId ? userInfo.userId : userInfo.createrId;
        this.$router.push({
          path: 'circleUserInfo',
          query: {
            toUserId: userId,
            circleId: this.circleId
          }
        });
      },
      goSearchBlog() {
        this.$router.push({
          path: 'searchBlog',
          query: {
            circleId: this.circleId
          }
        });
      },
      upCircleImg() {
        this.$refs.upCircleImg.$refs.input.click()
      },
      afterRead(file) {
        let formdata = new FormData();
        formdata.append('file', file.file);
        formdata.append('type', '2');
        this.Api.uploadImg(formdata).then(res => {
          if (res.success) {
            this.circleInfoParams.circleImg = file.content
            this.circleInfoParams.imgId = res.data
            this.$toast('上传成功！');
          } else {
            this.$toast(res.msg);
          }
        });
      },
      onUpInfo() {
        this.vanDialog = true
        this.circleInfoParams = assign(this.circleInfoParams, this.circleInfo)
      },
      updateCircle() {
        this.Api.updateCircle({
          userId: this.userId,
          id: this.circleId,
          ...this.circleInfoParams
        }).then(res => {
          if (res.success) {
            this.$toast('成功！');
            this.vanDialog = false;
            this.getCircleDetail(2)
          } else {
            this.$toast(res.msg);
          }
        });
      },
      selectBlog(item) {
        if (item.isTop === 1) {
          this.actions[0].name = '取消置顶';
        } else {
          this.actions[0].name = '置顶';
        }
        this.shows = true;
        this.selectBlogObj = item;
      },
      onSelect(item) {
        if (item.key === 1) {
          this.isTop(this.selectBlogObj);
        } else {
          this.delBlog(this.selectBlogObj);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .circleDetail {
    height: 100%;
    overflow: auto;

    .van-dialog {
      .circleImg {
        width: 1.8rem;
        height: 1.8rem;
        border-radius: 50%;
        overflow: hidden;
        margin: 0.2rem auto;

        .van-uploader {
          display: none;
        }

        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
    }

    .head {
      position: relative;
      background: #fff;
      padding: 0.4rem 0.32rem;
      font-size: 0.28rem;

      .head-img {
        overflow: hidden;

        img {
          float: left;
          width: 1.12rem;
          height: 1.12rem;
          border-radius: 50%;
          display: block;
        }

        .visit-btn {
          margin-top: 0.3rem;
          float: right;
          background: #ffc85f;
          box-shadow: 0 10px 11px -8px #ffc557;
          border-radius: 15px;
          height: 0.6rem;
          line-height: 0.6rem;
          border: none;
        }
      }

      h5 {
        font-size: 0.44rem;
        margin: 0.16rem 0;
        font-weight: bold;
      }

      .member-info {
        display: flex;
        align-items: center;

        p {
          width: 5.6rem;
          font-size: 0.28rem;
          color: #666;
        }

        img {
          width: 0.3rem;
          margin-left: 0.4rem;
          display: block;
        }
      }

      .member-number {
        font-size: 0.28rem;
        margin: 0.12rem 0;
      }

      .memberd-list {
        margin-top: 0.2rem;
        overflow: hidden;
        background: #f5f6f7;
        border-radius: 8px;
        padding: 0.2rem;
        display: flex;
        align-items: center;

        .member-head-list {
          display: flex;
          flex: 1;

          img {
            margin-left: -6px;
            display: block;
            height: 0.6rem;
            width: 0.6rem;
            border-radius: 50%;
            border: 1px solid #fff;
          }

          &::first {
            margin-left: 0;
          }
        }

        .circle-addressBook {
          font-size: 0.28rem;
          color: #999999;
          display: flex;
          align-items: center;
          line-height: 1;
        }
      }

      .share {
        position: absolute;
        top: 0.2rem;
        right: 0.2rem;
        font-size: 14px;
        color: #fff;
      }

      .memberBtn {
        position: absolute;
        top: 0.2rem;
        left: 0.2rem;
        font-size: 14px;
        color: #fff;
      }

      .circleName {
        color: #333;
        text-align: center;
        font-size: 0.64rem;
        padding: 0.1rem 0;
        background: #1989fa;
        color: #fff;
        height: 3rem;
        line-height: 3rem;
      }

      .dataDisplay {
        display: flex;
        background: #fff;

        .dataDisplayItem {
          padding: 0.2rem 0;
          flex: 1;
          font-size: 12px;
          text-align: center;
          border-right: 1px solid #ddd;

          .name {
            color: #888;
          }

          .val {
            color: #1989fa;
          }

          &:last-child {
            border-right: none;
          }
        }
      }
    }

    .addPost {
      width: 1rem;
      height: 1rem;
      background: #ffc85f;
      box-shadow: 0 10px 11px -8px #ffc557;
      position: fixed;
      top: 9rem;
      right: 0.2rem;
      font-size: 14px;
      text-align: center;
      line-height: 1rem;
      border-radius: 50%;
      color: #333;
    }

    .member {
      .title {
        display: flex;
        align-items: center;
        padding-left: 10px;

        .btn {
          display: flex;
          align-items: center;
          color: #1989fa;
          font-size: 14px;
        }

        p {
          flex: 1;
          font-size: 14px;
          color: #666;
          line-height: 30px;
        }
      }
    }

    .card {
      margin-top: 0.2rem;
      background: #fff;
      padding: 0.4rem 0.32rem;

      .blogNone {
        overflow: hidden;

        img {
          width: 1.66rem;
          display: block;
          margin: 1rem auto 0.44rem;
        }

        p {
          color: #999;
          font-size: 0.28rem;
          text-align: center;
        }
      }

      .post-total {
        font-size: 0.36rem;

        i {
          font-size: 0.32rem;
          color: #999999;
        }
      }

      .title {
        display: flex;
        align-items: center;
        padding-left: 10px;

        .btn {
          display: flex;
          align-items: center;
          color: #1989fa;
          font-size: 14px;
        }

        p {
          flex: 1;
          font-size: 14px;
          color: #666;
          line-height: 30px;
        }
      }
    }
  }

  .shareBox {
    width: 100%;
    height: 100%;
    background-color: #f5f6f7;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;

    .shareBox-con {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      width: 6.4rem;
      padding: 0.6rem 0.3rem;
      box-sizing: border-box;

      .head {
        display: flex;
        border-bottom: 1px dotted #eee;
        padding: 0 0 0.44rem 0;
        margin: 0;

        .headImg {
          width: 0.88rem;
          height: 0.88rem;
          overflow: hidden;
          border-radius: 50%;
          margin-right: 0.1rem;

          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }

        .text {
          flex: 1;

          p {
            color: #333;
            font-size: 0.28rem;
          }

          span {
            color: #666;
            font-size: 0.28rem;
            display: block;
          }
        }
      }
    }

    .con {
      overflow: hidden;

      img {
        width: 3.9rem;
        height: 3.9rem;
        margin: 0 auto;
        display: block;
      }

      p {
        margin-top: 0.26rem;
        font-size: 0.3rem;
        color: #666;
        text-align: center;
      }
    }
  }
</style>
