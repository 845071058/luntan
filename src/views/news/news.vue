<template>
	<div class="news">
		<div class="newsList">
			<div class="latest" v-if="totalComment > 0" @click="$router.push('newComments')">收到新评论<span></span></div>
			<div class="newsItem" v-for="(item, index) in msgList" :key="index" @click="message(item)">
				<div class="headImg"><span v-if="item.totalNoRead">{{item.totalNoRead}}</span><img :src="item.headImg" alt="" /></div>
				<div class="text">
					<div class="name">
						<p>{{ item.byUserName }}</p>
						<span>{{ item.createDate }}</span>
					</div>
					<div class="msg">{{ item.content }}</div>
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
	name: 'news',
	data() {
		return {
			msgList: [],
      totalComment: 0
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
				this.forMyMsg();
				clearInterval(time);
			}
		}, 500);
	},
	methods: {
		forMyMsg() {
			this.Api.forMyMsg({ userId: this.userId }).then(res => {
				if (res.success) {
					this.msgList = res.data.msgList;
          this.totalComment = res.data.totalComment
				} else {
					this.$toast(res.msg);
				}
			});
		},
		message(item) {
			this.$router.push({ path: 'weMsg', query: { userId: item.byUserId, byUserName: item.byUserName } });
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
      width: 2.2rem;
      margin: 0.32rem auto;
      font-size: 0.3rem;
      line-height: 0.76rem;
      background-color: #F5F6F7;
      color: #4C4C4C;
      border-radius: 0.38rem;
      text-align: center;
      position: relative;
      cursor: pointer;
      span{
        display: block;
        width: 0.16rem;
        height: 0.16rem;
        border-radius: 50%;
        background: #FF3015;
        position: absolute;
        top: 0.14rem;
        right: 0.14rem;
      }
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
