<template>
    <div>
        <div class='text-area-msg' v-if="msgObj">
                
                <div class="msg-text-batch" v-if="msgObj && msgObj.msgType === MSG_TYPE.IM_MSG_TYPE_TEXT">
                    <i class="el-icon-delete" @click="removeMsgObj"></i>
                    <div>{{JSON.parse(msgObj.message).message}}</div>
                </div>
                <div v-if="msgObj && msgObj.msgType === MSG_TYPE.IM_MSG_TYPE_VOICE" class=" msg-text-batch msg-picture msg-voice" >
                    <i class="el-icon-delete" @click="msgObj = null"></i>
                    <mini-audio :audio-source="JSON.parse(msgObj.message).picUrl || JSON.parse(msgObj.message).url" ></mini-audio>
                </div>
                <div v-if="msgObj && msgObj.msgType === MSG_TYPE.IM_MSG_TYPE_PICTURE" class="msg-text-batch msg-picture">
                            <i class="el-icon-delete" @click="msgObj = null"></i>
                            <img
                                :src="msgObj.isLocal?(JSON.parse(msgObj.message).picUrl ||JSON.parse(msgObj.message).url):(JSON.parse(msgObj.message).picUrl ||JSON.parse(msgObj.message).url)"
                                :style="{
                                    width:JSON.parse(msgObj.message).picSizeWidth,
                                    height:JSON.parse(msgObj.message).picSizeHeight
                                }"
                            />
                </div>
                 <div v-if="msgObj && msgObj.msgType === MSG_TYPE.IM_MSG_TYPE_VIDEO" class="msg-text-batch msg-video" >
                            <!-- TODO 上传未成功是的截图 未完成 暂时取消update状态-->
                            <i class="el-icon-delete" @click="msgObj = null"></i>
                            <video width="400" controls>
                                <source :src="JSON.parse(msgObj.message).url" type="video/mp4">
                            </video>
                 </div>
                 <div v-if="msgObj && msgObj.msgType === MSG_TYPE.IM_MSG_TYPE_FILE" class="msg-file" >
                            <div class="contents">
                               
                                <div class="info">
                                    <i class="el-icon-delete" @click="msgObj = null"></i>
                                    <!-- <i class="el-icon-download" @click="downloadFile(JSON.parse(msgObj.message))" ></i> -->
                                    <img :src="require('@/assets/svg/pdf-other.svg')" alt="" class="icon-file">
                                    <div class="info-file">
                                        <div class="name">{{JSON.parse(msgObj.message).fileName}}</div>
                                        <div class="size">{{formatFileSize(JSON.parse(msgObj.message).size)}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                <div class="msg-text-batch" v-if="msgObj && msgObj.msgType === MSG_TYPE.IM_MSG_BUSINESS_CARD">
                    <i class="el-icon-delete" @click="msgObj = null"></i>
                    <div class="im-business-card">
                                <div class="chat-avatar">
                                    <img v-if="JSON.parse(msgObj.message).message.photo" :src="JSON.parse(msgObj.message).message.photo" alt="">
                                    <p v-else>{{JSON.parse(msgObj.message).message.nikeName&&JSON.parse(msgObj.message).message.nikeName.slice(0,3)}}</p>
                                </div>
                                <div class="chat-desc">
                                    <p>{{JSON.parse(msgObj.message).message.nikeName}}</p>
                                </div>
                    </div>
                </div>
                
            </div>
        <send-msg @sendBusinessCard="sendBusinessCard"  @chooseFile="chooseFile"  v-if="!msgObj" class='batch-msg' @sendRecord="sendRecord"  @sendMsgs="sendMsgs"  :keypressMsg='keypressMsg' @keypressMsgChange='keypressMsgChange' ></send-msg>
    </div>
</template>
<script>
import {  mapGetters } from 'vuex'
import SendMsg from '@/components/Chat/components/sendMsg'
import { batchSendMessage, batchMessage, delBatchMessage , goimfilesUpload, clearBatchMessage} from "@/services";

import MSG_TYPE ,{ handleMessage,decrypt } from "../../services/im/constant" //调试用
export default {
    components: {
        SendMsg
    },
    data() {
        return {
            MSG_TYPE,
            listMsg : [],
            keypressMsg:false,
            name: "",
            inSearchFouc: false,
            allContent: false,
            allMembers: 0,
            allReceiver: [],
            addBatch: false,
            selList: [],
            selectMemberList: [],
            msgObj : null,
            batchMessages : [],
            detailBatch : null,
            sendVoice:false,
            voiceContent:'',
            businessCard : false,
        }
    },
     computed: {
        ...mapGetters([
            'friends',
            'userInfo'
        ]),
        
    },
    methods: {
        saveAs(data, name) {
            const urlObject = window.URL || window.webkitURL || window;
            const export_blob = new Blob([data]);
            const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = urlObject.createObjectURL(export_blob);
            save_link.download = name;
            save_link.click();
        },
        downloadUrlFile(url, fileName) {
            const url2 = url.replace(/\\/g, '/');
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url2, true);
            xhr.responseType = 'blob';
            //xhr.setRequestHeader('Authorization', 'Basic a2VybWl0Omtlcm1pdA==');
            // 为了避免大文件影响用户体验，建议加loading
            xhr.onload = () => {
                if (xhr.status === 200) {
                    // 获取文件blob数据并保存
                    this.saveAs(xhr.response, fileName);
                }
            };
            xhr.send();
        },
        downloadFile(msg){
            let { picUrl,url,fileName,ext } = msg
            if(!fileName){
                    fileName=this.$t('appName')+'_'+this.filterDate(parseInt(new Date().getTime()))+ext
            }
            this.downloadUrlFile(picUrl||url, fileName)
        },
        async chooseFile(file, localPath, status) {
            var loaded = 0;
            var chunkSize = 500000;
            let form = new FormData();
            form.append("file", file);
            form.append("fileType", 2); 
            form.append("from", this.userInfo.id+""); 
            
            let res = await goimfilesUpload(form)
            if(res.success){
                let data = res.data;
                if (MSG_TYPE.REG_IMAGE.test(file.type)) {
                    let msgObj = {
                        msgType : MSG_TYPE.IM_MSG_TYPE_PICTURE,
                        message : JSON.stringify(data)
                    }
                    this.updateValue(msgObj)
                }
                if (MSG_TYPE.REG_VIDEO.test(file.type)) {
                    let msg = {
                        width: data.width,
                        height: data.height,
                        thumbUrl: data.thumbUrl,
                        thumbWidth: data.thumbWidth,
                        thumbHeight: data.thumbHeight,
                        url: data.url,
                        duration: data.duration,
                        size: (data.size / 1024 / 1024).toFixed(2)
                    };
                    let msgObj = {
                        msgType : MSG_TYPE.IM_MSG_TYPE_VIDEO,
                        message : JSON.stringify(msg)
                    }
                    this.updateValue(msgObj)
                }
                if (status==3){
                    let msg = {

                        littlePicSizeWidth: data.width,
                        littlePicSizeHeight: data.height,
                        littlePicUrl: data.thumbUrl,
                        picSizeWidth: data.thumbWidth,
                        picSizeHeight: data.thumbHeight,
                        picUrl: data.url,
                        duration: data.duration,
                        size: data.size,
                        fileName: data.fileName
                    }; 
                    let msgObj = {
                        msgType : MSG_TYPE.IM_MSG_TYPE_FILE,
                        message : JSON.stringify(msg)
                    }
                    this.updateValue(msgObj)
                }
            }
            
        },

        sendRecord(content,activeRecord){
            this.sendVoice=activeRecord
            this.voiceContent=content
        },
        
        async sendVoiceF(file, localPath) {
              
           
            let form = new FormData();
            form.append("file", file);
            
            // 1头像 2消息内容
            // 1 avatar 2 message content
            form.append("fileType", 2); 
            // 发送人id(Sender id)
            // sender id (Sender id)
            form.append("from", this.userInfo.id+""); 
            // 私聊接收人id，群聊群id(Private chat recipient id or group chat group id)
            // Private chat recipient id, group chat group id (Private chat recipient id or group chat group id)
            let res = await goimfilesUpload(form)
            if(res.success){
                let data = res.data;
                let msg = {};
                var mp3file =data.url;

                // Create an instance of AudioContext
                var audioContext = new (window.AudioContext || window.webkitAudioContext)();

                // Open an Http Request
                var request = new XMLHttpRequest();
                request.open('GET', mp3file, true);
                request.responseType = 'arraybuffer';
                let that = this
                request.onload = await function() {
                    audioContext.decodeAudioData(request.response, async function(buffer) {
                        // Obtain the duration in seconds of the audio file (with milliseconds as well, a float value)
                        data.duration = buffer.duration.toFixed(6);

                        let isPic;
                        //图片
                        //voice
                            msg = {
                                littlePicSizeWidth: data.width,
                                littlePicSizeHeight: data.height,
                                littlePicUrl: data.thumbUrl,
                                picSizeWidth: data.thumbWidth,
                                picSizeHeight: data.thumbHeight,
                                picUrl: data.url,
                                duration: data.duration,
                                size: data.size,
                                width: data.width,
                                ext: data.ext,
                                height: data.height,
                                thumbUrl: data.thumbUrl,
                                thumbWidth: data.thumbWidth,
                                thumbHeight: data.thumbHeight,
                                url: data.url
                            };
                            let msgObj = {
                                msgType : MSG_TYPE.IM_MSG_TYPE_VOICE,
                                message : JSON.stringify(msg)
                            }
                            that.updateValue(msgObj)
                            
                        
                    });
                };
                request.send()
                
            }
        },
        removeMsgObj(){
            this.msgObj = null
            this.$emit('msgObjUpdate', null)
        },
        updateValue(msgObj){
            this.msgObj = msgObj
            this.$emit('msgObjUpdate', msgObj)
        },
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
		},
        sendBusinessCard(friend){
            this.businessCard=true
            this.sendMsgs(friend)
            
        },
        async sendMsgs(content){
            if(this.sendVoice){
                        let fileName=this.$t('appName')+'.wav'
                        this.sendVoiceF(new File([this.voiceContent], fileName),this.getObjectURL(this.voiceContent))
            }else if (content){ 
                if(this.businessCard){
                            let msgContent = {
                                friendId : content.id,
                                photo:content.photo,
                                nikeName:content.nikeName
                            }
                            let message = {
                                message : msgContent
                            }
                            this.msgObj = {
                                msgType : MSG_TYPE.IM_MSG_BUSINESS_CARD,
                                message: JSON.stringify(message)
                            }
                            this.businessCard = false
                }else{
                    let message = {
                        message : content
                    }
                    this.msgObj = {
                        msgType : MSG_TYPE.IM_MSG_TYPE_TEXT,
                        message : JSON.stringify(message)
                    }
                }
                
            }
                    
            this.updateValue(this.msgObj)
        },
        keypressMsgChange(val){
            this.keypressMsg=val
        },
    }
}
</script>
<style lang="scss" scoped>
    .text-area-msg {
       background: #fff;
        margin: 20px auto;
        width: 500px;
        position: relative;
        border-radius: 10px;
        padding: 15px;
        .msg-text-batch {
            padding: 10px;
            &.msg-video,&.msg-picture{
                text-align: center;
            }
            img{
                width: 400px;
                margin: 0 5%;
                border-radius: 10px;
                margin-top: 30px;
                box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            }
            video {
                width: 400px;
                margin-top: 24px;
                border-radius: 10px;
            }
           
            i{
                position: absolute;
                right: 19px;
                color: red;
                cursor: pointer;
            }
                .vueAudioBetter{
                    position: relative;
                    .operate span:last-child{
                        bottom: 0;
                    }
                }
        }
    }
    .im-business-card {
                        display: flex;
                        cursor: pointer;
                        background: #F0F1F4;
                        width: 165px;
                        padding: 4px;
                        border-radius: 15px;
                    .chat-avatar {
                        width: 35px;
                        height: 35px;

                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                            margin-top: 0px;
                        }

                        p {
                            border-radius: 50%;
                            width: 35px;
                            height: 35px;
                            font-size: 12px;
                            color: var(--primary-color);
                            background: #e5e4e8;
                            font-weight: bold;
                            text-align: center;
                            line-height: 35px;
                        }
                    }
                    .chat-desc{
                        p {
                            margin-left: 7px;
                            position: relative;
                            top: 5px;
                        }
                    }
                    
                }
     .msg-file{
                position: relative;
                max-width: 500px;
                background: #f3f6f9;
                border-radius: 5px;
                cursor: pointer;
                    i{
                        float: right;
                        margin-left: 10px;
                        position: relative;
                        top: 8px;
                        color: blue;
                        &.el-icon-delete{
                            color: red;
                        }
                    }
                    &.quote-file {

                        border-radius: 0!important;
                        background: transparent!important;
                        .contents{
                                padding: 0 !important;
                                margin: 0!important;
                            img{
                                display: inline-block;
                            }
                            .info{
                                display: inline-block;
                                .name{
                                    color: #B7D5F7 !important;
                                    font-size: 13px;
                                    margin: 0;
                                }
                            }
                        }
                        
                    }
                    .contents{
                        
                        padding: 10px;
                        align-items: center;
                        &:hover .type .downit{
                            display: block;
                        }
                        .type{
                            
                            .downit{
                                
                                .icone{
                                }
                            }
                            svg{
                                
                            }
                        }
                        .info{
                            .name{
                                color: #000;
                                font-size: 15px;
                            }
                            .size{
                                font-size: 10px;
                                color: #B3B3B3;
                            }
                            .info-file{
                                display: inline-block;
                                padding-left: 5px;
                            }
                        }
                    }
                }
</style>