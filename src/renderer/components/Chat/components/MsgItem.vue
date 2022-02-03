<template>
    <!-- 消息列表-item -->
    <!-- v-if="msgObj.message" 去掉message没有的内容 -->
    <div >
       
        <div class="msg-item"  @click="handleClick" :id="msgObj.msgId" v-if="msgObj.msg!='' && msgObj.msg.noticeType!=MSG_TYPE.MESSAGE_READ_RECEIPT" >
            <!-- v-if="msgObj.isMine===MSG_TYPE.IS_MINE||msgObj.isMine===MSG_TYPE.NO_MINE" -->
            <!--  <div>{{msgObj}}</div>  -->
            <!-- <div>{{msgObj.msgId}}</div> -->
            <!-- <div>{{mineRole}}</div> -->
            <div v-if="!msgObj.isTips"
                :class="{'im-self':msgObj.isMine===MSG_TYPE.IS_MINE,'im-other':msgObj.isMine !== MSG_TYPE.IS_MINE}"
            >
                <el-checkbox v-model="checkedSelect" :id='"check_"+msgObj.msgId' @change="checkMsg(msgObj.msgId)" class="check-select"></el-checkbox>
            
                <div class="avatar" ref='msgItem'  @contextmenu="rightPoint($event)" v-if="msgObj.isMine !== MSG_TYPE.IS_MINE ">
                    <div v-show="msgObj.isVisible">
                        <el-avatar v-if="getPhoto(msgObj.senderId)"  :src="getPhoto(msgObj.senderId)"></el-avatar>
                        <el-avatar   v-else >{{getName(msgObj.senderId) ? getName(msgObj.senderId).slice(0,2) : msgObj.senderName.slice(0,2)}}</el-avatar>
                            
                    </div>
                </div>
                
                <div ref="customRef" class="msg-item-body">
                    <div class="pops" >
                            <el-popover 
                                placement="left-end" 
                                width="120" 
                                v-model="isVisible"
                                ref="popover"
                                trigger="click">
                                 <!-- v-clipboard:copy="msgObj.msg" v-clipboard:success="onCopy" v-clipboard:error="onError" -->
                                <p class="add-chat-item" @click="copyImg(msgObj.msg)" v-if="msgObj.msgType === MSG_TYPE.IM_MSG_TYPE_PICTURE" >
                                    {{$t('copyImg')}}
                                </p>
                                <p class="add-chat-item" v-clipboard:copy="msgObj.msg.message" v-clipboard:success="onCopy" v-clipboard:error="onError" v-if="msgObj.msgType === MSG_TYPE.IM_MSG_TYPE_TEXT || msgObj.msgType === MSG_TYPE.IM_MSG_TYPE_ANALOG">
                                    {{$t('copy')}}
                                </p>
                                <p class="add-chat-item" @click="downloadFile(msgObj.msg)" v-if="msgObj.msgType === MSG_TYPE.IM_MSG_TYPE_PICTURE || msgObj.msgType === MSG_TYPE.IM_MSG_TYPE_VOICE">
                                    {{$t('download')}}
                                </p>
                                <!-- <p class="add-chat-item" @click="edit()" v-if="msgObj.msgType === MSG_TYPE.IM_MSG_TYPE_TEXT || msgObj.msgType === MSG_TYPE.IM_MSG_TYPE_ANALOG">
                                    {{$t('Edit')}}
                                </p> -->
                                <p class="add-chat-item" @click="makeQuotesMsg()" >
                                    {{$t('quote')}}
                                </p>
                               <!--  <p class="add-chat-item" @click="copy()" v-if="msgObj.isMine === MSG_TYPE.IS_MINE">
                                    {{$t('Forward')}}
                                </p> -->
                                <!-- <p class="add-chat-item" @click="copy()">
                                    {{$t('Add bookmark')}}
                                </p> -->
                                <p class="add-chat-item" @click="selectMsg(msgObj.msgId)">
                                    {{$t('selectMessage')}}
                                </p>
                                <p class="add-chat-item" @click="deleteMsg(msgObj)">
                                    {{$t('delete')}}
                                </p>
                                <p class="add-chat-item" @click="turnMsg()" v-if="msgObj.isMine === MSG_TYPE.IS_MINE || this.chatInfo.groupRole !=1">
                                    {{$t('withdraw')}}
                                </p><!-- 
                                <p class="add-chat-item" @click.stop="turnMsg()">
                                    回撤
                                </p> -->
                                <div slot="reference">
                                    <i class="el-icon-more-outline menumessage"></i>
                                </div>
                            </el-popover>
                        </div>
                    <div class="im-box">
                        <div class="msg-line name-sender" v-if="msgObj.isMine === MSG_TYPE.NO_MINE">{{getName(msgObj.senderId) ? getName(msgObj.senderId) : msgObj.senderName}}</div>
                        <div v-if="msgObj.msgType === MSG_TYPE.IM_MSG_TYPE_TEXT "
                            :id="msgObj.msgId"
                            class="im-content"
                            :class="{'msg-with-border':senderBefore===false && msgObj.isMine===MSG_TYPE.NO_MINE,'msg-with-border-mine':senderAfter===false && msgObj.isMine===MSG_TYPE.IS_MINE}"
                            >
                             <!-- 这里不能留空格 -->
                            <div class="msg-text" :id="'msg_'+msgObj.msgId" :class="{'searchActive':findSearch(msgObj)}">
                
                            <text-highlight :queries="getMsg(msgObj)">{{ msgObj.message }}</text-highlight>
                            </div>
                            <div class="msg-line"  :class="{'read': msgObj.isMine===MSG_TYPE.IS_MINE&&msgObj.isRead&&msgObj.roomType===MSG_TYPE.RECEIVE_TYPE_PRIVATE}">{{msgObj.sendTime | filterDate('HH:mm')}}</div>

                        </div>
                        <div v-if="msgObj.msgType === MSG_TYPE.IM_MSG_TYPE_REDBAG"
                            :id="msgObj.msgId"
                            class="im-content red-packet-box"
                            :class="{'opened':msgObj.redStatus=== 2,'expired':msgObj.redStatus=== 3 || (msgObj.redStatus!=2 && NowTime>(msgObj.sendTime + 24*60*60*1000)),'msg-with-border':senderBefore===false && msgObj.isMine===MSG_TYPE.NO_MINE,'msg-with-border-mine':senderAfter===false && msgObj.isMine===MSG_TYPE.IS_MINE}"
                            
                        >
                            <div class="red-packet"  @click="openRedPacketFun(msgObj.msg.id)" >
                                <div class="chat-avatar">
                                    
                                    <img :src="msgObj.redStatus=== 2 ?require('@/assets/svg/openedico.svg'): require('@/assets/svg/envelope-normal.svg')" alt="">
                                </div>
                                <div class="chat-desc">
                                    <p>{{msgObj.msg.remark || $t('best_wishes')}}</p>
                                    <p class="status" v-if="msgObj.redStatus !=2 && msgObj.redStatus !=3 && NowTime<(msgObj.sendTime + 24*60*60*1000)">{{$t('red_envelop')}}</p>
                                    <p class="status" v-else>{{msgObj.redStatus=== 2 ? $t('opened') : $t('expired')}}</p>
                                </div>
                            </div>
                            <div class="msg-line" :class="{'read': msgObj.isMine===MSG_TYPE.IS_MINE&&msgObj.isRead&&msgObj.roomType===MSG_TYPE.RECEIVE_TYPE_PRIVATE}">{{msgObj.sendTime | filterDate('HH:mm')}}</div>

                        </div>                        
                        <div v-if="msgObj.msgType === MSG_TYPE.IM_MSG_BUSINESS_CARD"
                            :id="msgObj.msgId"
                            class="im-content"
                            @click="showBusinessCard(msgObj.message)"
                            :class="{'msg-with-border':senderBefore===false && msgObj.isMine===MSG_TYPE.NO_MINE,'msg-with-border-mine':senderAfter===false && msgObj.isMine===MSG_TYPE.IS_MINE}"
                            >
                            <div class="im-business-card">
                                <div class="chat-avatar">
                                    <img v-if="msgObj.message.photo" :src="msgObj.message.photo" alt="">
                                    <p v-else>{{msgObj.message.nikeName&&msgObj.message.nikeName.slice(0,3)}}</p>
                                </div>
                                <div class="chat-desc">
                                    <p>{{msgObj.message.nikeName}}</p>
                                </div>
                            </div>
                            
                             <!-- 这里不能留空格 -->
                            <div class="msg-line" :class="{'read': msgObj.isMine===MSG_TYPE.IS_MINE&&msgObj.isRead&&msgObj.roomType===MSG_TYPE.RECEIVE_TYPE_PRIVATE}">{{msgObj.sendTime | filterDate('HH:mm')}}</div>

                        </div>
                        
                        <!-- <img src="~@/assets/404_images/404.png" alt=""> -->
                        <div v-if="msgObj.msgType === MSG_TYPE.IM_MSG_TYPE_PICTURE" class="msg-picture" @click="showMedia(1)">
                            <img
                                :src="msgObj.isLocal?(msgObj.msg.picUrl ||msgObj.msg.url):(msgObj.msg.picUrl ||msgObj.msg.url)"
                                :style="{
                                    width:msgObj.msg.picSizeWidth,
                                    height:msgObj.msg.picSizeHeight
                                }"
                            />
                            <div class="msg-line" :class="{'read': msgObj.isMine===MSG_TYPE.IS_MINE&&msgObj.isRead&&msgObj.roomType===MSG_TYPE.RECEIVE_TYPE_PRIVATE}">{{msgObj.sendTime | filterDate('HH:mm')}}</div>
                            
                            <!-- v-gallery全局弹窗有问题  -->
                                <!-- v-gallery:group1
                                :src="msgObj.isLocal?msgObj.msg.picUrl:msgObj.msg.picUrl"
                                :data-large="msgObj.isLocal?msgObj.msg.picUrl:msgObj.msg.picUrl" -->
                        </div>
                        <div v-if="msgObj.msgType === MSG_TYPE.IM_MSG_TYPE_VOICE" class="msg-picture msg-voice" :class="{'msg-with-border':senderBefore===false && msgObj.isMine===MSG_TYPE.NO_MINE,'msg-with-border-mine':senderAfter===false && msgObj.isMine===MSG_TYPE.IS_MINE}">
                                   <!-- <audio controls v-if="msgObj.msg.picUrl.includes('mp3')">
                                        <source :src="msgObj.msg.picUrl" type="audio/ogg">
                                        <source :src="msgObj.msg.picUrl" type="audio/mpeg">
                                    </audio> -->
                                    <mini-audio
                                        :audio-source="msgObj.msg.picUrl || msgObj.msg.url"
                                    ></mini-audio>
                            <div class="msg-line" :class="{'read': msgObj.isMine===MSG_TYPE.IS_MINE&&msgObj.isRead&&msgObj.roomType===MSG_TYPE.RECEIVE_TYPE_PRIVATE}">{{msgObj.sendTime | filterDate('HH:mm')}}</div>
                                                                
                            <!-- v-gallery全局弹窗有问题  -->
                                <!-- v-gallery:group1
                                :src="msgObj.isLocal?msgObj.msg.picUrl:msgObj.msg.picUrl"
                                :data-large="msgObj.isLocal?msgObj.msg.picUrl:msgObj.msg.picUrl" -->
                        </div>
                        <!-- 视频 -->
                        <div v-if="msgObj.msgType === MSG_TYPE.IM_MSG_TYPE_VIDEO" class="msg-video" @click="showMedia(2)" >
                            <!-- TODO 上传未成功是的截图 未完成 暂时取消update状态-->
                            <img :src="msgObj.msg.littlePicUrl||msgObj.msg.thumbUrl"/>
                            <img src="@/assets/svg/video.svg" alt="" class="video-icon">
                            <img src="@/assets/svg/play-video.svg" alt="" class="play-icon">
                            <div class="msg-line" :class="{'read': msgObj.isMine===MSG_TYPE.IS_MINE&&msgObj.isRead&&msgObj.roomType===MSG_TYPE.RECEIVE_TYPE_PRIVATE}">{{msgObj.sendTime | filterDate('HH:mm')}}</div>
                        </div>
                        <!-- 文件 -->
                        <div v-if="msgObj.msgType === MSG_TYPE.IM_MSG_TYPE_FILE" class="msg-file" >
                            <!-- 文件的下载 -->
                            <!-- File download -->
                            <!-- {{msgObj.fileType}} -->
                           <!--  <audio controls v-if="msgObj.msg.picUrl.includes('mp3')">
                                <source :src="msgObj.msg.picUrl" type="audio/ogg">
                                <source :src="msgObj.msg.picUrl" type="audio/mpeg">
                            </audio> -->
                           
                            <div class="contents" :class="{'msg-with-border':senderBefore===false && msgObj.isMine===MSG_TYPE.NO_MINE,'msg-with-border-mine':senderAfter===false && msgObj.isMine===MSG_TYPE.IS_MINE}">
                               
                                <div class="info"  @click="downloadFile(msgObj.msg)">
                                    <img :src="msgObj.isMine===MSG_TYPE.IS_MINE?require('@/assets/svg/pdf.svg'):require('@/assets/svg/pdf-other.svg')" alt="" class="icon-file">
                                    <div class="info-file">
                                        <div class="name">{{msgObj.msg.fileName}}</div>
                                        <div class="size">{{formatFileSize(msgObj.msg.size)}}</div>
                                    </div>
                                </div>
                                <div class="msg-line" :class="{'read': msgObj.isMine===MSG_TYPE.IS_MINE&&msgObj.isRead&&msgObj.roomType===MSG_TYPE.RECEIVE_TYPE_PRIVATE}">{{msgObj.sendTime | filterDate('HH:mm')}}</div>

                            </div>
                        </div>

                        <!-- 群聊已读详情 -->
                        <!-- Group chat has read details
                        <div class="msg-room-read" @click="roomReadInfo(msgObj)" v-if="msgObj.roomType===MSG_TYPE.RECEIVE_TYPE_PUBLIC&&mineRole!==1">
                            <svg-icon icon-class="yidu1" style=""></svg-icon>
                        </div> 
                        消息已读展示 -->
                        <!-- Message has been read display -->
                        
                        <!-- 消息发送失败 -->
                        <!-- Message sending failed -->
                        <div class="msg-send-faild" v-if="!msgObj.isSendFaild" @click="resend(msgObj)">
                            <svg-icon icon-class="shibai" v-if="msgObj.isResending==1"></svg-icon>
                            <i class="el-icon-loading" v-if="msgObj.isResending==3"></i>
                        </div>
                        

                        <!-- 消息扩展栏 -->
                        <!-- Message extension bar -->
                        

                        <!-- 引用消息列 -->
                        <!-- Quote message column -->
                       
                        <div class="msg-quote" v-if="msgObj.msgType === MSG_TYPE.IM_MSG_TYPE_QUOTE && quotes" :class="{'no-background' : msgObj.replyType==MSG_TYPE.IM_MSG_TYPE_VIDEO || msgObj.replyType==MSG_TYPE.IM_MSG_TYPE_PICTURE,'red-packet-white':quotes.msgType==MSG_TYPE.IM_MSG_TYPE_REDBAG}">
                             <div class="quote-content" @click="showQuote()" :class="{'red-packet-bo':quotes.msgType==MSG_TYPE.IM_MSG_TYPE_REDBAG}">
                                <div class="quote-cont">
                                    <div class="quote-txt" v-if="quotes.msgType!=MSG_TYPE.IM_MSG_TYPE_REDBAG">{{quotes.isMine===MSG_TYPE.IS_MINE?$t('you'):quotes.senderName}}</div>
                                    <div class="quote-txt" v-if="quotes.msgType==MSG_TYPE.IM_MSG_TYPE_TEXT || quotes.replyType==MSG_TYPE.IM_MSG_TYPE_TEXT">{{entitiesToUtf16(quotes.message)}}</div>
                                    <div class="quote-video" v-if="quotes.msgType==MSG_TYPE.IM_MSG_TYPE_PICTURE || quotes.replyType==MSG_TYPE.IM_MSG_TYPE_PICTURE">
                                        
                                        <div class="type-msg-quote">
                                            <img  :src="msgObj.isMine===MSG_TYPE.IS_MINE?require('@/assets/svg/pic-quote-blue.svg'):require('@/assets/svg/pic-quote.svg')" alt="" class="voice-pic icon-file">
                                            <span>{{$t('picture')}}</span>
                                        </div>
                                        <div class="video-quote">
                                            <img :src="quotes.msg.picUrl||quotes.msg.url" alt="">
                                        </div>
                                    </div>
                                    <div class="quote-txt" v-if="quotes.msgType==MSG_TYPE.IM_MSG_BUSINESS_CARD || quotes.replyType==MSG_TYPE.IM_MSG_BUSINESS_CARD">
                                       
                                        <div class="im-business-card">
                                            <div class="chat-avatar">
                                                <img v-if="quotes.msg.message.photo" :src="quotes.msg.message.photo" alt="">
                                                <p v-else>{{quotes.msg.message.nikeName.slice(0,3)}}</p>
                                            </div>
                                            <div class="chat-desc">
                                                <p>{{quotes.msg.message.nikeName}}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="quote-txt" v-if="quotes.msgType === MSG_TYPE.IM_MSG_TYPE_REDBAG || quotes.replyType==MSG_TYPE.IM_MSG_TYPE_REDBAG"
                                    >
                                        <div class="red-packet"  >
                                            <div class="chat-avatar">
                                                
                                                <img :src="quotes.redStatus=== 2 ?require('@/assets/svg/openedico.svg'): require('@/assets/svg/envelope-normal.svg')" alt="">
                                            </div>
                                            <div class="chat-desc">
                                                <p>{{quotes.msg.remark || $t('best_wishes')}}</p>
                                                <p class="status" v-if="quotes.redStatus !=2 && quotes.redStatus !=3">{{$t('red_envelop')}}</p>
                                                <p class="status" v-else>{{quotes.redStatus=== 2 ? $t('opened') : $t('expired')}}</p>
                                            </div>
                                        </div>

                                    </div> 
                                    <div class="quote-video" v-if="quotes.msgType==MSG_TYPE.IM_MSG_TYPE_VIDEO || quotes.replyType==MSG_TYPE.IM_MSG_TYPE_VIDEO">
                                        <div class="type-msg-quote">
                                            <img  :src="msgObj.isMine===MSG_TYPE.IS_MINE?require('@/assets/svg/video-quote.svg'):require('@/assets/svg/video-quote-gray.svg')" alt="" class="voice-pic icon-file">
                                            <span>{{$t('video')}}</span>
                                        </div>
                                        <div class="video-quote">
                                            <img :src="quotes.msg.littlePicUrl||quotes.msg.thumbUrl" alt="">
                                            <svg-icon class="start" icon-class="kaishi1"></svg-icon>
                                        </div>
                                    </div>
                                    <div v-if="quotes.msgType === MSG_TYPE.IM_MSG_TYPE_VOICE" class="msg-picture">
                                        <img  :src="msgObj.isMine===MSG_TYPE.IS_MINE?require('@/assets/svg/quote-audio.svg'):require('@/assets/svg/microphone-voice-gray.svg')" alt="" class="voice-pic icon-file">
                                        <span>{{$t('voice')}}</span>
                                    </div>
                                    <div class="msg-file quote-file" v-if="quotes.msgType === MSG_TYPE.IM_MSG_TYPE_FILE || quotes.replyType==MSG_TYPE.IM_MSG_TYPE_FILE">
                                        <div class="contents">
                                            <img :src="msgObj.isMine===MSG_TYPE.IS_MINE?require('@/assets/svg/file-quote.svg'):require('@/assets/svg/file-quote-gray.svg')" alt="" class="icon-file">
                                            <div class="info">
                                                <div class="name">{{quotes.msg.fileName}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="quote-reply" :class="{'no-pad' : msgObj.replyType==MSG_TYPE.IM_MSG_TYPE_VIDEO || msgObj.replyType==MSG_TYPE.IM_MSG_TYPE_PICTURE}">
                                <div v-if="msgObj.replyType === MSG_TYPE.IM_MSG_TYPE_VOICE" class="reply-txt msg-picture msg-voice">
                                        <mini-audio :audio-source="msgObj.msg.picUrl||msgObj.msg.url"></mini-audio>
                                    </div>
                                <div class="reply-txt" v-if="msgObj.replyType==MSG_TYPE.IM_MSG_TYPE_TEXT">{{entitiesToUtf16(msgObj.message)}}</div>
                                <div class="reply-txt reply-img" v-if="msgObj.replyType==MSG_TYPE.IM_MSG_TYPE_PICTURE" @click="showMedia(1)">
                                    <img :src="msgObj.msg.picUrl||msgObj.msg.url" alt="">
                                </div>
                                <!-- <div style="margin-top: 20px;margin-bottom: 10px;"> -->
                                <div class="reply-video msg-video" v-if="msgObj.replyType==MSG_TYPE.IM_MSG_TYPE_VIDEO" @click="showMedia(2)">
                                     <img :src="msgObj.msg.littlePicUrl||msgObj.msg.thumbUrl"/>
                                    <img src="@/assets/svg/video.svg" alt="" class="video-icon">
                                    <img src="@/assets/svg/play-video.svg" alt="" class="play-icon">
                                
                                </div>
                                <div v-if="msgObj.replyType === MSG_TYPE.IM_MSG_BUSINESS_CARD"
                                    class="reply-txt"
                                    @click="showBusinessCard(msgObj.message)"
                                    >
                                    <div class="im-business-card">
                                        <div class="chat-avatar">
                                            <img v-if="msgObj.message.photo" :src="msgObj.message.photo" alt="">
                                            <p v-else>{{msgObj.message.nikeName&&msgObj.message.nikeName.slice(0,3)}}</p>
                                        </div>
                                        <div class="chat-desc">
                                            <p>{{msgObj.message.nikeName}}</p>
                                        </div>
                                    </div>
                                    
                                    <!-- 这里不能留空格 -->

                                </div>
                                <!-- </div> -->
                                <div class="msg-file reply-file" v-if="msgObj.replyType === MSG_TYPE.IM_MSG_TYPE_FILE">
                                    <div class="contents" :class="{'msg-with-border':senderBefore===false && msgObj.isMine===MSG_TYPE.NO_MINE,'msg-with-border-mine':senderAfter===false && msgObj.isMine===MSG_TYPE.IS_MINE}">
                               
                                        <div class="info"  @click="downloadFile(msgObj.msg)">
                                            <img :src="msgObj.isMine===MSG_TYPE.IS_MINE?require('@/assets/svg/pdf.svg'):require('@/assets/svg/pdf-other.svg')" alt="" class="icon-file">
                                            <div class="info-file">
                                                <div class="name">{{msgObj.msg.fileName}}</div>
                                                <div class="size">{{formatFileSize(msgObj.msg.size)}}</div>
                                            </div>
                                        </div>

                                    </div>
                                    
                                </div>

                            </div>
                                <div class="msg-line"  :class="{'read': msgObj.isMine===MSG_TYPE.IS_MINE&&msgObj.isRead&&msgObj.roomType===MSG_TYPE.RECEIVE_TYPE_PRIVATE,'pic-quote' : msgObj.replyType==MSG_TYPE.IM_MSG_TYPE_VIDEO || msgObj.replyType==MSG_TYPE.IM_MSG_TYPE_PICTURE}" v-if="msgObj.replyType!=MSG_TYPE.IM_MSG_TYPE_VIDEO || msgObj.replyType!=MSG_TYPE.IM_MSG_TYPE_PICTURE">{{msgObj.sendTime | filterDate('HH:mm')}}</div>
                                
                            <div class="msg-read" style="bottom:0px !important"  v-if="msgObj.isMine===MSG_TYPE.IS_MINE&&msgObj.isRead&&msgObj.roomType===MSG_TYPE.RECEIVE_TYPE_PRIVATE">
                                <svg-icon icon-class="yidu" style="filter: invert(1);"></svg-icon>
                            </div>
                        </div>
                        <div class="msg-read" v-if="msgObj.msgType != MSG_TYPE.IM_MSG_TYPE_QUOTE && msgObj.isMine===MSG_TYPE.IS_MINE&&msgObj.isRead&&msgObj.roomType===MSG_TYPE.RECEIVE_TYPE_PRIVATE">
                                <svg-icon icon-class="yidu" style="filter: invert(1);"></svg-icon>
                            </div>
                    </div>
                </div>                
            </div> 
            <NoticeItem  v-if="msgObj && msgObj.msgType === MSG_TYPE.IM_MSG_TYPE_NOTIFICSTION" :item="msgObj"/>
            <el-dialog
                title="Tips"
                :visible.sync="redPacketInfo"
                width="30%"
                class="red-packet"
                :class="{'open-red-packet':redPacketDetails.redStatus===2 || (msgObj.isMine===MSG_TYPE.IS_MINE && msgObj.roomType == MSG_TYPE.RECEIVE_TYPE_PRIVATE)}"
                >
                <div v-if="redPacketDetails.redStatus!=2 && ((msgObj.isMine != MSG_TYPE.IS_MINE && msgObj.roomType === MSG_TYPE.RECEIVE_TYPE_PRIVATE) || msgObj.roomType === MSG_TYPE.RECEIVE_TYPE_PUBLIC)">
                     <el-avatar :src="redPacketDetails.photo" v-if="redPacketDetails.photo"></el-avatar>
                        <el-avatar  v-else >{{redPacketDetails.nikeName && redPacketDetails.nikeName.slice(0,2)}}</el-avatar>

                        <h3>{{redPacketDetails.nikeName}}</h3>
                        <p>{{redPacketDetails.remark}}</p>
                        <img class="status" :src="redPacketDetails.redStatus===3?require('@/assets/svg/expiredStatus.svg'):require('@/assets/svg/openStatus.svg')" alt="" @click="grabRed(redPacketDetails.id)">
                </div>
                <div v-else>
                    <img class="header" :src="require('@/assets/svg/openbackred.svg')" alt="" @click="grabRed(redPacketDetails.id)">
                    <p class="title-red">{{$t('red_envelop')}}</p>
                    <el-avatar :src="redPacketDetails.photo" v-if="redPacketDetails.photo"></el-avatar>
                    <el-avatar  v-else >{{redPacketDetails.nikeName && redPacketDetails.nikeName.slice(0,2)}}</el-avatar>
                    <h3>{{redPacketDetails.nikeName}}</h3>
                    <p>{{redPacketDetails.remark}}</p>
                    <h2 class="total-amount">{{currencyRed}} {{redPacketDetails.money}}</h2>
                    <p class="desc">{{$t('red_packet_transfered')}}</p>
                    <div class="top-list-open">
                        <p>{{$t('opened')}} {{redPacketDetails.grabNum}}/{{redPacketDetails.amount}}</p>
                        <p class="right-side">
                            {{redPacketDetails.grabMoney}}/{{redPacketDetails.money}}
                        </p>
                    </div>
                    <ul class="member-in-group">
                        <li v-for="(item,index) in redPacketDetails.redLogs" :key="index">
                            <el-avatar v-if="getPhoto(item.mid)"  :src="getPhoto(item.mid)"></el-avatar>
                            <el-avatar   v-else >{{getName(item.mid) ? getName(item.mid).slice(0,2) : item.nikeName.slice(0,2)}}</el-avatar>
                            <div class="info-red">
                                <p class="name">{{getName(item.mid) || item.nikeName}}</p>
                                <p class="date">{{item.createTime*1000 | filterDate('YYYY/MM/DD HH:mm')}}</p>
                            </div>
                            <p class="price">{{item.money}}</p>
                        </li>
                    </ul>
                </div>
                </el-dialog>
        </div>
    </div>
</template>

<script>
import {
    mapGetters
} from 'vuex'
import TextHighlight from 'vue-text-highlight';

// import MSG_TYPE,{translateHTML} from "@/services/im/constant";
import MSG_TYPE,{translateHTML} from "../../../services/im/constant" //调试用
import NoticeItem from './NoticeItem'
import { imBackMessage , redInfo, redGrab} from "@/services";
import VueClipboard from 'vue-clipboard2'
import {
	chatInRoomsDAO,
	chatLocalMsgDAO,
    userListDAO,
    userListInstance
   
} from "@/services/db";

const clipboard = require('electron').clipboard
const nativeImage = require('electron').nativeImage

import {

    muteUser,
    unMuteUser
} from '@/services'
export default {
    name:"msgItem",
    props: ["item","id","mineRole",'activeSearch','listSearch','senderBefore','senderAfter','uploadPercentage'],
    components: {
        NoticeItem,
        VueClipboard,
        TextHighlight
        
    },
    computed: {
        ...mapGetters([
            'chatInfo',
            'userInfo',
            'chatMembers',
            'rooms',
            'roomsMemberObj',
            'friends',
            // 'friendsObj',
            'usersObj',
            'chatInRooms',
            'chatInRoomsPro'

        ]),
        
    },
    data() {
        return {
            NowTime: new Date().getTime(),
            isSelected: false,
            checkedSelect: false,
            redPacketInfo: false,
            redPacketDetails:{},
            msgObj: {
                msg: ''
            },
            queries:[],
            MSG_TYPE,
            BASE_URL: MSG_TYPE.BASE_URL,
            isVisible: false,
            isPopBtn: true,
            isClickedPop: false,
            quotes: null,
            idx: this.id.split("_")[1],
            nameFor: '',
            avatarFor: '',
            currencyRed: ''
        }
    },
    watch: {
        item: {
            handler(newVal, oldVal) {
                if (
                    newVal&&newVal.msg 
                ) {
                    this.setItem(newVal);
                    this.makeUserMsg()
                }
            },
            deep: true

        },
    },
    created() {
        
    },
    beforeUpdate() {
        

    },
    updated(){
       
    },
    beforeDestroy() {
        this.$bus.$off('upd_msgItem')
    },
    mounted() {
        this.setItem(this.item);
        this.makeUserMsg()
        //this.rightPoint()
        this.dealEmit()
        this.currencyRed = JSON.parse(sessionStorage.getItem("appConfig")).currencySymbol
        
        
        

    },
    methods: {
       
        grabRed(id){
            let post = {
                redId: id,
            }
            redGrab(post).then(res => {
                if(res.success){
                    this.$set(this.msgObj,"redStatus", 2)
                    this.openRedPacketFun(res.data.redId)
                }else{
                    this.$set(this.msgObj,"redStatus", 3)
                    this.$set(this.redPacketDetails,'redStatus',this.msgObj.redStatus)
                    let getInstanceMsg = chatLocalMsgDAO.getInstance();
                    getInstanceMsg.update(this.msgObj)
                }
            })
        },
        openDetail(e){
            console.log(e,'comp')
        },
        getMsg(msgObj){
            let queries = []
            let nicknames = msgObj.msg.user? msgObj.msg.user.userName:'';
            // if(msgObj.msg.user){
            //     nicknames = msgObj.msg.user.userName
            // }
            if(nicknames){
                let array= Array.isArray(nicknames)? nicknames: nicknames.split(',')
                array.forEach((qry,index)=>{
                    queries.push(array[index])
                })
            }
            return queries
        },
        getPhoto(id){
            let getInstance = userListDAO.getInstance();
            getInstance.find(id).then((uInfo)=>{
                        if(uInfo){
                            return uInfo.photo
                        }
                        else{
                            return false
                        }
                    })
        },
        getName(id){
            let getInstance = userListDAO.getInstance();
            getInstance.find(id).then((uInfo)=>{
                        if(uInfo){
                            return uInfo.nikeName
                        }
                        else{
                            return false
                        }
                    })
        },
        openRedPacketFun(id){
            
            let post = {
                redId: id,
            }
            redInfo(post).then(res => {
                
                if(res.success){
                    let data = res.data
                    let getInstance = userListDAO.getInstance();
                    let getInstanceMsg = chatLocalMsgDAO.getInstance();
                    this.redPacketDetails  = data
                    if( this.msgObj.redStatus !=2 && this.NowTime>(this.msgObj.sendTime + 24*60*60*1000)){
                        this.msgObj.redStatus = 3
                    }
                    this.$set(this.redPacketDetails,'redStatus',this.msgObj.redStatus)
                    getInstanceMsg.update(this.msgObj)
                    getInstance.find(data.createId).then((uInfo)=>{
                        if(uInfo){
                            this.$set(this.redPacketDetails,'nikeName',uInfo.nikeName)
                            this.$set(this.redPacketDetails,'photo',uInfo.photo)
                        }
                        this.redPacketInfo  =  true
                    })
                }
            })
            
        },
        showBusinessCard(businessCard){
            this.$emit("showBusinessCard",businessCard)
        },
        noScroll(){
            this.$emit('noScroll')
        },
        fileIsVoice(file){
            this.$emit('fileIsVoice',file)
        },
        findSearch(item){
            let active=false
            this.listSearch.filter(v=>{
                    if(v.msgId==item.msgId){
                        active=true
                    }
                    
            })
            return active
        },
        copyMessage(el){
            el.select();
            document.execCommand("copy");
        },
        deleteLocalMsg(item,data,cdata){
            let getInstance = chatLocalMsgDAO.getInstance();
            let getInstanceRooms = chatInRoomsDAO.getInstance();
            let that =this
            let noticeDelete={...cdata}
            noticeDelete.msgId=data.msgId
            if(cdata){
                getInstance.update(noticeDelete).then(() => {
                    getInstanceRooms.find(item.roomIdAndId).then((result) => {
                        if (result) {
                            getInstance.findByRoomIdAndId(item.roomIdAndId).last().then((lastMessage)=>{
                                that.$store.dispatch('AddChatInRooms',lastMessage)
                                that.$bus.$emit("updateLocalMsg",noticeDelete)
                            })				
                        } 
                    });
                })
            }else{
                getInstance.delete(noticeDelete.msgId).then(() => {
                    getInstanceRooms.find(item.roomIdAndId).then((result) => {
                        if (result) {
                            getInstance.findByRoomIdAndId(item.roomIdAndId).last().then((lastMessage)=>{
                                that.$store.dispatch('AddChatInRooms',lastMessage)
                                that.$bus.$emit("deleteLocalMsg",noticeDelete)
                            })				
                        } 
                    });
                })
            }
            
        },
         dealEmit(){
            // 正在房间内 群密聊

            this.$bus.$off("back_msg")
            this.$bus.$on("back_msg",async(data) => {
                let item = {
                    id: this.chatInfo.id || this.chatInfo.roomId,
                    roomType: data.roomType
                }
                if(!item.roomIdAndId){
                    item.roomIdAndId = this.setRoomIdsId(item.id,item.roomType)
                }
                // 房间通知 xxx撤回了一条消息
                // 将消息添加到指定房间
                // Room notification xxx withdrew a message
                // add the message to the specified room
                let cdata = this.combineMsg(data,this.rooms,this.friends,1)
                // 如果是自己发送的撤回消息
                // 操作为 主动撤回之后接收im推送 将推送信息 替换已删除元素
                // If it is a withdrawal message sent by yourself
                // The operation is to receive im push after active withdrawal will push the information to replace the deleted element
                if(data.isMineBack){
                    // return
                    console.log('自己发送的撤回消息')
                    
                }else{
                    // 别人发送的撤回消息
                    let getInstance = chatLocalMsgDAO.getInstance();
                    getInstance.find(data.msg.backMsgId).then((dataMsg)=>{
                        this.deleteLocalMsg(item,dataMsg,cdata)
                        cdata = null
                    })
                }
            })
            // 其他房间
            // other rooms
            this.$bus.$off("back_msg_else")
            this.$bus.$on("back_msg_else",data => {
                let item = {
                    id: data.id,
                    roomType: data.roomType,
                    isElseRoom: data.isElseRoom
                }
                if(!item.roomIdAndId){
                    item.roomIdAndId = this.setRoomIdsId(item.id,item.roomType)
                }

                // 房间通知 xxx撤回了一条消息
                // 将消息添加到指定房间
                // Room notification xxx withdrew a message
                // add the message to the specified room
                let cdata = this.combineMsg(data,this.rooms,this.friends,1)
                let getInstance = chatLocalMsgDAO.getInstance();
                    getInstance.find(data.msg.backMsgId).then((dataMsg)=>{
                        this.deleteLocalMsg(item,dataMsg,cdata)
                        cdata = null
                    })

            })

            // 指定更新组件
            // Specify update component
            this.$bus.$on('upd_msgItem', (sedTime) => {
                if(this.item.sendTime == sedTime){
                    this.$forceUpdate()
                    this.setItem(this.item);
                }
            })
        },
        // 图片右键菜单
            onCopy: function (e) {
                console.log(e)
                /* e.text */
                this.$toasted.info( this.$t('copySucc'),{position:'bottom-center',duration: 1000});

            },
            onError: function (e) {
                this.$toasted.error( this.$t('copyErr'));
            },
        async rightPoint(){
            
            let customRef = this.$refs.msgItem
             await this.$store.dispatch('SetChatMembers', this.chatInfo.id)
            let listMembers = this.chatMembers.find(qry => qry.id === this.msgObj.senderId)
            if(this.chatInfo.groupRole===1 || !listMembers){
                return
            }
           
            let muteInt = listMembers.muteInt
            let mute =  muteInt > 0 ? false :  true
            let unmute = muteInt > 0 ? true :  false 
            if(customRef){
                let that = this;
                const {remote} = this.$electron
                const {Menu, MenuItem} = remote;
                
                //右键菜单
                //Right-click menu
                const menu = new Menu();
                let MenuList = [
                    {
                        label: this.$t('remove_from_group'),
                        click: () => {
                            let index = that.id.split("_")[1] // forid_index
                            let item ={
                                id : that.msgObj.senderId
                            }
                            that.$bus.$emit('kick_room',item) //对应组件
                        }
                    },
                    {
                        label: this.$t('mute'),
                        visible: mute,
                        click: () => {
                            let index = that.id.split("_")[1] // forid_index
                           
                                 that.muteUserFun()
                            
                        }
                    },
                    {
                        label:  this.$t('unmute'),
                        visible: unmute,
                        click: () => {
                            let index = that.id.split("_")[1] // forid_index
                                 that.unMuteUserFun()
                           
                            
                        }
                    },
                ]
                MenuList.map(v=> {
                    v = new MenuItem(v)
                    menu.append(v)
                })
                customRef.addEventListener('contextmenu', (e) => {
                    menu.popup({window: remote.getCurrentWindow()})
                    this.isClickedPop = true
                }, false)
            }

        },
        muteUserFun(){
            let post = {
                roomId: this.chatInfo.id, 
                userId: this.msgObj.senderId,
                muteMin: 99999999999999999999
            }
            muteUser(post).then(res => {
                if(res.success){
                    this.$message.success(this.$t('doSucc'))
                    this.$store.dispatch('SetChatMembers', this.chatInfo.id)

                    this.$store.dispatch('SetRoomInfo', {roomId: this.chatInfo.id , status:false})
                }else{
                    this.$message.error(res.message)
                 }
            })
        },
        unMuteUserFun(){
            let post = {
                roomId: this.chatInfo.id, 
                userId: this.msgObj.senderId,
            }
            unMuteUser(post).then(res => {
                if(res.success){
                    this.$message.success(this.$t('doSucc'))
                    this.$store.dispatch('SetChatMembers', this.chatInfo.id)

                    this.$store.dispatch('SetRoomInfo', {roomId: this.chatInfo.id , status:false})
                }else{
                    this.$message.error(res.message)
                 }
            })
        },
        async makeUserMsg(){
            // return this.makeUserMsgs(item, status, this.roomType)
           // this.nameFor = await this.makeUserMsgs(this.msgObj, 2, 1, true)
           // this.avatarFor = await this.makeUserMsgs(this.msgObj, 1, 1, true)
            this.$set(this.msgObj,"isVisible", true)
        },
        copy(){
            this.isVisible = false
            console.log('复制')
        },
        checkMsg(msgId){
            if(this.checkedSelect){
                this.$bus.$emit('listMsgId',msgId)
            }else{
                this.$bus.$emit('DelListMsgId',msgId)
            }
        },
        selectMsg(msgId) {
            this.checkedSelect=true
            this.$bus.$emit('hasSelected',true)
            this.$bus.$emit('listMsgId',msgId)
            
        },
        deleteMsg(item){
            this.$bus.$emit("deleteLocalMsg",item.msgId)
            this.isVisible = false
        },
        turnMsg(){
            // 消息的回撤 是根据roomIdAndId 来处理的 每条信息
            // The withdrawal of the message is processed according to roomIdAndId. Each piece of information
            this.isVisible = false
            let index = this.id.split("_")[1] // forid_index
            let item = this.item
            // 回撤成功之后 马上回收到im 关于自己回撤的消息
            // After the retracement is successful, im's news about his retracement will be retrieved immediately
            // 如果需要回复消息的话 则再加一个对应key即可
            // If you need to reply to a message, add a corresponding key.
            let getInstance = chatLocalMsgDAO.getInstance();
            this.$store.dispatch("SetChatInRoomsPro", {roomIdAndId: item.roomIdAndId, key:'backMineMsgIdx',val: index})
            if(!item.msgId){
                console.log('消息未成功传送_只需要撤回本地内容即可') //
                // 清除本地对应缓存
                // Clear the local corresponding cache
                getInstance.find(item.msgId).then((dataMsg)=>{
                        this.deleteLocalMsg(item,dataMsg)
                })
                return
            }
            let post = {
                msgId: item.msgId,
                sendTime: item.sendTime
            }
            imBackMessage(post).then(res => {
                if(res.success){
                    console.log('回撤成功')
                    // 只有别人看见的消息 才在这里回撤
                    // Only the news that others see will be withdrawn here
                    
                    let cdata = {
                        "roomId":item.roomId,
                        "senderId":this.userInfo.id,
                        "sendTime":item.sendTime,
                        "msgType":7,
                        "msg": `{"noticeType":25,"pointUser":null,"pointUsers":null,"controUser":null,"room":null,"muteInt":0,"message":{"nikeName":"${this.userInfo.nikeName}"},"msgReadTime":0,"readMsgId":0,"backMsgId":0}`,
                        "msgId":item.msgId,
                        "receiverId":this.chatInfo.id,
                        "senderName":item.senderName,
                        "senderHead":item.senderHead,
                        "senderLevel":0,
                        "receiveType":0,
                        "account":"",
                        "quoteMsgId":0,
                        "replyType":0
                    }
                    console.log('reply_Okkkk');
                    // 清除本地对应缓存
                    // Clear the local corresponding cache
                    
                    getInstance.find(item.msgId).then((dataMsg)=>{
                        this.deleteLocalMsg(item,dataMsg,cdata)
                    })
                }else{
                    this.$message.error(res.message)
                }
            })

        },
        // 清除本地对应缓存
        // Clear the local corresponding cache
        
        showMedia(status){
            if(status === 1){
                this.$emit('showSlider')
            }
            else{
                this.$emit('showSliderVideo')                
            }
            //this.$bus.$emit('dialog_show',status,this.msgObj)
        },
        showQuote(){
            this.$bus.$emit("atQuote", this.msgObj.quoteMsgId)
        },
        edit(){
            this.$emit('edit-msg', this.msgObj)
            this.isVisible=false
        },
        makeQuotesMsg(){

            this.$emit('quote-msg', this.msgObj) 
            this.$bus.$emit('quote_msg', this.msgObj) 
            this.isVisible=false
        },
        makeQuotes(){
            
                let quoteMsgId = this.msgObj&&this.msgObj.quoteMsgId
            
                if(quoteMsgId){
                    let roomIdAndId = this.chatInfo.roomIdAndId
                    let msgArr=[]
                    let getInstance = chatLocalMsgDAO.getInstance();
                    getInstance.find(quoteMsgId).then(msgArr=>{
                        let item = msgArr
                        if(item){
                            let msg_json = typeof item.msg === "string" ? JSON.parse(item.msg) : item.msg;
                            // 文本emoji处理
                            // Text emoji processing
                            if(item.msgType==MSG_TYPE.IM_MSG_TYPE_TEXT){
                                msg_json.message = this.entitiesToUtf16(msg_json.message)
                            }
                            
                            let obj = {
                                ...item,
                                msg: msg_json,
                                isMine: item.isMine?item.isMine:(this.userInfo.id == item.senderId ? MSG_TYPE.IS_MINE : MSG_TYPE.NO_MINE),
                                message: msg_json.message
                                    ? translateHTML(msg_json.message)
                                    : "",
                                sendTime: item.sendTime,
                                isTips: item.msgType==MSG_TYPE.IM_MSG_TYPE_NOTIFICSTION
                            };
                            if(item.replyType==MSG_TYPE.IM_MSG_TYPE_TEXT){
                                obj.msg.message = this.entitiesToUtf16(obj.msg.message)
                            }
                            this.quotes = obj
                        }
                    })
                    
                }
        },
        setItem(item){
            //console.log(item,'item')
            if(!item)return {}
            let msg_json = typeof item.msg === "string" ? JSON.parse(item.msg) : item.msg;
            // 文本emoji处理
            // Text emoji processing
            if(item.msgType==MSG_TYPE.IM_MSG_TYPE_TEXT){
                msg_json.message = this.entitiesToUtf16(msg_json.message)
            }
            
            this.msgObj = {
                ...item,
                msg: msg_json,
                isMine: item.isMine?item.isMine:(this.userInfo.id == item.senderId ? MSG_TYPE.IS_MINE : MSG_TYPE.NO_MINE),
                // nikeName: item.senderName || item.nikeName || item.nickName,
                message: msg_json.message
                    ? translateHTML(msg_json.message)
                    : "",
                sendTime: item.sendTime,
                isTips: item.msgType==MSG_TYPE.IM_MSG_TYPE_NOTIFICSTION
            };
            if((item.msgType!==MSG_TYPE.IM_MSG_TYPE_FILE&&item.msgType!==MSG_TYPE.IM_MSG_TYPE_VIDEO&&item.msgType!==MSG_TYPE.IM_MSG_TYPE_PICTURE&&item.msgType!==MSG_TYPE.IM_MSG_TYPE_QUOTE&&item.msgType!==MSG_TYPE.IM_MSG_TYPE_VOICE)&&this.msgObj.message===''){
                this.$bus.$emit('setDelRlist', this.idx) // 清空message为空的数据
            }
            
            if(item.msgType == MSG_TYPE.IM_MSG_TYPE_QUOTE){
                this.makeQuotes()
            }
            msg_json = null
            //this.setUserNameAndPhoto(item)
            // console.log("msgObj: ",this.msgObj,this.userInfo.id,item.senderId)
        },
        
        roomReadInfo(item){
            this.$bus.$emit('dialog_read_info',item)
        },
        handleClick(){
            this.$emit('handleClick',this.msgObj)  
            this.noScroll()        
        },
        async findInfo(){
            // 点击请求个人详情 然后展示 才能展示最新的个人消息
            // Click to request personal details and then show to show the latest personal news
            let ROOMTYPES = 1
            let ROOMTYPESR = 2
            let info;
            let chatInRooms = JSON.parse(JSON.stringify(this.chatInRooms))
            // friendStatus.  1 申请中  2 好友关系  3 没有关系
            // 点击请求个人详情 然后展示 才能展示最新的个人消息
            // friendStatus. 1 Application in progress 2 Friendship 3 No relationship
            // Click to request personal details and then show to show the latest personal news
            let uid = this.msgObj.senderId || this.msgObj.id;
            let userInfo = await this.fixInfo(1, {
                userId: uid,
            }).catch((err) => {
                console.log(err);
                this.$bus.$emit('show_dialog_err',err)
            });
            if(userInfo){
                
                this.msgObj = {...this.msgObj, ...userInfo}
                info = this.msgObj

                // 好友列
                // Friends column
                if(userInfo.friendStatus == 2){
                    let friends = JSON.parse(JSON.stringify(this.friends))
                    let friendsIdx = friends.findIndex((value, index, arr) => {
                        return (value.id == userInfo.id) 
                    })
                    // 如果存在
                    // if it exists
                    if(friendsIdx>-1){
                        friends[friendsIdx] = {...friends[friendsIdx], ...userInfo};
                        this.$store.commit('SET_FRIENDS', friends)
                        this.$store.commit('UPDATE_USERS_OBJ', friends[friendsIdx])
                    }
                }
                // 消息列 -- 密聊
                // Message column - secret chat
                let chatInRoomIdx = chatInRooms.findIndex((value, index, arr) => {
                    return ((value.id == userInfo.id) && (value.receiveType==ROOMTYPES || value.roomType==ROOMTYPES)) 
                })
                if(chatInRoomIdx>-1){
                    let chatObj = chatInRooms[chatInRoomIdx]
                    chatObj = {...chatObj, ...userInfo}
                    chatInRooms[chatInRoomIdx] = chatObj
                    this.$store.commit('SET_CHATIN_ROOMS', chatInRooms)

                    // 正在当前聊天列表 消息列表 处理密聊聊天记录 密聊只有一个聊天室可以直接处理
                    // Currently chatting list message list processing secret chat chat records secret chat has only one chat room that can be processed directly
                    let roomIdAndId = this.setRoomIdsId(userInfo.id, ROOMTYPES)
                    
                    
                    let getInstance = chatLocalMsgDAO.getInstance();
                    let localMsgData = await chatLocalMsgDAO.getInstance().findByRoomIdAndId(this.msgObj.roomIdAndId).toArray()
                    if(localMsgData&&localMsgData.length>0){
                        let localMsgDatas = localMsgData.map(v => {
                            if(v.id==userInfo.id || v.senderId==userInfo.id){
                                v = {...v,...userInfo}
                            }
                            return v;
                        })
                        //this.setChatLocalMsgStore(1, roomIdAndId, localMsgDatas)
                        
                        localMsgData.forEach(item=>{
                    
                            getInstance.find(item.msgId)
                            .then((result) => {
                                if(!result){
                                    getInstance.add(item)
                                   
                                }
                            })
                            
                        })
                        getInstance
                        .get()
                        .then((result) => {
                                                    //state.chatInRooms = result;
                        })
                        .catch((e) => {
                            console.log("err_or: ", e);
                        });
                        // 如果正在当前聊天室中
                        // If you are in the current chat room
                        if(this.chatInfo.roomIdAndId == roomIdAndId){
                            this.$bus.$emit("setRlist",localMsgDatas)
                        }
                    }
                }
                
                

                // 点击头像 如果在群聊中
                // Click on the avatar if in the group chat
                if(this.chatInfo.roomChatId){
                    let muteInt,role;

                    // 更新当前会员信息
                    // Update current member information
                    /* const [errMute, dataMute] = await this.awaitWrap(
                        this.$store.dispatch('SetChatMembers', (this.chatInfo.roomId||this.chatInfo.id))
                    )
                    if(errMute){
                        this.$message.error(errMute)
                        return
                    } */
                    this.chatMembers.some(v => {
                        if(v.id == uid || v.userId == uid){
                            muteInt = v.muteInt || v.muteTime
                            role = v.role

                            return true
                        }
                    })
                    this.msgObj = {...this.msgObj, muteInt, role}
                    // 群聊信息更新 根据当前用户详情
                    // Group chat information is updated according to the current user details
                    let roomIdAndId = this.msgObj.roomIdAndId
                    let roomsMemberObjs = {...this.roomsMemberObj}
                    let chatMembers = [...this.chatMembers]
                    // 更新对应用户缓存；群用户缓存 及用户 vuex
                    // Update corresponding user cache; group user cache and user vuex
                    // ---
                    if(chatMembers.length>0){
                        let chatMembersf = {}
                        chatMembers.map(v => {
                            if(v.id == userInfo.id){
                                let obj = {...v,...userInfo}
                                chatMembersf[v.id] = obj
                                this.$store.commit('UPDATE_USERS_OBJ', obj)
                            }else{
                                chatMembersf[v.id] = v;
                                // 查询一次用户信息 -- 更新一次用户信息
                                // Query user information once - update user information once
                                this.$store.commit('UPDATE_USERS_OBJ', v)
                            }
                        })
                        roomsMemberObjs[roomIdAndId] = chatMembersf
                    }
                    // 匹配会员信息的关键
                    // The key to matching member information
                    this.$store.commit('SET_MEMBEROBJ', roomsMemberObjs) 
                    // ---
                    // 如果正在当前聊天室中
                    // If you are in the current chat room
                    if(this.chatInfo.roomIdAndId == roomIdAndId){
                        let localMsgData = await chatLocalMsgDAO.getInstance().findByRoomIdAndId(this.msgObj.roomIdAndId).toArray()
                        if(localMsgData&&localMsgData.length>0){
                            localMsgData = localMsgData.map(v => {
                                if(chatMembers.length>0){
                                    chatMembers.map(v2 => {
                                        if(v.senderId==v2.id){
                                            let obj = {...v, ...v2}
                                            v = obj
                                            
                                        }
                                    })
                                }
                                return v;
                            })
                            let getInstance = chatLocalMsgDAO.getInstance();
                            localMsgData.forEach(item=>{
                    
                                getInstance.find(item.msgId)
                                .then((result) => {
                                    if(!result){
                                        getInstance.add(item)
                                    }
                                })
                                
                            })
                            getInstance
                            .get()
                            .then((result) => {
                                                        //state.chatInRooms = result;
                            })
                            .catch((e) => {
                                console.log("err_or: ", e);
                            });
                        }
                        this.$bus.$emit("setRlist",localMsgData)
                    }
                }
                this.$bus.$emit('show_info',this.msgObj,1)
            }
            
        },
        
        // 好友_昵称 和 群成员_昵称 需要统一然后，点击详情的时候再刷新此成员信息
        // Friends_nickname and group members_nickname need to be unified. Then, refresh the member information when you click on the details
        setUserNameAndPhoto(item){
            if(item.senderId==this.userInfo.id || item.isMine===MSG_TYPE.IS_MINE)return
            let nikeName;
            let photo;
            let idf;
            if(item.roomType == MSG_TYPE.RECEIVE_TYPE_PRIVATE){
                idf = this.getRoomIdsId(item.roomIdAndId)
            }else if(item.roomType ==  MSG_TYPE.RECEIVE_TYPE_PUBLIC){
                idf = item.senderId
            }
            // 查用户表
            // Check user table
            nikeName = this.usersObj[idf].nikeName
            photo = this.usersObj[idf].photo
            
            this.$set(this.msgObj,'nikeName', nikeName)
            this.$set(this.msgObj,'photo', photo)
        },

        // 保存到本地并自动点击
        // Save to local and click automatically
        saveAs(data, name) {
            const urlObject = window.URL || window.webkitURL || window;
            const export_blob = new Blob([data]);
            const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = urlObject.createObjectURL(export_blob);
            save_link.download = name;
            save_link.click();
        },
        // 下载含有url的文件
        // Download the file containing the url
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
                    fileName=this.$t('appName')+this.filterDate(parseInt(new Date().getTime()))+ext
            }
            this.downloadUrlFile(picUrl||url, fileName)
        },
        //复制图片
        copyImg(item){
            let that = this;
            // let imgMsg = JSON.stringify(item)
            // this.$copyText(imgMsg).then(function (e) {
            //     that.onCopy();
            //     console.log(e)
            //     }, function (e) {
            //      that.onError();
            //     console.log(e)
            //     })

           function    convertImgToBase64(url, callback, outputFormat){
                var canvas = document.createElement('CANVAS'),
                ctx = canvas.getContext('2d'),
                img = new Image;
                img.crossOrigin = 'Anonymous';
                img.onload = function(){
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img,0,0);
                var dataURL = canvas.toDataURL(outputFormat || 'image/png');
                callback.call(this, dataURL);
                canvas = null; 
                };
                img.src = url;
                }
                convertImgToBase64(item.thumbUrl,function(base64Image) {
                const image = nativeImage.createFromDataURL(base64Image)
                clipboard.writeImage(image);
                that.onCopy();
                that.isVisible=false
            })

        },
        // 重发
        resend(item){
            // 1 failed 2 successful 3 retransmitted 4 first transmission (stateless)
            this.$set(item,"isResending", 3) 
            this.$set(item,"isSendFaild", true)
            this.$set(item,"sendTime", parseInt(new Date().getTime()))
            this.$set(item,"arrIdx", this.idx)
            setTimeout(()=> {
                this.$bus.$emit('resend',item)
            }, 1000)
        }


    },
    

}
</script>

<style lang="scss" scoped>
audio:focus {
    outline: none;
}
.msg-item{
    width: 100%;
    padding: 0px 25px;
    
    &:hover .pops{
        display: block;
    }
    .pops{
        cursor: pointer;
        position: absolute;
        right: -15px;
        top: 1px;
        transform: rotate(90deg);
        font-size: 9pt;
        display: none;
    }
    .im-self{
        .im-box{
            .im-content{
                background: var(--primary-color) !important;
                float: right;
                &.red-packet-box {
                    background: #FFB100 !important;
                }
                &.msg-with-border-mine {
                    border-bottom-right-radius: 0px;
                }
                .msg-text{ 
                    color: #fff;

                }
                .msg-line{
                    color: #fff !important;
                    opacity: .6;
                }
                
            }
            
        }
    }
    .im-other{
        .im-box{
            .msg-line {
               // text-align: right;
            }
            .im-content{
                &.red-packet-box {
                    background: #FFB100 !important;
                }
                &.msg-with-border{
                    border-top-left-radius:0
                }
                
            }
            .msg-picture{
                
                &.msg-voice{
                   
                    .msg-line{
                        padding-left: 0;
                        &.name-sender{
                            padding-left: 0;
                        }
                    }
                }
               
            }
        }
    }
    .im-self{
        .msg-line{
                        color: var(--primary-color) ;
                            opacity: .5;
                       
                    }
        .msg-file{
                
                .contents{
                    &.msg-with-border-mine{
                        border-bottom-right-radius: 0
                    }
                    background: var(--primary-color) !important;
                    &:hover .type .downit{
                    }
                    .type{
                        /* width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        margin-right: 8px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: #fff;
                        position: relative; */
                        .downit{
                            /* position: absolute;
                            width: 40px;
                            height: 40px; */
                            /* border: 1px solid red; */
                            /* background: #fff;
                            display: none; */
                            .icone{
                                /* font-size: 40px; */
                            }
                        }
                        svg{
                            /* font-size: 30px;
                            color: var(--primary-color); */
                        }
                    }
                    .info{
                        img.icon-file {
                            display: inline-block;
                        }
                        .name{
                            color: #fff !important;
                            
                        }
                        .size{
                            color: #B7D5F7 !important;
                        }
                    }
                    .msg-line{
                        color: #B7D5F7 ;
                        &.read{
                            right: 12px;
                        }
                    }
                    
                }
        }
        .im-business-card {
            .chat-desc{
                p{
                    color: #fff !important;
                }
            }
        }
    }
    
    
    .im-self,.im-other{
        display: flex;
        position: relative;
        .avatar{
            margin-right: 10px;
            width: 45px;
            height: 45px;
            min-width: 45px;
            cursor: pointer;

            img {
                width: 45px;
                height: 45px;
                border-radius: 50%;
            }

            p {
                border-radius: 50%;
                width: 45px;
                height: 45px;
                font-size: 20px;
                color: var(--primary-color);
                background: #e5e4e8;
                font-weight: bold;
                text-align: center;
                line-height: 45px;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
        }
        .im-box{
            margin-right: 10px;
            min-width: 130px;
            /* position: relative; */
            .msg-line{
                //opacity: 0.35;
                font-size: 11px;
                font-weight: 400;
                align-self: flex-end;
                margin-left: auto;
                margin-top: 0;
                //padding-left: 15px;
                &.name-sender{
                    padding-top: 5px;
                    padding-bottom: 3px;
                    font-size: 12px;
                    text-align: left;
                    color: #000;
                }
            }
            .im-content{
                padding: 6px 14px 6px 15px;
                line-height: 1.5;
                font-size: 16px;
                background: #fff;
                border-radius: 15px;
                color: #000;
                min-width: 92px;
                display: inline-flex;
                max-width: 450px;
                &.red-packet-box {
                    background: #FFB100 !important;
                    min-width: 200px;
                    cursor: pointer;
                    &.expired {
                        background: #F6DA9A !important;
                        opacity: .5;
                    }
                    &.opened{
                        background: #F6DA9A !important;
                    }
                    .msg-line{
                        color: #fff !important;
                    }
                    .red-packet {
                        display: inline-flex;
                        color: #fff;
                        .chat-avatar{
                            position: relative;
                            top: 4px;
                        }
                         .chat-desc {
                            margin-left: 10px;
                            p {
                                margin: 0;
                                font-size: 16px;
                                font-weight: 700;
                                text-transform: capitalize;
                                &.status{
                                    font-size: 13px;
                                    font-weight: 100;
                                }
                            }
                        }
                    }
                }
                .im-business-card {
                    display: flex;
                    cursor: pointer;
                    .chat-avatar {
                        width: 35px;
                        height: 35px;

                        img {
                            width: 100%;
                            height: 100%;
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
            }
            .msg-text{
                word-break: break-word;
                line-height: 1.5;
                white-space: pre-wrap;
                font-size: 14px;
                padding-right: 5px;
                &.searchActive {
                    color: #e4e40f;
                }
            }
            /* 图片 */
            .msg-picture{
                max-width: 500px;
                width: 190px;
                cursor: pointer;
                &.msg-voice{
                    width: initial;
                    padding-bottom: 6px;

                }
                img{
                    border-radius: 10px;
                    width: 100%;
                }
            }
            .msg-picture {
                &.msg-voice{
                    &::before{
                        display: none;
                    }
                    &.msg-with-border-mine{
                         .vueAudioBetter{
                             border-bottom-right-radius: 0;
                         }
                    }
                    .vueAudioBetter{
                        box-shadow: none;
                        height: 56px;
                        line-height: 40px;
                        margin: 0;
                        padding: 0 14px;
                        border-radius: 4px;
                        background: #F2F2F2;
                    }
                }
            }
            .msg-picture{
                &.msg-voice{
                    .msg-line{
                        color: #fff;
                        
                    }
                }
            }
            /* 视频 */
            .msg-video,.msg-picture {
                &::before{
                    content: '';
                    width: 100%;
                    height: 50px;
                    position: absolute;
                    bottom: 3px;
                    border-radius: 12px;
                    border-top-left-radius: 0;
                    border-top-right-radius: 0;
                    background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.6) 100%);
                }
                position: relative;
                max-width: 500px;
                width: 190px;
                cursor: pointer;
                img{
                    width: 100%;
                    border-radius: 10px;
                    max-height: 150px;
                    border: 1px solid #E0E3E5;
                    &.video-icon {
                        position: absolute;
                        width: 19px;
                        bottom: 10px;
                        height: initial;
                        left: 10px;
                        border-radius: 0;
                        border: none;
                    }
                    &.play-icon {
                        width: 30px;
                        height: initial;
                        position: absolute;
                        top: calc(50% - 15px);
                        left: calc(50% - 15px);
                        border: none;
                    }
                }
                .msg-line{
                    color: #fff;
                    position: absolute ;
                    bottom: 10px;
                    right: 10px;
                }
                .start{
                    position: absolute;
                    top: 40%;
                    left: 46%;
                    color: #fff;
                    font-size: 40px;
                    filter: none;
                }
            }
            /* 文件展示 */
            .msg-file{
                position: relative;
                max-width: 500px;
                background: #f3f6f9;
                border-radius: 5px;
                cursor: pointer;
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
                    /* display: flex; */
                    align-items: center;
                    &:hover .type .downit{
                        display: block;
                    }
                    .type{
                        /* width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        margin-right: 8px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: #fff;
                        position: relative; */
                        .downit{
                            /* position: absolute;
                            width: 40px;
                            height: 40px; */
                            /* border: 1px solid red; */
                            /* background: #fff;
                            display: none; */
                            .icone{
                                /* font-size: 40px; */
                            }
                        }
                        svg{
                            /* font-size: 30px;
                            color: var(--primary-color); */
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
            /* 已读图标展示 */
            .msg-read{
                position: absolute;
                bottom: 4px;
                right: 13px;
            }
            .msg-room-read{
                cursor: pointer;
                position: absolute;
                bottom: 0;
                right: 10px;
            }
            /* 发送失败图标 */
            .msg-send-faild{
                cursor: pointer;
                position: absolute;
                top: 8px;
                margin-left: -9px;
                font-size: 20px;
                color: #ffb445;
            }
            /* 引用 */
            .msg-quote{
                padding: 0;
                border-radius: 8px;
                background: #f3f6f9;
                .msg-read{
                    bottom: 10px !important;
                }
                .msg-line{
                    padding-bottom: 5px;
                    padding-right: 7px;
                    &.read{
                        right: 20px;
                        padding-right: 20px;
                    }
                    &.pic-quote{
                        top: -15px;
                        color: #fff;
                    }
                }
                .quote-content{
                    cursor: pointer;
                    display: flex;
                    border-radius: 10px;
                    border-bottom-left-radius: 0;
                    border-bottom-right-radius: 0;
                    padding: 6px 14px 6px 15px;
                    .red-packet-bo {
                        background: #FFB100 !important;
                        .quote-txt{
                            color: #fff !important;
                        }
                    }
                    svg{
                        min-width: 1em;
                    }
                    .quote-cont{
                        width: 100%;
                        .msg-picture{
                            &::before{
                               display: none; 
                            }
                            width: initial;
                        }
                        
                        .quote-txt{
                            color: #B7D5F7;
                            font-size: 14px;
                            word-break: break-word;
                            line-height: 1.5;
                            img{
                                max-width: 500px;
                                width: 40px;
                            }
                        }
                        .quote-video{
                            position: relative;
                            margin-bottom: 10px;
                            color: #fff;
                            min-width: 160px;
                            width: 100%;
                            .start{
                                position: absolute;
                                top: 40%;
                                left: 40%;
                                font-size: 40px;
                                /* color: #fff; */
                            }
                            img{
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .user-tips{
                            color: #666;
                            font-size: 14px;
                        }

                    }
                    
                }
                .quote-reply{
                    display: flex;
                    word-break: break-word;
                    line-height: 1.5;
                    padding: 6px 14px 6px 15px;
                    .msg-line{
                        top: -11px;
                    }
                    .reply-txt{
                        img{
                            max-width: 500px;
                        }
                    }
                    .reply-img{
                        cursor: pointer;
                        max-width: 500px;
                        width: 190px;
                        cursor: pointer;
                        position: relative;
                        line-height: initial;
                        img{
                            width: 100%;
                            border-radius: 10px;
                            border-top-left-radius: 0;
                            border-top-right-radius: 0;
                            
                        }
                        &::before{
                                content: '';
                                width: 190px;
                                height: 50px;
                                position: absolute;
                                bottom: 3px;
                                border-radius: 12px;
                                border-top-left-radius: 0;
                                border-top-right-radius: 0;
                                background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.6) 100%);
                            }
                    }
                    .reply-video{
                        line-height: initial;
                        img{
                            border-top-right-radius: 0;
                            border-top-left-radius: 0;
                        }
                        .start{
                            position: absolute;
                            top: 45%;
                            left: 40%;
                            font-size: 40px;
                            /* color: #fff; */
                        }
                    }
                    .reply-file{
                        background: transparent;
                        .contents{
                            padding: 0;
                            margin: 0;
                            background: transparent !important;
                        }
                    }
                    .msg-voice{
                        .vueAudioBetter{
                            background: transparent !important;
                            padding: 0;
                            height: 27px;
                            .operate span:last-child{
                                bottom: 18px;
                                left: 25px;
                            }
                        }
                    }
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
            }
            

        }
        .im-comment{
            width: 20px;
            height: 20px;
            border: 1px solid #faf;
        }
    }
    .im-other{
        .im-box{
            .msg-file{
                
                .contents{
                    &.msg-with-border{
                        border-top-left-radius: 0
                    }
                }
                &.quote-file {

                    
                    .contents{
                            
                        img{
                        }
                        .info{
                            .name{
                                color: #B3B3B3 !important;
                                
                            }
                        }
                    }
                    
                }
            }
        }
    }
    .im-self{
        /* flex-wrap: wrap-reverse; */
        .im-box{
            .msg-quote{
                background: #3D94F7;
                color: #fff;
                .quote-content{
                    border: none;
                    background: #1577E6;
                    svg{
                    }
                    .quote-cont{
                        
                        .msg-picture{
                        }
                        .quote-txt{
                            
                            img{
                                
                            }
                        }
                        .quote-video{
                            
                            .start{
                                
                            }
                            img{
                            }
                        }
                        .user-tips{
                            
                        }

                    }
                    
                }
                .quote-reply{
                    
                    .reply-txt{
                        img{
                        }
                    }
                    .reply-img{
                    }
                    .reply-video{
                        
                        img{
                        }
                        .start{
                            
                        }
                    }
                }

            }
        }
        
        .msg-picture {
                &.msg-voice{
                    .vueAudioBetter{
                        background: var(--primary-color) !important;
                        span.icon-playcircle-fill{
                            color: white;
                            &::before{
                                content:"";
                                background-image: require('@/assets/svg/play-voice.svg');
                            }
                        }
                    }
                }
            }
        flex-direction: row-reverse;
        .msg-line{
            text-align: right;
                &.read{
                    right: 7px;
                    padding-right: 11px;
                    padding-left: 10px;
                }
                
        }
        .msg-video,.msg-picture{
            .msg-line{
                    &.read{
                        right: 21px;
                    }
                    
            }
        }
    }
    .im-other{
        .im-box{
            position: relative;
            .msg-line{
                    color:#B3B3B3;
                    text-align: right;
                    
                }
            .msg-room-read{
                right: 0px;
                bottom: -5px;
            }
            .msg-quote{
                background: #fff;
                color: #fff;
                .quote-content{
                    border: none;
                    background: #E4E8EB;
                    svg{
                    }
                    .quote-cont{
                        
                        .msg-picture{
                            color: #B3B3B3;
                        }
                        .quote-txt{
                            color: #000;
                            &:last-child{
                                color: #B3B3B3;
                            }
                            img{
                                
                            }
                        }
                        .quote-video{
                            
                            .start{
                                
                            }
                            img{
                            }
                        }
                        .user-tips{
                            
                        }

                    }
                    
                }
                .quote-reply{
                    color: #000;
                    .reply-txt{
                        
                        
                    }
                    .reply-img{
                        
                    }
                    .reply-video{
                        
                        img{
                        }
                        .start{
                            
                        }
                    }
                }
                

            }
        }
    }
}
.msg-item.masks{
    background: #ceecfa;
    transition: background-color 1s;
}
.el-popover {
    padding: 0;
    width: 145px !important;
    min-width: 0 !important;
}

.add-chat-item {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    font-size: 12px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;

    &:hover {
        color: var(--primary-color);
    }
}
.pops-icon{
    position: absolute;
    right: -15px;
    top: 50%;
}

label.el-checkbox.check-select {
    position: absolute;
    right: -20px;
    display: none;
}
.hasSeleced{
    label.el-checkbox.check-select {
        
        display: block;
    }
}
.svg-icon path {
    fill: #ff0000;
}
    .msg-file {
        .contents {
               
            background: #fff;
            border-radius: 10px;
            padding: 10px;
            margin-top: 10px;
            display: block!important;
            min-width: 220px;
            .info {
                .name {
                    font-size: 17pt;
                    white-space: nowrap;
                    overflow: hidden !important;
                    text-overflow: ellipsis;
                    margin-bottom: 5px;
                }
                .size {
                    color: gray;
                    font-size: 9pt;
                }
            }
            .type {
                .downit {
                    position: relative!important;
                    background: #fff!important;
                    margin: 0 -10px;
                    height: 36px!important;
                    text-align: center;
                    padding: 8px;
                    margin-top: 10px;
                    margin-bottom: -10px;
                    border-bottom-left-radius: 10px;
                    border-bottom-right-radius: 10px;
                    cursor: pointer;
                    display: block!important;
                    border-bottom: 1px solid #e4e4ea;
                    border-left: 1px solid #e4e4ea;
                    border-right: 1px solid #e4e4ea;
                    i {
                        position: absolute;
                        left: 15px;
                    }
                }
            }
        }
    }
     
    .msg-file.quote-file .type {
    display: none;
}
.msg-file.quote-file .contents {
}

.msg-item-body {
    position: relative;
}
img.voice-pic.icon-file {
    width: 8px!important;
    height: initial !important;
}
.type-msg-quote{
     img.voice-pic.icon-file{
        width: 12px !important;
    }
    span{
        color: #fff;
    }
}

.im-other{
    .type-msg-quote{
        img.voice-pic.icon-file{
            width: 12px !important;
        }
        span{
            color: #B3B3B3;
        }
    }
}

.video-quote {
    width: 40px;
    height: 40px;
    position: relative;
    float: right;
    margin-top: -32px;
    .start{
        font-size: 13px !important;
        top: 14px !important;
        left: 14px !important;
    }
}
.no-background{
    background: transparent !important;
}
.no-pad{
    padding: 0 !important;
}

 ul.member-in-group li {
        display: inline-flex;
        width: 100%;
        line-height: 2.5;
        padding: 10px 0;
        position: relative;
        cursor: pointer;
        &:before {
            position: absolute;
            content: '';
            width: calc(100% - 50px);
            right: 0;
            bottom: 0;
            border-bottom: 1px solid #F0F3F4;
        }
        .el-avatar {
            img{
                width:50px !important;
                height: 50px !important;
            }
            &.with-status:before{
                        content: '';
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        width: 16px;
                        height: 16px;
                        border: 3px solid #f0f0f0;
                        background: var(--primary-color);
                        border-radius: 50%;
            }
                    position: relative;
                    overflow: inherit;
                    width:59.95px;
                    height: 50px;
                    line-height: 50px;
                    font-size: 18px;
                    text-transform: uppercase;
        }
        
        p {
            margin-left: 10px;
            font-size: 16px;
            font-weight: 100;
            color: #000;
            width: 100%;
            span {
                float: right;
                color: var(--primary-color);
                font-size: 14px;
                position: relative;
                top: 12px;
                background: #F0F3F4;
                padding: 4px 11px;
                line-height: initial;
                border-radius: 13px;
                &.green{
                    color: #00D94B;
                }
            }
        }
    }


.red-packet.open-red-packet .el-dialog {
    background: #F0F3F4;
    padding-bottom: 30px;
}

.red-packet.open-red-packet .el-dialog img.header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}

p.title-red {}

.red-packet .el-dialog .el-dialog__body p.title-red {
    position: relative;
    color: #fff;
    font-size: 17px;
    top: -50px;
}

.red-packet.open-red-packet .el-dialog__header {
    position: relative;
    z-index: 2;
}

.red-packet.open-red-packet .el-dialog span.el-avatar {
    position: relative;
    margin-top: -50px;
    width: 50px;
    height: 50px;
}

.red-packet.open-red-packet .el-dialog h3 {
    font-size: 15px;
    color: #000;
    margin: 5px 0;
}

.red-packet.open-red-packet .el-dialog p {
    color: #9DA2A5;
    font-size: 13px;
    margin: 10px 0;
}

.red-packet.open-red-packet .el-dialog h2.total-amount {
    font-size: 30px;
    color: #000;
    margin: 15px 0;
}

.red-packet.open-red-packet .el-dialog ul.member-in-group {}

.red-packet.open-red-packet .el-dialog ul.member-in-group span.el-avatar {
    margin-top: initial;
    width: 60px;
    height: 50px;
}

.red-packet.open-red-packet .el-dialog ul.member-in-group .info-red {
    display: block;
    width: 100%;
    text-align: left;
    padding-left: 9px;
    line-height: 1.9;
    border-bottom: 1px solid #D8D8D8;
}

.red-packet.open-red-packet .el-dialog ul.member-in-group p.price {
    position: absolute;
    right: 0;
    margin: 0;
    width: initial;
    font-size: 15px;
    font-weight: 900;
    color: #000;
}

.red-packet.open-red-packet .el-dialog ul.member-in-group .info-red p {
    margin: 0;
}

.red-packet.open-red-packet .el-dialog ul.member-in-group .info-red p.name {
    font-size: 15px;
    font-weight: 900;
    color: #000;
}
.top-list-open {
    background: #E5E8EA;
    margin-left: -20px;
    margin-right: -20px;
    text-align: left;
    position: relative;
}

.top-list-open p {
    margin: 0 !important;
    padding: 15px 8px;
    color: #000 !important;
}

.top-list-open p.right-side {
    position: absolute;
    top: 0;
    right: 0;
    color: #9DA2A5 !important;
}
.red-packet {
                        display: inline-flex;
                        color: #fff;
                        .chat-avatar{
                            position: relative;
                            top: 4px;
                        }
                         .chat-desc {
                            margin-left: 10px;
                            p {
                                margin: 0;
                                font-size: 16px;
                                font-weight: 700;
                                text-transform: capitalize;
                                &.status{
                                    font-size: 13px;
                                    font-weight: 100;
                                }
                            }
                        }
                    }
                    .red-packet-bo {
                        background: #FFB100 !important;
                        .quote-txt{
                            color: #fff !important;
                        }
                    }
                    .red-packet-white{
                        background-color: #fff !important;
                        color : #000 !important;
                        
                    }

                   
</style>