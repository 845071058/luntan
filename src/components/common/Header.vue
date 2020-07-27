<template>
  <yd-navbar title="NavBar">
    <router-link to="#" slot="left">
      <yd-navbar-back-icon></yd-navbar-back-icon>
    </router-link>
    <router-link to="#" slot="right">
      <yd-navbar-next-icon></yd-navbar-next-icon>
    </router-link>
  </yd-navbar>
</template>

<script>
  import {NavBar, NavBarBackIcon, NavBarNextIcon} from 'vue-ydui/dist/lib.rem/navbar';
  export default {
    data() {
      return {}
    },
    components: {
      NavBar, NavBarBackIcon, NavBarNextIcon
    },
    methods: {}
  }
</script>

<style lang="less">

</style>
