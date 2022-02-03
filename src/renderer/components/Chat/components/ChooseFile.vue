<template>
	<!-- 选择文件-组件 -->
	<div v-show="isShow" class="file-area">
		
		
		
		<!-- <div v-for="(record, index) in recordings" :key="index" class="recorded-item">
                <div class="audio-container"><audio :src="record.src" controls /></div>
                <div><button @click="removeRecord(index)" class="button is-dark">delete</button></div>
              </div> -->
		<!-- <div class="upload" >
			<a style="padding:0">
				<vue-record-audio mimeType='audio/webm' ref="record"  :mode="recordMode.audio" @stop="stopRecord"  @start="recordClick" @result="onResult" />
				<i class="el-icon-close delete-voice" @click="cancelRecord" v-show="deleteRecord"></i>
			</a>
			:attempts="3"
		</div> -->
		<audio-recorder
			:class="{'activeRecord':activeRecord}"
            
            :time="100"
			:before-recording="recordClick"
            :after-recording="sendVoiceTest"/>
		
			
			<input type="file" raccept="*" class="hidden" style="display:none" accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"  ref="filez" @change="handleSendFile($event)" />
			<input type="file" raccept="*" class="hidden" style="display:none" accept="image/*,video/*,audio/*" ref="filezPic" @change="handleSendFile($event)" />
		<!-- <div class="upload" >
			<a @click="shareBusinessCard()">
				<i class="el-icon-user"></i>
			</a>
		</div> -->
		<business-card v-if="businessCard" @sendBusinessCard="sendBusinessCard" @hideBusinessCard="hideBusinessCard" :friendsSorted="friendsSorted" /> 
		<red-packet v-if="redPacket" @hideRedPacket="hideRedPacket"></red-packet>
		<el-popover 
            placement="top-end" 
            width="120" 
            v-model="isVisible"
            ref="popover"
            trigger="click">
            <p class="add-chat-item" @click="makeUploadSource(3)">
                <img  :src="require('@/assets/svg/img-send.svg')" alt="">
            	{{$t('search_pill_pictures')}} / {{$t('search_pill_videos')}}
            </p>
			<p class="add-chat-item disabled">
                <img  :src="require('@/assets/svg/call-send.svg')" alt="">
				{{$t('group_call')}}
            </p>
			<p class="add-chat-item" :class="{'disabled':appConfig.paymentSet===2}" @click="redPacketOpen()">
                <img  :src="require('@/assets/svg/red-send.svg')" alt="">
                {{$t('red_packet')}}
            </p>
			<p class="add-chat-item" @click="shareBusinessCard()">
                <img  :src="require('@/assets/svg/contact-send.svg')" alt="">
                {{$t('share_contact')}}
            </p>
			<p class="add-chat-item" @click="makeUploadSource(1)">
                <img  :src="require('@/assets/svg/doc-send.svg')" alt="">
                {{$t('search_pill_documents')}}
            </p>
            <div slot="reference">
            	<div class="upload" >
					<a >
						<img  :src="require('@/assets/svg/attach-file-send.svg')" alt="">
					</a>
				</div>
            </div>
        </el-popover>
	</div>
</template>

<script>
import BusinessCard from "@/components/AddChat/BusinessCardNew";
import RedPacket from "@/components/Details/RedPacket/index";

import MSG_TYPE from "@/services/im/constant";
import {  mapGetters } from 'vuex'

export default {
	name:"chooseFile",
	props: ["isShow","isUploadImg","isUploadVideo"],
	components: {
        BusinessCard,
		RedPacket
    },
	data() {
		return {
			businessCard: false,
			redPacket: false,
			isVisible:false,
			isAgency: false,
			isgAgency: false,
			activeRecord: false,
			recordMode: {
				audio: 'press',
				video: 'press'
			},
			friendsSorted: [],
			recordings: [],
			cancelRecordV:false,
			deleteRecord: false,
			sortBy: 'nikeName',
            sortDirection: 'asc',
			appConfig: ''
		}
	},
	mounted() {
		this.$bus.$off('upAvatar')
		this.$bus.$on('upAvatar',()=>{
			this.isAgency = true;
			this.$refs.filezPic.click()
		})
		this.$bus.$off('upgAvatar')
		this.$bus.$on('upgAvatar',()=>{
			this.isgAgency = true;
			this.$refs.filezPic.click()
		})
		this.appConfig = JSON.parse(sessionStorage.getItem("appConfig"))		
	},
	updated(){
		this.$bus.$off('upAvatar')
		this.$bus.$on('upAvatar',()=>{
			this.isAgency = true;
			this.$refs.filezPic.click()
		})
		//this.appConfig = JSON.parse(localStorage.getItem("appConfig"))
		
	},
	 computed: {
        ...mapGetters([
            'friends',
        ]),
    },
	methods: {
		sendBusinessCard(friend) {
			this.hideBusinessCard()
			this.$emit('sendBusinessCard',friend)
		},
		
		friendsSortedFun: function(){
				let listFriend = this.friends
				listFriend.map(element => {
                    element.select = false;
                });
                return listFriend.sort((p1,p2) => {
                    let modifier = 1;
                    if(this.sortDirection === 'desc') modifier = -1;
                    if(p1[this.sortBy].toLowerCase() < p2[this.sortBy].toLowerCase()) return -1 * modifier; if(p1[this.sortBy].toLowerCase() > p2[this.sortBy].toLowerCase()) return 1 * modifier;
                    return 0;
                });
        },
		sort: function(s){
                if(s === this.sortBy) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                }
                this.sortBy = s;
        },
		hideRedPacket() {
			this.redPacket = false
		},
		hideBusinessCard() {
			this.businessCard = false
		},
		redPacketOpen(){
			this.redPacket = true
		},
		shareBusinessCard(){
			this.businessCard = true
            this.friendsSorted = this.friendsSortedFun()
		},
		cancelRecord(){
			this.cancelRecordV=true
			this.$refs.record.stop()
			
        },
		removeRecord (index) {
			this.recordings.splice(index, 1)
		},
		recordClick () {
			this.activeRecord=true
			this.deleteRecord=true
			var recordClick=false
			this.$emit('recordClick',recordClick)
		},
		stopRecord () {
			var recordClick=true
			this.$emit('stopRecord',recordClick)
		},
		onVideoStream (stream) {
		},
		onVideoResult (data) {
			this.$refs.Video.srcObject = null
			this.$refs.Video.src = window.URL.createObjectURL(data)
		},
		sendVoiceTest (data){
			this.activeRecord=false
			this.stopRecord()
			this.$emit('sendRecord',data.blob)
		},
		onResult (data) {
			if(!this.cancelRecordV)
			{
				this.recordings.push({
				src: window.URL.createObjectURL(data)
				})

				data = data.slice(0, data.size, "audio/wav")

				
				
				this.$emit('sendRecord',data)
			}
			else{
				this.cancelRecordV=false
				
				this.$emit('cancelRecord')
				
			}
			this.deleteRecord=false
		},
		makeUploadSource(status){
			//let status=1
			
			if(status==1){
				this.$refs.filez.click()
			}else if(status==2){
				this.$refs.filevideo.click()
			}else if(status==3){
				this.$refs.filezPic.click()
			}
		},
		calculateSize(img, maxWidth, maxHeight) {
            let width = img.width;
            let height = img.height;
            // calculate the width and height, constraining the proportions
            if (width > height) {
                if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
                }
            }
            return [width, height];
        },
		blobToFile(theBlob, file){
			//A Blob() is almost a File() - it's just missing the two properties below which we will add
			theBlob.lastModifiedDate = new Date();
			theBlob.name = file.name;
			return new File([theBlob],file.name,{type: theBlob.type });
		},
		handleSendFile(event) {
			
			let _this = this.$(event.target);
			
			let status=1
			if (_this[0].files.length === 0) return;

			let file = _this[0].files[0];
            let localPath = this.getObjectURL(file); //本地图片，视频地址
            let image_reg = /(gif|jpg|jpeg|png|swf)$/;
			let video_reg = /(mp4)$/;
			if(file && file['type'].split('/')[0] === 'image'){
				status=1
			}else if(file && file['type'].split('/')[0] === 'video'){
				status=2
			}else{
				status=3
			}
			let isImage = image_reg.test(file.type);
			let isVideo = video_reg.test(file.type);
			console.log(1111)
			if(status==1){
				if(isImage){
					const blobURL = URL.createObjectURL(file);
                    const img = new Image();
                    const MAX_WIDTH = 1000;
                    const MAX_HEIGHT = 800;
                    const QUALITY = 0.7;
                    const MIME_TYPE = "image/jpeg";
                    img.src = blobURL;
					let that=this
					img.onload = function () {
						URL.revokeObjectURL(this.src);
						const [newWidth, newHeight] = that.calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
						const canvas = document.createElement("canvas");
						canvas.width = newWidth;
						canvas.height = newHeight;
						const ctx = canvas.getContext("2d");
						ctx.drawImage(img, 0, 0, newWidth, newHeight);
						canvas.toBlob(
						(blob) => {
							// Handle the compressed image. es. upload or save in local state
							let myFile=that.blobToFile(blob,file)
							if(that.isAgency){
								that.$bus.$emit("upsAvatar", myFile, localPath);
								that.isAgency=false
							} else if(that.isgAgency){
								that.$bus.$emit("upgsAvatar", myFile, localPath);
								that.isgAgency = false
							}else{
								that.$emit("choose-file", myFile, localPath, status);
							}
						},
						image_reg,
						QUALITY
						);
					}
					if (isImage && parseFloat(file.size / 1024 / 1024) > 5) {
						
						//图片最大5M
						this.$message.error(this.$t('reg_image'));
					}
				}else{
					this.$refs.fileimg.value = ''
					return this.$message.error(this.$t('reg_image'));
				}
			}else if(status==2){
				if(isVideo){
					if(this.isAgency){
						this.$bus.$emit("upsAvatar", file, localPath);
						this.isAgency=false
					} else if(this.isgAgency){
						this.$bus.$emit("upgsAvatar", file, localPath);
						this.isgAgency = false
					}else{

						this.$emit("choose-file", file, localPath, status);
					}
					if (isVideo && parseFloat(file.size / 1024 / 1024) > 20) {
						//视频最大20M
						this.$message.error(this.$t('reg_video'));
					}
				}else{
					this.$refs.filevideo.value = ''
					return this.$message.error(this.$t('reg_video'));
				}
			}else{
					if(this.isAgency){
						this.$bus.$emit("upsAvatar", file, localPath);
						this.isAgency=false
					} else if(this.isgAgency){
						this.$bus.$emit("upgsAvatar", file, localPath);
						this.isgAgency = false
					}else{

						this.$emit("choose-file", file, localPath, status);
					}
			}

			
			this.$refs.filez.value = ''
		},
		//建立一個可存取到該file的url 获取本地图片/视频url
		getObjectURL(file) {
			var url = null;
			// 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
			if (window.createObjectURL != undefined) {
				// basic
				url = window.createObjectURL(file);
			} else if (window.URL != undefined) {
				// mozilla(firefox)
				url = window.URL.createObjectURL(file);
			} else if (window.webkitURL != undefined) {
				// webkit or chrome
				url = window.webkitURL.createObjectURL(file);
			}
			return url;
		}
	},

}
</script>

<style lang="scss" scoped>
.add-chat-item.disabled{
		color: #999DA0;
		    cursor: not-allowed;
}
.delete-voice{
	position: absolute;
	left: -47px;
	top: -20px;
	color: red;
    background: #fff;
    border-radius: 50%;
    padding: 5px;
    cursor: pointer;
    box-shadow: 0px 7px 10px -8px #63645e;
}
.file-area{
	display: flex;
	position: relative;
	top: -9px;
	.upload{
		margin-left: 5px;
		height: 36px;
		width: 36px;
		line-height: 36px;
		text-align: center;
		cursor: pointer;
		background: #F0F1F4;
		border-radius: 50%;
		img{
			position: relative;
    		top: 5px;
		}
		&:hover{
                color: var(--primary-color);
        }
		a{
			height: 100%;
			width: 100%;
			position: relative;
			font-size: 16px;
			padding: 8px 12px;
			cursor: pointer;
			input {
				width: 100%;
				position: absolute;
				top: 0;
				left: 0;
				height: 60px;
				opacity: 0;
			}
		}
	}

}
.vue-audio-recorder {
    position: relative;
    background-color: #4db6ac;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: inline-block;
    cursor: pointer;
    -webkit-box-shadow: 0 0 0 0 rgba(232,76,61,.7);
    box-shadow: 0 0 0 0 rgba(232,76,61,.7);
}
</style>