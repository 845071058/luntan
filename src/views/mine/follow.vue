<template>
  <div class="follow">
    <div class="content">
      <p>请先关注公众号吧</p>
      <img src="../../assets/images/ewm.jpg" alt="">
      <span>关注成功后返回加入圈子</span>
    </div>
  </div>
</template>
<script>

export default {
  name: 'follow',
  data() {
    return {
      userInfo: this.$store.state.user
    };
  },
  created() {

  },
  methods: {

  }
};
</script>

<style lang="scss" scoped>
  .follow{
    width: 100%;
    height: 100%;
    background: #fff;
    position: relative;
    text-align: center;
    overflow: hidden;
    .content{
      margin-top: 2rem;
      p{
        font-size: 14px;
        color: #333;
      }
      img{
        width: 4rem;
        display: block;
        margin: 0 auto;
      }
      span{
        color: #666;
        font-size: 12px;
        display: block;
      }
    }
  }
</style>
