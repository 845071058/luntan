<template>
	<div id="login-box">
		<div class="logins">
			<div class="bagImg">
				<img src="../../assets/images/logo.png" alt>
			</div>
			<p class="title">国华广东售电业务信息系统</p>
			<el-form ref="form" :model="form" label-width="70px" class="userName">
				<el-form-item label="用户名:">
					<el-input v-model="form.userName" @blur="getPhone" placeholder="请输入手机号码或企业编号"></el-input>
				</el-form-item>
				<el-form-item label="密码:">
					<el-input v-model="form.passWord" type="password" placeholder="请输入密码"></el-input>
				</el-form-item>
				<el-form-item label="验证码:" v-show="isWeChat">
					<el-input v-model="form.validate" class="validate" placeholder="请输入密码"></el-input>
					<input id="send" type="button" :value="validataValue" @click="sendValite" :disabled="canSend">
				</el-form-item>
			</el-form>
			<!-- <p class="wechart-bind" @click="bindWeChat">微信绑定</p> -->
<!-- 			<div class="v-btn">
				<button @click="goHome" v-if="canWeChat">登录</button>
				<button @click="bind" v-if="!canWeChat">绑定并登录</button>
			</div> -->
		</div>
	</div>
</template>

<script>
import storage from "@/store/store";
import wx from "weixin-js-sdk";
import apiHost from "@/Api/apiConfig";
export default {
  data() {
    return {
      openId: storage.get("openId"),
      form: {
        userName: "",
        passWord: "",
        validate: ""
      },
      validate: "",
      phone: "",
      isWeChat: false,
      canWeChat: true,
      validataValue: "发送验证码",
      canSend: false
    };
  },
  created() {
    if (!this.openId && this.openId != '') {
      this.getWxCode();
    } else {
      this.Api.getWxAutoLogin(this.openId).then(respon => {
        if (respon.success == true) {
          if (respon.data.userType == 1) {
            this.$router.push("/home");
          } else {
            this.$router.push("/plan");
          }
          storage.set("userType", respon.data.userType);
          storage.set("authType", respon.data.authType);
        }
      });
    }
  },
  methods: {
    getWxCode() {
      let url = encodeURIComponent(apiHost.WXURL);
      let appId = apiHost.WXAPPID;
      window.location.href =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
        appId +
        "&redirect_uri=" +
        url +
        "&response_type=code&scope=snsapi_userinfo#wechat_redirect";
    },
    getLoginCode() {
      let para = {
        loginName: encodeURI(this.form.userName),
        password: encodeURIComponent(this.form.passWord)
      };
      if (this.isWeChat) {
        para.smsCode = this.form.validate;
      }
      return para;
    },
    goHome() {
      this.$store.dispatch("LoginByUsername", this.getLoginCode()).then(res => {
        if (res.success == true) {
          this.$dialog.toast({
            mes: "登录成功！",
            timeout: 1500
          });
          storage.set("authType", res.data.authType);
          this.Api.getUserType().then(ress => {
            if (ress.data == 1) {
              this.$router.push("/home");
            } else {
              this.$router.push("/plan");
            }
            storage.set("userType", ress.data);
          });
        } else {
          this.$dialog.toast({
            mes: res.msg,
            timeout: 1500
          });
        }
      });
    },
    sendCode1() {
      this.$dialog.loading.open("发送中...");
      setTimeout(() => {
        this.canSend = true;
        this.$dialog.loading.close();

        this.$dialog.toast({
          mes: "已发送",
          icon: "success",
          timeout: 1500
        });
      }, 1000);
    },
    sendValite() {
      if (!this.form.userName) {
        this.$dialog.toast({ mes: "请输入用户名！", timeout: 1500 });
        return false;
      }

      if (!isVaildPhone(this.form.userName)) {
        this.$dialog.toast({
          mes: "请在用户名框中输入您的手机号码！",
          timeout: 1500
        });
        return false;
      }

      this.Api.getIsUserByPhone(this.form.userName).then(res => {
        if (res.data === 0) {
          this.$dialog.toast({
            mes: "账号未登记，请联系售电公司！",
            timeout: 1500
          });
        } else {
          this.Api.getValidate(this.form.userName).then(res => {
            if (res.success) {
              this.$dialog.toast({ mes: "发送成功！", timeout: 1500 });
            } else {
              this.$dialog.toast({ mes: "该手机号未登记授权，请联系我司业务员", timeout: 1500 });
            }
          });
          let times = 60;
          let timer = null;
          timer = setInterval(() => {
            times--;
            if (times <= 0) {
              this.validataValue = "发送验证码";
              clearInterval(timer);
              this.canSend = false;
              times = 60;
            } else {
              this.validataValue = `${times}秒后重试`;
              this.canSend = true;
            }
          }, 1000);
        }
      });
    },
    bind() {
      let params = {
        loginName: encodeURI(this.form.userName),
        password: encodeURIComponent(this.form.passWord),
        smsCode: this.form.validate,
        wechatOpenid: storage.get("openId")
      };
      this.Api.getUserInfoLogin(params).then(respon => {
        if (respon.success == true) {
          storage.set('accountType',respon.data.phoneAccountFlag)
          this.Api.getUserType().then(res => {
            res.data == 1
              ? this.$router.push("/home")
              : this.$router.push("/plan");
            storage.set("userType", res.data);
          });
        } else {
          this.$dialog.toast({ mes: respon.msg, timeout: 1500 });
        }
      });
    },
    getPhone() {
      if (!this.form.userName) {
        this.$dialog.toast({ mes: "请输入用户名！", timeout: 1500 });
        return false;
      }
      if (isVaildPhone(this.form.userName)) {
        this.isWeChat = true;
        this.canWeChat = false;
      } else {
        this.isWeChat = false;
        this.canWeChat = true;
      }
    }
  }
};

function isVaildPhone(str) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
  return reg.test(str);
}
</script>
<style type="text/scss" lang="scss">
	#login-box {
  .logins {
    padding: 0.24rem;
    background: #fff;
    .log {
      height: 100%;
    }
    .bagImg {
      height: 2rem;
      margin: 0 auto;
      margin-top: 0.8rem;
      text-align: center;
    }
    .bagImg img {
      height: 100%;
    }
    .title {
      font-size: 0.5rem;
      font-family: "中体";
      color: #3d3d3d;
      font-weight: bold;
      padding-top: 0.54rem;
      text-align: center;
      letter-spacing: 0.02rem;
    }
    .userName {
      padding-top: 0.6rem;
    }

    .v-btn {
      width: 100%;
      height: 0.9rem;
      margin-top: 1rem;
    }
    .wechart-bind {
      text-align: right;
    }
    .validate {
      width: 58%;
    }
    #send {
      float: right;
      height: 40px;
      color: #fff;
      width: 38%;
      text-align: center;
      background: #ff4848;
      border-radius: 4px;
    }
    .vali-title {
      font-size: 0.3rem;
      padding-left: 0.24rem;
      line-height: 40px;
    }
  }
}
</style>
