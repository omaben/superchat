<template>
    <div class="chat-box" >
        <div class="chat-item">

            <div class="chat-title">
                <div class="chat-top-title">
                    <div class="avatar-chat-info">
                        <el-avatar :class="{'with-status':chatInfo.onlineStatus=== 1}"  v-if="chatInfo.logo" :src="chatInfo.logo"></el-avatar>
                        <el-avatar  :class="{'with-status':chatInfo.onlineStatus=== 1}" v-else >{{chatInfo.avatar && chatInfo.avatar.slice(0,2)}}</el-avatar>
                        <div class="title" @click="detailInfo()">
                            <h2>{{chatInfo.avatar}}</h2>
                            <div v-if="roomType == MSG_TYPE.RECEIVE_TYPE_PRIVATE" class="tool-item">
                               {{chatInfo.onlineStatus === 2 ? getDateFIlter(chatInfo.lastOnlineTime) : $t('online')}}
                            </div>
                            <div @click="detailInfo()" v-if="roomType == MSG_TYPE.RECEIVE_TYPE_PUBLIC" class="tool-item">
                                {{$t('inGroup', [chatInfo.memberNum])}}
                            </div>
                        </div>
                        <div class="chat-tool">
                            
                            <!-- <div @click="detailInfo()" v-if="roomType == MSG_TYPE.RECEIVE_TYPE_PUBLIC" class="tool-item">
                                {{$t('inGroup', [chatMembers.length || chatInfo.memberNum])}}
                            </div> -->
                            <!-- |
                            <div class="tool-item" @click="openFiles()">
                                <i class="el-icon-picture-outline"></i>
                                {{$t('gallery')}}
                            </div>
                            |
                            <div class="tool-item" @click="closeFind">
                                <i class="el-icon-search"></i>
                                {{$t('find')}}
                            </div> -->
                        </div>
                        
                    </div>
                    <div class="tool-icon" @click="reInviteFriend()" v-if="chatInfo.resend && !hasSeleced">
                        <i class="el-icon-refresh-right"></i>
                    </div>
                    
                    <!-- <div class="tool-icon" @click="inviteFriend()" v-if="!hasSeleced">
                        <i class="el-icon-user"></i>
                    </div> -->
                    <!-- <div class="tool-icon" @click="withdrawMultiple()" v-if="hasSelecedWithdraw">
                        <i class="el-icon-s-release" style="color:red"></i>
                    </div> -->
                    <div class="tool-icon" @click="deleteMultiple()" v-if="hasSeleced">
                        <i class="el-icon-delete"></i>
                    </div> 
                    <div class="tool-icon" @click="cancelDeleteMultiple()" v-if="hasSeleced">
                        <i class="el-icon-close"></i>
                    </div>
                </div>
                
                <div class="chat-top-search" v-show='searchActive'>
                    <div class="search">
                            <div class="search-box">
                                <img src="@/assets/ss.png" alt="" />
                                <input type="text" v-model="search" @input="findMsg('')" @keydown="scrollListSearch($event)" :placeholder="$t('find')" />
                                <i class="el-icon-close find-icon" @click="cancelFind" v-show="listSearch.length>0"></i>
                            </div>
                            <div class="info-search">
                                <span>
                                    {{listSearchActive}} / {{searchNumber}}
                                </span>
                                <i class="el-icon-arrow-up find-icon" @click="searchUp" v-show="listSearchActive>0"></i>
                                <i class="el-icon-arrow-down find-icon" @click="searchDown" v-show='listSearchActive<listSearch.length'></i>
                            </div>
                    </div>
                </div>
            </div>
            <div class="roomNotice" v-if="chatInfo.topNotice === 1">{{chatInfo.roomNotice}}</div>
            <div @scroll="handleScroll" class="chat-msg" id="msgList" :class="[{'searchActive':searchActive},{'moticActive':showDialog},{'quotaActive':isShowQuote},{'topNoticePad':chatInfo.topNotice === 1}]">
                <div class="his-msg" v-if='noShowMessage' >{{$t('msgDesc2')}}</div>
                 
                <ul id="containerUL"   :class="{'hasSeleced':hasSeleced}">

                    <li v-for="(item,idx) in list" :key="idx" ref :class="{'searchActive':findSearch(item)}">
                        <p class="date-msg" v-show="checkDateMsg(item,idx)!=''"><span>{{checkDateMsg(item,idx)}}</span></p>
                        
                        <MsgItem 
                            v-if="isShowMsgItem"
                            :key="selectKey"
                            :id="'test'+forId(idx)"
                            :item="item"
                            @showBusinessCard="showBusinessCard"
                            :senderBefore='checkSenderBefore(idx)'
                            :senderAfter='checkSenderAfter(idx)'
                            @fileIsVoice='fileIsVoice'
                            @handleClick="handleClick"
                            @quote-msg="quoteMsgFunc"
                            :listSearch="listSearch"
                            @edit-msg="editMsgFun"
                            :mineRole="mineRole"
                            @noScroll="noScroll"
                            @showSlider="openSlider(idx)"
                            @showSliderVideo="openSliderVideo(idx)"
                            />

                    </li>
                </ul>
                
            </div>
            <div class="chat-sendMsg">
                <quote-msg></quote-msg>
                <send-msg v-show="!chatInfo.resend" @sendBusinessCard='sendBusinessCard' :quotaActive='isShowQuote' :eMsg='eMsg' @msgkeyChange='msgkeyChange'  @sendMsgs="sendMsgs" :keypressMsg='keypressMsg' @keypressMsgChange='keypressMsgChange' @motic='motic' @moticClose='moticClose' @sendRecord="sendRecord"   @chooseFile="chooseFile" ></send-msg>
                <div class="tool-icon" @click="reInviteFriend()" v-if="chatInfo.resend && !hasSeleced">
                        Please, add as friend
                </div>
            </div>
        </div>
        <div class="carousel-lingallery" v-if="showSlider">
                <img @click="showSlider = false" class="close-carousel" :src="require('@/assets/svg/close-carousel.svg')" alt="">
                <lingallery  :startImage='startImage'   :responsive='responsive' :items="bigImages"/>
                <!-- <agile ref="main" :fade="true">...</agile>
                <agile ref="thumbnails" :as-nav-for="[$refs.main]" :slides-to-show="4" autoplay>...</agile>
             -->
            </div>
        <div class="carousel-lingallery" v-if="showSliderVideo">
                <img @click="showSliderVideo = false" class="close-carousel" :src="require('@/assets/svg/close-carousel.svg')" alt="">
            
                    <carousel class="video-carousel" :per-page="1" :paginationEnabled='paginationEnabled' :navigationEnabled='navigationEnabled' :navigate-to="startVideo" :mouse-drag="true">
                        <slide v-for="(item,index) in bigVideo"  :key="index" @pagechange="handleSlideClick">
                            <video-player  class="vjs-custom-skin"
                                        ref="videoPlayer"
                                        :options="playerOptions[index]"
                                        :playsinline="true"
                                >
                            </video-player>
                        </slide>
                    </carousel>
        </div>
            
    </div>
</template>

<script>
import {
    mapGetters
} from 'vuex'
import SendMsg from './components/sendMsg'
import { imBackMessage } from "@/services";

import QuoteMsg from './components/quoteMsg'
import MsgItem from './components/MsgItem'
import { sendMsg,goimfilesUpload,findUsersByRoomId,imMsgReceipt,addUserRelation } from '@/services'
import MSG_TYPE ,{ handleMessage,decrypt } from "../../services/im/constant" //调试用
import {scroller} from 'vue-scrollto/src/scrollTo'
import {windowHide,windowHideReceipt} from 'tool/storage.js'
import { chatLocalMsgDAO,chatInRoomsDAO } from "@/services/db";

const firstScrollTo = scroller()
export default {
    components: {
        SendMsg,
        MsgItem,
        QuoteMsg
    },
    props: {
        noScrollActive: {
			type: Boolean,
			default: () => {
				return false
			}
        },
        
    },
    data() {
        return {
            paginationEnabled: false,
            navigationEnabled : true,
            playerOptions: [],
            currentId: 1,
            startImage:1,
            startVideo: 0,
            showSlider : false,
            responsive: true,
            hasSelecedWithdraw:false,
            hasSeleced:false,
            listMsgId: [],
            bigImages: [],
            bigVideo: [],
            showSliderVideo: false,
            nbrList:0,
            nbrSend:-1,
            nameFor: '',
            pageStart: 0,
            showInfoDialog: false,
            unReadNumScroll:0,
            quotaActive:false,
            sendMsgScroll:false,
            eMsg:false,
            infoUser: false,
            noScrollActiveData:this.noScrollActive,
            demoArr: Array(10).fill(0),
            sendVoice:false,
            voiceContent:'',
            keypressMsg: false,
            list: [],
            editData: {},
            editMsg:false,
            search:'',
            searchNumber:0,
            MSG_TYPE,
            roomType: -1,
            NmbrShow:10,
            searchglobal: false,
            roomEle: [],
            isToBottom: true,
            unreadMsg:false,
            lastScrollTop: 0,
            mineRole: 1, // 1成员,2管理员,3群主
            placeHeight: "90",
            quoteObj: null, // 对象置空为 null
            isShowQuote: false,
            listSend: [],
            isShowMsgItem: true,
            hasHistory: false,
            searchActive:false,
            showDialog:false,
            clickFind:false,
            clickHistory:false,
            hasHistoryVal:'',
            noShowMessage : false,
            listSearch:[],
            selectKey:0,
            listSearchActive:0,
            businessCard:false,
            infoBusinessCard:false,
            options : {
                container: '#containerUL',
                easing: 'ease-in',
                lazy: false,
                offset: 60,
                force: true,
                cancelable: true,
                onStart: function(element) {
                // scrolling started
                },
                onDone: function(element) {
                // scrolling is done
                },
                onCancel: function() {
                // scrolling has been interrupted
                },
                x: false,
                y: true
            }
        }
    },
    watch: {
        // todo 消息数需要用vuex
        noticeMsg(val){
            if(val){
            }
        },

        list(newVal, oldVal) {
            if (newVal) {
                let getInstance = chatInRoomsDAO.getInstance();
                if(newVal[0]){
                    getInstance.find(newVal[0].roomIdAndId).then((result)=>{
                         if(result){
                            let unReadNum=result.unReadNum
                            
                            if(unReadNum>0){
                                    this.unreadMsg=true
                                    this.scrollUnreadMsg(unReadNum)

                            }
                            else{
                                this.scrollWay();
                            }
                         }
                     })
                }
                     
                  
                    
                
            }
        },
        chatInfo(newVal,oldVal){
            // 改变之前 保存当前聊天信息
            // Save the current chat information before changing
            // this.setList(oldVal,this.list) //房间切换不缓存信息
            if(newVal){
                // 清空聊天信息
                // this.list=[]
                // 重新匹配当前聊天信息
                // Rematch the current chat information
                this.makeChats(newVal)

            }
        },
        chatMembers(val){
            if(val){
                this.makeRole()
            }
        }
    },
    computed: {
        ...mapGetters([
            'chatMembers',
            'chatInfo',
            'userInfo',
            'rooms',
            'roomsMemberObj',
            'friends',
            'noticeMsg',
            'unReadNum',
            'chatInRooms',
            'chatInRoomsPro',
            'usersObj',
            'roomsObj',
            'eVal'
        ]),
    },
    created() {
        // 根据 roomChatId 查看是否是 群聊 密聊
        // Check whether it is a group chat or secret chat according to roomChatId
        this.makeChats(this.chatInfo)
        
       
    },
    updated() {
        
        this.$bus.$off('sendRedPacket')
        this.$bus.$on('sendRedPacket', (data) => {
            this.sendRedPacket(data)
            
        })
        this.$bus.$off('hasSelected')
        this.$bus.$on('hasSelected', (data) => {
            this.hasSeleced=data
            
        })
        this.$bus.$off('deleteLocalMsg')
        this.$bus.$on('deleteLocalMsg', (msgId) => {
            let getInstanceLocal = chatLocalMsgDAO.getInstance();
                getInstanceLocal.delete(msgId).then(()=>{
                    let index=this.list.findIndex(item => item.msgId === msgId)
                    this.list.splice(index, 1);
                })
                
        })
        
        this.$bus.$off('searchActiveUp')
        this.$bus.$on('searchActiveUp', (data) => {
            this.closeFind()
            this.searchActive=data
            
        })
        this.$bus.$off('listMsgId')
        this.$bus.$on('listMsgId', (data) => {
            this.listMsgId.push(data)
            this.checkWithdraw()
        })
        this.$bus.$off('DelListMsgId')
        this.$bus.$on('DelListMsgId', (data) => {
            let index=this.listMsgId.findIndex(item => item === data)
            this.listMsgId.splice(index,1)
            this.checkWithdraw()
        })
        
        this.$bus.$off('usersupd:msg')
        this.$bus.$on('usersupd:msg', () => {
            this.updMsgItemCom()
        })
        if(this.list){
            this.nbrList=this.list.length-1
        }
        this.eMsg=false
        if(this.clickFind || this.clickHistory || this.unreadMsg || this.showInfoDialog || this.infoUser || this.searchglobal){
            this.showInfoDialog=false
            this.clickFind=false
            this.clickHistory=false
            this.unreadMsg=false
            this.infoUser=false
            this.searchglobal = false
        }else{
            this.noScrollActiveData=false
            
        }
        
        this.$bus.$on('isShowQuote', bool => {
                this.isShowQuote = bool;
        })
        
        /* this.$electron.ipcRenderer.on('windowHideReceipt', (event, arg) => {
            this.makeChats(this.chatInfo)
        }) */
    },
    mounted() {
        // 各个id说明
        // 密聊mid  群聊roomId 为了统一用的 id=mid(-)id=roomId => roomIdAndId
        // 房间列表id 即为roomId
        // Description of each id
        // Secret chat mid group chat roomId for unified use id=mid(-)id=roomId => roomIdAndId
        // Room list id is roomId
        this.$bus.$off("IM_CHAT")
        this.$bus.$on("IM_CHAT", data => {
            this.dealWithMsg(data);
            
        })
        
        this.dealEmit()
        
    },
    methods: {
        handleSlideClick (dataset) {
            console.log(dataset)
            this.playerOptions = {
                height: '360',
                autoplay: false,
                muted: true,
                language: 'zh',
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                sources: [{
                    type: "video/mp4",
                    // mp4
                    src: this.bigVideo[dataset.index].src,
                    // webm
                    // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
                }],
                poster: this.bigVideo[dataset.index].thumbnail,
            }
        },
        openSliderVideo(i){
            this.bigVideo = []
                this.list.forEach((element,index) => {
                        if(element.msgType === MSG_TYPE.IM_MSG_TYPE_VIDEO){
                            let item = {
                                    src: JSON.parse(element.msg).url,
                                    thumbnail: JSON.parse(element.msg).thumbUrl,
                                    id: index
                            }
                            this.bigVideo.push(item)
                            let playerOptions = {
                                height: '360',
                                autoplay: false,
                                muted: true,
                                language: 'zh',
                                playbackRates: [0.7, 1.0, 1.5, 2.0],
                                sources: [{
                                    type: "video/mp4",
                                    // mp4
                                    src: item.src,
                                    // webm
                                    // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
                                }],
                                poster: item.thumbnail,
                            }
                            this.playerOptions.push(playerOptions)
                        }
                    });
            this.startVideo = this.bigVideo.findIndex(qry => qry.id === i)
            
            this.showSliderVideo = true
        },
        openSlider(i){
            
            this.bigImages = []
                this.list.forEach((element,index) => {
                        if(element.msgType === MSG_TYPE.IM_MSG_TYPE_PICTURE){
                            let item = {
                                    src: JSON.parse(element.msg).url,
                                    thumbnail: JSON.parse(element.msg).thumbUrl,
                                    id: index
                            }
                            this.bigImages.push(item)
                        }
                    
                    });
            console.log(this.bigImages,'this.bigImages')
            let that = this
            this.startImage = this.bigImages.findIndex(qry => qry.id === i)
            that.showSlider = true
        },
        async showBusinessCard(friend){
             let uid = friend.friendId;
             if(uid === this.userInfo.id){
                 return
             }
             let chatRoom2 = {}
                let userInfo = await this.fixInfo(1, {
                    userId: uid,
                }).catch((err) => {
                    this.$bus.$emit('show_dialog_err',err)
                });
                if(userInfo){
                    //userInfo.avatar=userInfo.nikeName
                    this.$store.commit('UPDATE_FRIENDS',userInfo)
                    userInfo.avatar = userInfo.nikeName;
                    chatRoom2 = {...userInfo, roomType:1,isFromGroup: this.chatInfo.roomType }

                    let roomIdAndId = this.setRoomIdsId(userInfo.id, 1)
                    let getInstance = chatInRoomsDAO.getInstance();
                    let chatRoom = await getInstance.find(roomIdAndId)
                    if(chatRoom){
                        getInstance.update(chatRoom).then(()=>{
                            getInstance.get().then(result=>{
                                this.$store.commit('SET_CHATIN_ROOMS', result)
                            })
                        })
                    }

                    this.$store.dispatch('setDetailFriend',true)
                        this.$bus.$emit("getImages",0,[],[])
                        let images = []
                        let bigImages = []
                        chatLocalMsgDAO.getInstance().findByRoomIdAndId(roomIdAndId).toArray()
                            .then((listData)=> {
                                let imagesList = listData.filter(qry=>qry.msgType === MSG_TYPE.IM_MSG_TYPE_PICTURE)
                                imagesList.forEach(qry =>{
                                    images.push(JSON.parse(qry.msg).thumbUrl)
                                    bigImages.push(JSON.parse(qry.msg))
                            })
                            this.$bus.$emit("getImages",images.length > 16 ? 16 : images.length,images,bigImages)
                                

                    })

                }
            this.$bus.$emit("openDetails", chatRoom2 )
        
        },
        sendBusinessCard(friend){
            this.businessCard=true
            this.sendMsgs(friend)
            
        },
        datesAreOnSameDay (first, second){
            if(first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate()){
                return true
            }else{
                return false
            }
        },
        getDateFIlter(date){
            if(date.toString().length === 10){
                date = date * 1000
            }
            let currentMsgDate= 0
            let currentdate = ''
            let today = new Date()
            let yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)
            currentMsgDate = this.filterDate(date,'YYYY-MM-DD')
            if(this.datesAreOnSameDay(new Date(currentMsgDate),today)){
                currentdate = this.$t('today')+' '+this.filterDate(date,'HH:mm')
            }
            else if(this.datesAreOnSameDay(new Date(currentMsgDate),yesterday)){
                currentdate = this.$t('yesterday')+' '+this.filterDate(date,'HH:mm')
            }else{
                currentdate = this.$t('last_seen')+' '+this.filterDate(date,'YYYY-MM-DD HH:mm')
            }
            return currentdate
        },
        checkDateMsg(msg,idx){
            let currentMsgDate= 0
            let beforeMsgDate= 0
            let currentdate = ''
            let today = new Date()
            let yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)
            if(this.list[idx - 1]){
                currentMsgDate = this.filterDate(msg.sendTime,'YYYY-MM-DD')
                beforeMsgDate = this.filterDate(this.list[idx - 1].sendTime,'YYYY-MM-DD')
                if(!this.datesAreOnSameDay(new Date(currentMsgDate),new Date(beforeMsgDate))){
                    if(this.datesAreOnSameDay(new Date(currentMsgDate),today)){
                        currentdate = this.$t('today')
                    }
                    else if(this.datesAreOnSameDay(new Date(currentMsgDate),yesterday)){
                        currentdate = this.$t('yesterday')
                    }else{
                        currentdate = currentMsgDate
                    }
                    
                }
            }else{
                currentMsgDate = this.filterDate(msg.sendTime,'YYYY-MM-DD')
                if(this.datesAreOnSameDay(new Date(currentMsgDate),today)){
                    currentdate = this.$t('today')

                }
                else if(this.datesAreOnSameDay(new Date(currentMsgDate),yesterday)){
                    currentdate = this.$t('yesterday')
                }else{
                    currentdate = currentMsgDate
                }
            }
            return currentdate
        },
        checkSenderBefore(idx){
            let val = false
            if(this.list[idx - 1]){
                if(this.list[idx].senderId === this.list[idx - 1].senderId){
                    val = true
                }
            }
            return val
        },
        checkSenderAfter(idx){
            let val = false
            if(this.list[idx + 1]){
                if(this.list[idx].senderId === this.list[idx + 1].senderId){
                    val = true
                }
            }
            return val
        },
        handleScroll: function(el) {
            if(!this.sendMsgScroll &&  (el.target.offsetHeight + el.target.scrollTop) >= el.target.scrollHeight){

                this.getHistoryBottomLast()
            }
            else{
                this.sendMsgScroll = false
            }
            if( el.target.scrollTop <=0 ){

                this.getHistoryTopLast()
            } 
        },
        async getHistoryBottom(){
            let roomIdAndId = this.chatInfo.roomIdAndId
            let chatByRoomId = await chatLocalMsgDAO.getInstance().getLimit(roomIdAndId,65).toArray()
                
            chatByRoomId.sort(function (a, b) {
                return a.msgId - b.msgId;
            });
            this.list = [...chatByRoomId]
            console.log(1,this.list)

            chatByRoomId.length = 0;
        },
        async getHistoryBottomLast(){
            
            if (this.list.length<1){
                return
            }
            let roomIdAndId = this.chatInfo.roomIdAndId
            let listAll=await chatLocalMsgDAO.getInstance().getLimitBottom(roomIdAndId,15,this.list[this.list.length - 1].msgId).toArray()
            let lastMsgId = false
            if(listAll.length<15){
                lastMsgId = true
            }
            if(listAll.length>0){
                this.list.splice(0,listAll.length)
                this.list.push.apply(this.list, listAll);
            }
            this.clickHistory=true
                this.noScroll()
                let contaner = document.querySelector("#msgList");

                if(!lastMsgId){
                    contaner.scrollTop = contaner.scrollHeight - 1000;       
                }else{

                    contaner.scrollTop = contaner.scrollHeight;       
                }
                this.noShowMessage= false
            listAll.length = 0;
        },
        async getHistoryTopLast(){
            if (this.list.length<1){
                return
            }
            let roomIdAndId = this.chatInfo.roomIdAndId
            let listAll=await chatLocalMsgDAO.getInstance().getLimitTop(roomIdAndId,15,this.list[0].msgId).toArray()
            listAll.sort(function (a, b) {
                return a.msgId - b.msgId;
                });
            if(listAll.length<15){
                this.noShowMessage= true
            }
            if(listAll.length>0){
                this.list.splice(this.list.length - listAll.length,listAll.length)
                this.list.unshift.apply(this.list, listAll);
            }
            this.clickHistory=true
                this.noScroll()
                let contaner = document.querySelector("#msgList");

                if(!this.noShowMessage){
                    contaner.scrollTop = 400;       
                }else{
                    contaner.scrollTop = 0;       
                }
            listAll.length = 0;
        },
        checkWithdraw() {
            let getInstanceLocal = chatLocalMsgDAO.getInstance();
            let item
            this.listMsgId.forEach(msgId => {
                getInstanceLocal.find(msgId).then(result=>{
                    if(result.isMine !== MSG_TYPE.IS_MINE){
                        item=true
                    }
                    if(item){
                        this.hasSelecedWithdraw=false
                    }else{
                        this.hasSelecedWithdraw=true
                    }
                })

            })
        },
        withdrawMultiple(){
            let getInstanceLocal = chatLocalMsgDAO.getInstance();
            this.listMsgId.forEach(msgId => {
                getInstanceLocal.find(msgId).then(item=>{
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
                                "roomId":0,
                                "senderId":this.userInfo.id,
                                "sendTime":0,
                                "msgType":7,
                                "msg": `{"noticeType":25,"pointUser":null,"pointUsers":null,"controUser":null,"room":null,"muteInt":0,"message":{"nikeName":"${this.userInfo.nikeName}"},"msgReadTime":0,"readMsgId":0,"backMsgId":0}`,
                                "msgId":item.msgId,
                                "receiverId":this.chatInfo.id,
                                "senderName":"您",
                                "senderHead":"http://18.162.115.225:9091/attachments/chatim/head/20210203/98e8208d171bebf192a859a93932d84d.png",
                                "senderLevel":0,
                                "receiveType":0,
                                "account":"",
                                "quoteMsgId":0,
                                "replyType":0
                            }
                            // 清除本地对应缓存
                            // Clear the local corresponding cache
                            let noticeDelete={...cdata}
                            noticeDelete.msgId=item.msgId
                            let getInstanceRooms = chatInRoomsDAO.getInstance();
                            let that = this
                            getInstanceLocal.update(noticeDelete).then(() => {
                                getInstanceRooms.find(item.roomIdAndId).then((result) => {
                                    if (result) {
                                        getInstanceLocal.findByRoomIdAndId(item.roomIdAndId).last().then((lastMessage)=>{
                                            that.$store.dispatch('AddChatInRooms',lastMessage)
                                            that.$bus.$emit("updateLocalMsg",noticeDelete)
                                        })				
                                    } 
                                });
                            })
                        }else{
                            this.$message.error(res.message)
                        }
                    })
                })
            })
        },
        deleteMultiple(){
            let getInstanceLocal = chatLocalMsgDAO.getInstance();
            this.listMsgId.forEach(msgId => {
                getInstanceLocal.delete(msgId)
                let index=this.list.findIndex(item => item.msgId === msgId)
                this.list.splice(index, 1);
                this.cancelDeleteMultiple()
            })
        },
        cancelDeleteMultiple(){
            this.hasSeleced=false
            this.listMsgId=[]
            if(this.selectKey===0){
                this.selectKey=1
            }else{
                this.selectKey=0
            }
            
        },
        async testMsg(){
            let data = {
                "roomId":0,
                "senderId":156,
                "sendTime":1608795305,
                "msgType":1,
                "msg":"\"aabdfgjdlgj\"",
                "msgId":3185,
                "receiverId":168,
                "senderName":"+971567154752",
                "senderHead":"",
                "senderLevel":0,
                "receiveType":1,
                "account":""
            }
            let dataImage = {
                "isAdmin":1,
                "msgType":2,
                "msg":"{\"littlePicSizeWidth\":\"1280\",\"littlePicSizeHeight\":\"427\",\"littlePicUrl\":\"http://192.168.8.32:9091/attachments/chatim/user/20201226/170-70/98e8208d171bebf192a859a93932d84d_thumb.png\",\"picSizeWidth\":\"719\",\"picSizeHeight\":\"240\",\"picUrl\":\"http://192.168.8.32:9091/attachments/chatim/user/20201226/170-70/98e8208d171bebf192a859a93932d84d.png\"}",
                "sendTime":1608968887,
                "roomId":85,
                "receiveType":2,
                "senderName":"+971567154752",
            }
            let dataVideo =  {
                "isAdmin":1,
                "msgType":3,
                "msg":"{\"littlePicSizeWidth\":\"960\",\"littlePicSizeHeight\":\"544\",\"littlePicUrl\":\"http://192.168.8.32:9091/attachments/chatim/user/20201226/170-70/330a0e513b874d13bdd33f15176babe1_thumb.jpg\",\"picSizeWidth\":\"240\",\"picSizeHeight\":\"240\",\"url\":\"http://192.168.8.32:9091/attachments/chatim/user/20201226/170-70/330a0e513b874d13bdd33f15176babe1.mp4\",\"duration\":\"22.747033\",\"size\":\"3.54\"}",
                "sendTime":1608968991,
                "roomId":85,
                "receiveType":2,
                "senderName":"+971567154752",
            }
            let dataNoticeArr = [
                {"roomId":70,"senderId":170,"sendTime":1608982690,"msgType":7,"msg":"{\"noticeType\":15,\"pointUser\":null,\"pointUsers\":[{\"id\":168,\"account\":\"+9710527123124\",\"nikeName\":\"+9710527123124\",\"photo\":\"\",\"sex\":3,\"birthday\":\"\",\"address\":\"\",\"sign\":\"\",\"openNotice\":1,\"friendStatus\":0,\"applyTime\":0,\"myStatus\":0,\"remark\":\"\",\"balance\":0}],\"controUser\":{\"id\":170,\"account\":\"+9710527123126\",\"nikeName\":\"+9710527123126\",\"photo\":\"\",\"sex\":3,\"birthday\":\"\",\"address\":\"\",\"sign\":\"\",\"openNotice\":1,\"friendStatus\":0,\"applyTime\":0,\"myStatus\":0,\"remark\":\"\",\"balance\":0},\"room\":{\"id\":85,\"logo\":\"\",\"name\":\"aab\",\"roomChatId\":\"05106030\",\"memberNum\":2,\"roomNotice\":\"\",\"createTime\":1608966753,\"status\":1,\"deleteTime\":0,\"creatorId\":170},\"muteInt\":0,\"message\":\"将+9710527123124,邀请进入群聊\"}","msgId":3391,"receiverId":0,"senderName":"+9710527123126","senderHead":"","senderLevel":3,"receiveType":0,"account":""},
                {"roomId":85,"senderId":156,"sendTime":1608981555,"msgType":7,"msg":"{\"noticeType\":12,\"pointUser\":{\"id\":173,\"account\":\"+9710527123125\",\"nikeName\":\"+9710527123125\",\"photo\":\"\",\"sex\":3,\"birthday\":\"\",\"address\":\"\",\"sign\":\"\",\"openNotice\":1,\"friendStatus\":0,\"applyTime\":0,\"myStatus\":0,\"remark\":\"\",\"balance\":0},\"pointUsers\":null,\"controUser\":{\"id\":170,\"account\":\"+9710527123126\",\"nikeName\":\"+9710527123126\",\"photo\":\"\",\"sex\":3,\"birthday\":\"\",\"address\":\"\",\"sign\":\"\",\"openNotice\":1,\"friendStatus\":0,\"applyTime\":0,\"myStatus\":0,\"remark\":\"\",\"balance\":0},\"room\":{\"id\":85,\"logo\":\"\",\"name\":\"aab\",\"roomChatId\":\"05106030\",\"memberNum\":1,\"roomNotice\":\"\",\"createTime\":1608966753,\"status\":1,\"deleteTime\":0,\"creatorId\":170},\"muteInt\":0,\"message\":\"将+9710527123125移出了群聊\"}","msgId":3381,"receiverId":0,"senderName":"+9710527123126","senderHead":"","senderLevel":3,"receiveType":0,"account":""},
                {"roomId":85,"senderId":170,"sendTime":1608982587,"msgType":7,"msg":"{\"noticeType\":15,\"pointUser\":null,\"pointUsers\":[{\"id\":168,\"account\":\"+9710527123124\",\"nikeName\":\"+9710527123124\",\"photo\":\"\",\"sex\":3,\"birthday\":\"\",\"address\":\"\",\"sign\":\"\",\"openNotice\":1,\"friendStatus\":0,\"applyTime\":0,\"myStatus\":0,\"remark\":\"\",\"balance\":0},{\"id\":173,\"account\":\"+9710527123125\",\"nikeName\":\"+9710527123125\",\"photo\":\"\",\"sex\":3,\"birthday\":\"\",\"address\":\"\",\"sign\":\"\",\"openNotice\":1,\"friendStatus\":0,\"applyTime\":0,\"myStatus\":0,\"remark\":\"\",\"balance\":0}],\"controUser\":{\"id\":170,\"account\":\"+9710527123126\",\"nikeName\":\"+9710527123126\",\"photo\":\"\",\"sex\":3,\"birthday\":\"\",\"address\":\"\",\"sign\":\"\",\"openNotice\":1,\"friendStatus\":0,\"applyTime\":0,\"myStatus\":0,\"remark\":\"\",\"balance\":0},\"room\":{\"id\":85,\"logo\":\"\",\"name\":\"aab\",\"roomChatId\":\"05106030\",\"memberNum\":3,\"roomNotice\":\"\",\"createTime\":1608966753,\"status\":1,\"deleteTime\":0,\"creatorId\":170},\"muteInt\":0,\"message\":\"将+9710527123124,+9710527123125,邀请进入群聊\"}","msgId":3385,"receiverId":0,"senderName":"+9710527123126","senderHead":"","senderLevel":3,"receiveType":0,"account":""},
                {"roomId":85,"senderId":172,"sendTime":1608982587,"msgType":7,"msg":"{\"noticeType\":15,\"pointUser\":null,\"pointUsers\":[{\"id\":168,\"account\":\"+9710527123124\",\"nikeName\":\"+9710527123124\",\"photo\":\"\",\"sex\":3,\"birthday\":\"\",\"address\":\"\",\"sign\":\"\",\"openNotice\":1,\"friendStatus\":0,\"applyTime\":0,\"myStatus\":0,\"remark\":\"\",\"balance\":0},{\"id\":173,\"account\":\"+9710527123125\",\"nikeName\":\"+9710527123125\",\"photo\":\"\",\"sex\":3,\"birthday\":\"\",\"address\":\"\",\"sign\":\"\",\"openNotice\":1,\"friendStatus\":0,\"applyTime\":0,\"myStatus\":0,\"remark\":\"\",\"balance\":0}],\"controUser\":{\"id\":170,\"account\":\"+9710527123126\",\"nikeName\":\"+9710527123126\",\"photo\":\"\",\"sex\":3,\"birthday\":\"\",\"address\":\"\",\"sign\":\"\",\"openNotice\":1,\"friendStatus\":0,\"applyTime\":0,\"myStatus\":0,\"remark\":\"\",\"balance\":0},\"room\":{\"id\":85,\"logo\":\"\",\"name\":\"aab\",\"roomChatId\":\"05106030\",\"memberNum\":3,\"roomNotice\":\"\",\"createTime\":1608966753,\"status\":1,\"deleteTime\":0,\"creatorId\":170},\"muteInt\":0,\"message\":\"将+9710527123124,+9710527123125,邀请进入群聊233\"}","msgId":3385,"receiverId":0,"senderName":"+9710527123126","senderHead":"","senderLevel":3,"receiveType":0,"account":""},
            ]
            this.sendMsgScroll=true
            await this.getHistoryBottom()
            this.list.push(data);
            this.dealWithMsg(data)
        },
        hasHistoryText(){
            let that = this
                if(that.hasHistory){
                
                that.hasHistoryVal=that.$t('msgDesc1')
                }
                else{
                    that.hasHistoryVal = that.$t('msgDesc2')
                }                              
        },
        dealEmit(){
            // 重置消息
            // reset message
            this.$bus.$off('scrollInfoUser')
            this.$bus.$on('scrollInfoUser',data =>{
                this.infoUser=data
            })
            
            this.$bus.$off('setRlist')
            this.$bus.$on('setRlist',data => {
                this.isToBottom = false
              
                this.list = data
                // 撤回消息 不能直接滚到底部
                // Withdraw the message can not be directly scrolled to the bottom
                this.$forceUpdate()
            })
            this.$bus.$off('deleteLocalMsg')
            this.$bus.$on('deleteLocalMsg',(data) => {
                this.list.find((item,index)=>{
                    if(item.msgId===data.msgId){
                        this.isToBottom = false
                        this.list.splice(index, 1);
                    }
                })
            })
            this.$bus.$off('updateLocalMsg')
            this.$bus.$on('updateLocalMsg',(data) => {
                this.list.find((item,index)=>{
                    if(item.msgId===data.msgId){
                        this.isToBottom = false
                        this.list.splice(index, 1, data);
                    }
                })
            })
            
            // 更新消息
            // update message
            this.$bus.$off('updRlist')
            this.$bus.$on('updRlist',(itemList) => {
                if(itemList){
                    this.list.map((item,index)=>{
                        if(item && item.msgId<=itemList.msgId){
                            let itemL={...item}
                                itemL.isRead=true
                            this.list[index]=itemL
                            
                        }
                    })
                    let getInstance = chatLocalMsgDAO.getInstance();
                    if(this.chatInfo.id!=itemList.roomIdAndId){
                                getInstance.findByRoomIdAndId(itemList.roomIdAndId).toArray().then((list)=>{
                                    if(list){
                                            list.forEach(item => {
                                                if(item.msgId<=itemList.msgId){
                                                    if(!item.isRead){
                                                        item.isRead=true
                                                        getInstance.update(item)
                                                    }
                                                    
                                                }
                                            });
                                    }
                                })   
                    }
                }
                
                //this.$forceUpdate()
                
            })
            
            // 引用状态
            // reference status
            this.$bus.$off('isShowQuote')
            this.$bus.$on('isShowQuote', bool => {
                this.isShowQuote = bool;

            })
            // 输入框高度修改
            // Modify the height of the input box
            this.$bus.$off('placeHeight')
            this.$bus.$on('placeHeight',(height) => {
                if(this.isShowQuote){
                    this.placeHeight = 150
                }else{
                    this.placeHeight = height
                }
                    this.scrollWay();
                
            })
            // 输入自定义表情
            // Enter a custom emoji
            this.$bus.$off('sendCusFace')
            this.$bus.$on('sendCusFace',(msg) => {
                this.sendInsertFace(msg);
            })
            // 滑动到指定引用信息位置
            // Slide to the specified reference information position
            this.$bus.$off('atQuote')
            this.$bus.$on('atQuote',data => {
                //this.scrollToQuote(data)
                this.scrollToMsg(data)
            })
            // 强制更新
            // mandatory update
            this.$bus.$off('usersupd:msg')
            this.$bus.$on('usersupd:msg', () => {
                this.updMsgItemCom()
            })
            // 重发
            // Resend
            this.$bus.$off('resend')
            this.$bus.$on('resend', (data) => {
                this.dealResend(data)
            })
            this.$bus.$off('hide_info')
            this.$bus.$on('hide_info',(data) => {
                this.showInfoDialog=true
                //this.infoUser=false
                this.noScrollActiveData=true
            })
            // global search
            this.$bus.$off('globalSearch')
            this.$bus.$on('globalSearch',(msg,idx) => {
                this.search=msg
                setTimeout(() => {
                    this.findMsg(idx);
                    
                }, 1500);
                
            })
        },
        // 更新 msgItem组件
        // Update the msgItem component
        updMsgItemCom(){
            this.isShowMsgItem = false;
            this.$nextTick(()=> {
                this.isShowMsgItem = true;
            })
        },
        msgkeyChange(val){
            this.eMsg=val
        },
        keypressMsgChange(val){
            this.keypressMsg=val
        },
        noScroll(){
            this.noScrollActiveData=true
        },
        scroll(id) {  
            document.getElementById(id).scrollIntoView({
                behavior: "smooth"
            });
            var target = document.getElementById(id);
            target.parentNode.scrollTop = target.offsetTop; 
        },
        findSearch(item){
            let active
            let findSearch = this.listSearch.filter(v => v.msgId==item.msgId) || null
           if(findSearch.length>0){
               return true
               
           }else{
               return false
           }
            
        },
        async scrollToMsg(dataNew,idx){
            let data = dataNew
            if(this.list.length>0){
                var elm = this.list.find(qry=>qry.msgId===data)
                
                if(elm){
                        //i should get index of elm
                        //let dom = this.getElementByAttr('div','id',data)[0];

                        //this.$(dom).addClass('masks')
                    var elems = document.querySelectorAll(".msg-item.masks");
                    [].forEach.call(elems, function(el) {
                            el.classList.remove("masks");
                    });
                    this.$nextTick(() => {
                        let contaner = document.querySelector("#msgList");
                        let dom = this.getElementByAttr('div','id',data)[0];
                        this.$(dom).addClass('masks')
                        let clientHeight = document.body.clientHeight;
                        if(dom&&dom.offsetTop){
                            contaner.scrollTop = dom.offsetTop - (clientHeight/2);

                            // 动画
                            // animation
                            this.$(dom).addClass('masks')
                        
                        }
                    })
                }else{
                   
                    let i=this.list[0].msgId
                    if(i>data){
                        do 
                            {
                                await this.getHistoryTopLast()
                                i=this.list[0].msgId
                            }
                        while (i > data)
                    }
                    else if(this.list[this.list.length - 1].msgId<data){
                            do 
                                {
                                    await this.getHistoryBottomLast()
                                }
                            while (this.list[this.list.length - 1].msgId < data)
                    }
                        
                    this.scrollToMsg(data)
                }
                this.clickHistory=true
                this.noScroll()
            }
            else{
                
            }
            
        },
        scrollListSearch(e){
             if(e.keyCode == 13) {
                if(this.listSearch.length>0){
                    var elems = document.querySelectorAll(".msg-item.masks");
                    [].forEach.call(elems, function(el) {
                        el.classList.remove("masks");
                    });
                    this.listSearchActive--
                    if(this.listSearchActive>0){
                    this.scrollToMsg(this.listSearch[this.listSearchActive - 1].msgId)
                    }
                    else{
                        this.listSearchActive=this.searchNumber
                        this.scrollToMsg(this.listSearch[this.searchNumber - 1].msgId)
                    }
                }
            }
            
        },
        searchUp(){
            if(this.listSearch.length>0){
                if(this.listSearchActive>1){
                    var elems = document.querySelectorAll(".msg-item.masks");
                    [].forEach.call(elems, function(el) {
                        el.classList.remove("masks");
                    });
                    this.listSearchActive--
                    this.scrollToMsg(this.listSearch[this.listSearchActive - 1].msgId)
                }
                    
            }
        },
        searchDown(){
            if(this.listSearch.length>0){
                if(this.listSearchActive<this.listSearch.length){
                    var elems = document.querySelectorAll(".msg-item.masks");
                    [].forEach.call(elems, function(el) {
                        el.classList.remove("masks");
                    });
                    this.listSearchActive++
                    this.scrollToMsg(this.listSearch[this.listSearchActive - 1].msgId)
                }
                    
            }
        },
        closeFind(){
            this.clickFind=true
            this.noScrollActiveData=true
            var elems = document.querySelectorAll(".msg-item.masks");
            [].forEach.call(elems, function(el) {
                el.classList.remove("masks");
            });
            this.searchNumber=0
            this.listSearchActive=0
            this.listSearch=[]
            this.searchActive=!this.searchActive
            this.search=''

        },
        cancelFind(){
            var elems = document.querySelectorAll(".msg-item.masks");
            [].forEach.call(elems, function(el) {
                el.classList.remove("masks");
            });
            this.searchNumber=0
            this.listSearchActive=0
            this.listSearch=[]
            this.search=''
        },
        async findMsg(idx){
            var elems = document.querySelectorAll(".msg-item.masks");
            [].forEach.call(elems, function(el) {
                el.classList.remove("masks");
            });

            this.searchNumber=0
            this.listSearchActive=0
            this.listSearch=[]
            let roomIdAndId 
            if(idx){
                roomIdAndId=idx
                //this.searchglobal=true
                //this.noScroll()
            }else{
                roomIdAndId = this.chatInfo.roomIdAndId
            }
            await chatLocalMsgDAO.getInstance().findByRoomIdAndId(roomIdAndId).toArray()
                .then((listData)=> {

                    listData.filter(v=>{
                        if(v.msgType === MSG_TYPE.IM_MSG_TYPE_TEXT || v.msgType === MSG_TYPE.IM_MSG_TYPE_QUOTE){

                            if(this.search!=''&& JSON.parse(v.msg).message&& JSON.parse(v.msg).message.toLowerCase().includes(this.search.toLowerCase()) ){
                                this.searchNumber++
                                this.listSearch.push(v)
                            }
                        }
                    })

                })
            
            if(this.listSearch.length>0){
                this.listSearchActive=this.searchNumber
                this.scrollToMsg(this.listSearch[this.searchNumber - 1].msgId,idx)
            }
        },
        
        async openFiles(){
            let roomIdAndId = this.chatInfo.roomIdAndId
            await chatLocalMsgDAO.getInstance().findByRoomIdAndId(roomIdAndId).toArray()
                .then((listData)=> {
                    this.$emit('openFiles',listData)

            })
        },
        // edit message 
        editMsgFun(data){
            this.noScroll()
            this.$store.commit('SET_EVAL', data.message)
            this.editMsg=true
            this.editData=data
        },
        // 引用方法
        // reference method
        quoteMsgFunc(data){
            if(data.isMine==MSG_TYPE.IS_MINE){
                
            }
            this.quoteObj = data;
        },
        // 已读详情权限
        // read details permissions
        makeRole(){
            let roomType = this.chatInfo.roomType || this.getRoomTypes(this.chatInfo.roomIdAndId)
            if(roomType==MSG_TYPE.RECEIVE_TYPE_PUBLIC){
                let id = this.userInfo.id
                let actIndex = this.chatMembers.findIndex((value, index, arr) => {
                    return (value.id == id)
                })
                if(this.chatMembers[actIndex]){
                    this.mineRole = this.chatMembers[actIndex].role
                }
            }else{
                // 密聊不显示已读详情
                // Secret chat does not display the read details
                this.mineRole = 1 
            }
        },
        async setList(oldVal,list){
            let key
            let roomType = this.roomType
            if (oldVal.roomIdAndId) {
                key = oldVal.roomIdAndId
            } else {
                if (roomType==MSG_TYPE.RECEIVE_TYPE_PUBLIC) {
                    key = this.setRoomIdsId(oldVal.id||oldVal.roomId, roomType)
                } else if(roomType==MSG_TYPE.RECEIVE_TYPE_PRIVATE){
                    key = this.setRoomIdsId(oldVal.id||oldVal.mid, roomType)
                }

            }

            let DELKEY = this.getUserStore("DELKEY")
            

            if (
				key == `NaN_${roomType}` ||
				key == `undefined_${roomType}`
			) {
				return;
			}
            // 添加好友 添加房间 判断是否等于 delkey .
            // 如果等于 则置为空 ’‘ 。否则不能缓存消息
            // Add friends add room to determine whether it is equal to delkey.
            // If it is equal, set it to empty ’’. Otherwise the message cannot be cached
            if(list&&list.length>0&&key&&DELKEY!=key&&DELKEY!="null"){
                let getInstance = await chatLocalMsgDAO.getInstance();
                let key
                list.forEach(item=>{
                    if(item){
                        if(item.roomIdAndId){
                            key = item.roomIdAndId
                        }else{
                            if (item.roomType==MSG_TYPE.RECEIVE_TYPE_PUBLIC) {
                                key = this.setRoomIdsId(item.id||item.roomId, item.roomType)
                            } else if(this.roomType==MSG_TYPE.RECEIVE_TYPE_PRIVATE){
                                key = this.setRoomIdsId(item.id||item.mid, item.roomType)
                            }
                        }
                        item.roomIdAndId=key
                         if(item.msgId && item.msg!=""){

                            getInstance.find(item.msgId)
                            .then(async(result) => {
                                if(!result){
                                    await chatLocalMsgDAO.getInstance().add(item)
                                    this.$bus.$emit("imgList", item.roomIdAndId)

                                }
                            })

                        }
                    }
                })
            }
            
        },
        getList(newVal){
           this.cancelDeleteMultiple()
            let key
            this.noShowMessage=false
            let listReceiptRead = 0
            let getInstanceUpRead = this.chatLocalMsgDAO.getInstance();
            if(this.list.length>0){
                let valueDB
                let oldroomIdAndId=this.list[this.list.length-1].roomIdAndId
                this.list.map((item)=>{
                    if(!valueDB){
                        if(item && !item.isRead){
                            valueDB=item.msgId
                        }
                    }
                })
                getInstanceUpRead.findByRoomIdAndId(oldroomIdAndId).toArray().then(result=>{
                    if(result){
                        result.map((item)=>{
                            if(valueDB){
                                if(item.msgId<valueDB){
                                    item.isRead=true
                                    getInstanceUpRead.update(item)
                                }
                            }else{
                                item.isRead=true
                                getInstanceUpRead.update(item)
                            }
                            
                        })
                    }
                })
                this.list=[]
            }
            
            if(newVal.roomIdAndId){
                key = newVal.roomIdAndId
            }else{
                if (this.roomType==MSG_TYPE.RECEIVE_TYPE_PUBLIC) {
                    key = this.setRoomIdsId(newVal.id||newVal.roomId, this.roomType)
                } else if(this.roomType==MSG_TYPE.RECEIVE_TYPE_PRIVATE){
                    key = this.setRoomIdsId(newVal.id||newVal.mid, this.roomType)
                }
            }
            newVal.roomIdAndId = key;
                (async () => {
                    if(newVal.id==-1)return

                    let getInstance = chatInRoomsDAO.getInstance();  
                    if(newVal.isFirst && sessionStorage.getItem('onLine')!='false'){
                        newVal.isFirst=false
                        
                        getInstance.update(newVal).then(()=>{
                            
                            getInstance
							.get()
							.then((result) => {
                                this.$store.commit('SET_CHATIN_ROOMS', result)
                            })
                            .catch((e) => {
                                    console.log("err_or: ", e);
                            });
                        })
                        /* if(newVal.roomType==MSG_TYPE.RECEIVE_TYPE_PUBLIC){
                            
                            let roomInfo = await this.fixInfo(2, {
                                roomIds: [newVal.roomId | newVal.id],
                            }).catch((err) => {
                                this.$bus.$emit("show_dialog_err", err);
                            });
                            if (roomInfo) {

                                // 更新当前群信息
                                // Update current group information
                                let info = { ...newVal, ...roomInfo};
                                await this.roomListInstance().editInstance(info)
                                let chatMembers = info.chatMember
                                this.$store.commit("SET_CHATMEMS", chatMembers); 

                                if(chatMembers&&chatMembers.length>0){
                                    chatMembers.map(async(vt) => {
                                        // 查询一次用户信息 -- 更新一次用户信息
                                        // Query user information once - update user information once
                                        this.$store.commit('UPDATE_USERS_OBJ', vt)
                                        await this.userListInstance().editInstance(vt)
                                    })
                                }
                            }
                        } */
                        const [err, resp] = await this.awaitWrap(this.$store.dispatch('GetOfflineMsgById', newVal))
                        
                        if(err){
                            this.$message.error(err.message)
                        }else{
                            let {data, count} = resp
                            let datas = data || []
                            let getInstance = this.chatLocalMsgDAO.getInstance();
                            if(datas.length>0){
                                datas.map(item => {
                                    let chatId
                                    let msg = JSON.parse(decrypt(item.msg))
                                    if(msg.noticeType==MSG_TYPE.MESSAGE_READ_RECEIPT){
                                        if(listReceiptRead<msg.readMsgId){
                                            listReceiptRead=msg.readMsgId
                                        }                                        
                                    }else{
                                        if(msg.msgType === MSG_TYPE.IM_MSG_TYPE_REDBAG){
                                        }
                                        if (msg.receiveType === MSG_TYPE.RECEIVE_TYPE_PUBLIC) {
                                        chatId = msg.roomId
                                        
                                        } else if (msg.receiveType === MSG_TYPE.RECEIVE_TYPE_PRIVATE) {
                                            chatId = msg.senderId
                                        }
                                        getInstance.add({
                                            ...msg,
                                            roomType : msg.receiveType,
                                            roomIdAndId: this.setRoomIdsId(chatId, msg.receiveType),
                                            isOffLineMsg: true,
                                            msgId:item.msgId
                                        })
                                    }
                                })
                                
                            }
                        }
                    }
                let chatByRoomId = await chatLocalMsgDAO.getInstance().getLimit(key,65).toArray()
                
                chatByRoomId.sort(function (a, b) {
                return a.msgId - b.msgId;
                });
                this.list = [...chatByRoomId]
                 console.log(2,this.list)
                
        
            })()
            return this.list
        },
        async makeChats(info){
            let key;
            this.keypressMsg=false
            this.$store.commit('SET_EVAL', '')     
            this.makeRoomType(info);
            if(!info.name&&!info.nikeName&&info.receiver){
                info.name= info.receiver
            }
            
            if(info.id!==-1){
                    if (info.roomIdAndId) {
                        key = info.roomIdAndId
                    } else {
                        if (this.roomType==MSG_TYPE.RECEIVE_TYPE_PUBLIC) {
                            key = this.setRoomIdsId(info.id||info.roomId, this.roomType)
                        } else if(this.roomType==MSG_TYPE.RECEIVE_TYPE_PRIVATE){
                            key = this.setRoomIdsId(info.id||info.mid, this.roomType)
                        }
                    }
                    let chatInRoomsPro = this.getChatLocalMsgStore(5)
                    let hasKey = this.hasKey(chatInRoomsPro[key],'page')
                    if(hasKey){
                        this.page = chatInRoomsPro[key]['page'] 
                    }else{
                        this.page = 0
                    }
            }
            if(this.roomType == MSG_TYPE.RECEIVE_TYPE_PUBLIC){
                // 没有网络时 房间切换在此处报错 不能卡住后面的进程
                // 获取群成员，如果是好友，可以将对应的昵称改为自己关系的备注 todo 异步不卡顿页面
                // When there is no network, the room switching error is reported here, and the subsequent process cannot be stuck
                // Get group members, if you are a friend, you can change the corresponding nickname to the remarks of your relationship todo asynchronous non-stuck page
               
                // 查询群成员后
                // 每个房间要赋值群成员信息，这样才能对应房间查询群成员
                // After querying group members
                // Each room must be assigned group member information so that the group member can be inquired about the room
                let roomEle = this.chatMembers || [];
                if (roomEle.length > 0) {
                    roomEle.map((v) => {
                        v.roomInId = info.roomId || info.id;
                    });
                }
                info.chatMember = roomEle;
                this.$set(info,'chatMember',roomEle)
            }
            // 群成员中的自己有禁言状态，发送给输入框禁用
            // Group members have a muted state, send to the input box to disable
            this.$bus.$emit('chatInfoChange',info)
            // 获取消息记录
            // Get the message record
            this.list = [];
            this.loadMessage( info ).then( list => {
                this.list = list;
            } );
            //this.list = this.getList(info)

        },
        /* switchTab( index ) {
            this.index = index;
            this.message = 'Loading...';
            this.loadMessage( index ).then( message => {
                this.message = message;
            } );
            }, */
            loadMessage( info ) {
                return new Promise( ( resolve, reject ) => {
                    setTimeout( () => resolve( this.getList(info) ), 100 );
                } );
            },
        // 获取历史消息
        // Get historical news old code
        makeAvatar(item){
            let avatar = item.logo||item.photo
            let val;
            let roomType = this.getRoomTypes(item.roomIdAndId)
            if(roomType == MSG_TYPE.RECEIVE_TYPE_PRIVATE){
                let idf = this.getRoomIdsId(item.roomIdAndId)
                val = (this.usersObj&&this.usersObj[idf]&&this.usersObj[idf].photo) || ''
            }else if(roomType == MSG_TYPE.RECEIVE_TYPE_PUBLIC){
                let pickObjs = this.roomsObj[item.roomIdAndId]
                if(pickObjs){
                    val = pickObjs.logo || item.logo
                }
            }
            return val||avatar
        },
        // 公用用户信息
        
        // 根据 roomId 查看是否是 群聊 密聊
        // Check whether it is a group chat or secret chat according to the roomId
        makeRoomType(item){
            if(item.roomChatId || item.receiveType===MSG_TYPE.RECEIVE_TYPE_PUBLIC){
                this.roomType = MSG_TYPE.RECEIVE_TYPE_PUBLIC // 群聊 
            }else{
                this.roomType = MSG_TYPE.RECEIVE_TYPE_PRIVATE // 私聊
            }
        },
        async dealWithMsg(datas) {
            
            // data.receiveType
            // 标记当前聊天房间 receiveType:0 通知
            // mark the current chat room receiveType:0 notification
            let data = JSON.parse(decrypt(datas.msg));

            data.msgId = datas.msgId
            if(!data.roomType){
                data.roomType = data.receiveType
            }
            if(!this.chatInfo.roomType){
                this.chatInfo.roomType = this.getRoomTypes(this.chatInfo.roomIdAndId)
            }
            let roomTypeGet = this.chatInfo.roomType
            let noticeMsg = data;
            let isPrivateChat = (this.chatInfo.id==this.noticeMsg.senderId||this.getRoomIdsId(this.chatInfo.roomIdAndId)==this.noticeMsg.senderId) || false
            
            if(data.msgType === MSG_TYPE.IM_MSG_TYPE_NOTIFICSTION){
                let msg = JSON.parse(data.msg)
                // 群解散特殊处理
                // Special handling for group dissolution
                if(msg.noticeType === MSG_TYPE.ROOM_DEL){
                    // 删除rooms房间 及chatinroom 正在聊的房间
                    // delete rooms and chatinroom
                    this.$store.dispatch('DelRooms',data.roomId)
                    return
                }else if(data.msgType === MSG_TYPE.MESSAGE_READ_RECEIPT){
                     // '留言已读回执'
                    //'Message has been read receipt'
                    let readBack = () => {
                        
                        let roomIdAndId;
                        let idr;
                         
                        // 先密聊 后群聊 群聊只有群主能看见谁看了消息
                        // Secret chat first, group chat later. In group chat, only the group owner can see who read the message
                        if(!noticeMsg.roomId){
                           
                            if(isPrivateChat){
                                // 密聊 如果正在密聊房间内
                                // Secret chat If you are in a secret chat room
                                idr = this.chatInfo.id || this.getRoomIdsId(this.chatInfo.roomIdAndId)
                            }else{
                                idr = noticeMsg.senderId
                            }

                            roomIdAndId = this.setRoomIdsId(idr,1)
                            
                            this.$bus.$emit('updRlist', item)                                
                        }
                    }
                    setTimeout(function(){
                        readBack()
                    },200)
                }
            }


            if (data.receiveType === MSG_TYPE.RECEIVE_TYPE_PUBLIC || data.receiveType === MSG_TYPE.RECEIVE_TYPE_PRIVATE) {
                
                let dealData
                dealData = {...data,roomType: data.receiveType};
                
               let chatId
                if(this.userInfo.id===dealData.senderId){
                    chatId = dealData.receiverId

                }
                else{
                chatId = dealData.roomId || dealData.senderId

                }
                let getInstance = chatInRoomsDAO.getInstance();
                let roomIdAndId = this.setRoomIdsId(chatId, dealData.roomType)
                
                getInstance.find(roomIdAndId).then((dataIndexDB)=>{
                    if(!dataIndexDB){
                        if(this.userInfo.id===dealData.senderId){
                           dealData = {...data,roomType: data.receiveType,unReadNum:0};
                        }
                        else{
                            dealData = {...data,roomType: data.receiveType,unReadNum:1};
                        }
                    }
                    else{
                        if(this.userInfo.id===dealData.senderId){
                            dealData.senderName=dataIndexDB.senderName
                            dealData.senderHead=dataIndexDB.dealData
                        }
                    }
                    
                    this.$store.dispatch('AddChatInRooms',dealData)
                    
                })
                
                // 不在此房间 未读消息处理 ---- todo 离线消息未读信息处理
                // Not in this room unread message processing ---- todo offline message unread message processing

                if(windowHide.get("isHide") || chatId != this.chatInfo.id || (roomTypeGet!== data.receiveType ||  roomTypeGet!== data.roomType)){
                    // 找到对应的正在聊天的房间chatInRoom 然后在未读数上加1
                    // Find the corresponding chatInRoom and add 1 to the unread
                    
                    let roomIdAndId = this.setRoomIdsId(chatId, dealData.roomType)
                    let getInstance = chatInRoomsDAO.getInstance();
                     getInstance.find(roomIdAndId).then((dataIndexDB)=>{
                         if(dataIndexDB){
                             if(!dataIndexDB.unReadNum){
                                 dataIndexDB.unReadNum=0
                             }
                            if(this.userInfo.id===dealData.senderId){
                                dataIndexDB.unReadNum=dataIndexDB.unReadNum
                            }else{
                                dataIndexDB.unReadNum=dataIndexDB.unReadNum + 1
                            }
                            dataIndexDB.msgId=dealData.msgId
                            dataIndexDB.sendTime=dealData.sendTime
                            dataIndexDB.msg=dealData.msg
                            dataIndexDB.msgType=dealData.msgType
                            
							getInstance.update(dataIndexDB).then(()=>{
                                getInstance
                                .get()
                                .then((result) => {
                                    this.$store.commit('SET_CHATIN_ROOMS', result)
                                })
                                .catch((e) => {
                                    console.log("err_or: ", e);
                                });
                            })
                            if(dataIndexDB.msgDoNotDisturb!=1){
                                if(this.userInfo.id===dealData.senderId){
                                    this.$store.commit("SET_UNREAD_NUM", this.unReadNum)
                                }
                                else{
                                    this.$store.commit("SET_UNREAD_NUM", this.unReadNum+1)
                                }
                            }
                         }
                    })
                    
                    // 未读总数加1
                    // add 1 to the total number of unread
                    
                }

                if(this.chatInfo.id === data.senderId || 
                    this.chatInfo.id === data.roomId ||
                    this.userInfo.id === data.receiverId || this.userInfo.id === data.senderId ){
                        
                        // 将消息推入缓存 并重新赋值
                        // Push the message into the cache and re-assign
                        let chatId
                        if(data.receiveType === MSG_TYPE.RECEIVE_TYPE_PUBLIC){
                            chatId=data.roomId
                        }else{
                            chatId=data.senderId
                        }

                        
                        data = this.combineMsg(dealData,this.rooms,this.friends)
                }else{
                    
                    // 将消息推入缓存
                    // Push the message into the cache
                    this.combineMsg(dealData,this.rooms,this.friends)
                }
                
            }


            if (data.receiveType === MSG_TYPE.RECEIVE_TYPE_PRIVATE) {
                //私聊 判断mid和路由里面的id是否相等 是则表示当前是和该人聊天
                //Private chat, judge whether the id in the mid and the route are equal. If yes, it means that the person is currently chatting with the person
                if (data && this.chatInfo.id === data.senderId && 
                    (this.chatInfo.roomType == data.receiveType || this.chatInfo.roomType == data.roomType) || (this.userInfo.id === data.senderId && data.msgType !== MSG_TYPE.IM_MSG_TYPE_NOTIFICSTION && this.chatInfo.id === data.receiverId)
                ) {
                
                    let dataExit=this.list.find(qry=> qry && qry.msgId===data.msgId)
                    if(!dataExit){
                        this.sendMsgScroll=true
                        await this.getHistoryBottom()
                        this.list.push(data);
                    }
                }else{
                    // 其他人发送的，如果自己和他是好友，则左侧对应的好友位置标红点

                }
            } else {                //群聊 判断roomId和路由里面的id是否相等 是则表示当前是在该群聊天
                // 自己发送的信息不push
                //Group chat Determine whether the roomId and the id in the route are equal. If yes, it means that the group chat is currently
                // The information sent by yourself is not pushed
                if ( this.userInfo.id === data.senderId && data.msgType !== MSG_TYPE.IM_MSG_TYPE_NOTIFICSTION) {
                    // 自己发送的消息收到推送了就不处理
                    // The message sent by oneself will not be processed after receiving the push
                    
                } else {
                    // 同一个房间内别人发的 就 push 进数组
                    // receiveType==0为群内通知消息
                    // 通知先走的是这里
                    // Push into the array if someone else sends in the same room
                    // receiveType==0 is the group notification message
                    // Here is where the notice goes first
                    if(data.roomId === this.chatInfo.id &&
                        (this.chatInfo.roomType == data.receiveType || this.chatInfo.roomType == data.roomType || data.receiveType==0)
                    ){
                        if(data.msgType === MSG_TYPE.IM_MSG_TYPE_NOTIFICSTION){
                            let msg = JSON.parse(data.msg)
                            data.roomType= MSG_TYPE.RECEIVE_TYPE_PUBLIC
                            // 撤回消息不能直接添加
                            // The withdrawal message cannot be added directly
                            if(msg.noticeType == MSG_TYPE.MESSAGE_BACK || msg.noticeType == MSG_TYPE.ROOM_ADD_USER){
                                return
                            }
                        }
                        let dataExit=this.list.find(qry=>qry.msgId===data.msgId)
                            if(!dataExit){
                                this.sendMsgScroll=true
                                await this.getHistoryBottom()
                                this.list.push(data);
                            }
                        this.setList(this.chatInfo, this.list);
                    }else{
                        // 其他房间发送的，如果自己在对应房间中，该房间信息标红点
                        
                    }
                }

            }
            if(data.msgType !== MSG_TYPE.IM_MSG_TYPE_NOTIFICSTION){
                if(windowHide.get("isHide")){
                    let dealData = {...data,roomType: data.receiveType};
                    let getInstanceRoom = chatInRoomsDAO.getInstance();
                    getInstanceRoom.find(dealData.roomIdAndId).then(res=>{
                    })
                    let dataMsgNotDis= (await chatInRoomsDAO.getInstance().find(dealData.roomIdAndId)).msgDoNotDisturb

                    let chatId;
                    if(dealData.receiveType === MSG_TYPE.RECEIVE_TYPE_PUBLIC){
                        chatId = dealData.roomId 
                        // 判断是否在当前房间
                        // Determine if it is in the current room
                        

                            dealData.roomIdAndId = this.setRoomIdsId(chatId, dealData.roomType)
                            if(dealData.senderId!=this.userInfo.id){

                                this.$electron.ipcRenderer.send("notify",dataMsgNotDis, dealData, handleMessage(dealData.msg, dealData.msgType), dealData.senderName,dealData.senderHead);
                            }
                        /* } */

                    }else if(dealData.receiveType === MSG_TYPE.RECEIVE_TYPE_PRIVATE){
                        chatId = dealData.senderId
                        // 判断是否在当前房间
                        // Determine if it is in the current room
                        /* if((chatId != this.chatInfo.id || 
                            (roomTypeGet!== dealData.receiveType ||  roomTypeGet!== dealData.roomType))
                        ){ */

                            dealData.roomIdAndId = this.setRoomIdsId(chatId, dealData.roomType)
                            if(dealData.senderId!=this.userInfo.id){
                                
                                this.$electron.ipcRenderer.send("notify",dataMsgNotDis , dealData, handleMessage(dealData.msg, dealData.msgType), dealData.senderName,dealData.senderHead||dealData.senderHead);
                            }

                            /* this.makeUserMsg(dealData, 2).then(names => {
                                this.$electron.ipcRenderer.send("notify", dealData, handleMessage(dealData.msg, dealData.msgType), names,this.makeAvatar(dealData));
                            }) */
                        /* } */
                    }
                    
                }
                
            }
           
            this.$forceUpdate()
        },
        async dealResend(data) {
            let msgType = data.msgType
            switch(msgType){
                case MSG_TYPE.IM_MSG_TYPE_TEXT:
                    this.sendMsgs(data)
                    break;
                case MSG_TYPE.IM_MSG_TYPE_PICTURE:
                case MSG_TYPE.IM_MSG_TYPE_VIDEO:
                case MSG_TYPE.IM_MSG_TYPE_VOICE:
                case MSG_TYPE.IM_MSG_TYPE_QUOTE:
                case MSG_TYPE.IM_MSG_TYPE_FILE:
                    data.msg = JSON.stringify(data.msg)
                    let res = await sendMsg(data);
                    let { arrIdx,isResending,sendTime } = data
                    arrIdx*=1
                    if(res.success){
                        let msg_id = res.data.msg_id
                        if(isResending==1 || isResending==3){
                            let targetMsg = this.list[arrIdx]
                            targetMsg.isResending = 2
                            targetMsg.msgId = msg_id
                            targetMsg.sendTime = sendTime
                            delete targetMsg.arrIdx
                            delete targetMsg.isSendFaild
                            console.log(arrIdx,this.list[arrIdx])
                            this.list.splice(arrIdx, 1)
                            this.sendMsgScroll=true
                            await this.getHistoryBottom()
                            this.list.push(targetMsg);
                            
                            // 标记当前聊天房间
                            // Mark the current chat room
                            
                            this.$store.dispatch('AddChatInRooms',targetMsg)
                        }
                        
                    }else{
                        if(isResending==3 || isResending==1){
                            this.list[arrIdx].isResending = 1;
                            this.list[arrIdx].isSendFaild = false;
                            
                        }
                    }
                    this.updMsgItemFunc(sendTime)
                    this.setList(this.chatInfo, this.list);
                    break;

                
            }

        },
        // 发送自定义表情图片
        // Send a custom emoji picture
        async sendInsertFace(msg){
            if(!msg)return
            let postData = {
                isAdmin: MSG_TYPE.NO_ADMIN,
                msgType: MSG_TYPE.IM_MSG_TYPE_PICTURE,
                msg: JSON.stringify(msg),
                sendTime: parseInt(new Date().getTime()),
                quoteMsgId: 0,
                replyType: 0,
                isResending: 4,
                isSendFaild: true,
            };
            //如果是密聊 roomType = 1 给后台传mid字段
            //If it is a secret chat roomType = 1 pass the mid field to the background
            if (this.roomType == MSG_TYPE.RECEIVE_TYPE_PRIVATE) {
                postData.mid = this.chatInfo.id || this.getRoomIdsId(this.chatInfo.roomIdAndId);
                postData.receiveType = MSG_TYPE.RECEIVE_TYPE_PRIVATE;
            } else {
                postData.roomId = this.chatInfo.id || this.getRoomIdsId(this.chatInfo.roomIdAndId);
                postData.receiveType = MSG_TYPE.RECEIVE_TYPE_PUBLIC;

            }   
            
            // 如果是引用消息
            // If it is a quoted message
            postData = this.forQuote(postData, MSG_TYPE.IM_MSG_TYPE_PICTURE)

            let insertData = {
                ...this.chatInfo,
                ...postData,
                isMine: MSG_TYPE.IS_MINE,
                senderId: this.userInfo.id,
                isLocal: true,
                roomType: this.roomType
            };
            this.sendMsgScroll=true
            await this.getHistoryBottom()
            this.list.push(insertData);

            this.$store.dispatch('AddChatInRooms',insertData)
            let result = await sendMsg(postData);
            if (result.success) {
                let newFaceObj = {
                    ...this.list[this.list.length-1],
                    msgId: result.data.msg_id
                }
                this.list[this.list.length-1] = newFaceObj
                this.$forceUpdate()
                // this.setList(this.chatInfo, this.list);
            } else {
                this.list[this.list.length-1].isResending = 1;
                this.list[this.list.length-1].isSendFaild = false;
                // 上传未成功删除msgId属性
                // The upload failed to delete the msgId attribute
                delete this.list[this.list.length-1].msgId
                let sedTime = this.list[this.list.length-1].sendTime
                this.updMsgItemFunc(sedTime)
                this.$message.error(result.message);
            }
            this.setList(this.chatInfo, this.list);
        },
        //选择文件（图片，视频, 文件）
        //Select file (picture, video, file)
         
        async chooseFile(file, localPath, status) {
            console.log(file, localPath, status,'file, localPath, status')
            this.$bus.$on('closeQuote', () => {
                this.quotaActive=false
            })
            
            if(status==1){
                //图片
                //image
                if (MSG_TYPE.REG_IMAGE.test(file.type)) {
                    this.sendBeforeInsertImage(file, localPath);
                }
            }else if(status==2){
                this.sendMsgScroll=true
                await this.getHistoryBottom()
                //视频
                //video
                let videoType = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
                if (MSG_TYPE.REG_VIDEO.test(videoType)) {
                    this.sendBeforeInsertVideo(file, localPath);
                }
            }else if(status==3){
                this.sendMsgScroll=true
                await this.getHistoryBottom()
                // 文件
                // file
                this.sendBeforeInsertFile(file, localPath);
            }
        },
        
        //本地显示文件-还未上传
        //Local display file-not uploaded yet
        async sendBeforeInsertFile(file, localPath) {
            let fileName = file.name
            // let fileType = file.type
            // let size = this.formatFileSize(file.size)
            let msg = {
                littlePicSizeWidth: 150,
                littlePicSizeHeight: 200,
                littlePicUrl: localPath,
                picSizeWidth: 150,
                picSizeHeight: 200,
                picUrl: localPath,
                fileName,
                size: file.size,
                isResending: 4,
                isSendFaild: true,
            };
            let postData = {
                isAdmin: MSG_TYPE.NO_ADMIN,
                msgType: MSG_TYPE.IM_MSG_TYPE_FILE,
                msg: JSON.stringify(msg),
                sendTime: parseInt(new Date().getTime()),
                quoteMsgId: 0,
                replyType: 0,
                fileName,
                // fileType,
                // fileSize
            };
            //如果是密聊 roomType = 1 给后台传mid字段
            //If it is a secret chat roomType = 1 pass the mid field to the background
            if (this.roomType == MSG_TYPE.RECEIVE_TYPE_PRIVATE) {
                postData.mid = this.chatInfo.id || this.getRoomIdsId(this.chatInfo.roomIdAndId);
                postData.receiveType = MSG_TYPE.RECEIVE_TYPE_PRIVATE;
            } else {
                postData.roomId = this.chatInfo.id || this.getRoomIdsId(this.chatInfo.roomIdAndId);
                postData.receiveType = MSG_TYPE.RECEIVE_TYPE_PUBLIC;

            }   
            // 如果是引用消息
            // If it is a quoted message
            postData = this.forQuote(postData, MSG_TYPE.IM_MSG_TYPE_FILE)

            let insertData = {
                ...this.chatInfo,
                ...postData,
                isMine: MSG_TYPE.IS_MINE,
                senderId: this.userInfo.id,
                // roomIdAndId: `${this.chatInfo.id}_${postData.receiveType}`,
                isLocal: true,
                roomType: this.roomType
            };
            this.sendMsgScroll=true
            await this.getHistoryBottom()
            this.list.push(insertData);
            this.$store.dispatch('AddChatInRooms',insertData)
            this.setList(this.chatInfo, this.list);
            this.uploadFiles(postData, file, 3);
        },

        //本地显示图片-还未上传
        //Local display picture-not uploaded yet
        async sendBeforeInsertImage(file, localPath) {
            let msg = {
                littlePicSizeWidth: 150,
                littlePicSizeHeight: 200,
                littlePicUrl: localPath,
                picSizeWidth: 150,
                picSizeHeight: 200,
                picUrl: localPath
            };
            let postData = {
                isAdmin: MSG_TYPE.NO_ADMIN,
                msgType: MSG_TYPE.IM_MSG_TYPE_PICTURE,
                msg: JSON.stringify(msg),
                sendTime: parseInt(new Date().getTime()),
                quoteMsgId: 0,
                replyType: 0,
                isResending: 4,
                isSendFaild: true,
            };
            //如果是密聊 roomType = 1 给后台传mid字段
            //If it is a secret chat roomType = 1 pass the mid field to the background
            if (this.roomType == MSG_TYPE.RECEIVE_TYPE_PRIVATE) {
                postData.mid = this.chatInfo.id || this.getRoomIdsId(this.chatInfo.roomIdAndId);
                postData.receiveType = MSG_TYPE.RECEIVE_TYPE_PRIVATE;
            } else {
                postData.roomId = this.chatInfo.id || this.getRoomIdsId(this.chatInfo.roomIdAndId);
                postData.receiveType = MSG_TYPE.RECEIVE_TYPE_PUBLIC;

            }   
            // 如果是引用消息
            // If it is a quoted message
            postData = this.forQuote(postData, MSG_TYPE.IM_MSG_TYPE_PICTURE)

            let insertData = {
                ...this.chatInfo,
                ...postData,
                isMine: MSG_TYPE.IS_MINE,
                senderId: this.userInfo.id,
                // roomIdAndId: `${this.chatInfo.id}_${postData.receiveType}`,
                isLocal: true,
                roomType: this.roomType
            };
            this.sendMsgScroll=true
            await this.getHistoryBottom()
            this.list.push(insertData);
            this.$store.dispatch('AddChatInRooms',insertData)
            this.setList(this.chatInfo, this.list);
            this.uploadFiles(postData, file);
        },

        //本地显示视频缩略图-还未上传
        //Display video thumbnail locally-not uploaded yet
        async sendBeforeInsertVideo(file, localPath) {
            this.sendMsgScroll=false
            this.$("body").find("#videoarea2") &&
            this.$("body")
                .find("#videoarea2")
                .remove();
            let str = `<div id="videoarea2" style="display:none;">
                        <video width="400" controls>
                            <source src="${localPath}"type="video/mp4">
                        </video>
                    </div>`;
            this.$("body").append(str);
            
            //视频截图
            var scale = 0.25;
            var video = this.$("#videoarea2").find("video")[0];
            video.autoplay = true;
            video.muted = true;
            let self = this;
            video.addEventListener("loadedmetadata", function loadedmetadata() {
                setTimeout(async () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    let src = canvas.toDataURL("image/png");
                    let msg = {
                        littlePicSizeWidth: 150,
                        littlePicSizeHeight: 200,
                        littlePicUrl: src,
                        picUrl: src,
                        size: 0,
                        isResending: 4,
                        isSendFaild: true,
                    };
                    let postData = {
                        isAdmin: MSG_TYPE.NO_ADMIN,
                        msgType: MSG_TYPE.IM_MSG_TYPE_VIDEO,
                        msg: JSON.stringify(msg),
                        sendTime: parseInt(new Date().getTime()),
                        quoteMsgId: 0,
                        replyType: 0,
                    };
                    //如果是密聊 roomType = 1 给后台传mid字段
                    //If it is a secret chat roomType = 1 pass the mid field to the background
                    if (self.roomType == MSG_TYPE.RECEIVE_TYPE_PRIVATE) {
                        postData.mid = self.chatInfo.id || self.getRoomIdsId(self.chatInfo.roomIdAndId);
                        postData.receiveType = MSG_TYPE.RECEIVE_TYPE_PRIVATE;
                    } else {
                        postData.roomId = self.chatInfo.id || self.getRoomIdsId(self.chatInfo.roomIdAndId);
                        postData.receiveType = MSG_TYPE.RECEIVE_TYPE_PUBLIC;
                    }
                    // 如果是引用消息
                    // If it is a quoted message
                    postData = self.forQuote(postData, MSG_TYPE.IM_MSG_TYPE_VIDEO)
                
                    let insertData = {
                        ...self.chatInfo,
                        ...postData,
                        isMine: MSG_TYPE.IS_MINE,
                        senderId: self.userInfo.id,
                        // roomIdAndId: `${self.chatInfo.id}_${postData.receiveType}`,
                        isLocal: true,
                        roomType: self.roomType
                    };
                    self.sendMsgScroll=true
                    //await self.getHistoryBottom()
                    self.list.push(insertData);
                    self.$store.dispatch('AddChatInRooms',insertData)
                    self.setList(self.chatInfo, self.list);
                    video.pause();
                    self.uploadFiles(postData, file);
                }, 300);
            });
        },
        async uploadFiles(postData, file, status) {
            var loaded = 0;
            var chunkSize = 500000;
            var total = file.size;
            var reader = new FileReader();
            var slice = file.slice(0, chunkSize);
            this.sendMsgScroll=true
            //await this.getHistoryBottom()
            //Just simulate API
           /*  do{
                setTimeout(function(){
                    loaded += chunkSize;
                    var percentLoaded = Math.min((loaded / total) * 100, 100);
                    console.log('Uploaded ' + Math.floor(percentLoaded) + '% of file "' + file.name + '"');

                    //Read the next chunk and call 'onload' event again
                    if (loaded <= total) {
                        slice = file.slice(loaded, loaded + chunkSize);
                        reader.readAsBinaryString(slice);
                    } else { 
                        loaded = total;
                        console.log('File "' + file.name + '" uploaded successfully!');
                    }
                }, 250);
            }while(loaded > total) */
                
            let form = new FormData();
            form.append("file", file);
            
            // 1头像 2消息内容
            // 1 avatar 2 message content
            form.append("fileType", 2); 
            let isOneToOne = this.roomType==MSG_TYPE.TYPE_PRIVATE
            //false=群聊 true=私聊
            //false=group chat true=private chat
            form.append("isOneToOne", isOneToOne); 
            // 发送人id(Sender id)
            // sender id (Sender id)
            form.append("from", this.userInfo.id+""); 
            let chatInfoId = this.chatInfo.id || this.getRoomIdsId(this.chatInfo.roomIdAndId)
            // 私聊接收人id，群聊群id(Private chat recipient id or group chat group id)
            // Private chat recipient id, group chat group id (Private chat recipient id or group chat group id)
            form.append("to", chatInfoId+""); 
            //this.loadObject = true;
            /* await goimfilesUpload(form, event => {
                let progress = Math.round((100 * event.loaded) / event.total);

            })
            .then(response => {
                console.log('test',response)
            }) */
            console.log(form,'testData')
            let res = await goimfilesUpload(form)
            // res.success = false; //传文件失败
            if(res.success){
                let data = res.data;
                let msg = {};
                let isPic;
                //图片
                //image
                if (MSG_TYPE.REG_IMAGE.test(file.type)) {
                    /* msg = {
                        littlePicSizeWidth: data.width,
                        littlePicSizeHeight: data.height,
                        littlePicUrl: data.thumbUrl,
                        picSizeWidth: data.thumbWidth,
                        picSizeHeight: data.thumbHeight,
                        picUrl: data.url
                    }; */
                    isPic = 1;
                    postData.msg = JSON.stringify(data);
                    // 如果是引用消息
                    // If it is a quoted message
                    postData = this.forQuote(postData, MSG_TYPE.IM_MSG_TYPE_PICTURE)
                }
                //视频
                //video
                if (MSG_TYPE.REG_VIDEO.test(file.type)) {
                    /* msg = {
                        littlePicSizeWidth: data.width,
                        littlePicSizeHeight: data.height,
                        littlePicUrl: data.thumbUrl,
                        picSizeWidth: data.thumbWidth,
                        picSizeHeight: data.thumbHeight,
                        picUrl: data.url,
                        duration: data.duration,
                        size: (data.size / 1024 / 1024).toFixed(2)
                    }; */
                    msg = {
                        width: data.width,
                        height: data.height,
                        thumbUrl: data.thumbUrl,
                        thumbWidth: data.thumbWidth,
                        thumbHeight: data.thumbHeight,
                        url: data.url,
                        duration: data.duration,
                        size: (data.size / 1024 / 1024).toFixed(2)
                    };
                    isPic = 2;
                    postData.msg = JSON.stringify(msg);
                    // 如果是引用消息
                    // If it is a quoted message
                    postData = this.forQuote(postData, MSG_TYPE.IM_MSG_TYPE_VIDEO)
                }
                //文件
                //file
                if (status==3){
                     msg = {

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
                    isPic = 3;
                    postData.msg = JSON.stringify(data);
                    // 如果是引用消息
                    // If it is a quoted message
                    postData = this.forQuote(postData, MSG_TYPE.IM_MSG_TYPE_FILE)
                }
                this.list[this.list.length-1].msg = postData.msg

                let result = await sendMsg(postData);
                
                // result.success = false; //发消息失败
                // result.success = false; //发消息失败
                if (result.success) {
                    let {msg_id} = result.data
                    //修改状态 为成功
                    //Modify the status as successful
                    this.list[this.list.length-1].msgId = msg_id
                    

                   
                } else {
                    //修改状态 为失败
                    // this.list.map(item => {
                    //     if (
                    //         item.status &&
                    //         item.status === MSG_TYPE.SEND_MSG_STATUS_LOADING
                    //     ) {
                    //         item.status = MSG_TYPE.SEND_MSG_STATUS_FAIL;
                    //     }
                    //     return item;
                    // });

                    this.list[this.list.length-1].isResending = 1;
                    this.list[this.list.length-1].isSendFaild = false;
                    // 上传未成功删除msgId属性
                    // The upload failed to delete the msgId attribute
                    delete this.list[this.list.length-1].msgId
                    let sedTime = this.list[this.list.length-1].sendTime
                    this.updMsgItemFunc(sedTime)
                    
                    this.$message.error(result.message);

                }
            }else{
                // this.list[this.list.length-1].isResending = 1;
                // this.list[this.list.length-1].isSendFaild = false;
                // // 上传未成功删除msgId属性
                // delete this.list[this.list.length-1].msgId
                // let sedTime = this.list[this.list.length-1].sendTime
                // this.updMsgItemFunc(sedTime)
                this.$message.error(res.message)
            }
            this.setList(this.chatInfo, this.list);
            
            this.scrollWay();
            
            

        },
        async updMsgItemFunc(sedTime){
            
            this.$nextTick(()=>{
                this.isToBottom=true
                    this.scrollWay();
                
                this.$bus.$emit('upd_msgItem', sedTime)
            })
        },
        forQuote(post,types){
            if(this.isShowQuote){
                // 去除挂载会员
                // Remove mounted members
                delete this.quoteObj.chatMember 
                let quoteObj = {
                    msgType: MSG_TYPE.IM_MSG_TYPE_QUOTE,
                    quoteMsgId: this.quoteObj.msgId,
                    replyType: types,
                }
                this.isShowQuote=false
                this.$bus.$emit('closeQuote')
                return {...post,...quoteObj}
            }else{
                return post
            }
        },
        sendRecord(content,activeRecord){
            this.sendVoice=activeRecord
            this.voiceContent=content
        },
        moticClose(data){
            this.showDialog=data
            let that = this
            setTimeout(function(){
                
                    that.scrollWay();
                
            },100)
            
        },
        motic(data){
            this.showDialog=data
               this.searchNumber=0
            this.listSearchActive=0
            this.listSearch=[]
            this.searchActive=false
             this.search=''
            let that = this
            setTimeout(function(){
                
                    that.scrollWay();
                
            },100)
            
        },
        fileIsVoice(file){
            let value
            if(file.indexOf(".wav") == file.length - 4) {
                
                value= true
            }
            else{
                value= false
            }
            return value
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
        async sendVoiceF(file, localPath) {
              let msg = {
                littlePicSizeWidth: 150,
                littlePicSizeHeight: 200,
                littlePicUrl: localPath,
                picSizeWidth: 150,
                picSizeHeight: 200,
                picUrl: localPath,
                size: file.size,
                isResending: 4,
                isSendFaild: true,
                width: 150,
                height: 200,
                thumbUrl: localPath,
                thumbWidth: 150,
                thumbHeight: 200,
                url: localPath,
            };
            let postData = {
                isAdmin: MSG_TYPE.NO_ADMIN,
                msgType: MSG_TYPE.IM_MSG_TYPE_VOICE,
                msg: JSON.stringify(msg),
                sendTime: parseInt(new Date().getTime()),
                quoteMsgId: 0,
                replyType: 0,
            };
            //如果是密聊 roomType = 1 给后台传mid字段
            //If it is a secret chat roomType = 1 pass the mid field to the background
            if (this.roomType == MSG_TYPE.RECEIVE_TYPE_PRIVATE) {
                postData.mid = this.chatInfo.id || this.getRoomIdsId(this.chatInfo.roomIdAndId);
                postData.receiveType = MSG_TYPE.RECEIVE_TYPE_PRIVATE;
            } else {
                postData.roomId = this.chatInfo.id || this.getRoomIdsId(this.chatInfo.roomIdAndId);
                postData.receiveType = MSG_TYPE.RECEIVE_TYPE_PUBLIC;

            }   
            // 如果是引用消息
            // If it is a quoted message
            postData = this.forQuote(postData, MSG_TYPE.IM_MSG_TYPE_VOICE)

            let insertData = {
                ...this.chatInfo,
                ...postData,
                isMine: MSG_TYPE.IS_MINE,
                senderId: this.userInfo.id,
                // roomIdAndId: `${this.chatInfo.id}_${postData.receiveType}`,
                isLocal: true,
                roomType: this.roomType
            };
            this.sendMsgScroll=true
            await this.getHistoryBottom()
            this.list.push(insertData);
            this.$store.dispatch('AddChatInRooms',insertData)
            this.setList(this.chatInfo, this.list);
           
            
             this.uploadVoices(postData, file);
        },
        async uploadVoices(postData, file) {
            let form = new FormData();
            form.append("file", file);
            
            // 1头像 2消息内容
            // 1 avatar 2 message content
            form.append("fileType", 2); 
            let isOneToOne = this.roomType==MSG_TYPE.TYPE_PRIVATE
            //false=群聊 true=私聊
            //false=group chat true=private chat
            form.append("isOneToOne", isOneToOne); 
            // 发送人id(Sender id)
            // sender id (Sender id)
            form.append("from", this.userInfo.id+""); 
            let chatInfoId = this.chatInfo.id || this.getRoomIdsId(this.chatInfo.roomIdAndId)
            // 私聊接收人id，群聊群id(Private chat recipient id or group chat group id)
            // Private chat recipient id, group chat group id (Private chat recipient id or group chat group id)
            form.append("to", chatInfoId+""); 
            let res = await goimfilesUpload(form)
            // res.success = false; //传文件失败
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
                request.onload = function() {
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
                            isPic = 1;
                            postData.msg = JSON.stringify(msg);
                            // 如果是引用消息
                            // If it is a quoted message
                            postData = that.forQuote(postData, MSG_TYPE.IM_MSG_TYPE_VOICE)
                    
                        //文件
                        //file
                        
                        that.list[that.list.length-1].msg = postData.msg

                        let result = await sendMsg(postData);
                        
                        // result.success = false; //发消息失败
                        if (result.success) {
                            that.keypressMsg=false
                            that.showDialog=false
                            let {msg_id} = result.data
                            //修改状态 为成功
                            //Modify the status as successful
                            that.list[that.list.length-1].msgId = msg_id
                            await chatLocalMsgDAO.getInstance().add(that.list[that.list.length-1])
                            that.$bus.$emit("imgList", that.list[that.list.length-1].roomIdAndId)
                            that.scrollWay();
                            
                        
                        } else {
                            //修改状态 为失败
                            // this.list.map(item => {
                            //     if (
                            //         item.status &&
                            //         item.status === MSG_TYPE.SEND_MSG_STATUS_LOADING
                            //     ) {
                            //         item.status = MSG_TYPE.SEND_MSG_STATUS_FAIL;
                            //     }
                            //     return item;
                            // });

                            that.list[that.list.length-1].isResending = 1;
                            that.list[that.list.length-1].isSendFaild = false;
                            
                            // 上传未成功删除msgId属性
                            // The upload failed to delete the msgId attribute
                            delete that.list[that.list.length-1].msgId
                            let sedTime = that.list[that.list.length-1].sendTime
                            that.updMsgItemFunc(sedTime)
                            console.log(result,'testgbggg')
                            that.$message.error(result.message);
                            this.setList(this.chatInfo, this.list);
                        }
                    });
                };
                request.send()
                
            }else{
                // this.list[this.list.length-1].isResending = 1;
                // this.list[this.list.length-1].isSendFaild = false;
                // // 上传未成功删除msgId属性
                // delete this.list[this.list.length-1].msgId
                // let sedTime = this.list[this.list.length-1].sendTime
                // this.updMsgItemFunc(sedTime)
                this.$message.error(res.message)
            }
            
            this.sendVoice=false
            
                
        },
        beforeUpload (file){
                const isLt2M = file.fileName;
                
                if (!isLt2M) {
                   console.log("上传失败，大小不能超过2M");
                }
                return isLt2M;
                },
         blobToFile(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
            theBlob.lastModifiedDate = new Date();
            theBlob.fileName = fileName;
            
            return theBlob;
        },
        async sendRedPacket(item){
            let msgContent = {
                                id : item.redId,
                                nickName:item.nickName,
                                remark:item.remark
            }
            let post = {
                        // mid: this.chatInfo.id,
                        // receiveType: MSG_TYPE.RECEIVE_TYPE_PRIVATE, // 1私聊(private chat) 2群聊(group chat)
                        msgType: MSG_TYPE.IM_MSG_TYPE_REDBAG,
                        msg: msgContent,
                        sendTime: item.sendTime,
                        quoteMsgId: 0,
                        replyType: 0,
                        msgId:item.msgId,
                        isMine: MSG_TYPE.IS_MINE,
                        receiveName: this.chatInfo.nikeName || this.chatInfo.name,
                        roomType: this.roomType,
                    }
            if (this.roomType == MSG_TYPE.RECEIVE_TYPE_PRIVATE) {
                        post.mid = this.chatInfo.id || this.getRoomIdsId(this.chatInfo.roomIdAndId);
                        post.receiveType = MSG_TYPE.RECEIVE_TYPE_PRIVATE;
                        post.roomIdAndId = `${this.chatInfo.id||this.chatInfo.mid}_${MSG_TYPE.RECEIVE_TYPE_PRIVATE}`
                    } else {
                        post.roomId = this.chatInfo.id || this.getRoomIdsId(this.chatInfo.roomIdAndId);
                        post.receiveType = MSG_TYPE.RECEIVE_TYPE_PUBLIC;
                        post.roomChatId = this.chatInfo.roomChatId
                        post.roomIdAndId = `${this.chatInfo.id}_${MSG_TYPE.RECEIVE_TYPE_PUBLIC}`
                    }

                this.list.push(post);
                this.listSend.push(post)
                let getInstanceLocal = chatLocalMsgDAO.getInstance();
                getInstanceLocal.add(post)
                this.nbrSend++
                this.$store.dispatch('AddChatInRooms',post)
        },
        async sendMsgs(content,users){
            this.sendMsgScroll=true
            //await this.getHistoryBottom()
            // this.closeWS()
            this.$bus.$on('closeQuote', () => {
                this.quotaActive=false
            })
            this.quotaActive=false
            if(!this.editMsg){
                this.noScrollActiveData=false
            }
            if(this.sendVoice){
                let fileName=this.$t('appName')+'.wav'
                this.sendVoiceF(new File([this.voiceContent], fileName),this.getObjectURL(this.voiceContent))
            }
            if (content) {
                let insertData
                let post

                
                // Start reading the blob as text.
                if(!content.isSendFaild){
                    let msgTypeT = MSG_TYPE.IM_MSG_TYPE_TEXT
                    if(this.businessCard){
                        msgTypeT = MSG_TYPE.IM_MSG_BUSINESS_CARD
                            let msgContent = {
                                friendId : content.id,
                                photo:content.photo,
                                nikeName:content.nikeName
                            }
                            content = msgContent
                            
                            this.businessCard = false
                    }
                    let msgspro =  JSON.stringify({
                            message: content,
                            user: users
                    })
                    post = {
                        // mid: this.chatInfo.id,
                        // receiveType: MSG_TYPE.RECEIVE_TYPE_PRIVATE, // 1私聊(private chat) 2群聊(group chat)
                        msgType: msgTypeT,
                        msg: JSON.stringify({
                            message: content,// 传的话就要用 utf16
                            user: users
                        }),
                        sendTime: parseInt(new Date().getTime()),
                        quoteMsgId: 0,
                        replyType: 0,
                    }
                    //如果是密聊 roomType = 1 给后台传mid字段
                    // 密聊用户字段房间名为 nickName，群聊为 name
                    //If it is a secret chat roomType = 1 pass the mid field to the background
                    // Secret chat user field room name is nickName, group chat is name
                    if (this.roomType == MSG_TYPE.RECEIVE_TYPE_PRIVATE) {
                        post.mid = this.chatInfo.id || this.getRoomIdsId(this.chatInfo.roomIdAndId);
                        post.receiveType = MSG_TYPE.RECEIVE_TYPE_PRIVATE;
                        post.roomIdAndId = `${this.chatInfo.id||this.chatInfo.mid}_${MSG_TYPE.RECEIVE_TYPE_PRIVATE}`
                    } else {
                        post.roomId = this.chatInfo.id || this.getRoomIdsId(this.chatInfo.roomIdAndId);
                        post.receiveType = MSG_TYPE.RECEIVE_TYPE_PUBLIC;
                        post.roomChatId = this.chatInfo.roomChatId
                        post.roomIdAndId = `${this.chatInfo.id}_${MSG_TYPE.RECEIVE_TYPE_PUBLIC}`
                    }
                    
                    // 如果是引用消息
                    // If it is a quoted message
                    post = this.forQuote(post, msgTypeT)
                    
                    insertData = {
                        ...post,
                        // 自己渲染就用原来的
                        // Use the original for rendering by yourself
                        msg: msgspro, 
                        isMine: MSG_TYPE.IS_MINE,
                        receiveName: this.chatInfo.nikeName || this.chatInfo.name,
                        roomType: this.roomType,
                        isResending: 4,
                        isSendFaild: true,
                    };
                    if(!this.editMsg){
                        this.noScrollActiveData=false
                        this.sendMsgScroll=true
                        await this.getHistoryBottom()
                        this.list.push(insertData);
                        if(this.list.length>65){
                            this.list.splice(0, 1);
                        } 
                        
                        this.listSend.push(insertData)
                        /* let dataDB={...insertData}
                        dataDB.msgId=111111
                         let getInstanceLocal = chatLocalMsgDAO.getInstance();
                        getInstanceLocal.add(dataDB) */
                        //this.list[idx] = it;
                        this.$store.dispatch('AddChatInRooms',insertData)
                        
                    }
                    else{
                        this.noScrollActiveData=true
                        let that = this
                        this.list.forEach(function(item,index) {
                            
                            if(item.msgId===that.editData.msgId){
                                item.msg=msgspro
                                that.$set(that.list, index, item)

                            }
                        });
                        this.eVals= ''
                        this.editData={}
                        this.editMsg=false
                    }
                    
                    // 标记当前聊天房间
                    // Mark the current chat room
                    //this.setList(this.chatInfo, this.list);
                }else{
                    insertData = content
                    insertData.msg = JSON.stringify({
                        message: content.msg.message,
                        user: users
                    })
                    post = content
                }
                let res = await sendMsg(post);
                let { arrIdx } = content
                arrIdx*=1
                // res.success = false;
                if(res && res.success){
                    
                    
                     let getInstanceLocal = chatLocalMsgDAO.getInstance();
                    if(post.msgId){
                        getInstanceLocal.find(post.msgId).then((result)=>{
                            if(result){
                                getInstanceLocal.delete(post.msgId)
                            }   
                        }) 
                            
                            //this.$forceUpdate()
                            // this.setList(this.chatInfo, this.list);
                    }
                     
                    let msg_id = res.data.msg_id
                    
                    // 赋值
                    // TODO 消息发送太快 会有bug  需要做个消息缓存模型
                    if(!arrIdx){
                        
                        
                        
                        
                        if(msg_id){
                            let item = {... this.list[this.nbrList]}
                            item.msgId=msg_id
                            this.list[this.nbrList]=item
                            this.nbrSend++
                            this.listSend[this.nbrSend].msgId=msg_id
                            getInstanceLocal.add(this.listSend[this.nbrSend])
                            
                            this.$forceUpdate()
                        }
                        // 标记当前聊天房间
                        // Mark the current chat room
                        this.$store.dispatch('AddChatInRooms',this.list[this.list.length-1])
                    }
                    if(content.isResending==1 || content.isResending==3 || content.isResending==4){
                        let targetMsg = this.list[arrIdx]
                         console.log(content,'info')
                         let getInstanceLocal34 = chatLocalMsgDAO.getInstance();
                                getInstanceLocal34.delete(content.msgId).then(()=>{
                                    let index=this.list.findIndex(qry => qry.msgId === content.msgId)
                                     console.log(index,'info index')
                                    this.list.splice(index, 1);
                                })
                        
                        targetMsg.isResending = 2
                        targetMsg.msgId = msg_id
                        targetMsg.sendTime = content.sendTime
                        delete targetMsg.arrIdx
                        delete targetMsg.isSendFaild
                        
                        this.sendMsgScroll=true
                        //await this.getHistoryBottom()
                        this.list.push(targetMsg);
                        // 标记当前聊天房间
                        // Mark the current chat room
                        this.$store.dispatch('AddChatInRooms',targetMsg)
                    }

                    // 更新缓存数据 包括图片视频 获取msg_id方便撤回消息
                    // {msg_id: 3362, send_time: 1608969330}

                }else{
                    let sedTime;
                    if(content.isResending==3 || content.isResending==1){
                        
                        this.list[arrIdx].isResending = 1;
                        this.list[arrIdx].isSendFaild = false;
                        sedTime = this.list[arrIdx].sendTime
                        
                        
                    }else if(!this.isObject(content)){
                    console.log(res,'testgbggg',content)

                        
                       
                        sedTime = this.list[this.list.length-1].sendTime
                        let getInstanceLocal = chatLocalMsgDAO.getInstance();
                        getInstanceLocal.get().then(result=>{
                                console.log(res,'result',result)

                            let nbr= result.filter(item=>item.isSendFaild==false).length
                            this.list[this.list.length-1].isResending = 1;
                            this.list[this.list.length-1].isSendFaild = false;
                            
                            this.list[this.list.length-1].msgId = insertData.sendTime+nbr;
                             console.log(this.list[this.list.length-1])
                            getInstanceLocal.add(insertData)
                            let getInstance = chatInRoomsDAO.getInstance();
                                let infoRoom = {...this.chatInfo}
                                if(res.code==5022){
                                    infoRoom.resend=true

                                }
                                getInstance.update(infoRoom).then(()=>{
                                    this.$store.commit("SET_CHATINFO", infoRoom);
                            })
                        })
                        
                        
                    }
                    this.updMsgItemFunc(sedTime)
                    
                    this.$message.error(res.message)
                }
                this.setList(this.chatInfo, this.list);
            }
        },
        // 根据元素自定义属性获取元素，操作元素
        // Obtain elements and manipulate elements according to their custom attributes
        getElementByAttr(tag,attr,value){
            var aElements=document.getElementsByTagName(tag);
            var aEle=[];
            for(var i=0;i<aElements.length;i++)
            {
                if(aElements[i].getAttribute(attr)==value)
                    aEle.push( aElements[i] );
            }
            return aEle;
        },
        
        // 聊天消息自动滑倒最底部
        // The chat message automatically slips to the bottom
        async scrollWay() {

                     if(!this.noScrollActiveData&&!this.infoUser && !this.searchglobal){
                                this.$nextTick(async() => {
                                        
                                        // 如果有 unReadNum ，则是从其他房间进入。反之则 正在此聊天室聊天
                                        // 滑到最底部操作
                                        // If there is unReadNum, it is entered from another room. Otherwise, chatting in this chat room
                                        // Slide to the bottom to operate
                                        
                                            // 正在此聊天室 
                                            // 密聊 数据导入一次滑动一次 => 每次滑动只需要取最后一条消息标记为已读
                                            // is in this chat room
                                            // Secret chat data import once slide once => each slide only needs to take the last message and mark it as read
                                    
                                    if(this.isToBottom){
                                            let contaner = document.querySelector("#msgList");
                                            contaner.scrollTop = contaner.scrollHeight;
                                            let lastArr = this.list.slice(-1)[0];
                                            lastArr&&this.imMsgReceiptFunc(lastArr)
                                            
                                    }else{
                                        this.isToBottom = true;
                                    }
                                });
                                }
        },
        scrollUnreadMsg(unReadNum){
            if(this.searchglobal){
                this.searchglobal=false
                return
            }
            this.unReadNumScroll=unReadNum
            let that = this
            let roomIdAndId = this.chatInfo.roomIdAndId
            
            let getInstance = chatInRoomsDAO.getInstance();
            let getInstanceLocal = chatLocalMsgDAO.getInstance();
            let unReadNums = this.unReadNum-unReadNum>0?this.unReadNum-unReadNum:0
            this.$store.commit("SET_UNREAD_NUM", unReadNums)
            let indexList=this.list.length - unReadNum - 1
            if(this.list[indexList]){
                let msgId=this.list[indexList].msgId
                let contaner = document.querySelector("#msgList");
                let dom = this.getElementByAttr('div','id',msgId)[0];
                let clientHeight = document.body.clientHeight;
                    if(dom&&dom.offsetTop){
                        contaner.scrollTop = dom.offsetTop - (clientHeight/2) + 150;
                        this.$(dom).addClass('masks')
                    }
                    setTimeout(() => {
                        that.$(dom).removeClass('masks') 
                    }, 2000);
                
            }

            getInstance.find(roomIdAndId).then((dataIndexDB)=>{
                dataIndexDB.unReadNum=0
                dataIndexDB.msgCount=0
			    getInstance.update(dataIndexDB).then(()=>{
                    this.chatInfo.unReadNum=0
                    getInstance
                    .get()
                    .then((result) => {
                        this.$store.commit('SET_CHATIN_ROOMS', result)
                    })
                    .catch((e) => {
                        console.log("err_or: ", e);
                    });
                })
                getInstanceLocal.find(dataIndexDB.msgId).then((result)=>{
                    if(result){
                        this.imMsgReceiptFunc(result)
                    }
                })
                
            })
            
            
         },
        forId(index){
            return "forid_" +index
        },
        handleClick(item){
        },
        async detailInfo(){
            if(this.roomType === 2){
                this.$store.dispatch('SetRoomInfo', {roomId: this.chatInfo.id , status:false})
                this.$store.dispatch('setDetailGroup',true)
            }else{
                let uid = this.chatInfo.id;
                let userInfo = await this.fixInfo(1, {
                    userId: uid,
                }).catch((err) => {
                    this.$bus.$emit('show_dialog_err',err)
                });
                if(userInfo){
                    //userInfo.avatar=userInfo.nikeName
                    this.$store.commit('UPDATE_FRIENDS',userInfo)
                    let chatObj = {...this.chatInfo, ...userInfo}
                    this.$store.commit('SET_CHATINFO', chatObj)
                    let getInstance = chatInRoomsDAO.getInstance();
                    getInstance.update(chatObj).then(()=>{
                        getInstance.get().then(result=>{
                            this.$store.commit('SET_CHATIN_ROOMS', result)
                            this.$store.dispatch('setDetailFriend',true)
                            this.$bus.$emit("getImages",0,[],[])
                            let images = []
                            let bigImages = []
                            let roomIdAndId = chatObj.roomIdAndId
                            chatLocalMsgDAO.getInstance().findByRoomIdAndId(roomIdAndId).toArray()
                                .then((listData)=> {
                                    let imagesList = listData.filter(qry=>qry.msgType === MSG_TYPE.IM_MSG_TYPE_PICTURE)
                                    imagesList.forEach(qry =>{
                                        images.push(JSON.parse(qry.msg).thumbUrl)
                                        bigImages.push(JSON.parse(qry.msg))
                                    })
                                    imagesList.length = 0;
                                    this.$bus.$emit("getImages",images.length > 16 ? 16 : images.length,images,bigImages)
                                

                            })
                        })
                    })   

                }
            }
            this.$bus.$emit("openDetails")
        },
        reInviteFriend(){
            let post = {
                friendId: this.chatInfo.id,
                remark: ''
            }
            addUserRelation(post).then(res => {
                let dedata = res;
                if(dedata.success){
                    let getInstance = chatInRoomsDAO.getInstance();
                    this.chatInfo.resend=false
                    getInstance.update(this.chatInfo).then(()=>{
                                    getInstance
                                        .get()
                                        .then((result) => {
                                            this.$store.commit('SET_CHATIN_ROOMS', result)
                                            let that = this
                                            
                                        })
                                    .catch((e) => {
                                        console.log("err_or: ", e);
                                    });
                                })
                    this.$message.success(this.$t('applyHasSent'));
                    this.$bus.$emit('addfriend_init');
                    
                }else{
                    this.$message.error(dedata.message)
                }
            })

        },
        imMsgReceiptFunc(item){
            //优化切换房间 最后一条已读id 缓存，回执过的就不回执了
            //Optimize the cache of the last read id to switch rooms, and the ones that have been received will not be returned
            let lastMsgId = null;
            let getInstance = chatInRoomsDAO.getInstance();
            getInstance.find(item.roomIdAndId).then((dataIndexDB)=>{
                if(dataIndexDB){
                    lastMsgId=dataIndexDB.lastReadMsgId
                }
            }) 
            if(item.senderId==this.userInfo.id ||
                item.mid==this.chatInfo.id || 
                item.isMine == MSG_TYPE.IS_MINE ||
                item.msgId == lastMsgId
            ){
                return
            }
            console.log(item,'123123')
            let post = {
                msgId: item.msgId,
                receiptType: item.roomType,
                roomId: item.roomId,
                senderId: item.senderId,
            }
            imMsgReceipt(post).then(res => {
                if(res.success){
                    getInstance.find(item.roomIdAndId).then((dataIndexDB)=>{
                            if(dataIndexDB){

                            
                                dataIndexDB.lastReadMsgId=item.msgId
                                getInstance.update(dataIndexDB).then(()=>{
                                    getInstance
                                        .get()
                                        .then((result) => {
                                            this.$store.commit('SET_CHATIN_ROOMS', result)
                                            
                                        })
                                    .catch((e) => {
                                        console.log("err_or: ", e);
                                    });
                                })
                            }
                        })   
            }else{
                    this.$message.error(res.message)
                }
            })
        }

    },
}
</script>

<style lang="scss" scoped>

.avatar-chat-info {
    display: inline-flex;
    cursor: pointer;
    .title {
        margin-left: 9px;
        padding-top: 8px;
        h2 {
            font-size: 24px;
            margin-bottom: 5px;
        }
        .tool-item {
            color: #4C4F50;
            font-size: 14px;
            font-weight: 100;
        }

    }   
    .el-avatar {
        width: 57px;
        height: 57px;
        font-size: 24px;
        line-height: 57px;
        text-transform: uppercase;
        overflow: inherit;
        position: relative;
        img{
            border-radius: 50% !important;
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
    }
}


.search-box {
        input{
            border: none;
            outline: none;
        }
}
.chat-box {
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;
    overflow: hidden;
    font-size: 16px;

    .chat-title {
        width: 100%;
        padding: 15px 25px;
        box-sizing: border-box;
        border-bottom: 1px solid #ddd;
        display: block;
        align-items: center;
        
        .chat-top-title {
            width: 100%;
            display: flex;
            h2 {
                flex: 1;
                .title{
                    cursor: pointer;
                }

                span {
                    font-size: 25px;

                }
                .chat-tool {
                    margin-top: 10px;
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                    color: #888;

                    .tool-item {
                        padding-left: 10px;
                        padding-right: 10px;
                        cursor: pointer;

                        &:first-child {
                            padding-left: 0;
                        }

                        &:last-child {
                            border-right: 0;
                        }

                        &:hover {
                            color: #aaa;
                        }
                    }

                }
            }

            .tool-icon {
                width: 40px;
                height: 40px;
                background: #f0f0f0;
                border-radius: 50%;
                text-align: center;
                line-height: 45px;
                cursor: pointer;
                margin-left: 5px;
                i {
                    font-size: 16pt;
                }
                img {
                    width: 20px;
                    height: 20px;
                }

                &:hover {
                    background: #e0e0e0;
                    color: var(--primary-color);
                }
            }
        }
        .chat-top-search {
            width: 100%;
            padding: 10px 50px;
            margin-top: 15px;
            .search {
                border: 1px solid #ddd;
                padding: 10px;
                border-radius: 5px;
                display: flex;
                .search-box {
                    font-size: 9pt;
                    width: calc(100% - 150px);
                    display: inline-flex;
                    height: 20px;
                    img {
                        height: 14px;
                        margin-right: 7px;
                        position: relative;
                        top: 3px;
                    }
                    input{
                        width: 100%;
                    }
                    i.find-icon {
                        background: #ddd;
                        border-radius: 50%;
                        padding: 5px 4px;
                        font-size: 8pt;
                        height: 20px;
                        width: 20px;
                        margin-right: 15px;
                        cursor: pointer;
                        &:hover {
                            background: #ceecfa;
                            color: green;
                        }
                    }
                }
                .info-search{
                        &::before {
                        height: 38px;
                        width: 1px;
                        background: #ddd;
                        content: '';
                        position: absolute;
                        margin-top: -11px;
                    }
                    i.find-icon {
                        background: #ddd;
                        border-radius: 50%;
                        padding: 5px 4px;
                        font-size: 8pt;
                        height: 20px;
                        width: 20px;
                        margin-left: 5px;
                        cursor: pointer;
                        &:hover {
                            background: #ceecfa;
                            color: green;
                        }
                    }

                    span{
                        margin-left: 10px;
                    }
                }
                
            }
        }


    }
    

    .chat-msg{
        height: calc(100vh - 139px);
        width: 100%;
        overflow-y: auto;
        background: #F0F3F4;
        &.searchActive {
            height: calc(100vh - 235px);
        }
        &.moticActive {
            height: calc(100vh - 394px);
            &.quotaActive {
                height: calc(100vh - 459px);
            }
        }
        .his-msg{
            height: 40px;
            text-align: center;
            line-height: 40px;
            cursor: pointer;
        }
        ul{
            min-width: 200px;
            width: 100%;
            li{
                margin-top: 10px;

                &:last-child {
                    margin-bottom: 20px;
                }
            }
        }
    }

    .chat-sendMsg {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        .tool-icon{
            position: relative;
            text-align: center;
            padding: 15px;
            cursor: pointer;
            color: var(--primary-color) !important;
        }
    }
}
.el-badge.unreadMsg{
    right: 30px;
    position: absolute;
    bottom: 77px;
}
p.date-msg {
    text-align: center;
    padding: 10px;
    span {
        color: #000;
        background: #fff;
        font-size: 14px;
        padding: 6px 17px;
        border-radius: 16px;
    }
}
.roomNotice {
    text-align: left;
    background: #f1f1f4;
    padding: 11px;
    border-bottom: 1px solid #E0E3E5;
}
.topNoticePad{
    padding-bottom: 50px;
}

</style>
