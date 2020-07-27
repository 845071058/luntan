<template>
  <div id="login-box"></div>
</template>

<script>
import { setToken } from '@/utils/auth'; // getToken from cookie
import storage from '@/store/store';
function GetQueryString(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  let r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
}
export default {
  data() {
    return {
      code: GetQueryString('code')
    };
  },
  created() {
    this.Api.getOpenId({ code: this.code }).then(res => {
      if (res.success) {
        storage.set('openId', res.data.openid);
        storage.set('accessToken', res.data.access_token);
        this.$router.push({ path: '/home', query: { circleId: this.$route.query.circleId, shareId: this.$route.query.shareId } });
      }
    });
  }
};
</script>
