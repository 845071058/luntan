<template>
	<div class="myblog">
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
              <van-icon @click.stop="delBlog(item)" name="cross" color="#C7C7C7" />
							<!-- <img src="../../assets/images/dian.png" alt="" class="card-hide" /> -->
						</div>
						<div class="text">
							<div class="con" v-html="item.content"></div>
							<div class="imgList" v-if="item.imgs && item.imgs.length > 0">
								<div class="imgItem" v-for="(imgObj, imgIndex) in item.imgs" :key="imgIndex" @click.stop="checkImg(imgObj.imgUrl, item.imgs)">
									<img :src="imgObj.imgUrl" alt />
								</div>
							</div>
							<div class="bot">
								<p class="bot-time">{{ item.createTime }}</p>
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
		<van-overlay :show="show" @click="show = false" z-index="999">
			<div class="commentBox">
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
				<div class="commentFrame">
					<div class="commentInput"><input type="text" v-model="commentValue" :placeholder="commentInputText" /></div>
					<van-button plain type="info" round @click="addComment">发送</van-button>
				</div>
			</div>
		</van-overlay>
		<!-- 查看回复详情 -->
		<van-overlay :show="replyShowDetail" @click="show = false" z-index="999">
			<div class="commentBox">
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
					<div class="commentListItem reply-commit reply-commit-repeat" v-for="(item, index) in commentInfo.replys" :key="index">
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
					<div class="commentInput"><input type="text" v-model="commentValue" placeholder="回复评论..." /></div>
					<van-button plain type="info" round @click="addComment">发送</van-button>
				</div>
			</div>
		</van-overlay>
	</div>
</template>

<script>
  import wx from 'weixin-js-sdk';

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

export default {
	name: 'myblog',
	data() {
		return {
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
			blogList: [],
      show: false,
      shows: false,
      isMaster: 2,
      selectBlogObj: '',
      commentValue: '',
      commentBlogId: '',
      commentList: [],
      commentInputText: '发表评论...',
      commentId: '',
      commentToUserId: '',
      actions: [{ key: 1, name: '置顶' }, { key: 2, name: '删除', color: '#FF3B30' }],
      commentInfo: initCommentInfo(),
      replyShowDetail: false
		};
	},
	computed: {
		userId() {
			return this.$store.state.user.userId;
		}
	},
	created() {
		let time = setInterval(() => {
			if (this.userId) {
        this.wxJssdk();
				this.getMyBolg();
				clearInterval(time);
			}
		}, 500);
	},
	methods: {
    wxJssdk() {
    	let url = encodeURIComponent(location.href.split('#')[0]);
    	this.Api.wxJssdk({ configUrl: url }).then(res => {
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
		getMyBolg() {
			this.Api.getMyBolg({ userId: this.userId }).then(res => {
				if (res.success) {
					this.blogList = res.data;
				} else {
					this.$toast(res.msg);
				}
			});
		},
    goBlogDetail(item) {
      this.$router.push({ path: 'blogDetail', query: { blogId: item.blogId } });
    },
    onComment(item) {
    	this.commentValue = '';
    	this.commentInputText = '发表评论...';
    	this.commentId = '';
    	this.commentToUserId = '';

    	if(!this.show) this.show = true;
    	if(item) this.commentBlogId = item.blogId

    	this.Api.onClickComment({ blogId: this.commentBlogId }).then(res => {
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
    	this.commentId = item.commentId;
    	this.commentToUserId = item.createrId;
    	this.commentInfo = item;
    	this.replyByCommentId();
    },
    replyByCommentId(){
    	this.Api.replyByCommentId({commentId:this.commentInfo.commentId}).then(res => {
    		if (res.success) {
    			this.commentInfo.replys = res.data
    		} else {
    			this.$toast(res.msg);
    		}
    	})
    },
    addComment() {
    	let params = {
    		blogId: this.commentBlogId,
    		userId: this.userId,
    		commentId: this.commentId,
    		toUserId: this.commentToUserId,
    		content: this.commentValue
    	};
    	this.Api.addNewReply(params).then(res => {
    		if (res.success) {
    			if(this.commentInfo.commentId) this.replyByCommentId()
    			this.$toast('成功！');
    			this.onComment()
          this.getMyBolg()
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
              this.getMyBolg();
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
.myblog {
  background: #fff;
  padding: 0 0.32rem;
}
</style>
