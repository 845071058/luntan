<template>
  <div class="circleUserInfo">
    <div class="head">
      <div class="headImg"><img :src="userInfo.imgUrl" alt="" /></div>
      <div class="circleName">
        {{ userInfo.remarkName }}
        <img class="vipImg" v-if="userInfo.isVip === 1" src="../../assets/images/vip1.png" alt />
        <img class="attestImg" v-if="userInfo.proveStatus === 1" src="../../assets/images/grsm.png" alt="" />
        <img class="attestImg" v-if="userInfo.proveStatus === 2" src="../../assets/images/qysm.png" alt="" />
      </div>
    </div>
    <van-cell-group>
      <van-field label="昵称" v-model="userInfo.remarkName" :readonly="userId != toUserId" />
      <van-field label="标签" v-model="userInfo.label" :readonly="userId != toUserId" />
      <van-field label="电话" placeholder="手机号码" maxlength="11" type="tel" v-model="userInfo.mobile" :readonly="userId != toUserId" />
      <van-field label="个人说明" type="textarea" maxlength="120" show-word-limit v-model="userInfo.signName" :readonly="userId != toUserId"
        placeholder="这个人很懒，什么也没留下" />
    </van-cell-group>
    <div class="btnList" v-if="userId != toUserId">
      <div class="btnItem" @click="message">
        <img src="../../assets/images/dx.png" alt="">
        发消息
      </div>
      <div class="btnItem" @click="userBan" v-if="userInfo.currentUserMaster === 1">
        <img src="../../assets/images/jy_1.png" alt="">
        禁言
      </div>
    </div>
    <div class="btnBox" v-else>
      <van-button class="btn" round type="info" @click="saveUserInfo">保存</van-button>
    </div>
  </div>
</template>

<script>
  function initUserInfo() {
    return {
      circleId: '',
      circleName: '',
      imgUrl: '',
      label: '',
      mobile: '',
      remarkName: '',
      userId: '',
      isVip: '',
      proveStatus: '',
      isBan: '',
      isMaster: '',
      currentUserMaster: '',
      signName: ''
    };
  }

  export default {
    name: 'circleUserInfo',
    data() {
      return {
        circleId: this.$route.query.circleId,
        toUserId: this.$route.query.toUserId,
        userInfo: initUserInfo()
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
          this.getMyCircleInfo();
          clearInterval(time);
        }
      }, 500);
    },
    methods: {
      getMyCircleInfo() {
        this.Api.getMyCircleInfo({
          circleId: this.circleId,
          userId: this.toUserId,
          currentUserId: this.userId
        }).then(res => {
          if (res.success) {
            this.userInfo = res.data;
          } else {
            this.$toast(res.msg);
          }
        });
      },
      userBan() {
        let type = this.userInfo.isBan === 2 ? 1 : 2
        let params = {
          circleId: this.circleId,
          masterId: this.userId,
          userId: this.userInfo.userId,
          isBan: type
        };
        this.Api.isBan(params).then(res => {
          if (res.success) {
            this.userInfo.isBan = type;
            if (this.userInfo.isBan === 1) {
              this.$toast('解除禁言');
            } else {
              this.$toast('禁言成功');
            }
          } else {
            this.$toast(res.msg);
          }
        });
      },
      message() {
        this.$router.push({
          path: 'weMsg',
          query: {
            userId: this.toUserId,
            byUserName: this.userInfo.remarkName
          }
        });
      },
      saveUserInfo() {
        let params = {
          circleId: this.circleId,
          label: this.userInfo.label,
          mobile: this.userInfo.mobile,
          remarkName: this.userInfo.remarkName,
          userId: this.userId,
          signName: this.userInfo.signName
        };
        this.Api.updMyCircleInfo(params).then(res => {
          if (res.success) {
            this.$toast('修改成功');
            this.getMyCircleInfo();
          } else {
            this.$toast(res.msg);
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .circleUserInfo {
    .head {
      background: #fff;
      padding: 0.44rem 0.32rem;
      display: flex;
      align-items: center;

      .headImg {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 0.2rem;
        overflow: hidden;
        border-radius: 50%;

        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }

      .circleName {
        flex: 1;
        margin-top: 0.2rem;
        line-height: 1;
        font-size: 0.4rem;
        .vipImg {
          width: 0.52rem;
          margin-left: 0.1rem;
        }

        .attestImg {
          width: 1.06rem;
          margin-left: 0.1rem;
        }
      }
    }

    .btnList {
      background: #fff;
      margin-top: 0.2rem;

      .btnItem {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.32rem;
        color: #805E4F;
        height: 1.2rem;
        border-bottom: 1px solid #eee;

        img {
          width: 0.4rem;
          margin-right: 0.2rem;
        }
      }
    }

    .btnBox {
      position: fixed;
      bottom: 0;
      background: #fff;
      width: 100%;
      padding: 0.1rem 0;

      .btn {
        width: 90%;
        margin: 0 auto;
        display: block;
      }
    }
  }
</style>
