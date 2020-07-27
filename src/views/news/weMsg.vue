<template>
  <div class="weMsg">
    <div class="msgBox">
      <div class="msgList">
        <div class="msgItem" v-for="(item, index) in msgList" :key="index">
          <div class="createTime">{{item.msgTime}}</div>
          <div class="myConBox" v-if="item.byUserId === userId">
            <div class="msgCon">
              <span class="sjx"></span>
              {{item.msgContent}}
            </div>
            <div class="user">
              <div class="headImg"><img :src="item.createHeadImg" alt=""></div>
            </div>
          </div>
          <div class="toConBox" v-else>
            <div class="user">
              <div class="headImg"><img :src="item.createHeadImg" alt=""></div>
            </div>
            <div class="msgCon">
              <span class="sjx"></span>
              {{item.msgContent}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="commentFrame">
      <div class="commentInput">
        <input type="text" v-model="msgContent" placeholder="发送消息...">
      </div>
      <van-button plain round type="info" @click="sendMsg">发送</van-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'member',
    data() {
      return {
        isInit: true,
        msgContent: '',
        msgList: [],
        toUserId: this.$route.query.userId,
        byUserName: this.$route.query.byUserName,
        isMaster: 2
      };
    },
    computed: {
      userId() {
        return this.$store.state.user.userId;
      }
    },
    created() {
      document.title = this.byUserName
      let time = setInterval(() => {
        if (this.userId) {
          this.getWeMsg();
          clearInterval(time);
        }
      }, 500);
    },
    methods: {
      getWeMsg() {
        this.Api.getWeMsg({
          byUserId: this.userId,
          toUserId: this.toUserId
        }).then(res => {
          if (res.success) {
            this.msgList = res.data
            if(this.isInit) {
              this.isInit = false
              this.$nextTick(()=>{
                let ele = document.querySelector(".msgBox")
                //判断元素是否出现了滚动条
                if(ele.scrollHeight > ele.clientHeight) {
                	//设置滚动条到最底部
                	ele.scrollTop = ele.scrollHeight;
                }
              })
            }
          } else {
            this.$toast(res.msg);
          }
        })
      },
      sendMsg() {
		if (!this.msgContent) return this.$toast('内容不能为空!');
        let params = {
          byUserId: this.userId,
          msgContent: this.msgContent,
          toUserId: this.toUserId
        }
        this.Api.sendMsg(params).then(res => {
          if (res.success) {
            this.msgContent = ''
            this.getWeMsg()
            this.$toast('成功');
          } else {
            this.$toast(res.msg);
          }
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
  .weMsg {
    width: 100%;
    height: 100%;
    position: relative;

    .msgBox {
      height: 100%;
      padding-bottom: 50px;
      overflow: auto;
    }
  }
</style>
