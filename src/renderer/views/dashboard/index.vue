<template>
<div class="app-cent">
    
    <div class="dashboard-container" v-if="!boxChat && !serieManage && !createGroup && !notification && !broadcastList && !detailGroup && !detailFriend">
        <div class="content-chat">
            
            <img  :src="require('@/assets/svg/start-chat.svg')" alt="">
            <p  v-if="chatInRooms.length>0">{{$t('chatDesc1')}}</p>
            <div v-else>
                <h2>{{$t('there_is_no_chats')}}</h2>
                <p>{{$t('add_contacts_to_start')}}</p>
                <el-button type="primary" @click="isShowAddFrd=true">{{$t('addNewContact')}}</el-button>
            </div>
            <add-private-chat v-if="isShowAddFrd" @hideSetBox="hideFrd" @addFriend="getFriend"></add-private-chat>
            
        </div>
    </div>
    
    <div class="app-chat" v-if="boxChat && !serieManage && !createGroup && !notification && !broadcastList && !detailGroup && !detailFriend">
        <chat-box @openFiles="openFiles" :noScrollActive='noScrollActive'></chat-box>
    </div>
    <div class="app-chat" v-show="serieManage" v-if="!notification && !broadcastList">
        <teams-manage></teams-manage>
    </div>
    <div class="app-chat" v-if="createGroup  && !notification && !broadcastList" v-show="!serieManage">
        <create-group></create-group>
    </div>
    <div class="app-chat" v-if="detailGroup   && !notification && !broadcastList " v-show="!mutedList && !detailFriend && !serieManage">
        <detail-group-update></detail-group-update>
    </div>
    <div class="app-chat" v-if="!notification && !broadcastList " v-show="!serieManage && detailFriend">
        <detail-friend-update></detail-friend-update>
    </div>
    <div class="app-chat" v-if="notification  && !serieManage && !createGroup && !broadcastList">
        <notification></notification>
    </div>
    <div class="app-chat" v-if="broadcastList  && !serieManage && !createGroup && !notification">
        <broadcast></broadcast>
    </div>
    <div class="app-chat" v-if="mutedList">
        <bannedList></bannedList>
    </div>
    <custom-dialog @noScroll='noScroll' ></custom-dialog>
    <el-dialog :visible.sync="securityNull" :title="$t('Set up secret question')">
                
                <span>For your account security please set up a secret question</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary"  @click="securityAdd()">Set Up</el-button>
                    <el-button type="warning" @click="securityNull = false">Not Yet</el-button>
                </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" :title="$t('Set up secret question')">
        <el-form  :model="ruleForm" label-position="top" :rules="rules" ref="ruleForm" label-width="110px">
                <el-form-item :label="$t('newSecretSecIssue')" prop="newQus" >
                    <el-select v-model="ruleForm.newQus" :placeholder="$t('newSecretSecIssue')" >
                        <el-option v-for="item in qusList" :key="item.id" :label="item.question"
                            :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('newSecretAnswer')" prop="newAns">
                    <el-input v-model="ruleForm.newAns" :placeholder="$t('inp_newSecretAnswer')"></el-input>
                </el-form-item>
                
        </el-form>
        <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm('ruleForm')">{{$t('submit')}}</el-button>
                    <el-button @click="resetForm('ruleForm')">{{$t('reset')}}</el-button>
                </span>
    </el-dialog>
    <el-dialog :title="$t('addFriend')" :visible.sync="isShowRemark" class="request-friend" :modal-append-to-body="false">
        <el-row>
            <el-col v-if="friendItem.nikeName" :span="4" class="img-request">
                <img v-if="friendItem.photo"  :src="friendItem.photo" alt="">
                <p v-else>{{friendItem.nikeName.slice(0,2)}}</p>
            </el-col>
            <el-col :span="20" class="form-request">
                 <el-form :model="form" label-position="top" >
                    <el-form-item :label="friendItem.nikeName" :label-width="formLabelWidth">
                        <el-input rows='5' :placeholder="$t('EnterRemarks')" type="textarea" v-model="form.addFRemark" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
               
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelFriend()">{{$t('cancel')}}</el-button>
                    <el-button type="primary" @click="addFriend()">{{$t('submit')}}</el-button>
                </div>
    </el-dialog>
</div>
</template>

<script>
// 此组件 过滤交互
import ChatBox from '@/components/Chat/Chat'
import CustomDialog from '@/components/Chat/components/CustomDialog'
import fData from '@/app.config';
import TeamsManage from "@/components/AddChat/TeamsManage";
import CreateGroup from "@/components/AddChat/CreateGroup";
import Notification from "@/components/AddChat/Notification";
import Broadcast from "@/components/Broadcast/index";
import BannedList from "@/components/Details/Group/BannedList";
import DetailGroupUpdate from "@/components/Details/Group/index";
import DetailFriendUpdate from "@/components/Details/Friend/index";
import AddPrivateChat from "@/components/AddChat/AddPrivateChat";

import MSG_TYPE,{translateHTML,decrypt} from "../../services/im/constant" //调试用
import {
	chatInRoomsDAO,
	chatLocalMsgDAO
} from "@/services/db";

import {
    kickRoom, 
    safeGetQuestion,
    safeQueryQuestion,
    safeAddQuestion,
    addUserRelation
} from '@/services'
import {
    mapGetters,

} from 'vuex'
//import { deleteData } from '../../../../nodes-exp/indexdb/test';

export default {
    name: 'dashboard',
    components: {
        ChatBox,
        CustomDialog,
        TeamsManage,
        CreateGroup,
        Notification,
        Broadcast,
        DetailGroupUpdate,
        DetailFriendUpdate,
        BannedList,
        AddPrivateChat
    },
    data() {
        return {
            formLabelWidth: '120px',
            friendItem:{},
            isShowAddFrd: false,
            form: {
                addFRemark: '',
            },
            isShowRemark: false,
            qusList: [],
            dialogVisible:false,
            MSG_TYPE,
            securityNull:false,
            loading: false,
            isChat: false,
            noScrollActive:false,
            ruleForm: {
                newQus: '',
                newAns: '',
            },
            rules: {
                newQus: fData.MUST,
                newAns: fData.MUST,
            },
            
        }
    },
    computed: {
        ...mapGetters([
            'chatInfo',
            'userInfo',
            'rooms',
            'chatInRooms',
            'friends',
            'noticeMsg',
            'chatMembers',
            'unReadNum',
            'roomsMemberObj',
            'boxChat',
            'serieManage',
            'createGroup',
            'notification',
            'broadcastList',
            'detailGroup',
            'detailFriend',
            'mutedList'
        ])
    },
    watch: {
        // todo 消息数需要用vuex
        noticeMsg(val){
            if(val){
            }
        }
    },
    created() {

    
        // 判断调用需要用 但是不准确的数据 的应用函数
        // this.dealNData()
           
        safeGetQuestion().then(res => {
            if(res && !res.success){
                this.securityNull=true
            }
        })
        // 多用户端 运行判断处理
        // Multi-user terminal operation judgment processing
        if(this.isObject(this.chatInRooms)){
            let isFirst = sessionStorage.getItem('isFirst')
            if(isFirst==null){
                sessionStorage.setItem('isFirst',true)
            }
            if(sessionStorage.getItem('isFirst')){
                sessionStorage.setItem('isFirst',false)
                setTimeout(()=>{
                    window.location.reload()
                },1500)
            }
        }
        // this.makeStore()
        // this.testFunc()
        
    },
    beforeDestroy() {
        this.isChat = false
    },
    async mounted() {
        
        let userInfo = this.$store.getters.userInfo
        
        this.dealEmit()
        
        // let str = "4MLJ4pn6ciGndFDIKEjYvdyeTdgkkd9Rs3Mr57vF4VBs4igxwa8r7rL4IjolUC536LwcXygEBZwiYM/PFxLv3SN/7d0YsCmQeOMa7M49aJwvTTc9HYpobJu5xIjvW2qm6nGxyuae/qDvL7AgtEk72VjX0oR+VFOhgC+xy5hlkTNuxR+38O/o0qlJJ6Sap74CJb+vuQ8xoT9YyX3ijvS5bsZh8R2hMuZLdsAbhSGhxPmSnDdhQWB5nzG37q/XnxUlthLOhqzJEYBk0zhBp5sFAXmXrDLYXZ5aUIRX0O4GqbeiRe1robS9z/jBOUfIdgsVUPo7b1qI5Omj91zKJqnvEyvb1PQ4YPZpwpN4FbK9arDjW15Wk5DW9CFlEEnARKlKYC/nJn4M0f6uT1o5gSOwssv4+VIjVePt8IXITPRQeEyPUaTIR8gJ3OH4zrgV9vV/Ypz5LP/SKVFhI4GC2NRO4vfsCZyjKHoUp2cT78xhGyYgrJjdmTK0vIiaSWegtKy1cnTvxOVQpa9kBtvKf2tdAMrqvnxxK/AHmbNFVvBL2OTIl7/c6yHGlLJEgfUOlGCNpT7newZcHRx/IsmtKymH0MOQPgEGQXUhUML46TJAXE8Pm4OHV9uzJBGEQVPASfbdPzrloQRHQ+euzO8VxLqUf//9OaA618OGkoyJr0fWbEJwDYaa7/hVrOcco9YsABR+Ce7EoMUUJNCJsB3pY9/BeB/Tkj5an9+zYmstjr7fY8t8y/r8gVDkFtR7yeW+620gfRv2EjsAyNmU9Ckhb8HRIro/ayQ+w3Sa7vQXQW5FK9k="
        // let a  = this.decrypt(str)
        // console.log(a,"avvvv")

    },
    methods: {
        getFriend(item){
            this.friendItem = item;
            this.form = {
                addFRemark: ''
            }
            this.isShowRemark=true;
        },
        hideFrd() {
            this.isShowAddFrd = false;
        },
        addFriend(){
            let post = {
                friendId: this.friendItem.id,
                remark: this.form.addFRemark
            }
        addUserRelation(post).then(res => {
                let dedata = res;
                if(dedata.success){
                    this.cancelFriend();
                    this.$message.success(this.$t('applyHasSent'));
                    this.$bus.$emit('addfriend_init');
                    // this.$store.dispatch('AddFriends',this.friendItem);
                    // 重新进入列表一个房间
                    // this.$store.dispatch('SetChatInfo', this.friendItem);
                    // this.$store.dispatch('AddChatInRooms', {...this.friendItem,roomType: 1})
                }else{
                    this.$message.error(dedata.message)
                    // this.$bus.$emit('addfriend_init')
                }
            })

        },
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    
                        let post = {
                            questionId: this.ruleForm.newQus,
                            answer: this.ruleForm.newAns
                        }
                        safeAddQuestion(post).then(res => {
                            if(res.success){
                                this.$message.success(this.$t('doSucc'))
                                this.dialogVisible=false
                            }else{
                                this.$message.error(res.message)
                            }
                        })
                    

                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
            
        },
        resetForm(formName){
            this.$refs[formName].resetFields();
            this.ruleForm = {
                newQus: this.qusList[0].id,
                newAns: '',
            }
            this.dialogVisible=false
        },
        getAllQus(){
            safeQueryQuestion().then(res => {
                if(res.success){
                    this.qusList = res.data || [];
                    // this.ruleForm.newQus = this.qusList[0].id
                    this.$set(this.ruleForm,'newQus',this.qusList[0].id)
                }else{
                    this.$message.error(res.message)
                }
            })
        },
        securityAdd(){
            this.dialogVisible=true
            this.securityNull=false
            this.getAllQus()
        },
        noScroll(){
            this.noScrollActive=true
        },
        openFiles(list){
            this.$emit('openFiles',list)
        },
        async dealEmit(){
            this.$bus.$off('changeChat');
            this.$bus.$on('changeChat', data => {
                //this.boxChat = true;
                this.$store.dispatch('SetChatBox',true)
            });
            

            // 踢出群聊
            // Kick out group chat
            this.$bus.$off('kick_room');
            this.$bus.$on('kick_room', data => {
                let sure = () => {
                    let post = {
                        // 房间id也是chatInfo,个人id也是chatInfo,
                        // The room id is also chatInfo, and the personal id is also chatInfo
                        roomId: this.chatInfo.id, 
                        userId: data.id,
                    }
                    kickRoom(post).then(res => {
                        if(res.success){
                            this.$message.success('操作成功！')
                            // 移除对应会员
                            // Remove corresponding member
                            this.$store.dispatch('RemoveChatMem',data.id)
                            // 更新房间信息
                            // Update room information
                            this.$store.dispatch('SetRoomInfo',{roomId: post.roomId , status:false})
                                .then(()=>{this.isChat = false;}).catch(err => {
                                    this.$message.error(err)
                                });
                        }else{
                            this.$message.error(res.message)
                        }
                    })
                }
                this.$confirm(this.$t('toSureKickOut',[data.nikeName]), this.$t('tips'), {
                    confirmButtonText: this.$t('confirm'),
                    cancelButtonText: this.$t('cancel'),
                    type: 'warning'
                }).then(() => {
                    sure()
                }).catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '已取消删除'
                    // });          
                });
            });
            // 接收im消息 然后将消息 分别发送到各个组件处理
            // Receive im message and send the message to each component for processing
            this.$bus.$off("IM")
            this.$bus.$on("IM", data => {
                //console.log(`chat-${this.chatInfo&&this.chatInfo.account || 'undefineChatInfo'}-recieve_index`, data);
                this.$bus.$emit('IM_CHAT',data)
                this.dealWithMsgs(data);
            })
            // 处理离线通知
            // handle offline notifications
            this.$bus.$off("dealNotice")
            this.$bus.$on("dealNotice", data => {
                
                    this.dealWithMsgs(data);
                
            })

            // 处理弹出框消息
            // Handling Notify messages
            // this.$bus.$off("makeNotify")
            
        },
        
        async dealWithMsgs(datas) {
            let data = JSON.parse(decrypt(datas.msg));
            
            data.msgId = datas.msgId;
            data.senderKey = datas.senderKey;
            // 通知消息
            // notification message
            if(data.msgType == MSG_TYPE.IM_MSG_TYPE_NOTIFICSTION){
                
                let noticeMsg = data;
                
                let msg_json = typeof noticeMsg.msg === "string" ? JSON.parse(noticeMsg.msg) : noticeMsg.msg;
                noticeMsg.msg = msg_json;
                
                noticeMsg.message = msg_json.message
                    ? translateHTML(msg_json.message)
                    : "";
                // 添加消息通知
                // Add message notification
                let noticeType = noticeMsg.msg.noticeType;
                
                let roomInfo = noticeMsg.msg.room
                let roomId = (noticeMsg.msg.room&&noticeMsg.msg.room.id) || -1;
                let isSendIdMineId = noticeMsg.senderId!=this.userInfo.id;
                // 密聊判断
                // Secret chat judgment
                let isPrivateChat = (this.chatInfo&&this.chatInfo.id==noticeMsg.senderId||this.chatInfo&&this.getRoomIdsId(this.chatInfo.roomIdAndId)==noticeMsg.senderId) || false
                
                // update online status
                if(noticeType === 31){

                    this.$store.dispatch('UpdateStatus',JSON.parse(msg_json.message))

                }
                // 留言已读回执 消息回撤 不能push 到 通知消息
                // Message has been read receipt, message recall, cannot be pushed to notification message
                if(noticeType !== MSG_TYPE.MESSAGE_READ_RECEIPT && noticeType !== MSG_TYPE.MESSAGE_BACK){
                    this.$store.dispatch('AddNoticeMsg', noticeMsg)
                    
                    // 在其他房间的通知消息 需要缓存查看
                    // Notification messages in other rooms need to be cached for viewing
                    if(data.receiveType==0 && roomId !== 0){
                        // 在其他房间

                        // in other room
                        if(data.roomId !== this.chatInfo.id && data.receiveType==0){
                            let room = {...noticeMsg.msg.room}
                            let dealData = {...room,...data,roomType: 2};
                            dealData.roomId = dealData.id
                            dealData.receiverId = dealData.roomId
                            if(
                                (data.senderId === this.userInfo.id && (noticeType === MSG_TYPE.ROOM_USER_OUT)
                                )
                            ){
                                return
                            }
                            // if(data.senderId !== this.userInfo.id &&
                            //     noticeType === MSG_TYPE.ROOM_USER_OUT
                            // ){

                            // }
                            this.$store.dispatch('AddChatInRooms',dealData)
                            
                            
                            // 将消息推入缓存
                            // Push the message into the cache
                            this.combineMsg(dealData,this.rooms,this.friends)
                            this.$store.dispatch('AddRooms', dealData)
                            /* this.$store.dispatch('FindRoomRelation').then().catch(err=>{
                                    this.$message.error(err)
                            }) */
                        }
                        else{
                            let dealData = {...data,roomType: 2};
                            this.$store.dispatch('AddChatInRooms',dealData)
                            // 将消息推入缓存
                            // this.combineMsg(dealData,this.rooms,this.friends)
                        }
                        
                    }
                }
                

                // 接受好友添加请求
                // Accept friend add request
                if(noticeType == MSG_TYPE.USER_RELATION_ACCEPT){
                    /* let userInfo = await this.fixInfo(1, {
						userId: noticeMsg.senderId || noticeMsg.id,
					}).catch((err) => {
						console.log(err);
						this.$bus.$emit('show_dialog_err',err)
					});
					if(userInfo){
						noticeMsg = { ...noticeMsg, ...userInfo, roomType: 1 };
                    } */
                    // 好友同意之后才能把好友添加到房间 以及好友列表
                    // Friends can be added to the room and friends list only after they agree
                     if(data.id || data.mid || data.roomId) {
                         this.$store.dispatch('AddFriends',noticeMsg)

                        let dealData = {
                            ...noticeMsg,
                            // account: noticeMsg.account?noticeMsg.account:noticeMsg.senderName
                        };
                        this.$store.dispatch('AddChatInRooms',dealData)
                        
                        // 将消息添加到指定房间
                        // add the message to the specified room
                        this.combineMsg(dealData,this.rooms,this.friends)
                     }
                     else{
                         let roomIdAndId = data.senderId+'_1'
                         let getInstance = chatInRoomsDAO.getInstance();
                            let chatRoom = await getInstance.find(roomIdAndId)
                            
                            if(chatRoom){
                                chatRoom.resend = false
                                getInstance.update(chatRoom).then(()=>{
                                    getInstance.get().then(result=>{
                                        this.$store.commit('SET_CHATIN_ROOMS', result)
                                        this.$store.dispatch('SetChatInfo',chatRoom)
                                    })
                                })
                            }
                     }
                    
                }else if(noticeType == MSG_TYPE.ROOM_USER_KICK){
                    // '被踢'
                    noticeMsg.roomType = 2;
                    // roomId=0
                    // noticeMsg.roomId = roomId;
                    // `${roomId}_2`
                    let roomIdAndId = this.setRoomIdsId(roomId,2)
                    console.log('被踢!!!!!!')
                    this.$store.dispatch('DelRooms',roomId)
                    
                    this.$store.commit('DEL_CHATIN_ROOMS',{roomIdAndId, roomType:2})
                    this.$store.dispatch('SetChatInfo', this.chatInRooms[0] || this.friends[0]);
                }else if(noticeType == MSG_TYPE.ROOM_ADD_USER){
                    // '拉进群通知'
                    
                    console.log('拉进群通知收到了！')
                    if(isSendIdMineId){
                        // 这里是为了挂载会员信息
                        // Here is to mount member information
                        let roomInfo = await this.fixInfo(2,{roomIds: [roomId]}).catch((err) => {
                            console.log(err);
                            this.$bus.$emit('show_dialog_err',err)
                        });
                        if(roomInfo){
                            noticeMsg = { ...noticeMsg, ...roomInfo, roomType: 2 };
                        }
                        // 添加到房间列表 房间列表会员会增加多位
                        // Add to the room list The room list will add more members
                        this.$store.dispatch('AddRooms', noticeMsg)
                        this.$store.dispatch('SetRoomInfo', {roomId:roomId , status:true})
                        
                        // let dealData = {
                        //     ...noticeMsg,
                        //     // account: noticeMsg.account?noticeMsg.account:noticeMsg.senderName
                        // };

                        // this.$store.dispatch('AddChatInRooms',dealData)

                        // 将消息添加到指定房间
                        // this.combineMsg(dealData,this.rooms,this.friends)

                        // 如果在群内 则需要处理对应的群成员信息
                        // If you are in the group, you need to process the corresponding group member information
                        if(roomId == this.chatInfo.id){
                            let pointUser = noticeMsg.msg.pointUsers[0]
                            // 拉进去的最开始都是成员 
                            // The first people who pulled in were all members
                            pointUser.role = 1 
                            let arr = [...this.chatMembers,pointUser]
                            this.$store.commit("SET_CHATMEMS", arr);
                            // 将消息推入缓存 并重新赋值
                            // Push the message into the cache and re-assign
                            let data = this.combineMsg(noticeMsg,this.rooms,this.friends)
                            setTimeout(async() => {
                                //let localMsg = this.getChatLocalMsgStore('localMsg')
                        
                                let roomIdAndId = this.setRoomIdsId(roomId,2)
                                let localMsgData = await chatLocalMsgDAO.getInstance().findByRoomIdAndId(roomIdAndId).toArray()

                                //let localMsgData = localMsg[roomIdAndId]
                                
                                // localMsgData.push(data)
                                this.$bus.$emit("setRlist",localMsgData)
                            },500)
                        }
                    }else{
                        // 如果在群内 则需要处理对应的群成员信息
                        // If you are in the group, you need to process the corresponding group member information
                        if(roomId == this.chatInfo.id){
                            // 将消息推入缓存 并重新赋值
                            // Push the message into the cache and re-assign
                            let data = this.combineMsg(noticeMsg,this.rooms,this.friends)
                        }
                        let pointUsers = noticeMsg.msg.pointUsers
                        pointUsers.map(v => {
                            this.$store.commit('UPDATE_USERS_OBJ', v)
                        })
                    }
                }else if(noticeType == MSG_TYPE.ROOM_USER_OUT){
                    // '退出房间通知'
                    //'Exit room notification'
                    console.log('退出房间通知收到了')
                    if (noticeMsg.senderId == this.userInfo.id){
                        console.log('自己离开房间 不在这里做操作')
                        return;
                    } 
                    let roomInfo = await this.fixInfo(2,{roomIds: [roomId]}).catch((err) => {
						console.log(err);
						this.$bus.$emit('show_dialog_err',err)
					});
					if(roomInfo){
						noticeMsg = { ...noticeMsg, ...roomInfo, roomType: 2 };
                    }
                    // 将房间重新赋值 会员也要重新赋值
                    // Re-assign the room and the member should also re-assign
                    this.$store.commit('UPDATE_ROOMS', noticeMsg)
                    let dealData = {
                        ...noticeMsg,
                    };
                    // this.$store.dispatch('AddChatInRooms',dealData)
                    // 将消息添加到指定房间
                    // this.combineMsg(dealData,this.rooms,this.friends)

                    // 如果是正在聊天的房间 则需要重新赋值chatInfo的详情信息来渲染当前房间
                    // If it is a chat room, you need to re-assign the chatInfo details to render the current room
                    if(this.chatInfo.roomId == dealData.roomId || this.chatInfo.id == dealData.roomId){
                        this.$store.dispatch('SetChatInfo', dealData);
                    }
                }else if(noticeType == MSG_TYPE.ROOM_DEL){
                    // '群解散'
                    //'group disband'
                    // '群解散消息收到了'
                    //'Group disbandment message received'
                    let name = noticeMsg.msg.room.name
                    // 删除rooms房间 及chatinroom 正在聊的房间
                    // delete rooms and chatinroom
                    this.$store.dispatch('DelRooms',roomId)
                    noticeMsg.roomIdAndId = this.setRoomIdsId(roomId,2)
                    this.$store.dispatch('DelChatInRooms',noticeMsg)
                    setTimeout(()=>{
                        this.$store.dispatch('SetChatInfo', this.rooms[0] || this.friends[0]);
                        noticeMsg.roomId = 0
                        this.$store.dispatch('AddNoticeMsg', noticeMsg)
                    },200)
                }else if(noticeType == MSG_TYPE.ROOM_ADD_ADMIN && isSendIdMineId){
                    // '委任管理权'
                    //'Delegation of management rights'
                    // 如果在群内 则需要处理对应的群成员信息
                    // If you are in the group, you need to process the corresponding group member information
                    if(roomId == this.chatInfo.id){
                        let pointUser = noticeMsg.msg.pointUser
                        // 委任管理权
                        // Appoint management
                        pointUser.role = 2 
                        this.$store.commit('UPDATE_CHATMEMS',pointUser)
                    }


                }else if(noticeType == MSG_TYPE.ROOM_DEL_ADMIN && isSendIdMineId){
                    // '取消管理权'
                    //'Cancel management rights'
                    // 如果在群内 则需要处理对应的群成员信息
                    // If you are in the group, you need to process the corresponding group member information
                    if(roomId == this.chatInfo.id){
                        let pointUser = noticeMsg.msg.pointUser
                        // 取消管理权
                        // Cancel management
                        pointUser.role = 1 
                        this.$store.commit('UPDATE_CHATMEMS',pointUser)
                    }

                    
                }else if(noticeType == MSG_TYPE.ROOM_MUTE_USER && isSendIdMineId){
                    // '禁言'
                    console.log('禁言收到了！')
                    
                    // 如果在群内 则需要处理对应的群成员信息
                    // If you are in the group, you need to process the corresponding group member information
                    let pointUser = noticeMsg.msg.pointUser
                    if(roomId == this.chatInfo.id){
                        // muteInt 禁言结束时间
                        // muteInt mute end time
                        pointUser.muteInt = noticeMsg.msg.muteInt
                        pointUser.role = 1 //只有会员会被禁言
                        let sendTime = noticeMsg.sendTime
                        this.$store.commit('UPDATE_CHATMEMS',pointUser)
                        // 如果自己被禁言了
                        // If you are banned
                        if(pointUser.id == this.userInfo.id){
                            this.$bus.$emit('beMute',pointUser,sendTime)
                        }
                    }else{
                        // 如果在其他房间 如果自己被禁言了
                        // 推送来的时候 在其他房间的时候 需要请求房间详情 以更新房间会员信息 用户信息
                        // If you are in another room, if you are muted
                        // When it is pushed, it is necessary to request room details in other rooms to update the room membership information. User information
                        if(pointUser.id == this.userInfo.id){
                            // 群聊信息更新 根据当前用户详情
                            // Group chat information is updated according to the current user details
                            let roomIdAndId = this.setRoomIdsId(roomId,2)
                            let roomsMemberObjs = {...this.roomsMemberObj}
                            let obj = roomsMemberObjs[roomIdAndId][this.userInfo.id]
                            let muteInt = noticeMsg.msg.muteInt
                            obj = {...obj,...pointUser,muteInt}
                            roomsMemberObjs[roomIdAndId][this.userInfo.id] = obj

                            // 匹配会员信息的关键
                            // The key to matching member information
                            this.$store.commit('SET_MEMBEROBJ', roomsMemberObjs) 

                        }
                    }

                }else if(noticeType == MSG_TYPE.USER_UNMUTE){
                    // '会员解除禁言'
                    //'Members lifted the ban'
                    console.log('会员解除禁言收到了！')
                    // 如果在群内 则需要处理对应的群成员信息
                    // If you are in the group, you need to process the corresponding group member information
                    let pointUser = noticeMsg.msg.pointUser
                    if(roomId == this.chatInfo.id){
                        // muteInt 禁言结束时间
                        // muteInt mute end time
                        pointUser.muteInt = noticeMsg.msg.muteInt
                        //只有会员会被禁言
                        // Only members will be banned
                        pointUser.role = 1 
                        let sendTime = noticeMsg.sendTime
                        this.$store.commit('UPDATE_CHATMEMS',pointUser)
                        // 如果自己被禁言了
                        // If you are banned
                        if(pointUser.id == this.userInfo.id){
                            this.$bus.$emit('beMute',pointUser,sendTime)
                        }
                    }else{
                        // 如果在其他房间 如果自己被解除禁言了
                        // 推送来的时候 在其他房间的时候 需要请求房间详情 以更新房间会员信息 用户信息
                        // If you are in another room, if you are unblocked
                        // When it is pushed, it is necessary to request room details in other rooms to update the room membership information. User information
                        if(pointUser.id == this.userInfo.id){
                            // 群聊信息更新 根据当前用户详情
                            // Group chat information is updated according to the current user details
                            let roomIdAndId = this.setRoomIdsId(roomId,2)
                            let roomsMemberObjs = {...this.roomsMemberObj}
                            let obj = roomsMemberObjs[roomIdAndId][this.userInfo.id]
                            let muteInt = noticeMsg.msg.muteInt
                            obj = {...obj,...pointUser,muteInt}
                            roomsMemberObjs[roomIdAndId][this.userInfo.id] = obj

                            // 匹配会员信息的关键
                            // The key to matching member information
                            this.$store.commit('SET_MEMBEROBJ', roomsMemberObjs) 
                            // 缓存会员信息
                            // Cache member information
                            this.setChatLocalMsgStore(9, "", roomsMemberObjs); 

                        }
                    }


                }else if(noticeType == MSG_TYPE.ROOM_MUTE && isSendIdMineId){
                    // '房间禁言'
                    // 只有群主和管理员能发消息 管理员不能被禁言
                    // Only group owners and administrators can send messages, administrators cannot be muted
                    console.log('房间禁言收到了！')
                    // 如果在群内 则需要处理对应的群成员信息
                    // If you are in the group, you need to process the corresponding group member information
                    if(roomId == this.chatInfo.id){
                        this.$bus.$emit('toMute')
                    }else{
                        // rooms房间和chatInRooms status 都要改，不请求接口
                        // The rooms and chatInRooms status must be changed without requesting the interface
                        let rooms = this.rooms.map(v=>{
                            if(v.roomId==roomId || v.id==roomId){
                                v.status=2
                            }
                            return v
                        })
                        let chatInRooms = this.chatInRooms.map(v=>{
                            if(v.roomId==roomId || v.id==roomId){
                                v.status=2
                            }
                            return v
                        })
                        // console.log("rooms: ",rooms)
                        // console.log("chatInRooms: ",chatInRooms)
                        this.$store.commit("SET_ROOMRS", rooms);
                        this.$store.dispatch('SetChatInRooms',chatInRooms)
                    }


                }else if(noticeType == MSG_TYPE.ROOM_UNMUTE && isSendIdMineId){
                    // '房间解除禁言'
                    //'Room unmute'
                    console.log('房间解除禁言收到了！')
                    // 如果在群内 则需要处理对应的群成员信息
                    // If you are in the group, you need to process the corresponding group member information
                    if(roomId == this.chatInfo.id){
                        this.$bus.$emit('unMute')
                    }else{
                        // rooms房间和chatInRooms status 都要改，不请求接口
                        // The rooms and chatInRooms status must be changed without requesting the interface
                        let rooms = this.rooms.map(v=>{
                            if(v.roomId==roomId || v.id==roomId){
                                v.status=1
                            }
                            return v
                        })
                        let chatInRooms = this.chatInRooms.map(v=>{
                            if(v.roomId==roomId || v.id==roomId){
                                v.status=1
                            }
                            return v
                        })
                        // console.log("rooms: ",rooms)
                        // console.log("chatInRooms: ",chatInRooms)
                        this.$store.commit("SET_ROOMRS", rooms);
                        this.$store.dispatch('SetChatInRooms',chatInRooms)
                    }

                }else if(noticeType == MSG_TYPE.ROOM_KICK_USER){
                    // '踢人' 
                    // 群主、管理员踢了某人 ---> 群主、管理员应该收到消息
                    // The owner and the administrator kicked someone ---> the owner and the administrator should receive the message

                    // let roomInfo = noticeMsg.msg.room
                    
                    // 如果在群内 则需要处理对应的群成员信息
                    // If you are in the group, you need to process the corresponding group member information
                    if(roomId == this.chatInfo.id){
                        let kickId = noticeMsg.msg.pointUser.id
                        this.$store.dispatch('RemoveChatMem',kickId)
                    }

                }else if(noticeType == MSG_TYPE.MESSAGE_BACK){
                    
                    let combackMsg;
                    // 是否是自己发送的 自己只有在密聊群聊房间
                    // Did you send it by yourself? Only in the secret group chat room
                    let isMineBack = !isSendIdMineId; 
                    if(noticeMsg.roomId == this.chatInfo.id){
                        // 如果在群内 群聊
                        // If in a group chat
                        combackMsg = {...noticeMsg,roomType: 2, isMineBack}
                        this.$bus.$emit('back_msg',combackMsg)
                    }else if(!noticeMsg.roomId&&isPrivateChat){
                        // 密聊 如果正在密聊房间内
                        // Secret chat If you are in a secret chat room
                        console.log('撤回消息')
                        combackMsg = {...noticeMsg,roomType: 1, isMineBack}
                        this.$bus.$emit('back_msg',combackMsg)
                    }else{
                        // 其他房间的处理 未在对应房间 直接删除对应聊天记录
                        // Other rooms are not in the corresponding room, directly delete the corresponding chat record
                        if(noticeMsg.roomId){
                            combackMsg = {...noticeMsg,roomType: 2,isElseRoom: true,id: noticeMsg.roomId}
                        }else{
                            combackMsg = {...noticeMsg,roomType: 1,isElseRoom: true,id: noticeMsg.senderId}
                        }
                        this.$bus.$emit('back_msg_else',combackMsg)
                    }
                    // todo 自己撤回的消息 也要添加到通知 方便做恢复数据处理
                    

                }else if(noticeType == MSG_TYPE.MESSAGE_READ_RECEIPT && isSendIdMineId){
                    // '留言已读回执'
                    //'Message has been read receipt'
                    let readBack = () => {
                        let roomIdAndId;
                        let idr;
                        
                        let readMsgId = noticeMsg.msg.readMsgId;
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
                            let getInstance = chatLocalMsgDAO.getInstance();
                            getInstance.find(readMsgId)
                            .then((result) => {
                                if(result){
                                    this.$bus.$emit('updRlist',result)
                                    
                                    /* getInstance.findByRoomIdAndId(roomIdAndId).toArray().then((data)=>{
                                        if(data){
                                            data.forEach(item => {
                                                if(item.msgId==readMsgId){
                                                     if(!item.isRead){
                                                        item.isRead=true
                                                        getInstance.update(item)
                                                        this.$bus.$emit('updRlist',item)
                                                     }
                                                }
                                            });
                                            
                                        }
                                    }) */
                                }
                                
                            })
                            
                            
                            
                            
                        }
                    }
                    setTimeout(()=>{
                        readBack()
                        
                    },500)
                    // todo isRead渲染队列 直接渲染赋值不完全

                    // 如果在群内 消息回执--弹窗--详情
                    // If you are in the group message receipt - pop-up window - details
                }else if(noticeType == MSG_TYPE.ROOM_INFO_UPDATE && isSendIdMineId){
                    // '群信息修改'
                    //'Group information modification'
                    console.log('群信息修改')
                    let roomMsg = noticeMsg.msg.room
                    // chatInRoom处理 消息
                    // chatInRoom handles the message
                    let chatInRoomsf = JSON.parse(JSON.stringify(this.chatInRooms))
                    if(chatInRoomsf.length>0){
                        let chatInRooms = chatInRoomsf.map(v => {
                            let ids = v.roomId || v.id
                            if(ids == roomId && v.roomType == MSG_TYPE.RECEIVE_TYPE_PUBLIC){
                                v = {...v, ...roomMsg}
                            }
                            return v;
                        })
                        this.$store.commit('SET_CHATIN_ROOMS', chatInRooms)
                    }
                    // console.log("chatInRoomsv: ",chatInRooms)

                    // room 房间处理 群聊
                    // room room processing group chat
                    let roomsf = JSON.parse(JSON.stringify(this.rooms))
                    if(roomsf.length>0){
                        let rooms = roomsf.map(v => {
                            let ids = v.roomId || v.id
                            if(ids == roomId){
                                let value = {...v, ...roomMsg}
                                v = value
                                // v.roomNotice = roomsf.roomNotice;
                                // this.$set(v,'roomNotice',roomsf.roomNotice)
                            }
                            return v;
                        })
                        this.$store.commit('SET_ROOMRS', rooms)
                    }
                    // 如果在当前房间 chatInfo
                    // If in the current room chatInfo
                    let msId = this.chatInfo.roomId || this.chatInfo.id
                    if(msId == roomId){
                        let ms = {...this.chatInfo, ...roomMsg}
                        this.$store.commit('SET_CHATINFO', ms)
                    }


                }else if(noticeType == MSG_TYPE.ROOM_CHANGE_NAME && isSendIdMineId){
                    // '群房间名称修改'
                    //'Group room name modification'
                    let name = noticeMsg.msg.room.name
                    // chatInRoom处理 消息
                    // chatInRoom handles the message
                    
                    //let info = this.chatInRooms;
                    
                    let roomInfo = await this.fixInfo(2, {
                        roomIds: [roomId],
                    }).catch((err) => {
                        this.$bus.$emit("show_dialog_err", err);
                    });
                    if (roomInfo) {
                        let roomIdAndId = this.setRoomIdsId(roomId,2)
                        roomInfo.roomIdAndId=roomIdAndId
                        await this.roomListInstance().editInstance(roomInfo)
                        let upData=await chatInRoomsDAO.getInstance().find(roomIdAndId)
                        upData.name=name
                        upData.nikeName=name
                        upData.avatar=name
                        chatInRoomsDAO.getInstance().update(upData)
                        chatInRoomsDAO.getInstance().get().then((result) => {
                            this.$store.commit('SET_CHATIN_ROOMS', result)
                        })
                       

                    }
                    let chatInRoomsf = JSON.parse(JSON.stringify(this.chatInRooms))
                    if(chatInRoomsf.length>0){
                        chatInRoomsf.map(v => {
                            let ids = v.roomId || v.id
                            if(ids == roomId && v.roomType == MSG_TYPE.RECEIVE_TYPE_PUBLIC){
                                v.name = name;
                            }
                            return v;
                        })
                        this.$store.commit('SET_CHATIN_ROOMS', chatInRoomsf)
                    }

                    // room 房间处理 群聊
                    // room room processing group chat
                    let rooms = JSON.parse(JSON.stringify(this.rooms))
                    if(rooms.length>0){
                        rooms.map(v => {
                            let ids = v.roomId || v.id
                            if(ids == roomId){
                                v.name = name
                            }
                            return v;
                        })
                        this.$store.commit('SET_ROOMRS', rooms)
                    }
                    // 如果在当前房间 chatInfo
                    // If in the current room chatInfo
                    let msId = this.chatInfo.roomId || this.chatInfo.id
                    if(msId == roomId){
                        let ms = {...this.chatInfo}
                        ms.name = name;
                        this.$store.commit('SET_CHATINFO', ms)
                    }
                }
            }
            
            
        },
        dealNData(){
            

        },
        makeStore(){
            // this.setLocalUsersStore('usersId',[1,2,3,4])
            // this.setLocalUsersStore('usersIds',[1,2,3,4])
            this.delLocalUsersStore('usersId')
            this.delLocalUsersStore('usersIds')
            // console.log(this.localUsersMsg.get() || [],'this')


        },
        testMsg(){
            let data = {
                "roomId":0,
                "senderId":170,
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
            // this.list.push(dataImage);
            // this.list.push(dataVideo);
            // this.list = [...this.list,...dataNoticeArr]
            this.dealWithMsgs(data)
        },
        testFunc() {
            this.fixInfo(1,{userId: this.userInfo.id}).then(res => {
            }).catch(err => {this.$message.error(err)})
            this.fixInfo(2,{roomIds: [157]}).then(res => {
            }).catch(err => {this.$message.error(err)})
        }
    },
}
</script>

<style lang="scss" scoped>
.app-cent {
    height: 100%;

    .dashboard-container {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .app-chat {
        height: 100%;
    }
}
.el-select{
    width: 100%;
}
.content-chat {
    text-align: center;
    img {
        width: 200px;
        /* margin: 0 auto; */
    }
    h2 {
        margin: 15px 0;
        font-size: 18px;
        font-weight: 700;
    }
    p {
        font-size: 14px;
        margin: 14px 0;
    }
}
.img-request{
    img{
        width: 48px;
        height: 48px;
        border-radius: 50%;
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
</style>
