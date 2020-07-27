<template>
	<div class="attest">
		<van-field label="认证类型" placeholder="请选择圈子类型" :value="typeName" right-icon="arrow" clickable readonly @click="showPicker = true" />
		<van-popup v-model="showPicker" round position="bottom">
			<van-picker title="认证类型" show-toolbar :columns="typeList" @confirm="onTypeConfirm" @cancel="showPicker = false" />
		</van-popup>
		<van-field label="真实姓名" v-model="addProveParams.realName" placeholder="输入真实姓名" />
		<van-field label="身份证" v-model="addProveParams.idCard" placeholder="输入身份证号" />
		<div class="codeList">
			<div class="codeItem" v-for="(item, index) in imgSrc" :key="index" @click="selectImg(index)">
				<img :src="item.src" alt="" />
				<p>{{index === 0 ? '正面照' : '反面照'}}</p>
				<img v-show="!item.isUp" class="icon" src="../../assets/images/icon_1.png" alt="" />
			</div>
			<van-uploader v-show="false" ref="uploaderCode" style="margin-top: 0.1rem;" :after-read="afterRead" />
		</div>
		<div class="license" v-show="addProveParams.proveType === 2">
			<h3>营业执照</h3>
			<div class="licenseItem" @click="selectImg(2)"><img :src="licenseSrc" alt="" /></div>
		</div>
		<van-button class="btn" type="info" :disabled="isbtn" @click="addProve" round>确认</van-button>
	</div>
</template>

<script>
function initAddProveParams() {
	return {
		userId: '',
		realName: '',
		idCard: '',
		proveType: 1,
		imgIds: []
	};
}

export default {
	name: 'attest',
	data() {
		return {
			showPicker: false,
			typeList: ['个人认证', '企业认证'],
			typeName: '个人认证',
			text: '身份证',
			addProveParams: initAddProveParams(),
			imgLength: 1,
			selectImgIndex: 0,
			uploader: [],
			imgSrc: [{ src: `${require('../../assets/images/img_3.png')}`, isUp: false }, { src: `${require('../../assets/images/img_2.png')}`, isUp: false }],
			licenseSrc: require('../../assets/images/img_4.png')
		};
	},
	computed: {
		isbtn: function() {
			return !Boolean(this.addProveParams.realName && this.addProveParams.idCard && this.addProveParams.imgIds.length > this.imgLength);
		}
	},
	methods: {
		onTypeConfirm(value, index) {
			this.typeName = value;
			this.addProveParams.proveType = index + 1;
			if (this.addProveParams.proveType === 1) {
				this.text = '身份证';
				this.imgLength = 1;
			} else {
				this.text = '身份证和企业营业执照';
				this.imgLength = 2;
			}
			this.showPicker = false;
		},
		selectImg(index) {
			this.selectImgIndex = index;
			this.$refs.uploaderCode.$refs.input.click();
		},
		afterRead(file) {
			let formdata = new FormData();
			formdata.append('file', file.file);
			formdata.append('type', '1');
			this.Api.uploadImg(formdata).then(res => {
				if (res.success) {
					if(this.selectImgIndex == 3) {
						this.licenseSrc = file.content;
					} else {
						this.imgSrc[this.selectImgIndex].src = file.content;
						this.imgSrc[this.selectImgIndex].isUp = true;
					}
					this.$set(this.addProveParams.imgIds, this.selectImgIndex, res.data);
					this.$toast('上传成功！');
				} else {
					this.$toast(res.msg);
				}
			});
		},
		addProve() {
			this.addProveParams.userId = this.$store.state.user.userId;
			this.Api.addProve(this.addProveParams).then(res => {
				if (res.success) {
					this.$toast('提交成功！');
					this.$router.go(-1);
				} else {
					this.$toast(res.msg);
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.attest {
	.license{
		overflow: hidden;
		background: #fff;
		padding: 10px 16px;
		h3 {
			font-size: 14px;
			margin-bottom: 0.32rem;
		}
		.licenseItem{
			width: 2.24rem;
			height: 2.24rem;
			img{
				width: 100%;
				height: 100%;
				display: block;
			}
		}
	}
	
	.codeList {
		padding: 10px;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		background: #fff;
		.codeItem {
			width: 2.8rem;
			height: 1.76rem;
			margin-right: 0.4rem;
			margin-bottom: 0.4rem;
			position: relative;
			.icon {
				position: absolute;
				top: 50%;
				left: 50%;
				z-index: 99;
				width: 0.64rem;
				height: 0.64rem;
				transform: translate(-50%, -50%);
			}
			img {
				width: 100%;
				height: 100%;
				display: block;
			}
			p{
				margin-top: 0.1rem;
				line-height: 1;
				color: #BBBBBB;
				font-size: 12px;
				text-align: center;
			}
		}
	}
	.btn {
		width: 90%;
		margin: 0.2rem auto 0;
		display: block;
	}
}
</style>
