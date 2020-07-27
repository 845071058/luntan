<template>
  <div class="addBlog">
    <div class="form">
      <van-field v-model="textareaVal" label-width="40" colon type="textarea" placeholder="请输入发帖内容" rows="3" />
      <div class="imgList">
        <van-uploader :max-count="9" v-model="imgSrc" :before-delete="removeImg" :after-read="afterRead" />
      </div>
    </div>
    <div class="btnBox">
      <van-button class="btn" round type="info" @click="addBlog">发帖</van-button>
    </div>
  </div>
</template>

<script>
  function initAddBolgParams() {
    return {
      byUserId: '',
      circleId: '',
      content: '',
      imgIds: []
    };
  }
  export default {
    name: 'addBlog',
    data() {
      return {
        addBolgParams: initAddBolgParams(),
        textareaVal: '',
        imgSrc: []
      };
    },
    created() {
      this.addBolgParams.circleId = this.$route.query.circleId;
    },
    methods: {
      afterRead(file) {
        file.status = 'uploading';
        file.message = '上传中...';

        let formdata = new FormData();
        formdata.append('file', file.file);
        formdata.append('type', '2');
        this.Api.uploadImg(formdata).then(res => {
          if (res.success) {
            this.addBolgParams.imgIds.push(res.data);
            file.status = 'success';
            this.$toast('上传成功！');
          } else {
            file.status = 'failed';
            file.message = '上传失败';
            this.$toast(res.msg);
          }
        });
      },
      removeImg(file, detail) {
        this.imgSrc.splice(detail.index, 1)
        this.addBolgParams.imgIds.splice(detail.index, 1)
      },
      addBlog() {
        if (!this.textareaVal) return this.$toast('发帖内容不能为空');
        this.addBolgParams.content = this.textareaVal.replace(/\n/g, '<br>');
        this.addBolgParams.content = this.addBolgParams.content.replace(/\s/g, '&nbsp;');
        this.addBolgParams.byUserId = this.$store.state.user.userId;

        this.Api.addBlog(this.addBolgParams).then(res => {
          if (res.success) {
            this.$toast('发布成功！');
            this.textareaVal = '';
            this.imgSrc = [];
            this.arddBolgPaams = initAddBolgParams();
            this.$router.go(-1);
          } else {
            this.$toast(res.msg);
          }
        });
      }
    }
  };
</script>

<style>
  .addBlog .van-uploader__preview-image {
    width: 2.1rem;
    height: 2.1rem;
  }

  .addBlog .van-uploader__upload {
    width: 2.1rem;
    height: 2.1rem;
  }
</style>

<style lang="scss" scoped>
  .addBlog {
    .form {
      background: #fff;

      .imgList {
        padding: 10px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .imgItem {
          width: 2rem;
          height: 2rem;
          margin-right: 0.07rem;
          margin-bottom: 0.08rem;
          position: relative;
          border-radius: 4px;
          overflow: hidden;

          .icon {
            position: absolute;
            top: 0.08rem;
            right: 0.08rem;
            z-index: 99;
          }

          img {
            width: 100%;
            height: 100%;
            display: block;
          }
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
