<template>
    <div class="chat-box" >
        <div class="chat-item">
            <div class="chat-title">
                <div class="chat-top-title">
                    <h2 >
                        <img  :src="require('@/assets/svg/notification-icon.png')" alt="">
                        <span>{{$t('chatTitle')}} </span>
                    </h2>
                    <div class="tool-icon">
                        <el-popover class="quick-access-popover" placement="bottom-end" width="120" v-model="visible">
                            <p class="add-chat-item" @click="readNotify()">
                                {{$t('readAllNotify')}}
                            </p>
                            <p class="add-chat-item" @click="clearNotify()">
                                {{$t('clearNotify')}}
                            </p>
                            <div class="add-chat-btn" slot="reference">
                                <img class="quick-access" :src="require('@/assets/svg/menu.svg')" alt="">
                            </div>
                        </el-popover> 
                    </div>
                </div>
            </div>
            <div class="session-chat-list">
                    <ul id="list" @scroll="scrollEvent">
                        <li v-for="(item,key) in noticeMsg" :key="key" @click="toChat(item,key)">
                            <div class="lipro" v-if="item.roomId==0">
                                <div class="chat-avatar" :class="{'unRead': !item.isRead}">
                                    <img :src="avatarFor[key]||logos" alt="">
                                </div>
                                <div class="chat-desc">
                                    
                                    <h6>{{JSON.parse(item.msg.message).nikeName}}</h6>
                                    <div class="msg-notice">
                                        <p v-html='handleNotice(item.msg)'></p>
                                        <el-row :gutter="20" class="button-notice">
                                            <el-col :span="12" v-if="MSG_TYPE&&(item.msg.noticeType == MSG_TYPE.USER_RELATION_ADD || item.msg.noticeType == MSG_TYPE.ROOM_RELATION_ADD)">
                                                <el-button  class="gray" size="small"  @click="dofunc(item.msg.noticeType,item,{status:3},key)">{{$t('refuse')}}</el-button>
                                            </el-col>
                                            <el-col :span="12" v-if="MSG_TYPE&&(item.msg.noticeType == MSG_TYPE.USER_RELATION_ADD || item.msg.noticeType == MSG_TYPE.ROOM_RELATION_ADD)">
                                                <el-button class="green" size="small"  @click="dofunc(item.msg.noticeType,item,{status:2},key)">{{$t('agree')}}</el-button>
                                            </el-col>
                                            <el-col style="float: right;" :span="12" v-if="MSG_TYPE&&(item.msg.noticeType != MSG_TYPE.USER_RELATION_ADD && item.msg.noticeType != MSG_TYPE.ROOM_RELATION_ADD)">
                                                <el-button   class="gray" size="small" @click.prevent.stop="delNotice(key)" >{{$t('del')}}</el-button>
                                            </el-col>
                                        </el-row>
                                        <p class="time">{{item.sendTime | fromNow}}</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
            </div>
        </div>
    </div>
</template>
<script>
import logos from '@/assets/svg/notification-icon.png'
import {findAllUserRelation, userAcceptOrRefuse, queryUserByid, roomAcceptOrRefuse} from '@/services'
import MSG_TYPE,{handleNotice} from '@/services/im/constant'
import { NoticeMsgDAO } from "@/services/db";
import { VueDebounce } from "@/services/tool"
import {
    mapGetters
} from "vuex";
export default {
    components:{
    },
    data() {
        return {
            chatListScroll: 0,
            friendList: [],
            MSG_TYPE,
            logos,
            avatarFor: [],
            findCount: 0,
            visible:false,
        };
    },
    computed: {
        ...mapGetters([
            "rooms",
            "friends",
            "noticeMsg",
            "userInfo"
        ]),
        
    },
    created() {
        // this.getFriendList();
    },
    watch: {
        noticeMsg(val){
            if(val&&val.length>1){
                this.prevs()
            }
        }
    },
    mounted() {
        NoticeMsgDAO.getInstance().get().then(result=>{
            this.$store.dispatch('SetNoticeMsg', [...result])
        })
        this.makeUserMsg(this.avatarFor, 1)
    },
    methods: {
        async testDebounce() {
            if(this.noticeMsg&&this.noticeMsg.length>0){
                this.findCount = 0;
                await this.makeUserMsg(this.avatarFor, 1)
            }else{
                ++this.findCount;
                if(this.findCount>3){
                    return
                }
                this.prevs()
            }
        },
        prevs: VueDebounce('testDebounce', 1000),
        async makeUserMsg(arr, status){
            for(var i=0;i<this.noticeMsg.length;i++){
                var setObj = this.noticeMsg[i]
                var roomId = (setObj.msg.room&&setObj.msg.room.id)|| ''
                if(roomId){
                    setObj.roomIdAndId = this.setRoomIdsId(roomId, 2)
                }else{
                    var senderId = setObj.senderId
                    setObj.roomIdAndId = this.setRoomIdsId(senderId, 1)
                }
                var data = await this.makeUserMsgs(setObj, status)
                this.$set(arr, i, data)
            }
            
        },
        clearNotify(){
            if(this.noticeMsg.length==0)return
            this.$confirm(this.$t('isConfirmAction'), this.$t('tips'), {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
            }).then(() => {
                
                this.$store.commit("CLEAR_NOTICEMSG")
                //this.$store.commit("SET_NOTICEMSG",[])
            }).catch(()=>{})
        },
        delNotice(idx){
            this.$store.commit("DEL_NOTICEMSG",idx)
        },
        makeNotice(item,index){
            this.$set(item,'isRead',true)
            // 设置缓存里面的已读未读
            // Set the read and unread in the cache
            this.$store.dispatch('SetNoticeMsg', [...this.noticeMsg])
        },
        readNotify(){
            this.noticeMsg.forEach((element,index) => {
                this.makeNotice(element,index)
            });
        },
        async toChat(item,index){
            this.makeNotice(item,index)
            let msgType = (item.msg&&item.msg.noticeType) || ''
            let roomId
            if(
                  MSG_TYPE.ROOM_RELATION_ADD == msgType ||  
                MSG_TYPE.ROOM_USER_KICK == msgType || 
                MSG_TYPE.ROOM_DEL == msgType || 
                MSG_TYPE.USER_RELATION_ADD == msgType 
            ){
                console.log('return')
                return
            }
            // 群聊跳转
            // Group chat jump
            if(item.msg && item.msg.room){
                roomId = item.msg.room.id
                let room;
                this.rooms.some(v => {
                    if(v.roomId == roomId || v.id == roomId){
                        room = v;
                    }
                })
                if(room){
                    if(!room.chatMember){
                        let roomInfo = await this.fixInfo(2,{roomIds: [roomId]}).catch((err) => {
                            console.log(err);
                            this.$bus.$emit('show_dialog_err',err)
                        });
                        if(roomInfo){
                            room = { ...room, ...roomInfo, roomType: 2, roomId: item.roomId};
                        }
                    }
                    this.$store.dispatch('SetChatInfo', room);
                }
            }
            // 密聊跳转 好友申请通过了可以
            // Secret chat jump, friends can apply for it
            if(MSG_TYPE.USER_RELATION_ACCEPT == msgType ){
                let info;
                this.friends.some(v => {
                    if(v.id == item.senderId){
                        info = v;
                    }
                })
                this.$store.dispatch('SetChatInfo', info);
            }


        },
        dofunc(st,item,{status},idx){
            let typeObj = MSG_TYPE;
            if(st==typeObj.USER_RELATION_ADD){
                this.makeRelation(item,status)
                
            }
            if(st==typeObj.ROOM_RELATION_ADD){
                this.makeRoomeRelation(item,status)
            }
            this.$store.commit("DEL_NOTICEMSG",idx)
            
        },
        handleNotice,
        async makeRoomeRelation(item,status){
            let post = {
                userId: item.msg.controUser.id,
                roomId: item.msg.room.id,
                accept: status
            }
            const [errFriend, dataFriend] = await this.awaitWrap(roomAcceptOrRefuse(post))
            if(errFriend){
                this.$message.error(errFriend)
                return
            }
            if(dataFriend.success){
                let str = status==2?this.$t('agree'):this.$t('refuse')
                if(status==2){

                        this.$store.dispatch('FindRoomRelation').then().catch(err=>{
                            this.$message.error(err)
                        })
                } 
            }
        },
        // 好友关系处理
        // Friendship handling
        async makeRelation(item,status){
            let post = {
                friendId: item.id || item.senderId,
                accept: status
            }
            const [errFriend, dataFriend] = await this.awaitWrap(userAcceptOrRefuse(post))
            if(errFriend){
                this.$message.error(errFriend)
                return
            }
            if(dataFriend.success){
                let str = status==2?this.$t('agree'):this.$t('refuse')

                const [errInfo, dataInfo] = await this.awaitWrap(queryUserByid({userId:item.senderId}))
                if(dataInfo.success){
                    let data = dataInfo.data;
                    this.$message.success(this.$t('atoFriend',[str, (data.nikeName||data.account)]))
                    if(status==2){
                        let datas = {
                            ...item,
                            ...data,
                            roomType: 1
                        }
                        this.$store.dispatch('GetFriends')
                        // 重新进入列表一个房间
                        // Re-enter a room in the list
                        // this.$store.dispatch('SetChatInfo', datas);
                        this.$store.dispatch('AddChatInRooms',datas)
                    }   
                }else{
                    this.$message.error(errInfo)
                }
            }
        },
        
        // 查询好友
        // Query friends
        getFriendList() {
            this.friendList = [];
            findAllUserRelation().then(res => {
                let dedate = res;
                if(dedate && dedate.success){
                    dedate.data.map(v => {
                        if(v.status==1){
                            this.friendList.push(v)
                        }
                    })
                    // this.friendList = dedate.data || [];
                    this.$bus.$emit('apply_friend',this.friendList.length)
                }else{
                    //this.$message.error(dedate.message)
                }
            })
        },
        scrollEvent() {
            let _this = this
            let read = _this.$el.querySelector('#list')
            this.chatListScroll = read.scrollTop;
        },
        

    },
};
</script>
<style lang="scss" scoped>
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
                    display: inline-flex;
                    line-height: 57px;
                    img{
                        width: 50px;
                    }
                    .title{
                        cursor: pointer;
                    }

                    span {
                        font-size: 24px;
                        margin-left: 10px;
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
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 45px;
                    cursor: pointer;
                    margin-left: 5px;
                    position: relative;
                    top: 11px;
                    i {
                        font-size: 16pt;
                    }
                    img {
                        width: 100%;
                    }
                    .add-chat-btn.el-popover__reference{
                        line-height: 0;
                        height: 32px;
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
            height: calc(100vh - 185px);
            width: 100%;
            overflow-y: auto;
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
        }
    }
    .session-chat-list {
            height: calc(100vh - 100px);
            box-sizing: border-box;
            overflow: hidden;
            background: #F0F3F4;
            padding: 0;
            padding-left: 40px;
            padding-top: 40px;

            ul {
                height: 100%;
                overflow-y: auto;

                li {
                    height: auto!important;
                    .lipro{
                        // height: 1000px;
                        display: flex;
                        padding: 15px 10px;
                        box-sizing: border-box;

                        &.active {
                            background: #fff !important;
                        }

                        &:hover {
                            cursor: pointer;
                            background: #eaeaea;
                        }

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

                        .chat-desc {
                            margin-left: 10px;
                            flex: 1;
                            align-items: center;

                            h6 {
                                font-size: 12px;
                                margin-top: 7px;
                            }
                            .msg-notice{
                                background: #fff;
                                padding: 10px;
                                border-radius: 13px;
                                border-top-left-radius: 0;
                                margin-top: 11px;
                                width: min-content;
                                p {
                                    margin-top: 5px;
                                    font-size: 14px;
                                    color: #000;
                                    min-width: 400px;
                                    strong {
                                        font-weight: 100;
                                        color: var(--primary-color);
                                    }
                                    &.time{
                                        font-size: 11px;
                                        color: #B3B3B3;
                                        text-align: right;
                                        margin-top: 10px;
                                    }
                                } 
                                .button-notice {
                                    margin-top: 25px;
                                    button {
                                        width: 100%;
                                        font-size: 13px;
                                        font-weight: 800;
                                        &.gray {
                                            color: #000;
                                            background: #E0E3E5;
                                            outline: none!important;
                                            border: none!important;
                                        }
                                        &.green{
                                            background: #00D048;
                                            color: #fff;
                                        }
                                    }
                                }

                            }
                        }
                    }
                }
            }
            #list{
                li{
                    height: 120px;
                    .h6{
                        height: 50px;
                        line-height: 50px;
                        display: flex;
                        justify-content: space-between;
                        .el-button{
                            margin-left: 0;
                        }
                    }
                }
            }
        }
</style>