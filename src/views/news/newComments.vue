<template>
	<div class="news">
		<div class="newsList">
			<div class="newsItem" v-for="(item, index) in msgList" :key="index" @click="goBlogDetail(item)">
				<div class="headImg"><span v-if="item.totalNoRead">{{item.totalNoRead}}</span><img :src="item.headImg" alt="" /></div>
				<div class="text">
					<div class="name">
						<p>{{ item.createName }}</p>
						<span>{{ item.createTime }}</span>
					</div>
					<div class="msg">{{ item.commentContent }}</div>
				</div>
			</div>
		</div>
		<div v-if="!msgList || msgList.length < 1" class="msgNone">
			<img src="../../assets/images/img_8.png" alt="" />
			<p>暂无消息内容</p>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			msgList: []
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
				this.getNewComments();
				clearInterval(time);
			}
		}, 500);
	},
	methods: {
		getNewComments() {
			this.Api.getNewComments({ userId: this.userId }).then(res => {
				if (res.success) {
					this.msgList = res.data;
				} else {
					this.$toast(res.msg);
				}
			});
		},
		goBlogDetail(item) {
		  this.$router.push({
		    path: 'blogDetail',
		    query: {
		      circleId: item.circleId,
		      blogId: item.blogId
		    }
		  });
		}
	}
};
</script>

<style lang="scss" scoped>
.news {
	background: #fff;
	height: 100%;
	overflow: auto;
  padding-bottom: 1rem;
	.msgNone {
		img {
			width: 4.7rem;
			display: block;
			margin: 2rem auto 0.2rem;
		}
		p {
			color: #999;
			font-size: 0.28rem;
			text-align: center;
		}
	}
	.newsList {
    .latest{
      width: 80%;
      margin: 0.4rem auto;
      font-size: 0.28rem;
      line-height: 0.32rem;
      padding: 0.2rem 0.36rem;
      border-bottom: 1px solid #eee;
      margin-bottom: 0.2rem;
      background-color: rgba(0,0,0,.7);
      color: #fff;
      border-radius: 0.36rem;
    }
		.newsItem {
			padding: 0.2rem 0.36rem;
			display: flex;
			align-items: center;
			.headImg {
				width: 0.96rem;
				height: 0.96rem;
				margin-right: 0.24rem;
				position: relative;
				img {
					width: 100%;
					height: 100%;
					display: block;
					border-radius: 50%;
				}
				span{
					display: block;
					position: absolute;
					background: #FF4F25;
					border-radius: 50%;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
					width: 0.32rem;
					height: 0.32rem;
					line-height: 0.32rem;
					text-align: center;
					font-size: 0.24rem;
					color: #FFFFFF;
					top: 0;
					right: 0;
				}
			}
			.text {
				flex: 1;
				border-bottom: 1px solid #eee;
				.name {
					display: flex;
					align-items: center;
          margin-bottom: 0.1rem;
					p {
						font-size: 0.34rem;
						color: #333;
						font-weight: bold;
						flex: 1;
					}
					span {
						color: #ced1d4;
						font-size: 12px;
					}
				}
				.msg {
					width: 5.32rem;
					color: #999;
					font-size: 0.28rem;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					margin-bottom: 0.24rem;
				}
			}
		}
	}
}
</style>
