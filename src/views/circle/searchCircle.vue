<template>
	<div class="searchCircle">
		<div class="search">
			<div class="search-input">
				<van-icon name="search" style="margin: 0 0.2rem;" size="20" color="#969799" />
				<input type="text" placeholder="请输入圈子名称" v-model="circleName" />
			</div>
			<van-button plain type="info" @click="getCircleList">搜索</van-button>
		</div>
		<div v-if="!circleList || circleList.length < 1" class="searchNone">
			<img src="../../assets/images/img_9.png" alt="" />
			<p>没有搜索到相关的内容</p>
		</div>
		<ul class="circleList">
			<div class="circleItem" v-for="(item, index) in circleList" :key="index" @click="onCircle(item)">
				<div class="circleImg"><img :src="item.circleImg" alt="" /></div>
				<div class="text">
					<p>{{ item.finalName }}</p>
					<div class="num">
						<span style="margin-right: 0.32rem;">成员:{{ item.totalUser }}人</span>
						<span>发帖:{{ item.totalBlog }}</span>
					</div>
				</div>
				<van-icon name="arrow" size="14" color="#969799" />
			</div>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'searchCircle',
	data() {
		return {
			circleList: [],
			circleName: ''
		};
	},
	computed: {
		userId() {
			return this.$store.state.user.userId;
		}
	},
	methods: {
		getCircleList() {
			this.Api.getCircleByName({ circleName: this.circleName, userId: this.userId }).then(res => {
				if (res.success) {
					this.circleList = res.data;
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
					this.$router.push({ path: 'circleDetail', query: { circleId: item.circleId } });
				} else {
					this.$dialog
						.confirm({
							title: '加入圈子',
							message: '您确定加入该圈子吗'
						})
						.then(() => {
							this.Api.userAddCircle({ circleId: item.circleId, userId: this.userId }).then(res => {
								if (res.success) {
									this.$router.push({ path: 'circleDetail', query: { circleId: item.circleId } });
									this.$toast('加入成功！');
								} else {
									this.$toast(res.msg);
								}
							});
						})
						.catch(() => {});
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.searchCircle {
	.searchNone {
		img {
			width: 3.38rem;
			display: block;
			margin: 1.16rem auto 0.2rem;
		}
		p {
			color: #999;
			font-size: 0.28rem;
			text-align: center;
		}
	}
	.search {
		margin-bottom: 0.1rem;
		// background: #fff;
		padding: 10px;
		display: flex;
		align-items: center;
		.search-input {
			flex: 1;
			display: flex;
			align-items: center;
			background: #f7f7f7;
			border-radius: 4px;
			height: 36px;
			padding-right: 10px;
			line-height: 36px;
			font-size: 16px;
			color: #232326;
			input {
				background: none;
				width: 100%;
				flex: 1;
			}
		}
		.van-button {
			width: 0.8rem;
			padding: 0;
			border: none;
			height: 36px;
			color: #333;
			font-size: 0.32rem;
			font-weight: normal;
			line-height: 36px;
			margin-left: 10px;
			background: none;
			.van-button__text {
				font-weight: normal !important;
				font-size: 0.32rem;
			}
		}
	}
	.circleList {
		// padding: 0 10px;
		background: #fff;
		.circleItem {
			padding: 0.24rem 0.5rem;
			display: flex;
			align-items: center;
			border-bottom: 1px solid #ddd;
			&:last-child {
				border-bottom: none;
			}
			.circleImg {
				width: 1.12rem;
				height: 1.12rem;
				overflow: hidden;
				border-radius: 50%;
				margin-right: 0.2rem;
				img {
					width: 100%;
					height: 100%;
					display: block;
				}
			}
			.text {
				flex: 1;
				line-height: 1;
				p {
					font-size: 0.34rem;
					color: #333333;
					margin-bottom: 0.2rem;
					font-weight: bold;
				}
				.num {
					display: flex;
					align-items: center;
					span {
						font-size: 0.24rem;
						color: #999999;
						display: block;
					}
				}
			}
		}
	}
}
</style>
