<template>
	<div class="circle">
		<div class="select">
			<div class="select-input" @click="$router.push('/searchCircle')">
				<van-icon style="position: absolute;left: 32%;top: 18px;" name="search" size="20" color="#b3b3b3" />
				搜索圈子
			</div>
		</div>
		<div v-if="myCircles.length > 0" class="my-create-circle">
			<div class="myCircle-title">
				<h5>我创建的圈子</h5>
				<van-button type="default" class="create-btn has-circles" @click="$router.push('/addCircle')">创建</van-button>
			</div>
			<div class="myCircle-detail" v-for="(item, index) in myCircles" :key="index" @click="goCircle(item)">
				<div class="circle-info">
					<img :src="item.circleImg" alt />
					<div class="myCircle-detail-info">
						<h5>{{ item.finalName }}</h5>
						<p>
							<span>成员:{{ item.totalUser }}人</span>
							<span style="margin-left:0.2rem">发帖:{{ item.totalBlog }}</span>
						</p>
					</div>
				</div>
				<van-icon name="arrow" size="14" color="#969799" />
			</div>
		</div>
		<div class="my-create-circle" v-if="myCircleList.length > 0">
			<div class="myCircle-title"><h5>加入的圈子</h5></div>
			<div class="myCircle-detail" v-for="(item, index) in myCircleList" :key="index" @click="goCircle(item)">
				<div class="circle-info">
					<img :src="item.circleImg" alt />
					<div class="myCircle-detail-info">
						<h5>{{ item.finalName }}</h5>
						<p>
							<span>成员:{{ item.totalUser }}人</span>
							<span style="margin-left:0.2rem">发帖:{{ item.totalBlog }}</span>
						</p>
					</div>
				</div>
				<van-icon name="arrow" size="14" color="#969799" />
			</div>
		</div>
		<div class="my-create-circle" v-if="recommendCircle.length > 0">
			<div class="myCircle-title">
        <h5>推荐圈子</h5>
        <van-button style="width: 2.1rem;height: 0.6rem;line-height: 0.6rem;font-size: 0.28rem;border: none;" round icon="replay" type="info" @click="getCircleRecomCircle">换一换</van-button>
      </div>
			<div class="myCircle-detail" v-for="(item, index) in recommendCircle" :key="index" @click="onCircle(item)">
				<div class="circle-info">
					<img :src="item.circleImg" alt />
					<div class="myCircle-detail-info">
						<h5>{{ item.finalName }}</h5>
						<p>
							<span>成员:{{ item.totalUser }}人</span>
							<span style="margin-left:0.2rem">发帖:{{ item.totalBlog }}</span>
						</p>
					</div>
				</div>
				<van-icon name="arrow" size="14" color="#969799" />
			</div>
		</div>
    <div class="no-circle" v-if="!myCircles.length">
    	<h5>您还没有自己的圈子</h5>
    	<p>去创建一个吧~</p>
    	<van-button type="default" class="create-btn" @click="$router.push('/addCircle')">创建</van-button>
    </div>
	</div>
</template>

<script>
export default {
	name: 'myCircle',
	data() {
		return {
			myCircles: [],
			myCircleList: [],
			recommendCircle: []
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
				this.getMyCircleList();
				this.getMyCircles();
				this.getCircleRecomCircle();
				clearInterval(time);
			}
		}, 500);
	},
	methods: {
		getCircleRecomCircle() {
			this.Api.getCircleRecomCircle({ userId: this.userId }).then(res => {
				if (res.success) {
					this.recommendCircle = res.data;
				} else {
					this.$toast(res.msg);
				}
			});
		},
		getMyCircleList() {
			this.Api.getMyCare({ userId: this.userId, type: 1 }).then(res => {
				if (res.success) {
					this.myCircleList = res.data;
				} else {
					this.$toast(res.msg);
				}
			});
		},
		getMyCircles() {
			this.Api.getMyCircles({ userId: this.userId }).then(res => {
				if (res.success) {
					this.myCircles = res.data;
				} else {
					this.$toast(res.msg);
				}
			});
		},
		onCircle(item) {
			if (this.$store.state.user.subscribe != 1) {
				this.$router.push('/follow');
			} else {
				if (item.status == 1) {
					this.$router.push({ path: 'circleDetail', query: { circleId: item.circleId, circleName: item.finalName } });
				} else {
					this.$dialog
						.confirm({
							title: '加入圈子',
							message: '您确定加入该圈子吗'
						})
						.then(() => {
							this.Api.userAddCircle({ circleId: item.circleId, userId: this.userId }).then(res => {
								if (res.success) {
									this.$router.push({ path: 'circleDetail', query: { circleId: item.circleId, circleName: item.finalName } });
									this.$toast('加入成功！');
								} else {
									this.$toast(res.msg);
								}
							});
						})
						.catch(() => {});
				}
			}
		},
		goCircle(item) {
			this.$router.push({ path: 'circleDetail', query: { circleId: item.circleId, circleName: item.finalName } });
		}
	}
};
</script>

<style lang="scss" scoped>
.circle {
	padding-bottom: 1.6rem;
	.create-btn {
		display: block;
		text-align: center;
		height: 0.6rem;
		line-height: 0.6rem;
		font-size: 14px;
		border-radius: 0.32rem;
		background: #ffc557;
		box-shadow: 0 10px 11px -8px #ffc557;
		color: #333;
		border: none;
	}
	.select {
		margin-bottom: 0.1rem;
		padding: 10px 16px;
		.select-input {
			background: #fff;
			border-radius: 4px;
			height: 36px;
			// padding-left: 35px;
			// padding-right: 10px;\
			text-align: center;
			padding: 0 10px;
			line-height: 36px;
			font-size: 15px;
			color: #bbb;
		}
	}
	.no-circle {
		margin-bottom: 0.2rem;
		font-size: 0.36rem;
		width: 100%;
		height: 2.54rem;
		background: url(../../assets/images/circle-bg.png);
		background-size: 100% 100%;
		text-align: center;
		h5 {
			padding-top: 0.4rem;
		}
		p {
			margin-top: 0.1rem;
			font-size: 0.28rem;
			color: #999;
		}
		.create-btn {
			margin: 0.2rem auto;
		}
	}
	.my-create-circle {
		background: #fff;
		padding: 30px 16px;
		margin-bottom: 0.2rem;
		.myCircle-title {
			display: flex;
			justify-content: space-between;
			h5 {
				font-size: 18px;
			}
		}
		.myCircle-detail {
			margin-top: 0.44rem;
			padding-left: 0.2rem;
			overflow: hidden;
			.circle-info {
				display: flex;
				float: left;
			}
			img {
				margin-right: 0.2rem;
				width: 1.12rem;
				height: 1.12rem;
				border-radius: 50%;
			}
			i {
				margin-top: 0.4rem;
				float: right;
			}
			.myCircle-detail-info {
				h5 {
					font-size: 17px;
				}
				p {
					margin-top: 0.08rem;
					color: #999;
					font-size: 12px;
				}
			}
		}
	}
	.circleBtn {
		padding: 10px;
		background: #fff;
		line-height: 15px;
		border-bottom: 1px solid #eee;
		font-size: 14px;
		display: flex;
		align-items: center;
		&:last-child {
			border-bottom: none;
		}
		p {
			color: #333;
			flex: 1;
		}
	}
	.circleList {
		.tit {
			font-size: 14px;
			padding-left: 10px;
			line-height: 0.64rem;
		}
		.circleItem {
			background: #fff;
			padding: 10px;
			align-items: center;
			border-bottom: 1px solid #ddd;
			p {
				line-height: 1.3;
				font-size: 16px;
				color: #333;
				flex: 1;
				font-weight: bold;
			}
			&:last-child {
				border-bottom: none;
			}
			.circleDesc {
				color: #888;
				font-size: 12px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}
}
</style>
