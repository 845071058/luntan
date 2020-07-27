<template>
	<div class="friends">
    <div class="search">
    	<div class="search-input">
    		<van-icon style="margin: 0 0.2rem;" name="search" size="20" color="#969799" />
    		<input type="text" placeholder="请输入用户名称" v-model="userMame" />
    	</div>
    	<van-button plain type="info" @click="myFriend">搜索</van-button>
    </div>
    <div v-if="!memberList || memberList.length < 1" class="searchNone">
    	<img src="../../assets/images/img_9.png" alt="" />
    	<p>没有搜索到相关的内容</p>
    </div>
    <div class="memberList">
    	<div class="memberItem" v-for="(item, index) in memberList" :key="index" @click="message(item)">
    		<div class="user">
    			<div class="headImg"><img :src="item.imgUrl" alt="" /></div>
    			<div class="text">
    			  <div class="name">
    			  	<p :class="{active:item.isVip === 1}">{{ item.myName }}</p>
    			    <img class="isVip" v-if="item.isVip === 1" src="../../assets/images/vip1.png" alt="" />
    			    <img class="attestImg" v-if="item.proveStatus === 1" src="../../assets/images/grsm.png" alt="" />
    			    <img class="attestImg" v-if="item.proveStatus === 2" src="../../assets/images/qysm.png" alt="" />
    			  </div>
    			</div>
    		</div>
    	</div>
    </div>
  </div>
</template>

<script>
export default {
	name: 'friends',
	data() {
		return {
      userMame: '',
      memberList: []
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
				this.myFriend();
				clearInterval(time);
			}
		}, 500);
	},
	methods: {
		myFriend() {
			this.Api.myFriend({ userId: this.userId, name: this.userMame }).then(res => {
				if (res.success) {
					this.memberList = res.data;
				} else {
					this.$toast(res.msg);
				}
			});
		},
		message(item) {
			this.$router.push({ path: 'weMsg', query: { userId: item.userId, byUserName: item.myName } });
		}
	}
};
</script>

<style lang="scss" scoped>
.friends {
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
  		height: 36px;
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
</style>
