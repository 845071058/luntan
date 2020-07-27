<template>
  <div>
    <div class="loading-bar"><span class="press"></span></div>
    <div class="app-init">
      <transition>
        <router-view></router-view>
      </transition>
    </div>
    <botMenu></botMenu>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import storage from '@/store/store';
import apiHost from '@/Api/apiConfig';
import botMenu from '@/components/botMenu';
import wx from 'weixin-js-sdk';

export default {
  name: 'app',
  components: {
    botMenu
  },
  data() {
    return {
      openId: storage.get('openId'),
      accessToken: storage.get('accessToken'),
      whiteList: ['/wx']
    }
  },
  watch: {
    $route(to, from) {
      if (!this.openId) {
        if(this.whiteList.indexOf(to.path) === -1){
          this.getWxCode()
        }
      } else {
        if(this.$store.state.user.nickname) return
        const params = {
          'accessToken': this.accessToken,
          'openid': this.openId
        }
        if(this.$route.query.shareId){
          params.shareId = this.$route.query.shareId
          params.circleId = this.$route.query.circleId
        }
        this.Api.getUserInfo(params).then(res => {
          this.$store.commit('SET_USER', res.data)
          if (res.data.subscribe != 1) this.$router.push('/follow')
        })
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  mounted() {},
  created() {

  },
  methods: {
    getWxCode() {
      let url = apiHost.WXURL;
      if(this.$route.query.circleId) {
        url = url + '?circleId=' + this.$route.query.circleId
        if(this.$route.query.shareId) {
          url = url + '&shareId=' + this.$route.query.shareId
        }
      } else {
        if(this.$route.query.shareId) {
          url = url + '?shareId=' + this.$route.query.shareId
        }
      }
      url = encodeURIComponent(url);
      let appId = apiHost.WXAPPID;
      window.location.href =
        'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + url + '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
    }
  }
};
</script>

<style lang="scss" type="text/scss">
@import './style/common.scss';
@import './assets/font/iconfont.css';

.tab-icon {
  width: 0.4rem;
  height: 0.4rem;
  display: inline-block;
  font-size: 0.3rem;
}
.tab-icon img {
  width: 100%;
  height: 100%;
  display: block;
}
.v-btn button {
  width: 100%;
  height: 100%;
  font-size: 0.36rem;
  color: #fff;
  background: #ff4848;
  text-align: center;
  border-radius: 0.1rem;
  letter-spacing: 0.03rem;
}
.li-title {
  font-size: 0.32rem;
  color: #333;
  letter-spacing: 0.02rem;
  font-weight: 600;
}
.loding{
  position: fixed;
  top:0;
  left:0;
  z-index:121;
  width: 100%;
  height: 100%;
  background-color: rgba(50,50,51,.88);
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  .van-loading{
    margin: 4.5rem auto;
  }
}
</style>
