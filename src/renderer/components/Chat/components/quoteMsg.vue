<template>
    <div class="chat-quote" v-if="isShow">
        <div class="quote-del">
            <i class="el-icon-circle-close" @click="delQuote"></i>
        </div>
        <div class="quote-content" @click="showQuote()">
            <div v-if="quotes.msgType==MSG_TYPE.IM_MSG_TYPE_TEXT || (quotes.msgType==MSG_TYPE.IM_MSG_TYPE_QUOTE&&quotes.replyType==MSG_TYPE.IM_MSG_TYPE_TEXT)" 
                class="quote-text">
                <div class="name">
                    {{quotes.name}}
                </div>
                <div class="content">
                    {{quotes.message}}
                </div>
            </div>
             <div v-if="quotes.msgType === MSG_TYPE.IM_MSG_BUSINESS_CARD" class="quote-text">
                    <div class="im-business-card">
                        <div class="chat-avatar">
                            <img v-if="quotes.message.photo" :src="quotes.message.photo" alt="">
                            <p v-else>{{quotes.message.nikeName.slice(0,3)}}</p>
                        </div>
                        <div class="chat-desc">
                            <p>{{quotes.message.nikeName}}</p>
                        </div>
                    </div>
            </div>
            <div v-if="quotes.msgType==MSG_TYPE.IM_MSG_TYPE_PICTURE || (quotes.msgType==MSG_TYPE.IM_MSG_TYPE_QUOTE&&quotes.replyType==MSG_TYPE.IM_MSG_TYPE_PICTURE)" class="quote-img">
                <div class="left">
                    <img :src="quotes.msg&&(quotes.msg.picUrl ||quotes.msg.url)" alt="">
                </div>
                <div class="right">
                    <div class="name">
                        {{quotes.name}}
                    </div>
                    <div class="content">
                        {{$t('aPhoto')}}
                    </div>
                </div>
            </div>
            <div v-if="quotes.msgType==MSG_TYPE.IM_MSG_TYPE_VOICE || (quotes.msgType==MSG_TYPE.IM_MSG_TYPE_QUOTE&&quotes.replyType==MSG_TYPE.IM_MSG_TYPE_VOICE)" 
                class="quote-text">
                <div class="name">
                    {{quotes.name}}
                </div>
                <div class="content">
                    {{$t('voice')}}
                </div>
            </div>
            <div v-if="quotes.msgType==MSG_TYPE.IM_MSG_TYPE_VIDEO || (quotes.msgType==MSG_TYPE.IM_MSG_TYPE_QUOTE&&quotes.replyType==MSG_TYPE.IM_MSG_TYPE_VIDEO)" class="quote-img">
                <div class="left">
                    <img :src="quotes.msg&&quotes.msg.littlePicUrl" alt="">
                </div>
                <div class="right">
                    <div class="name">
                        {{quotes.name}}
                    </div>
                    <div class="content">
                        {{$t('aVideo')}}
                    </div>
                </div>

            </div>
            <div v-if="quotes.msgType==MSG_TYPE.IM_MSG_TYPE_FILE || (quotes.msgType==MSG_TYPE.IM_MSG_TYPE_QUOTE&&quotes.replyType==MSG_TYPE.IM_MSG_TYPE_FILE)" class="quote-img">
                
                <div class="right">
                    <div class="name">
                        {{quotes.name}}
                    </div>
                    <div class="content">
                        <img :src="require('@/assets/svg/pdf-other.svg')" alt=""> {{quotes.msg.fileName|| $t('aFile')}}
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MSG_TYPE from "@/services/im/constant";
export default {
    data() {
        return {
            quotes: {},
            isShow: false,
            MSG_TYPE,

        }
    },
    computed: {
        ...mapGetters([
            'chatInfo',
            'userInfo',
        ]),
    },
    mounted() {
        this.dealEmit()
    },
    methods: {
        dealEmit(){
            this.$bus.$off('quote_msg')
            this.$bus.$on('quote_msg', data => {
                this.setItem(data)
               
            })
            this.$bus.$off('closeQuote')
            this.$bus.$on('closeQuote', () => {
                this.delQuote()
            })
            

        },
        setItem(val){
            if(val){
                this.$bus.$emit("placeHeight", 150)
                this.$bus.$emit("isShowQuote", true)
                this.isShow = true
                // if(val.isMine==MSG_TYPE.IS_MINE){}
                 
                this.quotes = {
                    ...val,
                    name: val.isMine==MSG_TYPE.IS_MINE?(this.userInfo.nikeName||this.userInfo.account):(val.nikeName || val.senderName)
                }

            }else{
                this.isShow = false
                this.$bus.$emit("isShowQuote", false)
            }

        },
        delQuote(){
            this.isShow = false
            this.$bus.$emit("isShowQuote", false)
            this.$bus.$emit("placeHeight", 80)
        },
        showQuote(){
            this.$bus.$emit("atQuote", this.quotes.msgId)
        }
    },
}
</script>

<style lang="scss" scoped>
    .chat-quote{
        display: flex;
        background: #fff;
        height: 60px;
        margin-right: 0;
        margin-left: 0;
        position: relative;
        bottom: 0;
        border-top-left-radius: 11px;
        border-top-right-radius: 11px;
        .quote-del{
                width: 30px;
                height: 60px;
                margin-right: 10px;
                line-height: 70px;
                position: absolute;
                right: 0;
            i{
                cursor: pointer;
                font-size: 30px;
            }
        }
        .quote-content{
            width: calc(100% - 60px);
            cursor: pointer;
            border-left: 4px solid #e0e3e5;
            padding-left: 10px;
            align-items: center;
            display: flex;
            border-top-left-radius: 11px;
            .quote-text{
                display: flex;
                flex-direction: column;
                width: 100%;
                .name{
                    font-size: 20px;
                    font-weight: 500;
                    color: var(--primary-color);
                    margin-bottom: 5px;
                }
                .content{
                    min-height: 20px;
                    font-size: 16px;
                    overflow: hidden;
                    word-break: keep-all;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            .quote-img{
                display: flex;
                .left{
                    img{
                        width: 50px;
                        height: 50px;
                        margin-right: 10px;
                    }
                    svg{
                        font-size: 40px;
                        color: var(--primary-color);
                        margin-top: 5px;
                        margin-right: 10px;
                    }
                }
                .right{
                    .name{
                        font-size: 20px;
                        font-weight: 500;
                        color: var(--primary-color);
                        margin-bottom: 5px;
                    }
                    .content{
                        img{
                            width: 12px;
                        }
                        font-size: 16px;
                        min-height: 20px;
                    }
                }
            }
        }

    }
    .vueAudioBetter.quotes-audio {
        margin: 0;
        height: 27px;
        box-shadow: none;
    }
    .msg-file.quote-file .info .size {
        margin-bottom: 10px!important;
    }

    .msg-file.quote-file .contents {
        margin-bottom: 8px;
    }
    .im-business-card {
                    display: flex;
                    cursor: pointer;
                    .chat-avatar {
                        width: 35px;
                        height: 35px;

                        img {
                            width: 100% !important;
                            height: 100% !important;
                            border-radius: 50%;
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
</style>