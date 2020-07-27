<template>
	<div class="member">
		<div class="search">
			<div class="search-input">
				<van-icon style="margin: 0 0.2rem;" name="search" size="20" color="#969799" />
				<input type="text" placeholder="请输入您想找的职业,产品或兴趣" v-model="userMame" />
			</div>
			<van-button plain type="info" @click="serchCircleUsers">搜索</van-button>
		</div>
    <div v-if="!memberList || memberList.length < 1" class="searchNone">
    	<img src="../../assets/images/img_9.png" alt="" />
    	<p>没有搜索到相关的内容</p>
    </div>
		<div class="memberList">
			<div class="memberItem" v-for="(item, index) in memberList" :key="index" @click="goUserDetail(item)">
				<div class="isMaster" v-if="isMaster === 1 && userId === item.userId"><img src="../../assets/images/img_7.png" alt=""></div>
				<div class="user">
					<div class="headImg"><img :src="item.imgUrl" alt="" /></div>
					<div class="text">
            <div class="name">
            	<p :class="{active:item.isVip === 1}">{{ item.myName }}</p>
              <img class="isVip" v-if="item.isVip === 1" src="../../assets/images/vip1.png" alt="" />
              <!-- <img class="attestImg" v-if="item.proveStatus === 1" src="../../assets/images/grsm.png" alt="" />
              <img class="attestImg" v-if="item.proveStatus === 2" src="../../assets/images/qysm.png" alt="" /> -->
              <span class="mobile">{{item.mobile}}</span>
            </div>
            <div class="label">{{item.label}}</div>
          </div>
					<div class="btn" v-if="isMaster === 1">
						<img src="../../assets/images/dx.png" @click.stop="message(item)" alt="" />
						<img v-if="item.isBan == '1'" @click.stop="userBan(item, 2)" src="../../assets/images/jy.png" alt="" />
						<img v-if="item.isBan == '2'" @click.stop="userBan(item, 1)" src="../../assets/images/jy_1.png" alt="" />
					</div>
				</div>
			</div>
			<!-- 以下第一行修改 -->
			<div class="cardBtn" v-if="pageTotal > memberList.length" @click="nextPage">查看更多成员</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'member',
	data() {
		return {
			circleId: this.$route.query.circleId,
			userMame: '',
			memberList: [],
			isMaster: 2,
			pageSize: 50,
			pageTotal: 0,
			pageNum: 1
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
				this.getCircleUsers();
				clearInterval(time);
			}
		}, 500);
	},
	methods: {
		getCircleUsers() {
			this.Api.getCircleUsers({ circleId: this.circleId, userId: this.userId, name: this.userMame,page:this.pageNum,size:this.pageSize }).then(res => {
				if (res.success) {
					this.isMaster = res.data.isMaster;
					//这是原来的只有这两行 this.memberList = res.data.list;
					this.memberList = [...this.memberList, ...res.data.list];
					this.pageTotal = res.data.total;
					
				} else {
					this.$toast(res.msg);
				}
			});
		},
		serchCircleUsers() {
			this.pageNum = 1;
			this.memberList= [];
			this.Api.getCircleUsers({ circleId: this.circleId, userId: this.userId, name: this.userMame,page:this.pageNum,size:this.pageSize }).then(res => {
				if (res.success) {
					this.isMaster = res.data.isMaster;
					//这是原来的只有这两行 this.memberList = res.data.list;
					this.memberList = res.data.list;
					this.pageTotal = res.data.total;
					
				} else {
					this.$toast(res.msg);
				}
			});
		},
		initPage() {
        this.memberList = []
        this.pageNum = 1
        this.pageSize = 50
        this.getCircleUsers()
      },
		nextPage() {
        this.pageNum = this.pageNum + 1;
        this.getCircleUsers();
      },
		userBan(item, type) {
			let params = {
				circleId: this.circleId,
				masterId: this.userId,
				userId: item.userId,
				isBan: type
			};
			this.Api.isBan(params).then(res => {
				if (res.success) {
					item.isBan = type;
					if (item.isBan == 1) {
						this.$toast('解除禁言');
					} else {
						this.$toast('禁言成功');
					}
				} else {
					this.$toast(res.msg);
				}
			});
		},
		goUserDetail(userInfo) {
			this.$router.push({ path: 'circleUserInfo', query: { toUserId: userInfo.userId, circleId: this.circleId } });
		},
		message(item) {
			this.$router.push({ path: 'weMsg', query: { userId: item.userId, byUserName: item.myName } });
		}
	}
};
</script>

<style lang="scss" scoped>
.member {
  .searchNone{
    img{
      width: 3.38rem;
      display: block;
      margin: 1.16rem auto 0.2rem;
    }
    p{
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
			height: 0.72rem;
			color: #333;
			font-size: 0.32rem;
			font-weight: normal;
			line-height: 36px;
			margin-left: 10px;
	    background: none!important;
	    .van-button__text{
	      font-weight: normal!important;
	      font-size: 0.32rem;
	    }
		}
	}
}
.cardBtn {
		width: 2.2rem;
		height: 0.64rem;
		line-height: 0.64rem;
		text-align: center;
		border: 1px solid #eeeeee;
		border-radius: 0.32rem;
		font-size: 0.28rem;
		color: #bbbbbb;
		margin: 0.2rem auto 0;
	}
</style>
