<template>
	<div class="blogDetail">
		<div class="head">
			<div class="headImg" @click="goUserDetail({createrId:createrId})"><img :src="headImgUrl" alt="" /></div>
			<div class="text">
				<div class="name">
					<p :class="{active:isVip === 1}">
						{{ nickName }}
						<img class="vipImg" v-if="isVip === 1" src="../../assets/images/vip1.png" alt />
						<img class="attestImg" v-if="proveStatus === 1" src="../../assets/images/grsm.png" alt="" />
						<img class="attestImg" v-if="proveStatus === 2" src="../../assets/images/qysm.png" alt="" />
					</p>
				</div>
				<div class="con" v-html="content"></div>
				<div class="imgList">
					<div class="imgItem" v-for="(item, index) in imgs" :key="index" @click="checkImg(item, imgs)">
            <!-- <img :src="item" alt="" /> -->
            <div class="img" :style="{'backgroundImage': 'url(' + item.imgUrl + ')'}"></div>
          </div>
				</div>
				<div class="bot">
					<p class="bot-time">{{ createTime }}</p>
					<div class="fabulous" :class="isLike === 1 ? 'active' : ''" @click.stop="onLike(item)">
						<img v-if="isLike === 1" src="../../assets/images/xin.png" alt="" />
						<img v-else src="../../assets/images/xin1.png" alt="" />
						{{ totalLike }}
					</div>
				</div>
			</div>
		</div>
		<div class="comment">
			<div class="tit">全部评论（{{ comments.length }}）</div>
			<div class="commentList">
				<div class="commentListItem" v-for="(item, index) in comments" :key="index">
					<div class="user">
						<div class="headImg" @click="goUserDetail(item)"><img :src="item.headImg" alt /></div>
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
									<div class="replyListItem" v-for="(obj, keys) in item.replys" :key="keys" v-if="keys < 2">
										<div class="name">{{ obj.createName }}：</div>
										<p>{{ obj.content }}</p>
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
      <!-- 查看回复详情 -->
      <van-overlay :show="replyShowDetail" z-index="999" :lock-scroll="false">
      	<div class="commentBox">
      		<div class="commentTit">
      			<van-icon name="arrow-down" class="icon-down" @click="replyShowDetail = false" />
      			{{ commentInfo.replys.length }}条回复
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
      			<div class="commentInput"><input type="text" v-model="commentValues" placeholder="回复评论..." /></div>
      			<van-button plain type="info" round @click="addComment">发送</van-button>
      		</div>
      	</div>
      </van-overlay>
			<div class="commentFrame">
				<div class="commentInput">
          <input type="text" v-model="commentValue" :placeholder="commentInputText" />
          <van-icon v-if="commentToUserId" @click.stop="initCommentData" name="close" color="#C7C7C7" size="16" />
        </div>
				<van-button plain type="info" round @click="addComment(1)">发送</van-button>
			</div>
		</div>
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
	name: 'blogDetail',
	data() {
		return {
			blogId: this.$route.query.blogId,
      circleId: this.$route.query.circleId,
			headImgUrl: '',
			isVip: '',
			proveStatus: 4,
			nickName: '',
			createTime: '',
			imgs: [],
			likeUser: [],
			comments: [],
			content: '',
			isLike: 2,
			totalLike: 0,
			show: false,
			msgContent: '',
			commentInputText: '发表评论...',
      commentValue: '',
      commentValues: '',
      commentId: '',
      commentIds: '',
      commentToUserId: '',
      commentToUserIds: '',
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
				this.getBlogDetail();
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
		getBlogDetail() {
			this.Api.getBlogDetail({ userId: this.userId, blogId: this.blogId }).then(res => {
				if (res.success) {
					this.createrId = res.data.createrId
					this.headImgUrl = res.data.headImg;
					this.nickName = res.data.createName;
					this.imgs = res.data.imgs;
					this.comments = res.data.comments;
					this.content = res.data.content;
					this.isLike = res.data.isLike;
					this.totalLike = res.data.totalLike;
					this.likeUser = res.data.likeUser;
					this.createTime = res.data.createTime;
					this.isVip = res.data.isVip;
					this.proveStatus = res.data.proveStatus;
				} else {
					this.$toast(res.msg);
				}
			});
		},
		onLike() {
			let params = {
				blogId: this.blogId,
				isLike: 1,
				userId: this.$store.state.user.userId
			};
			if (this.isLike === 1) {
				params.isLike = 2;
			}
			this.Api.isLike(params).then(res => {
				if (res.success) {
					this.isLike = params.isLike;
					if (this.isLike === 1) {
						this.totalLike++;
						this.$toast('点赞成功！');
					} else {
						this.totalLike--;
						this.$toast('取消成功！');
					}
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
    	this.Api.replyByCommentId({ commentId: this.commentInfo.commentId }).then(res => {
    		if (res.success) {
    			this.commentInfo.replys = res.data;
    		} else {
    			this.$toast(res.msg);
    		}
    	});
    },
    initCommentData() {
      this.commentValue = '';
      this.commentInputText = '发表评论...';
      this.commentId = '';
      this.commentToUserId = '';
    },
		addComment(type) {
      if(!this.commentValue) {
       return this.$toast('内容不能为空！');
      }
			let params = {
				blogId: this.$route.query.blogId,
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
          this.getBlogDetail()
				} else {
					this.$toast(res.msg);
				}
			});
		},
		goUserDetail(userInfo) {
			this.$router.push({ path: 'circleUserInfo', query: { toUserId: userInfo.createrId, circleId: this.$route.query.circleId } });
		}
	}
};
</script>

<style lang="scss" scoped>
.blogDetail {
	.head {
		background: #fff;
		padding: 10px;
		display: flex;
		.headImg{
			width: 0.8rem;
			height: 0.8rem;
			overflow: hidden;
			border-radius: 50%;
			margin-right: 0.2rem;
			img{
				width: 100%;
				height: 100%;
				display: block;
			}
		}
		.text {
			flex: 1;
			.name {
				font-size: 14px;
				color: #7e5c4d;
				display: flex;
				align-items: center;
				p {
					overflow: hidden;
					height: 0.8rem;
					display: flex;
					align-items: center;
					flex: 1;
          &.active{
            color: #A01E0D;
          }
					.vipImg {
						width: 0.52rem;
						margin-left: 0.1rem;
					}
					.attestImg {
						width: 1.06rem;
						margin-left: 0.1rem;
					}
				}
			}
			.con{
				font-size: 0.3rem;
				color: #333333;
				margin-bottom: 0.2rem;
			}
			.imgList {
				margin-bottom: 0.2rem;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				.imgItem {
					width: 1.76rem;
					height: 1.76rem;
					border-radius: 4px;
					margin-right: 0.1rem;
					margin-bottom: 0.1rem;
					overflow: hidden;
					img {
						width: 100%;
						height: 100%;
						display: block;
					}
          .img{
          	width: 100%;
          	height: 100%;
          	background-size: cover;
          	background-position: center;
          }
				}
			}
			.bot {
				padding-top: 0.1rem;
				display: flex;
				font-size: 15px;
				color: #4c4c4c;
				overflow: hidden;
				align-items: center;
				.bot-time {
					font-size: 12px;
					color: #999;
					flex: 1;
				}
				.fabulous {
					display: flex;
					align-items: center;
					line-height: 0.6rem;
					justify-content: center;
					margin-right: 0.6rem;
					&.active {
						color: #ff7840;
					}
					img {
						width: 0.3rem;
						margin-right: 0.1rem;
						display: block;
					}
				}
			}
		}
	}
	.fabulous {
		.tit {
			font-size: 14px;
			color: #666;
			line-height: 30px;
			padding-left: 10px;
		}
		.userList {
			background: #fff;
			padding: 10px;
			display: flex;
			flex-wrap: wrap;
			.userItem {
				width: 0.64rem;
				height: 0.64rem;
				overflow: hidden;
				border-radius: 50%;
				margin-right: 0.1rem;
				img {
					width: 100%;
					height: 100%;
					display: block;
				}
			}
		}
	}
	.comment {
		background: #fff;
		.tit {
			font-size: 0.34rem;
			color: #333333;
			padding-left: 0.32rem;
			font-weight: bold;
		}
	}
}
</style>
