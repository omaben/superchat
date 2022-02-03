<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
                <div class="member-name">
                    <div class="receivers">
                        <div class="receiver-avatar" :style="{'margin-left': 0, 'z-index':receivers.length + 1}" @click="resendToMembersFun(item)">
                            <img  :src="require('@/assets/svg/create-batch.svg')" alt="">
                        </div>
                        <div class="receiver-avatar" :style="{'z-index':receivers.length - index}" v-for="(receiver,index) in receivers" :key="index">
                           <img v-if="receiver.photo" :src="receiver.photo" alt="">
                           
                           <p v-else :index="index">{{receiver.nikeName.slice(0,2)}}</p>
                            
                           
                        </div>
                    </div>
                    <span> - {{item.memberNum}} {{$t('people')}}</span>
                </div>
            <el-button style="float: right; padding: 3px 0" type="text" @click="resendBatchFun(item)">
                <img  :src="require('@/assets/svg/loading-batch.svg')" alt="">
            </el-button>
        </div>
        <div  class="text item">
            <p v-if="item.msgType === MSG_TYPE.IM_MSG_TYPE_TEXT">
                {{JSON.parse(item.message).message}}
            </p>
            <div v-if="item.msgType === MSG_TYPE.IM_MSG_TYPE_VOICE" class=" msg-text-batch msg-picture msg-voice" >
                <mini-audio :audio-source="JSON.parse(item.message).picUrl || JSON.parse(item.message).url" ></mini-audio>
            </div>
            <div v-if="item.msgType === MSG_TYPE.IM_MSG_TYPE_PICTURE" class="msg-text-batch msg-picture" >
                <img
                    :src="item.isLocal?(JSON.parse(item.message).picUrl ||JSON.parse(item.message).url):(JSON.parse(item.message).picUrl ||JSON.parse(item.message).url)"
                    :style="{
                        width:JSON.parse(item.message).picSizeWidth,
                        height:JSON.parse(item.message).picSizeHeight
                    }"
                />
            </div>
            <div v-if="item.msgType === MSG_TYPE.IM_MSG_TYPE_VIDEO" class="msg-text-batch msg-video" >
                <video width="400" controls>
                    <source :src="JSON.parse(item.message).url" type="video/mp4">
                    </video>
            </div>
            <div v-if=" item.msgType === MSG_TYPE.IM_MSG_TYPE_FILE" class="msg-file" >
                <div class="contents">
                    <div class="info">
                        <img :src="require('@/assets/svg/pdf-other.svg')" alt="" class="icon-file">
                        <div class="info-file">
                            <div class="name">{{JSON.parse(item.message).fileName}}</div>
                            <div class="size">{{formatFileSize(JSON.parse(item.message).size)}}</div>
                         </div>
                    </div>
                </div>
            </div>
            <div class="msg-text-batch" v-if="item && item.msgType === MSG_TYPE.IM_MSG_BUSINESS_CARD">
                    <div class="im-business-card">
                                <div class="chat-avatar">
                                    <img v-if="JSON.parse(item.message).message.photo" :src="JSON.parse(item.message).message.photo" alt="">
                                    <p v-else>{{JSON.parse(item.message).message.nikeName&&JSON.parse(item.message).message.nikeName.slice(0,3)}}</p>
                                </div>
                                <div class="chat-desc">
                                    <p>{{JSON.parse(item.message).message.nikeName}}</p>
                                </div>
                    </div>
                </div>
            <p class="time-send-batch"> {{item.createTime  | fromNow}}</p>
        </div>
    </el-card>
</template>
<script>
    import {  mapGetters } from 'vuex'

    import MSG_TYPE ,{ handleMessage,decrypt } from "../../services/im/constant" //调试用
    export default {
        props: ["item","receivers"],
    
        components: {
            
        },
        data() {
            return {
                MSG_TYPE,
            }
        },
        methods: {
            resendBatchFun(item){
                this.$emit('resendBatchFun', item)
            },
            resendToMembersFun(item){
                this.$emit('resendToMembersFun', item)
            }
           
        }
    }
</script>
<style lang="scss" scoped>
    .box-card {
        width: 94%;
        margin-left: 3%;
        margin-top: 15px;
        video{
            margin: 0;
        }
        .el-card__header{
            padding: 5px 10px;
            i{
                margin-left: 10px;
            }
            .member-name{
                overflow: hidden;
                word-break: keep-all;
                text-overflow: ellipsis;
                max-width: 340px;
                white-space: nowrap;
                display: inline-flex;
                span{
                    color: #9DA2A5;
                    font-size: 11pt;
                    position: relative;
                    top: 8pt;
                    margin-left: 20px;

                }
            }
            .receiver-avatar {
                display: inline-flex;
                position: relative;
                width: 26px;
                cursor: pointer;
                top: 4pt;
                margin-left: -13px;
                img {
                    width: 26px !important;
                    height: 26px !important;
                    position: relative;
                    border-radius: 50%;
                }
                p {
                    border-radius: 50%;
                    width: 26px;
                    height: 26px;
                    font-size: 10px;
                    color: var(--primary-color);
                    font-weight: bold;
                    text-align: center;
                    line-height: 26px;
                    padding-left: 8px;
                    cursor: pointer;
                    position: relative;
                    top: -9px;
                    &:before {content: '';width: 26px;height: 26px;background: #e5e4e8;position: absolute;border-radius: 50%;z-index: -1;left: 0;}

                }
            }
        }
        .el-card__body {
            padding: 0px;
            .text.item p{
                padding: 15px;
                font-size: 15px;
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
                .text-area-msg {
                    border-top: 1px solid #ddd;
                    .msg-picture {
                        text-align: center;
                        img{
                            width: 90%;
                            margin: 0 5%;
                            border-radius: 5px;
                            margin-top: 30px;
                            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
                        }
                    }
                    
                }
        }
    } 
    p.time-send-batch {
        padding: 7px !important;
        text-align: right;
        font-size: 11px !important;
        color: #B3B3B3;
        padding-right: 15px !important;
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
                            font-size: 12px !important;
                            color: var(--primary-color);
                            background: #e5e4e8;
                            font-weight: bold;
                            text-align: center;
                            line-height: 35px;
                            padding: 0 !important;
                        }
                    }
                    .chat-desc{
                        p {
                           margin-left: 7px;
                            position: relative;
                            top: 11px;
                            padding: 0 !important;
                        }
                    }
                    
                }
.msg-text-batch {
    padding: 11px !important;
}
</style>