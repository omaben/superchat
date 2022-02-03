<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-28 17:08:06
 * @LastEditTime: 2019-09-30 17:36:10
 * @LastEditors: Please set LastEditors
 -->
<template>
	<transition name="fade">
		<div class="modal-box">
			<div class="modal-content" v-show="Mpanel">
				<div class="modal-header">
					<span>{{$t('slide.title')}}</span>
					<span @click="onCancel" class="close-mask">
						<i data-v-1a504564 class="iconfont icon-sykszz-close"></i>
					</span>
				</div>
				<!--内容区域-->
				<div class="modal-body">
					<div id="mpanel" ref="mpanel"></div>
				</div>
				<div class="modal-bottom">
					<!-- <i class="red">*</i>请完成上方的验证
					<i class="red">*</i>-->
				</div>
			</div>
		</div>
	</transition>
</template>
 
<script>
import { captchaPuzzle,captchaPuzzleVer } from "@/services/index"
export default {
	props: ["type"],
	name: "mpanel",
	watch: {
		
	},
	data() {
		return {
			path: null,
			refresh: false,
			Mpanel:false,
		};
	},
	mounted() {
		this.slideVerify();
	},
	methods: {
		onCancel() {
			this.$emit("close");
		},
		// 提示框
		showToolTip(text, timeout = 2000) {
			this.$message({
				message: text,
				duration: timeout
			});
		},
		// 验证
		slideVerify() {
			let _this = this;

			captchaPuzzle()
				.then(resq => {
					let res = resq.data.data;
					window.dpr = 1;
					this.Mpanel = true;
					
					_this.$emit("codeId", res.id);

					
					_this.$("#mpanel").slideVerify({
						type: 2,
						mode: "pop",
						vOffset: _this.type,
						vSpace: 5,
						codeId: res.id,
						explain: this.$t("slide.explain"),
						imgUrl: "data:image/png;base64," + res.normal,
						smallImg: "data:image/png;base64," + res.small,
						imgSize: {
							width: res.imgx * window.dpr + "px",
							height: res.imgy * window.dpr + "px"
						},
						blockSize: {
							width: res.sImgx * window.dpr + "px",
							height: res.sImgy * window.dpr + "px"
						},
						barSize: {
							width: res.imgx * window.dpr + "px",
							height: res.sImgy * window.dpr + "px"
						},
						rand2: res.y * window.dpr,
						ready: function(v) {
							if (v) {
								_this.slideVerify();
							}
						},
						success: function(data) {
							// 向父组件传值
							_this.$emit("success", data, res.id);
						},
						error: function() {
							_this.$message.error(_this.$t("slide.fail"));
							_this.slideVerify();
							// _this.showToolTip("验证失败");
						}
					});
				})
				.catch(err => {
					this.$message.error(err.message)
				});
		}
	}
};
</script>

<style scoped lang="scss">
/* @import  url('./less/skin.less'); */

@import url("~@/styles/verify.scss");
.modal-box {
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	left: 0;
	top: 0;
	z-index: 100;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
}

.modal-content {
	position: relative;
	width: 90%;
	height: 322px;
	background: #fff;
	border-radius: 10px;
	box-sizing: border-box;
	font-size: 12px;
}

.modal-header {
	padding: 0 15px;
	height: 40px;
	line-height: 40px;
	font-size: 16px;
	color: #1a1a1a;
	text-align: center;
	font-weight: bold;
}
.modal-bottom {
	height: 22px;
}

.modal-bottom .red {
	color:  #e60012;
}

.close-mask {
	float: right;
	color: #646466;
}

.close-mask .iconfont {
	font-size: 15px;
}

#mpanel {
	background-color: #fff;
}

.fade-enter-active {
	animation: fade-in 0.5s;
}

.fade-leave-active {
	animation: fade-in 0.5s reverse;
}

@keyframes fade-in {
	0% {
		transform: scale(0);
	}
	50% {
		transform: scale(1.5);
	}
	100% {
		transform: scale(1);
	}
}
</style>