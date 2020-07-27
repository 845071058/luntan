<template>
  <div class="vip">
    <div class="head">
      <div class="headImg"><img :src="userInfo.headimgurl" alt=""></div>
      <div class="text">
        <div class="name">{{ userInfo.myName ? userInfo.myName : userInfo.nickname }}</div>
      </div>
    </div>
    <div class="con">
      <div class="conBox">
        <p>是否会员</p>
        <span>{{info.isVip === 1 ? '是' : '否'}}</span>
      </div>
      <div class="conBox">
        <p>vip积分值</p>
        <span>{{info.integral}}</span>
      </div>
      <div class="conBox">
        <p>到期时间</p>
        <span>{{info.expireDate}}</span>
      </div>
      <div class="conBox">
        <p>认证状态</p>
        <span>{{info.proveStatus === 1 ? '通过认证' : info.proveStatus === 2 ? '认证中' : info.proveStatus === 3 ? '认证未通过' : '未认证'}}</span>
      </div>
    </div>
    <div class="btnBox">
      <van-button class="btn" type="info" @click="onVip">{{info.isVip === 1 ? '续费会员' : '成为会员'}}</van-button>
      <van-button v-if="info.proveStatus === 4 && info.isVip === 1" class="btn" type="info" @click="$router.push('attest')">去认证</van-button>
    </div>
    <van-dialog v-model="vanDialog" title="续费会员" show-cancel-button @confirm="upName">
      <van-grid :column-num="3">
        <van-grid-item :class="choiceMonth === 1 ? 'active' : ''" @click="onChoice(1)" text="一个月" />
        <van-grid-item :class="choiceMonth === 2 ? 'active' : ''" @click="onChoice(2)" text="二个月" />
        <van-grid-item :class="choiceMonth === 3 ? 'active' : ''" @click="onChoice(3)" text="三个月" />
      </van-grid>
    </van-dialog>
  </div>
</template>

<script>

export default {
  name: 'vip',
  data() {
    return {
      vanDialog: false,
      info: {
        expireDate: '',
        integral: 0,
        isVip: '',
        proveStatus: ''
      },
      choiceMonth: 1
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
          this.info = res.data
        }
      })
    },
    onChoice(type) {
      this.choiceMonth = type
    },
    onVip(){
      if(this.info.isVip === 1){
        this.vanDialog = true
      }else{
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
    upName(){
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
.vip {
  .head{
    display: flex;
    padding: 10px;
    box-sizing: border-box;
    background: #fff;
    .headImg{
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;
      img{
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .text{
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .name{
        color: #333;
        font-size: 14px;
      }
    }
  }
  .con{
    display: flex;
    flex-wrap: wrap;
    background: #fff;
    margin-top: 10px;
    .conBox{
      padding: 10px;
      width: 50%;
      font-size: 14px;
      line-height: 1.3;
      text-align: center;
      p{
        display: block;
      }
      span{
        margin-top: 10px;
        display: block;
        color: #1989fa;
      }
    }
  }
  .btnBox{
    flex: 1;
    text-align: center;
    .btn{
      width: 40%;
    }
  }
}
</style>

<style>
  .active .van-grid-item__text{
    color: #1989fa;
  }
</style>
