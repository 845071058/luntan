<template>
	<div class="mine">
		<div class="head">
			<div class="headImg"><img :src="userInfo.headimgurl" alt="" /></div>
			<div class="text">
				<p class="name">
					{{ userInfo.myName ? userInfo.myName : userInfo.nickname }}
					<img src="../../assets/images/xg.png" @click="vanDialog = true" style="margin-left: 10px;width:13px;height:15px;" />
				</p>
			</div>
		</div>
		<div class="my-member">
			<div class="vip-member" @click="onVip">
				<div>
					<h5>VIP会员</h5>
					<p v-if="vipInfo.isVip === 2" class="active">未开通</p>
					<p v-else :class="{active:vipInfo.proveStatus>3}">{{vipInfo.proveStatus === 1 ? '已认证' : vipInfo.proveStatus === 2 ? '认证中' : vipInfo.proveStatus === 3 ? '认证未通过' : '未认证'}}</p>
				</div>
				<img src="../../assets/images/hy.png" alt="" />
			</div>
			<div class="vip-member" @click="jfsm">
				<div>
					<h5>VIP积分</h5>
					<p>共{{vipInfo.integral}}分</p>
				</div>
				<img src="../../assets/images/jf.png" alt="" />
			</div>
		</div>
		<div class="open-member" v-if="vipInfo.isVip === 1">
			<div class="member-detail">
				<h4>
					<img src="../../assets/images/vip2.png" alt="" />
					已开通
				</h4>
				<span>有效期至：{{vipInfo.expireDate}}</span>
			</div>
			<van-button type="default" class="renewal" @click="vipDialog = true">立即续费</van-button>
		</div>
		<div class="mineList">
			<div class="mineItem" @click="goMyblog">
				<img src="../../assets/images/wdtz.png" alt="" />
				<p>我的帖子</p>
				<van-icon name="arrow" size="14" color="#969799" />
			</div>
			<div class="mineItem" @click="goFriends">
				<img src="../../assets/images/wdhy.png" alt="" />
				<p>我的好友</p>
				<van-icon name="arrow" size="14" color="#969799" />
			</div>
			<div class="mineItem" @click="addFeedbackDialog = true">
				<img src="../../assets/images/khfk.png" alt="" />
				<p>客户反馈</p>
				<van-icon name="arrow" size="14" color="#969799" />
			</div>
		</div>
		<div class="mineList">
			<div class="mineItem" @click="notOpen">
				<img src="../../assets/images/wdqb.png" alt="" />
				<p>我的钱包</p>
				<van-icon name="arrow" size="14" color="#969799" />
			</div>
		</div>
		<van-dialog v-model="vipDialog" title="续费会员" show-cancel-button @confirm="renew">
		  <van-radio-group v-model="choiceMonth">
			  <van-cell-group>
			      <van-cell title="一个月" clickable @click="choiceMonth = '1'">
			        <template #right-icon>
			          <van-radio name="1" checked-color="#4C4C4C" />
			        </template>
			      </van-cell>
			      <van-cell title="二个月" clickable @click="choiceMonth = '2'">
			        <template #right-icon>
			          <van-radio name="2" checked-color="#4C4C4C" />
			        </template>
			      </van-cell>
				  <van-cell title="三个月" clickable @click="choiceMonth = '3'">
				    <template #right-icon>
				      <van-radio name="3" checked-color="#4C4C4C" />
				    </template>
				  </van-cell>
			    </van-cell-group>
		  </van-radio-group>
		</van-dialog>
		<van-dialog v-model="vanDialog" title="编辑资料" show-cancel-button @confirm="upName">
			<van-field v-model="userInfoParams.myName" placeholder="用户名" />
			<van-field v-model="userInfoParams.mobile" placeholder="电话号码" />
		</van-dialog>
		<van-dialog v-model="addFeedbackDialog" title="客户反馈" show-cancel-button @confirm="addFeedback">
			<van-field v-model="addFeedbackParams.content" colon type="textarea" placeholder="请留下你的珍贵意见，小讯与您一起成长" rows="3" />
			<div class="imgList">
				<div class="imgItem" v-show="imgSrc"><img :src="imgSrc" alt="" /></div>
				<van-uploader style="margin-top: 0.1rem;" :after-read="afterRead" />
			</div>
		</van-dialog>
	</div>
</template>

<script>
import { addFeedback, uploadImg } from '@/Api/test';
import storage from '@/store/store';

function initUserInfoParams() {
	return {
		mobile: '',
		myName: '',
		userId: ''
	};
}

function initAddFeedbackParams() {
	return {
		byUserId: '',
		content: '',
		imgIds: []
	};
}

export default {
	name: 'mine',
	data() {
		return {
			vanDialog: false,
			addFeedbackDialog: false,
			upUserName: '',
			imgSrc: '',
			addFeedbackParams: initAddFeedbackParams(),
			userInfoParams: initUserInfoParams(),
			vipDialog: false,
			choiceMonth: 1,
			vipInfo: {
			  expireDate: '',
			  integral: 0,
			  isVip: '',
			  proveStatus: ''
			}
		};
	},
	computed: {
		userInfo() {
			return this.$store.state.user;
		}
	},
	created() {
		let time = setInterval(() => {
			if (this.userInfo.userId) {
				this.vipDetail()
				clearInterval(time);
			}
		}, 500);
	},
	methods: {
		vipDetail(){
		  this.Api.vipDetail({userId: this.userInfo.userId}).then(res => {
		    if(res.success){
		      this.vipInfo = res.data
		    }
		  })
		},
		upName() {
			this.userInfoParams.userId = this.userInfo.userId;
			this.Api.updateMyInfo(this.userInfoParams).then(res => {
				if (res.success) {
					this.userInfoParams = initUserInfoParams();
					const params = {
						accessToken: storage.get('accessToken'),
						openid: storage.get('openId')
					};
					this.Api.getUserInfo(params).then(res => {
						this.$store.commit('SET_USER', res.data);
					});
				} else {
					this.$toast(res.msg);
				}
			});
		},
		addFeedback() {
			this.addFeedbackParams.byUserId = this.userInfo.userId;
			addFeedback(this.addFeedbackParams).then(res => {
				if (res.success) {
					this.addFeedbackDialog = false;
					this.addFeedbackParams = initAddFeedbackParams();
					this.imgSrc = '';
					this.$toast('提交成功！');
				} else {
					this.$toast(res.msg);
				}
			});
		},
		afterRead(file) {
			let formdata = new FormData();
			formdata.append('file', file.file);
			uploadImg(formdata).then(res => {
				if (res.success) {
					this.imgSrc = file.content;
					this.addFeedbackParams.imgIds[0] = res.data;
				} else {
					this.$toast('上传失败！');
				}
			});
		},
		notOpen() {
			this.$toast('功能暂未开放，敬请期待！');
		},
		goFriends() {
			this.$router.push('friends');
		},
		goMyblog() {
			this.$router.push('myblog');
		},
    jfsm(){
      this.$dialog.alert({
        title: '积分说明',
        messageAlign: 'left',
        message: '1：通过分享圈子二维码可以获得积分</br>2：每拉新一人获得1积分，每消耗10积分可以续费30天vip</br>3：vip特权：拥有红色昵称和会员标志，成员排名靠前，并且可以完成个人认证或企业认证，另有其他优享服务！',
      }).then(() => {
        // on close
      });
    },
		onVip(){
			if(this.vipInfo.isVip === 1) {
				this.$router.push('attest')
			} else {
				this.$dialog
					.confirm({
						title: '确定加入会员',
						message: ''
					})
					.then(() => {
						this.Api.vipAddVipTime({userId: this.userInfo.userId, choice: 1}).then(res => {
						  if (res.success) {
						    this.$toast('成功！');
						  	this.vanDialog = false;
				        this.vipDetail()
						  } else {
						  	this.$toast(res.msg);
						  }
						})
					})
					.catch(() => {});
			}
		},
		renew(){
		  this.Api.vipAddVipTime({userId: this.userInfo.userId, choice: this.choiceMonth}).then(res => {
		    if (res.success) {
		      this.$toast('成功！');
		      this.vipDetail()
		    	this.vanDialog = false;
		    } else {
		    	this.$toast(res.msg);
		    }
		  })
		}
	}
};
</script>

<style lang="scss" scoped>
.mine {
	padding-bottom: 1rem;
	.active .van-grid-item__text{
	  color: #1989fa;
	}
	.van-radio-group{
		overflow: hidden;
		.van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after{
			border-width: 0;
		}
		.van-cell-group{
			margin-top: 0.2rem;
			.van-cell{
				background: #F5F6F7;
				width: 4.4rem;
				margin: 0 auto 0.2rem;
				border-radius: 0.44rem;
				display: flex;
				.van-cell__title{
					flex: 1;
				}
				.van-cell__value{
					flex: initial;
				}
			}
		}
	}
	.head {
		display: flex;
		padding: 0.32rem;
		.headImg {
			width: 1.28rem;
			height: 1.28rem;
			border-radius: 50%;
			overflow: hidden;
			margin-right: 20px;
			img {
				width: 100%;
				height: 100%;
				display: block;
			}
		}
		.text {
			flex: 1;
			display: flex;
			flex-direction: column;
			width: 0;
			justify-content: center;
			.name {
				font-size: 20px;
				display: flex;
				align-items: center;
				color: #333;
			}
		}
	}
	.my-member {
		display: flex;
		justify-content: space-between;
		padding: 0 0.32rem;
		margin-bottom: 0.32rem;
		.vip-member {
			background: #fff;
			border-radius: 4px;
			padding: 0.36rem;
			width: 3.28rem;
			div {
				float: left;
				h5 {
					font-size: 16px;
					color: #333;
				}
				p {
					font-size: 12px;
					color: #999;
					&.active{
						color: #FF3015;
					}
				}
			}
			img {
				float: right;
				width: 0.8rem;
			}
		}
	}
	.open-member {
		overflow: hidden;
		background: #343748;
		border-radius: 8px 8px 0 0;
		padding: 16px;
		margin: 0.32rem 0.32rem 0;
		.member-detail {
			float: left;
			color: #efcc8c;
			font-size: 0.28rem;
			h4 {
				font-size: 17px;
				img {
					width: 0.92rem;
				}
			}
			span {
				font-size: 12px;
			}
		}
		.renewal {
			padding: 0;
			border: none;
			margin-top: 4px;
			float: right;
			width: 1.6rem;
			text-align: center;
			height: 0.64rem;
			line-height: 0.64rem;
			font-size: 14px;
			border-radius: 0.32rem;
			background: #efcc8c;
		}
	}
	.mineList {
		background: #fff;
		.mineItem {
			padding: 0.44rem;
			background: #fff;
			line-height: 1.3;
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
			img {
				width: 0.52rem;
				margin-right: 21px;
			}
		}
	}
	.imgList {
		padding: 10px;
		display: flex;
		align-items: center;
		.imgItem {
			width: 1.6rem;
			height: 1.6rem;
			margin-right: 10px;
			img {
				width: 100%;
				height: 100%;
				display: block;
			}
		}
	}
}
</style>
