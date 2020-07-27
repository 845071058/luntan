<template>
	<div class="myCircle">
		<div class="search">
			<div class="search-input">
				<van-icon style="position: absolute;left: 18px;top: 15px;" name="search" size="20" color="#969799" />
				<input type="text" placeholder="请输入圈子名称" v-model="searchVal" />
			</div>
			<van-button plain type="info" @click="getMyCircleList">搜索</van-button>
		</div>
		<ul class="circleList">
			<div class="circleItem" v-for="(item, index) in myCircleList" :key="index" @click="goCircle(item)">
				<p>{{ item.finalName }}</p>
				<van-icon name="arrow" size="14" color="#969799" />
			</div>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'myCircle',
	data() {
		return {
			searchVal: '',
			myCircleList: []
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
				clearInterval(time);
			}
		}, 500);
	},
	methods: {
		getMyCircleList() {
			this.Api.getMyCare({ userId: this.userId, type: 1, circleName: this.searchVal }).then(res => {
				if (res.success) {
					this.myCircleList = res.data;
				} else {
					this.$toast(res.msg);
				}
			});
		},
		goCircle(item) {
			this.$router.push({ path: 'circleDetail', query: { circleId: item.id } });
		}
	}
};
</script>

<style lang="scss" scoped>
.myCircle {
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
