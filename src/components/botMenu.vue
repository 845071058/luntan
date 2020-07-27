<template>
  <footer class="footer clear"  :class="{ 'leave': leaveComp }">
    <div class="footer-item" :class="{ active: isActive('home') }" @click="open('/home')">
      <p class="icon">
        <span class="tab-icon">
          <img src="../assets/images/sy.png" alt="" v-if="!isActive('home')" />
          <img src="../assets/images/sy1.png" alt="" v-if="isActive('home')" />
        </span>
      </p>
      <p class="name">首页</p>
    </div>
    <div class="footer-item" :class="{ active: isActive('circle') }" @click="open('/circle')">
      <p class="icon">
        <span class="tab-icon">
          <img src="../assets/images/qz.png" alt="" v-if="!isActive('circle')" />
          <img src="../assets/images/qz1.png" alt="" v-if="isActive('circle')" />
        </span>
      </p>
      <p class="name">圈子</p>
    </div>
    <div class="footer-item" :class="{ active: isActive('news') }" @click="open('/news')">
      <p class="icon">
        <span class="tab-icon">
          <img src="../assets/images/xx.png" alt="" v-if="!isActive('news')" />
          <img src="../assets/images/xx1.png" alt="" v-if="isActive('news')" />
        </span>
      </p>
      <p class="name">消息</p>
    </div>
    <div class="footer-item" :class="{ active: isActive('mine') }" @click="open('/mine')">
      <p class="icon">
        <span class="tab-icon">
          <img src="../assets/images/wd.png" alt="" v-if="!isActive('mine')" />
          <img src="../assets/images/wd1.png" alt="" v-if="isActive('mine')" />
        </span>
      </p>
      <p class="name">我的</p>
    </div>
  </footer>
</template>

<script>
  export default {
    name: 'botMenu',
    data() {
      return {
        nowUrl: '/'
      };
    },
    watch: {
      '$route'(to, from) {
        this.nowUrl = to.name
      }
    },
    computed: {
      leaveComp() {
        var base = ['home', 'circle', 'news', 'mine'];
        for (var i = 0; i < base.length; i++) {
          if (this.isActive(base[i])) {
            return false
          }
        }
        return true
      }
    },
    mounted() {
      // this.userType = storage.get('userType')
    },
    created() {},
    methods: {
      open(link) {
        this.$router.openPage(link);
      },
      isActive(name) {
        return this.nowUrl === name ? true : false
      }
    }
  };
</script>

<style>
</style>
