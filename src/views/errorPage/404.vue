<template>
  <div class="app-init">
    <div style="background:#f0f2f5;height:100%;">
      <div class="wscn-http404">
        <div class="bullshit">
          <div class="bullshit__headline">{{ message }}</div>
          <div class="bullshit__info">请检查您输入的网址是否正确，请点击以下按钮返回主页或者发送错误报告</div>
          <a href="/" class="bullshit__return-home">返回首页</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import img_404 from '@/assets/404_images/404.png'
  import img_404_cloud from '@/assets/404_images/404_cloud.png'

  export default {
    name: 'page404',
    data() {
      return {
        img_404,
        img_404_cloud
      }
    },
    computed: {
      message() {
        return '特朗普说这个页面你不能进......'
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .wscn-http404 {
    position: relative;
    width: 100%;
    padding: 0 1rem;
    overflow: hidden;
    .pic-404 {
      position: relative;
      float: left;
      width: 100%;
      padding: 1.5rem 0;
      overflow: hidden;
      &__parent {
        width: 100%;
      }
      &__child {
        position: absolute;
        &.left {
          width: 0.8rem;
          top: .17rem;
          left: 0;
          opacity: 0;
          animation-name: cloudLeft;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1s;
        }
        &.mid {
          width: .46rem;
          top: .1rem;
          left: 2rem;
          opacity: 0;
          animation-name: cloudMid;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1.2s;
        }
        &.right {
          width: .62rem;
          top: 1rem;
          left: 5rem;
          opacity: 0;
          animation-name: cloudRight;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1s;
        }
        @keyframes cloudLeft {
          0% {
            top: 0.22rem;
            left: 3rem;
            opacity: 0;
          }
          20% {
            top: .33rem;
            left: 2.5rem;
            opacity: 1;
          }
          80% {
            top: 1.2rem;
            left: 1.2rem;
            opacity: 1;
          }
          100% {
            top: 1.3rem;
            left: 1rem;
            opacity: 0;
          }
        }
        @keyframes cloudMid {
          0% {
            top: .2rem;
            left: 5rem;
            opacity: 0;
          }
          20% {
            top: .6rem;
            left: 4.6rem;
            opacity: 1;
          }
          70% {
            top: 1.5rem;
            left: 3.6rem;
            opacity: 1;
          }
          100% {
            top: 2rem;
            left: 3rem;
            opacity: 0;
          }
        }
        @keyframes cloudRight {
          0% {
            top: 100px;
            left: 500px;
            opacity: 0;
          }
          20% {
            top: 120px;
            left: 460px;
            opacity: 1;
          }
          80% {
            top: 180px;
            left: 340px;
            opacity: 1;
          }
          100% {
            top: 200px;
            left: 300px;
            opacity: 0;
          }
        }
      }
    }
    .bullshit {
      &__oops {
        font-size: .5rem;
        font-weight: bold;
        line-height: .4rem;
        color: #1482f0;
        opacity: 0;
        margin-bottom: .5rem;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
      }
      &__headline {
        font-size: .35rem;
        line-height: .3rem;
        color: #FF5A5A;
        opacity: 0;
        margin-bottom: .15rem;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.1s;
        animation-fill-mode: forwards;
      }
      &__info {
        font-size: .25rem;
        line-height: .3rem;
        color: grey;
        opacity: 0;
        margin-bottom: .3rem;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.2s;
        animation-fill-mode: forwards;
      }
      &__return-home {
        display: block;
        float: left;
        width: 1.8rem;
        height: .6rem;
        background-color: #FF5A5A;
        border-radius: 1rem;
        text-align: center;
        color: #ffffff;
        opacity: 0;
        font-size: .25rem;
        line-height: .6rem;
        cursor: pointer;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.3s;
        animation-fill-mode: forwards;
      }
      @keyframes slideUp {
        0% {
          transform: translateY(60px);
          opacity: 0;
        }
        100% {
          transform: translateY(0);
          opacity: 1;
        }
      }
    }
  }
</style>
