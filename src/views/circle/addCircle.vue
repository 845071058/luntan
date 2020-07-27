<template>
  <div class="addCircle">
    <div class="logo">
      <img src="../../assets/images/logo1.png" alt />
    </div>
    <!-- <van-form @submit="onSubmit"></van-form> -->
    <van-field label="圈子名称" required maxlength="4" v-model="addCircleParams.sonName" placeholder="输入圈子名称" :rules="[{ required: true, message: '请填写用户名' }]" />
    <van-field label="圈子类型" required placeholder="请选择圈子类型" right-icon="arrow" :value="typeName" clickable readonly
      @click="(showPicker = true), (showPickerType = 1)" />
    <van-field v-show="addCircleParams.typeId === 1" readonly clickable required label="城市" right-icon="arrow" :value="addCircleParams.superName"
      placeholder="选择城市" @click="(showPicker = true), (showPickerType = 2)" />
    <van-field v-show="addCircleParams.typeId === 2" readonly clickable required label="兴趣" right-icon="arrow" :value="addCircleParams.superName"
      placeholder="选择兴趣" @click="(showPicker = true), (showPickerType = 3)" />
    <van-field v-show="addCircleParams.typeId === 3" readonly clickable required right-icon="arrow" label="游戏" :value="addCircleParams.superName"
      placeholder="选择游戏" @click="(showPicker = true), (showPickerType = 4)" />

    <van-popup v-model="showPicker" round position="bottom">
      <van-picker v-if="showPickerType === 1" title="圈子类型" show-toolbar :columns="typeList" @confirm="onTypeConfirm"
        @cancel="showPicker = false" />
      <van-area v-if="showPickerType === 2" title="选择城市" :area-list="areaList" :columns-placeholder="['请选择', '请选择', '请选择']"
        @cancel="showPicker = false" @confirm="onAreaConfirm" />
      <van-picker v-if="showPickerType === 3" title="兴趣" show-toolbar value-key="superName" :columns="interestList"
        @confirm="onInterestConfirm" @cancel="showPicker = false" />
      <van-picker v-if="showPickerType === 4" title="游戏" show-toolbar value-key="superName" :columns="gameList"
        @confirm="onGameConfirm" @cancel="showPicker = false" />
    </van-popup>
    <van-field label="圈子介绍" type="textarea" placeholder="输入圈子介绍" maxlength="50" show-word-limit v-model="addCircleParams.circleDesc" />
    <van-button class="btn" type="info" :disabled="isbtn" round @click="addCircle">创建</van-button>
  </div>
</template>

<script>
  import area from "@/assets/js/area";

  function initAddCircleParams() {
    return {
      masterId: "",
      sonName: "",
      superName: "",
      typeId: "",
      masterId: "",
      circleDesc: ""
    };
  }

  export default {
    name: "addCircle",
    data() {
      return {
        showPickerType: 1,
        showPicker: false,
        typeList: ["同城圈", "兴趣圈", "游戏圈"],
        interestList: [],
        gameList: [],
        areaValue: "",
        areaList: area,
        addCircleParams: initAddCircleParams(),
        typeName: ""
      };
    },
    computed: {
      isbtn: function() {
        // if(this.addCircleParams.sonName && this.typeName && this.addCircleParams.superName) return false
        return !Boolean(
          this.addCircleParams.sonName &&
          this.typeName &&
          this.addCircleParams.superName
        );
      }
    },
    created() {
      console.log(this.isbtn);
    },
    methods: {
      onTypeConfirm(value, index) {
        this.addCircleParams.typeId = index + 1;
        this.typeName = value;
        this.showPicker = false;
        this.addCircleParams.superName = "";
        this.getSuperCircle();
      },
      onAreaConfirm(value, index) {
        if (value[2] && value[2].name) {
          this.addCircleParams.superName = value[2].name;
          // this.areaValue = value[2].name;
        } else if (value[1] && value[1].name) {
          this.addCircleParams.superName = value[1].name;
          // this.areaValue = value[1].name;
        } else {
          if (value[0].code === "110000" || value[0].code === "120000") {
            this.addCircleParams.superName = value[0].name;
            // this.areaValue = value[0].name;
          } else {
            this.$toast("不能创建省级圈子！");
          }
        }
        this.showPicker = false;
      },
      onInterestConfirm(value, index) {
        this.addCircleParams.superName = value.superName;
        this.showPicker = false;
      },
      onGameConfirm(value, index) {
        this.addCircleParams.superName = value.superName;
        this.showPicker = false;
      },
      getSuperCircle(type) {
        this.Api.getSuperCircle({
          typeId: this.addCircleParams.typeId
        }).then(
          res => {
            if (res.success) {
              if (this.addCircleParams.typeId === 2) {
                this.interestList = res.data;
              } else {
                this.gameList = res.data;
              }
            }
          }
        );
      },
      addCircle() {
        this.addCircleParams.masterId = this.$store.state.user.userId;
        this.addCircleParams.finalName =
          this.addCircleParams.sonName + this.addCircleParams.superName;
        this.Api.addCircle(this.addCircleParams).then(res => {
          if (res.success) {
            this.$toast("创建成功！");
            this.addCircleParams = initAddCircleParams();
            this.$router.go("-1");
          } else {
            this.$toast(res.msg);
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .addCircle {
    overflow: hidden;

    .logo {
      background: #fff;
      overflow: hidden;

      img {
        width: 1.6rem;
        height: 1.6rem;
        display: block;
        border-radius: 50%;
        margin: 0.5rem auto;
      }
    }

    .btn {
      width: 90%;
      margin: 0.2rem auto 0;
      display: block;
      background: #ffc85f;
      color: #333333;
      border: none;

      .van-button__text {
        font-weight: bold !important;
      }
    }
  }
</style>
<style lang="scss">
  .addCircle .van-field .van-field__label span {
    color: #666;
  }
</style>
