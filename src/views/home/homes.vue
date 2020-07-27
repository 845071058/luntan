<template>
	<div class="homg">
		<div class="select" @click="$router.push('searchBlog')">
			<div class="select-input">
				<van-icon style="position: absolute;left: 18px;top: 15px;" name="search" size="20" color="#969799" />
				搜索
			</div>
		</div>
		<ul class="cardList">
			<li class="cardList-item" v-for="(item, index) in blogList" :key="index">
				<div class="user" @click="goBlogDetail(item)">
					<div class="headImg" @click.stop="goUserDetail(item)"><img :src="item.headImgUrl" alt="" /></div>
					<div class="name">{{ item.nickName }}</div>
					<!-- <van-icon class="icon" name="arrow" /> -->
				</div>
				<div class="text">
					<div class="con" v-html="item.content"></div>
					<div class="imgList" v-if="item.imgs && item.imgs.length > 0">
						<div class="imgItem" v-for="(imgObj, index) in item.imgs" :key="index"><img :src="imgObj.imgUrl" alt="" /></div>
					</div>
					<div class="bot">
						<div class="comment" @click.stop="onComment(item, index)">
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
		<van-overlay :show="show" @click="show = false" z-index="999">
		  <div class="reply" @click.stop>
			<div class="reply-input"><input type="text" v-model="commentValue" placeholder="发表评论" /></div>
			<van-button plain type="info" @click="addComment">发送</van-button>
		  </div>
		</van-overlay>
	</div>
</template>
<script>
import { userInfo } from '@/Api/test';
export default {
	name: 'homg',
	data() {
		return {
			blogList: [],
      show: false,
      commentValue: '',
      commentBlogId: '',
      commentIndex: 0
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
				this.dadPage();
				clearInterval(time);
			}
		}, 500);
	},
	methods: {
		dadPage() {
			this.Api.dadPage({ userId: this.userId }).then(res => {
				if (res.success) {
					this.blogList = res.data;
				} else {
					this.$toast(res.msg);
				}
			});
		},
    goUserDetail(userInfo) {
      this.$router.push({ path: 'circleUserInfo', query: { toUserId: userInfo.creater, circleId: userInfo.circleId } });
    },
		goBlogDetail(item) {
			this.$router.push({ path: 'blogDetail', query: { blogId: item.blogId } });
		},
    onComment(item, index) {
      (this.show = true), (this.commentValue = '');
      this.commentIndex = index
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
          this.blogList[this.commentIndex].totalComment++
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
    onImg() {
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: [] // 需要预览的图片http链接列表
      });
    }
	}
};
</script>

<style lang="scss" scoped>
.homg {
  padding-bottom: 0.8rem;
	.select {
		margin-bottom: 0.1rem;
		background: #fff;
		padding: 10px;
		.select-input {
			background: #f7f7f7;
			border-radius: 15px;
			height: 30px;
			padding-left: 35px;
			padding-right: 10px;
			line-height: 30px;
			font-size: 12px;
			color: #232326;
		}
	}
}
</style>
