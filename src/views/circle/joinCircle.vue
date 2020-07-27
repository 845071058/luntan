<template>
	<div class="joinCircle">
		<div class="search">
			<div class="search-input">
				<van-icon style="position: absolute;left: 18px;top: 15px;" name="search" size="20" color="#969799" />
				<input type="text" placeholder="请输入圈子名称" v-model="searchVal" />
			</div>
			<van-button plain type="info" @click="getCircleList">搜索</van-button>
		</div>
		<ul class="circleList">
			<div class="circleItem" v-for="(item, index) in circleList" :key="index" @click="onCircle(item)">
				<p>{{ item.finalName }}</p>
				<van-icon name="arrow" size="14" color="#969799" />
			</div>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'joinCircle',
	data() {
		return {
			searchVal: '',
			circleList: []
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
				this.getCircleList();
				clearInterval(time);
			}
		}, 500);
	},
	methods: {
		getCircleList() {
			this.Api.getMyCare({ userId: this.userId, type: 2, circleName: this.searchVal }).then(res => {
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
				this.$dialog
					.confirm({
						title: '加入圈子',
						message: '您确定加入该圈子吗'
					})
					.then(() => {
						this.Api.userAddCircle({ circleId: item.id, userId: this.userId }).then(res => {
							if (res.success) {
								this.$router.push({ path: 'circleDetail', query: { circleId: item.id } });
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
};
</script>

<style lang="scss" scoped>
.joinCircle {
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
	.circleList {
		padding: 0 10px;
		background: #fff;
		.circleItem {
			padding: 10px;
			line-height: 15px;
			font-size: 14px;
			display: flex;
			align-items: center;
			border-bottom: 1px solid #ddd;
			p {
				color: #333;
				flex: 1;
			}
			&:last-child {
				border-bottom: none;
			}
		}
	}
}
</style>
