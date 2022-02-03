<template>
<div class="session-list">
    <div class="session-chat-list">
       
        <ul id="list" @scroll="scrollEvent" ref="customRef">
            
             <li @click="setNotifFunc"  :class="{'active':notification}" >
                <div class="chat-avatar">
                    <img  :src="require('@/assets/svg/notification-icon.png')" alt="">
                </div>
                <div class="chat-info" >
                    <div class="chat-desc">
                        <h6>{{$t('chatTitle')}} <img  :src="require('@/assets/svg/notification-check.svg')" alt=""></h6>
                        <p v-if="lastNotice" v-html='handleNotice(lastNotice.msg)'></p>
                    </div>
                    <div class="chat-time" >
                        <p class="time" v-if="lastNotice">{{lastNotice.sendTime | fromNow}}</p>
                        <el-badge  :value="noticeNum" :max="99" class="item" :hidden="noticeNum<=0" >
                            <div style="width:20px;height:20px;" ></div>
                        </el-badge>
                    </div>
                </div>
                
            </li>
            <li @click="setBroadcastListFunc" :class="{'active':broadcastList}">
                <div class="chat-avatar">
                    <img  :src="require('@/assets/svg/broadcast.svg')" alt="">
                </div>
                <div class="chat-info">
                    <div class="chat-desc">
                        <h6>{{$t('broadcast')}}</h6>
                        <p v-if="lastBatch && lastBatch.msgType!=MSG_TYPE.IM_MSG_TYPE_TEXT">
                            {{handleMessage(lastBatch.message, lastBatch.msgType,lastBatch)}}
                        </p>
                        <p v-if="lastBatch && lastBatch.msgType===MSG_TYPE.IM_MSG_TYPE_TEXT">
                            {{JSON.parse(lastBatch.message).message}}
                        </p>
                    </div>
                    <div class="chat-time" >
                        <p class="time" v-if="lastBatch">{{lastBatch.createTime | fromNow}}</p>
                        
                    </div>
                </div>
                
            </li>
            <li  :class="{'active':chatActiveIdx == index}" :index="index" v-for="(item, index) in chatInRooms" v-show="item.id!=userInfo.id" :key="index" >
                <div class="chat-avatar " :class="{'with-status':item.onlineStatus=== 1}" :index="index" @click="toChat(item,index)">
                    
                    <img  v-if="item.logo" @error="item.logo === null" :src="item.logo" alt="" :index="index">
                    <p v-if="!item.logo && item.avatar" :index="index" >
                        {{item.avatar.slice(0,2)}}
                    </p>
                    <img v-if="!item.logo && !item.avatar" :src="require('@/assets/svg/notification-icon.png')" alt="">
                </div>
                <div class="chat-info">
                    <div class="chat-desc" :index="index" @click="toChat(item,index)">
                        <h6 :index="index">{{item.avatar}}</h6>
                        <p :index="index" v-if="item && (item.msgType === MSG_TYPE.IM_MSG_TYPE_NOTIFICSTION)" v-html='handleNotice(item.msg)' v-show="item.roomType===MSG_TYPE.RECEIVE_TYPE_PRIVATE || (item.roomType===MSG_TYPE.RECEIVE_TYPE_PUBLIC && ((item.showRoomNotice!=1 || item.msg.noticeType != MSG_TYPE.ROOM_KICK_USER) && (item.showMuteNotice!=1 || item.msg.noticeType != MSG_TYPE.ROOM_MUTE_USER)) || item.groupRole != 1)"></p>
                        <p :index="index" v-else>{{handleMessage(item.msg, item.msgType,item)}}</p>
                    </div>
                    <div class="chat-time" :index="index" >
                        <!-- <div style="max-height:0px;overflow:hidden;">{{item}}</div> -->
                        <p  @click="toChat(item,index)" :index="index" class="time" v-if="item.sendTime">{{item.sendTime | fromNow}}</p>
                        <!-- <p class="time">{{item}}</p> -->
                        <!-- <p class="number">{{unReadNum(item.roomIdAndId)}}</p> -->
                        
                        
                        <img @click="toChat(item,index)" src="@/assets/svg/silent.svg" v-if="item.msgDoNotDisturb===1"  class="icone-info" alt="">
                        <img @click="toChat(item,index)" src="@/assets/svg/pin.svg" v-if="item.topStatus===1" style="top: 12px;" class="icone-info" alt="">
                        <el-badge @click="toChat(item,index)" :index="index" :value="item.unReadNum" :max="99" class="item" v-if="item.unReadNum>0">
                            <div style="width:20px;height:20px;" :index="index"></div>
                        </el-badge>
                        <img src="@/assets/svg/dropDown.svg" :index="index" @click="rightPoint"   class="icone-info dropDownIco" alt="" :class="{'active':chatActiveIdx == index}">
                    </div>
                </div>
                
            </li>
        </ul>
    </div>
    
    <add-batch v-if="showBatch" @hideSetBox="hideBatchFunc"></add-batch>
    
    <el-dialog
        :title="$t('groupAnnouncement')"
        :visible.sync="announcementGroup"
        :before-close="handleCloseAnnouncement"
        width="30%"
    >
        <span>{{announcementGroupText}}</span>
    </el-dialog>
</div>
</template>

<script>

import {
	chatInRoomsDAO,
	chatLocalMsgDAO,
    NoticeMsgDAO
} from "@/services/db";
import {
    mapGetters
} from 'vuex'
import MSG_TYPE,{ handleMessage,handleNotice } from '@/services/im/constant';
import { VueDebounce } from "@/services/tool"

export default {
    components: {
        
    },
    data() {
        return {
            lastNotice: null,
            lastBatch: null,
            chatInRoomsAll:[],
            tabActive: 1,
            MSG_TYPE,
            chatListScroll: 0,
            visible: false,
            showAddGroup: false,
            announcementGroup:false,
            showAddPrivateChat: false,
            showBatch: false,
            chatActiveIdx: -1,
            friendItem: {},
            sessionIndex: -1,
            isFirst: true,
            noticeNum: 0,
            avatarFor: [],
            nameFor: [],
            labelTextU: 'Pin',
            findCount: 0,
            announcementGroupText:''
        };
    },
    computed: {
        ...mapGetters([
            'userInfo',
            'rooms',
            'chatInfo',
            'chatInRooms',
            'friends',
            "noticeMsg",
            'notification',
            'broadcastList',
            'batchs'
        ]),

    },
    watch: {
        chatInRooms(val){
            if(val.length==0){
                this.$store.commit("SET_UNREAD_NUM", 0);
            }
            //this.makeUserMsg(this.avatarFor, 1)
            //this.makeUserMsg(this.nameFor, 2)
            

        },
        noticeMsg: {
            handler(newVal, oldVal) {
                if(newVal){
                    this.checkNoticeNum(newVal)
                }
            },
            deep: true
        },
    },
    updated() {
        this.makeActiveCls()
        this.$bus.$off('usersupd:sess')
        this.$bus.$on('usersupd:sess', () => {
            this.$forceUpdate()
        })
        this.$bus.$off('updateBatchTest')
        this.lastBatch = this.batchs[0]
        this.$bus.$on('updateBatchTest', () => {
            let that = this
                that.lastBatch = this.batchs[0]
                that.$forceUpdate()
        })

       //this.chatInRooms.unshift(chatInRoomsPin)
        //this.updatePin()
    },
    
    mounted() {
        
        this.makeActiveCls()
        //this.rightPoint()
        this.prevs()
        this.$bus.$off('usersupd:sess')
        this.$bus.$on('usersupd:sess', () => {
            this.$forceUpdate()
            
        })

        this.$bus.$off('usersupd:nav')
        this.$bus.$on('usersupd:nav', () => {
            this.prevs()
        })
        this.lastBatch = this.batchs[0]
        if(this.isFirst){
            setTimeout(() => {
                this.isFirst = false
                this.$forceUpdate()
                
            },500)
            
        }
        this.$bus.$off('updateBatchTest')
        this.$bus.$on('updateBatchTest', () => {
            this.lastBatch = this.batchs[0]
            this.$forceUpdate()
        })
         NoticeMsgDAO.getInstance().get().then(result=>{
            this.$store.dispatch('SetNoticeMsg', [...result])
            this.checkNoticeNum(this.noticeMsg)
        })   

        
    },
    
    methods: {
        setBroadcastListFunc(){
            this.$store.dispatch('SetBroadcastList',true)
            this.$store.dispatch('SetSerieManage',false)
             this.$store.dispatch('SetNotification',false)
             this.$store.dispatch('setCreateGroup',false)
            this.$bus.$emit('updateBatch')
            this.chatActiveIdx = -1
        },
        setNotifFunc (){
             this.$store.dispatch('SetNotification',true)
             this.$store.dispatch('SetBroadcastList',false)
             this.$store.dispatch('setCreateGroup',false)
            this.$store.dispatch('SetSerieManage',false)
             this.chatActiveIdx = -1
        },
       
        // 右键菜单处理
        // Right-click menu processing
        /* updatePin(){
            let oldchatInRooms = this.chatInRooms
            oldchatInRooms.forEach((element,index) => {
                if(element.topStatus===1){
                    this.oldchatInRooms.splice(0, 0, oldchatInRooms.splice(index, 1)[0]);
                }
            });
            if(oldchatInRooms!=this.chatInRooms){
                console.log(this.oldchatInRooms,'chatInRoomsttt')
            }
        }, */
        checkNoticeNum(val){
            
            let count=0
            if(val.length>0){
                val.map(v => {
                    if(!v.isRead){
                        count++
                    }
                })
            }
            let getInstanceNotice = NoticeMsgDAO.getInstance();
            getInstanceNotice.getLast().then(result=>{
                this.lastNotice = result          
            })
            this.noticeNum = count;
        },
        handleNotice,
        labelText(v){
            this.labelTextU=this.chatInRooms[v].topStatus===2?this.$t('pin'):this.$t('Unpin')
        },
        rightPoint(e){
            let customRef = this.$refs.customRef
            let that = this;
            const {remote, ipcRenderer} = this.$electron
            const {Menu, MenuItem} = remote;
            //右键菜单
            //Right-click menu
            const menu = new Menu();

                    if(e){
                        e.preventDefault();

                    }
                let dom = this.$(e.target)
                // console.log('popName: ',dom.prop("tagName"))
                // 判断元素是否为 sup
                // Determine whether the element is sup
                if(dom.prop("tagName")==='SUP'){
                    
                    return
                }
                this.sessionIndex = e.target.getAttribute("index")

                if(!this.sessionIndex)return
                this.labelText(this.sessionIndex)
                
               let  MenuList = [
                {
                    label: this.labelTextU, // 清空当前聊天记录 // pin the current chat
                    click: () => {
                        if(!this.sessionIndex){
                            return this.$message.error(this.$t('delDesc1'))
                        }
                        let val = this.chatInRooms[this.sessionIndex]
                        
                        let status 
                        if(val.topStatus===1){
                            status = 2
                        }else{
                            status = 1
                        }
                        val.topStatus = status
                        this.$store.dispatch('pinChatRoom', val)
                        // 要重新进入列表一个房间
                    },
                    id: 'menuListClass'
                    //visible : this.chatInRooms[this.sessionIndex].topStatus===2 ? true : false
                    
                },
                {
                    label: this.$t('delConv'), // 清空当前聊天记录 // Clear the current chat history
                    click: () => {
                        if(!this.sessionIndex){
                            return this.$message.error(this.$t('delDesc1'))
                        }
                        let val = this.chatInRooms[this.sessionIndex]
                        
                        this.$store.dispatch('DelChatInRooms', val)
                        // 要重新进入列表一个房间
                        
                    }
                },
            ]
            menu.clear()
                 MenuList.map(v=> {
                    v = new MenuItem(v)
                    
                    menu.append(v)
                })
                menu.popup({window: remote.getCurrentWindow()})

        },
        
        async testDebounce() {
            if(this.chatInRooms&&this.chatInRooms.length>0){
                this.findCount = 0;
            }else{
                ++this.findCount;
                if(this.findCount>3){
                    return
                }
                this.prevs()
            }
        },
        prevs: VueDebounce('testDebounce', 1000),
        
        handleMessage,
        makeActiveCls(){
            if(this.chatInfo&&this.chatInfo.id==-1)return
            let fid = this.chatInfo&&this.chatInfo.roomIdAndId;
            if(fid && !this.notification && !this.broadcastList){
                let actIndex = this.chatInRooms.findIndex((value, index, arr) => {
                    return (value.roomIdAndId == fid) 
                })
                this.chatActiveIdx = actIndex
            }
            
        },
        getFriend(item){
            this.friendItem = item;
            this.isShowRemark=true;
        },
        scrollEvent() {
            let read = this.$el.querySelector('#list')
            this.chatListScroll = read.scrollTop;
        },
        showAddGroupFunc() {
            this.visible = false;
            this.showAddGroup = true;
        },
        hideAddFroupBox() {
            this.showAddGroup = false;

        },
        showAddPrivateChatFunc() {
            this.visible = false;
            this.showAddPrivateChat = true;
        },
        showBatchFunc() {
            this.visible = false;
            this.showBatch = true
        },
        hideAddPrivateChat() {
            this.showAddPrivateChat = false;
        },
        handleCloseAnnouncement(){
            this.announcementGroupText=''
            this.announcementGroup=false
        },
        hideBatchFunc() {
            this.visible = false;
            this.showBatch = false
        },
        toChat(item, idx , event) {
            this.$emit('closeFiles2')
            this.$bus.$emit("inputText", true)
            this.$bus.$emit('closeQuote')
            this.$bus.$emit("imgList", item.roomIdAndId)
            //if(this.chatActiveIdx==idx)return
            
            this.chatActiveIdx = idx;
            this.$store.dispatch('SetChatInfo', item);
            console.log('here')
            this.$bus.$emit('changeChat', true);
            this.$bus.$emit('searchActiveUp', false);
            this.$store.dispatch('setDetailFriend',false)
            this.$store.dispatch('setDetailGroup',false)
            
             this.$store.dispatch('SetChatBox',true)
            this.$store.commit('SET_EVAL', '')
            if(item.roomNotice && item.isFirst && item.topNotice !=1){
                this.announcementGroup=true
                this.announcementGroupText=item.roomNotice
            }
        },

    },
};
</script>

<style lang="scss" scoped>

.session-list {
    position: relative;
    height: 100%;
    font-size: 16px;

    .add-chat {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        padding: 10px;
        box-sizing: border-box;

        .add-chat-btn {
            width: 100%;
            height: 32px;
            font-size: 12px;
            border: 1px solid #ddd;
            border-radius: 20px;
            background: #fff;
            text-align: center;
            line-height: 32px;
            cursor: pointer;

            img {
                width: 18px;
                vertical-align: middle;
            }

        }

        &.border-style {
            box-shadow: 0 2px 2px rgba($color: #000000, $alpha: .1);
        }

    }

    .session-chat-list {
        height: 100%;
        box-sizing: border-box;

        ul {
            height: calc(100%);
            overflow-y: auto;
            &.top-session-list{
                height: initial;
                padding-bottom: 3px;
            }
            li {
                // height: 1000px;
                display: flex;
                align-items: center;
                padding: 0 10px;
                box-sizing: border-box;
                padding-bottom: 0;
                height: 62px;
                padding-top: 8px;

                &.active {
                    background: #F0F3F4 !important;
                }

                &:hover {
                    cursor: pointer;
                    background: #F0F3F4;
                    img.icone-info{
                         &.dropDownIco{
                            display: inline;
                        }
                    }
                }

                .chat-avatar {
                    width: 48px;
                    height: 48px;
                    position: relative;
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
                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        background: #e5e4e8;
                    }

                    p {
                        border-radius: 50%;
                        width: 48px;
                        height: 48px;
                        font-size: 12px;
                        color: var(--primary-color);
                        background: #e5e4e8;
                        font-weight: bold;
                        text-align: center;
                        line-height: 50px;
                    }
                }
                .chat-info{
                    border-bottom: 1px solid #E0E3E5;
                    display: inline-flex;
                    width: calc(100% - 48px);
                    .chat-desc {
                    
                        margin-left: 10px;
                        flex: 1;
                        align-items: center;
                        height: 56px;
                        padding-top: 10px;

                        h6 {
                            font-size: 16px;
                            color: #000;
                            font-weight: 500;
                            word-break: keep-all;
                            text-overflow: ellipsis;
                            max-width: 160px;
                            white-space: nowrap;
                            overflow: hidden;

                        }

                        p {
                            
                            margin-top: 10px;
                            font-size: 14px;
                            color: #4C4F50;
                            overflow: hidden;
                            word-break: keep-all;
                            text-overflow: ellipsis;
                            max-width: 160px;
                            white-space: nowrap;
                        }
                    }

                    .chat-time {
                        text-align: right;
                        padding-top: 10px;

                        .item{
                            right: -3px;
                            top: 15px;
                        }

                        .time {
                            font-size: 13px;
                            color: #666;
                        }

                        .number {
                            display: inline-block;
                            padding: 2px 5px;
                            box-sizing: border-box;
                            margin-top: 5px;
                            font-size: 12px;
                            background: #f56c6c;
                            border-radius: 10px;
                            text-align: center;
                            color: #fff;
                            font-weight: bold;
                        }
                    }
                }
            }
        }

    }

}
img.icone-info {
    display: inline-block;
    position: relative;
    top: 8px;
    margin-left: 2px;
    &.dropDownIco{
        display: none;
    }
    &.active{
        display: inline;
    }

}
</style>
<style lang="scss">
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
    img{
            position: relative;
            top: 3px;
            margin-right: 3px;
    }
}
#menuListClass{
    background: #000!important;
}
</style>
