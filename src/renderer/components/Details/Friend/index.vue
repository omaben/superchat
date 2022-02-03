<template>
    <div class="chat-box"  v-if="chatInfoF">
        <div class="chat-item">
            <div class="chat-title">
                <div class="add-chat-title">
                    <div class="settting-close" @click="hideCreateGroup">
                        <i class="el-icon-arrow-left" ></i> {{$t('back')}}
                    </div>
                    <h2>{{$t('contact_info')}}</h2>
                    <div class="add-member-btn" v-if="userInfo.id!==chatInfoF.id && chatInfoF.friendStatus === 2">
                        <el-button type="primary" size="small" v-if="!isFromGroup && !editGroup" round @click="editGroupFun">{{$t('Edit')}}</el-button>
                    </div>
                </div>
            </div>
        </div>
        <el-row class="details-info">
             <el-row :gutter="20">
                <el-col :span="12" :offset="6">
                    <div class="grid-content general-info">
                        <el-avatar :class="{'with-status':chatInfo.onlineStatus=== 1}" v-if="chatInfoF.logo" :src="chatInfoF.logo"></el-avatar>
                        <el-avatar :class="{'with-status':chatInfo.onlineStatus=== 1}" v-else >{{chatInfoF.avatar && chatInfoF.avatar.slice(0,2)}}</el-avatar>
                        <h6>{{chatInfoF.avatar}}</h6>
                        <!-- <p>Always go to your crib 👫</p> -->
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="10" v-if="!editGroup">
                <el-col v-if="userInfo.id!==chatInfoF.id && chatInfoF.friendStatus === 2 && !chatInfoF.resend" :span="6" >
                    <div class="grid-content bg-white action-info" @click="toChat(chatInfoF)">
                        <img  :src="require('@/assets/svg/chats-start.svg')" alt="">
                        <p>{{$t('start_chat')}}</p>
                    </div>
                </el-col>
                <el-col v-else :span="!chatInfoF.resend ? 12 : 6" v-show="forbidAddFriends != 1 || chatInfo.groupRole === 3 || chatInfo.groupRole === 2">
                    <div class="grid-content bg-white action-info" @click="openAddFriend(chatInfoF)">
                         <img  :src="require('@/assets/svg/add-friend-group.svg')" alt="">
                        <p>{{$t('addContact')}}</p>
                    </div>
                </el-col>
                <el-col :span="6" v-if="userInfo.id!==chatInfoF.id && chatInfoF.friendStatus === 2 && isFromGroup != 3">
                    <div class="grid-content bg-white action-info" @click="pinGroupFunc(true)">
                        <img  :src="require('@/assets/svg/pin-chat-group.svg')" alt="">
                        <p v-if="!pinGroup">{{$t('pin')}}</p>
                        <p v-else>{{$t('Unpin')}}</p>
                    </div>
                </el-col>
                <el-col :span="6" v-if="userInfo.id!==chatInfoF.id && chatInfoF.friendStatus === 2 && isFromGroup !=3 && (chatInfo.groupRole === 3 || chatInfo.groupRole === 2)">
                    <div class="grid-content bg-white action-info" @click="dealDisturb(true)">
                        <img  :src="require('@/assets/svg/mute-group.svg')" alt="">
                        <p v-if="!msgDoNotDisturb">{{$t('groupMute')}}</p>
                        <p v-else>{{$t('groupUnmute')}}</p>
                    </div>
                </el-col>
                <el-col :span="userInfo.id!==chatInfoF.id && chatInfoF.friendStatus === 2 ? 6 : 12" v-if="forbidAddFriends !=1 || chatInfo.groupRole === 3 || chatInfo.groupRole === 2">
                    <div class="grid-content bg-white action-info">
                        <el-popover class="quick-access-popover" placement="bottom-end" width="120" v-model="visible">
                                 <p class="add-chat-item" @click='openDetailDevices'>
                                    <span>{{$t('loginIp')}}</span>
                                </p>
                                <p class="add-chat-item" v-if="chatInfoF.friendStatus==2 " @click="clearDataByRoom(chatInfo.roomIdAndId)" >
                                    <span class="blue">{{$t('clearConversation')}}</span>
                                </p>
                                <p class="add-chat-item" @click="complains(2,chatInfo)">
                                    <span class="yellow">{{$t('report')}}</span>
                                </p>
                                <p class="add-chat-item" v-if="chatInfoF.friendStatus==2 " @click="editFriend(chatInfoF)">
                                    <span class="red">{{$t('deleteContact')}}</span>
                                </p>
                                <div class="add-chat-btn" slot="reference">
                                    <img  :src="require('@/assets/svg/more-info.svg')" alt="">
                                    <p>{{$t('more')}}</p>
                                </div>
                            </el-popover> 
                    </div>
                </el-col>
            </el-row>
            <el-tabs v-model="activeTabs" class="bg-white all-info-tabs" @tab-click="handleClickTabs" v-if="!isFromGroup && !editGroup && chatInfoF.friendStatus === 2">
                <el-tab-pane :label="$t('search_pill_pictures')" name="images" >
                    <images ></images>
                </el-tab-pane>
                <el-tab-pane :label="$t('search_pill_videos')" name="videos">
                    <videos></videos>
                </el-tab-pane>
                <el-tab-pane :label="$t('search_pill_documents')" name="documents">
                    <files :files="files"></files>
                </el-tab-pane>
            </el-tabs>
             <!-- (chatInfoF.friendStatus != 2)   :class="{'no-Friend':chatInfoF.friendStatus != 2}"-->
            <el-row class="details-update "  :class="{'no-Friend':!editGroup}" v-if="isFromGroup || editGroup" >
                <div v-if="!showSettings">
                    <el-row class="bg-white grid-content " >
                        <update-friend :info="chatInfoF" :forbidAddFriends="forbidAddFriends" :isFromGroup="isFromGroup"/>
                    </el-row>
                    <el-row class="bg-white grid-content " v-if="(chatInfo.groupRole === 3 || chatInfo.groupRole === 2)  ">
                        <div class="update-info-cent">
                            <div class="update-cent-item">
                                <div class="update-item-title">
                                    <span>{{$t('setUpAdmin')}}</span>
                                </div>
                                <div class="update-item-cent">
                                    <el-switch
                                        v-model="setUpAdmin"
                                        active-color="#13ce66"
                                        @change="editManger(chatInfoF)"
                                        inactive-color="#F2F2F2">
                                    </el-switch>
                                </div>
                            </div>
                            <div class="update-cent-item">
                                <div class="update-item-title">
                                    <span>{{$t('mute')}}</span>
                                </div>
                                <div class="update-item-cent">
                                    <el-switch
                                        v-model="isMute"
                                        active-color="#13ce66"
                                        @change="forMuteTime(chatInfoF,2)"
                                        inactive-color="#F2F2F2">
                                    </el-switch>
                                    
                                </div>
                            </div>
                        </div>
                    </el-row>
                    <el-row class="bg-white grid-content " v-if="userInfo.id!==chatInfoF.id && chatInfoF.friendStatus === 2 && !isFromGroup">
                        <div class="update-info-cent">
                            <div class="update-cent-item" @click="openSerieManage(chatInfoF.id)">
                                <div class="update-item-title">
                                    <span>{{$t('series')}}</span>
                                </div>
                                <div class="update-item-cent">
                                    <span>{{teams[seriesId] ? teams[seriesId] .teamName :""}} </span>
                                    <i class="el-icon-arrow-right"></i>
                                </div>
                            </div>
                            <div class="update-cent-item">
                                <div class="update-item-title">
                                    <span>{{$t('blackList')}}</span>
                                </div>
                                <div class="update-item-cent">
                                    <el-switch
                                        v-model="inBlackList"
                                        active-color="#13ce66"
                                        @change="addInBlackList(chatInfoF.id)"
                                        inactive-color="#F2F2F2">
                                    </el-switch>
                                </div>
                            </div>
                        </div>
                    </el-row>
                    <el-row class="bg-white grid-content " v-if="userInfo.id!==chatInfoF.id && chatInfoF.friendStatus === 2 && !isFromGroup">
                        <div class="update-info-cent">
                            <div class="update-cent-item" @click="clearDataByRoom(chatInfoF.roomIdAndId)">
                                <div class="update-item-title">
                                    <span class="blue">{{$t('clearConversation')}}</span>
                                </div>
                            </div>
                            <div class="update-cent-item" @click="complains(1,chatInfoF)">
                                <div class="update-item-title">
                                    <span class="yellow">{{$t('report')}}</span>
                                </div>
                            </div>
                            
                            <div v-if="chatInfoF.friendStatus==2" class="update-cent-item">
                                <div class="update-item-title" @click="editFriend(chatInfoF)">
                                    <span class="red">{{$t('deleteContact')}}</span>
                                </div>
                            </div>
                        </div>
                    </el-row>
                </div>
            </el-row>
        </el-row>
        <el-dialog :title="$t('complaints')" :visible.sync="isComplain" :modal="false">
                                <div class="feedback">
                                    <div class="feedback-input">
                                        <el-radio-group v-model="content" class="visible-account">
                                            <el-radio  label="1">{{$t('Report_msg_1')}}</el-radio>
                                            <el-radio  label="2">{{$t('Report_msg_2')}}</el-radio>
                                            <el-radio  label="3">{{$t('Report_msg_3')}}</el-radio>
                                            <el-radio  label="4">{{$t('Report_msg_4')}}</el-radio>
                                            <el-radio   label="5">{{$t('Report_msg_5')}}</el-radio>
                                        </el-radio-group>
                                    </div>
                                    <div>
                                        <el-button type="primary" @click="complainFunc">{{$t('confirm')}}</el-button>
                                    </div>
                                </div>
                            </el-dialog>
        <el-dialog :title="$t('addContact')" :visible.sync="isShowRemark" onVisible :modal-append-to-body="false" >
            <el-form>
                <el-form-item :label="$t('remark')">
                    <el-input v-model="addFRemark" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelFriend()">{{$t('cancel')}}</el-button>
                <el-button type="primary" @click="addFriend()">{{$t('confirm')}}</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="detailDevices" class="devices-detail" center>
                    <div class="tp-header">
                        <img  :src="require('@/assets/svg/android-ico.svg')" alt="">
                        <img  :src="require('@/assets/svg/pc-ico.svg')" alt="">
                        <img  :src="require('@/assets/svg/ios-ico.svg')" alt="">
                    </div>
                    <div class="info-box">
                        <div class="info-item" >
                            <div class="info-item-title">
                               {{$t('device_name')}}
                            </div>
                            <div class="info-item-cent" >
                                
                            </div>
                        </div>
                        <div class="info-item" >
                            <div class="info-item-title">
                               {{$t('deviceIp')}}
                            </div>
                            <div class="info-item-cent" >
                                
                            </div>
                        </div>
                        
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="detailDevices = false">{{$t('cancel')}}</el-button>
                        <el-button  class="confirm-dialog" type="primary" @click="logoutDevice(detailDeviceInfo)">{{$t('logout')}}</el-button>
                    </span>
                </el-dialog>
    </div>
</template>
<script>
import {  mapGetters } from 'vuex'
import Images from '../Images';
import Videos from '../Videos';
import Files from '../Files';
import UpdateFriend from './UpdateFriend';
import { chatLocalMsgDAO } from "@/services/db";
import MSG_TYPE,{translateHTML} from "../../../services/im/constant" //调试用
import {
    outRoomRealation,
    deleteRoom,
    delteUserRealation,
    updateRoomStatus,
    complain,
    addBlackList,
    delBlackList,
    addUserRelation,
    addRoomAdmin,
    delRoomAdmin,
    muteUser,
    unMuteUser,
    getUserDevice
} from '@/services'
export default {
    
    components: {
        Images,
        Videos,
        Files,
        UpdateFriend,
    },
    computed: {
        ...mapGetters([
            'chatInfo',
            'friends',
            'rooms',
            'teams',
            'userInfo',
            'chatMembers'
        ]),
    },
    data() {
        return {
            visible: false,
            detailDevices:false,
            MSG_TYPE,
            addFRemark: '',
            chatInfoF : null,
            value:false,
            editGroup: false,
            activeTabs: 'images',
            showSettings: false,
            images: [],
            bigImages: [],
            files:[],
            groupMute:false,
            pinGroup: false,
            msgDoNotDisturb: false,
            dataSetting : {

            },
            ownerTransferVal : false,
            newOwner : [],
            isComplain : false,
            pInfo: {},
            pStatus: -1,
            content: '1',
            seriesId: 0,
            inBlackList: false,
            oldGroup : null,
            isShowRemark : false,
            infoPro : {},
            forbidAddFriends : 2,
            setUpAdmin : false,
            isMute : false,
            isFromGroup:false

        }
    },
    mounted() {
        
        this.$bus.$off('openDetails')
        this.$bus.$on('openDetails', (oldGroup,forbidAddFriends,isMute) => {
            this.activeTabs = 'images'
            if(oldGroup){
                this.isMute = isMute === true ? true : false
                this.chatInfoF = oldGroup
                this.forbidAddFriends = forbidAddFriends
                let setAdmin = this.chatInfo.members.find(qry => qry.id === oldGroup.id)
                if(setAdmin){
                    this.setUpAdmin =true
                }else{
                    this.setUpAdmin = false
                }
            }
            else{

                this.chatInfoF = this.chatInfo
            }
            this.handleEventGroup()
            this.seriesId = this.teams.findIndex((value, index, arr) => {
                    return (value.id == this.chatInfoF.teamId)
            })
        })
    },
    updated() {
       
        let isFromChat = ('isFromGroup' in this.chatInfoF);
        this.isFromGroup  = isFromChat ?  this.chatInfoF.isFromGroup: false;
        // this.editGroup =  this.isFromGroup;
        console.log(this.chatInfoF,'....',   this.isFromGroup)
        this.$bus.$off('openDetails')
        this.$bus.$on('openDetails', (oldGroup,forbidAddFriends,isMute) => {
            this.activeTabs = 'images'
            if(oldGroup){
                this.isMute = isMute === true ? true : false
                this.chatInfoF = oldGroup
                this.forbidAddFriends = forbidAddFriends
                let setAdmin = this.chatInfo.members.find(qry => qry.id === oldGroup.id)
                if(setAdmin){
                    this.setUpAdmin =true
                }else{
                    this.setUpAdmin = false
                }
            }else{
                this.chatInfoF = this.chatInfo
            }
            this.handleEventGroup()
            this.seriesId = this.teams.findIndex((value, index, arr) => {
                    return (value.id == this.chatInfoF.teamId)
            })
        })
    },
    methods: {
        openDetailDevices(){
            let post = {
                id: this.chatInfoF.id,
            }
            
            getUserDevice(post).then(res => {
               if(res.success){
                    this.detailDevices = true
                    console.log(res)

               }

            })
        },
        forMuteTime(memberInfo,status){
            let post;
            if(!this.isMute){
                post = {
                    roomId: memberInfo.roomInId || this.chatInfo.id, 
                    userId: memberInfo.id
                }
                unMuteUser(post).then(res => {
                    if(res.success){
                        this.$message.success(this.$t('doSucc'))
                        this.$store.dispatch('SetRoomInfo', {roomId: this.chatInfo.id , status:false})
                        // 状态改变了之后需要重新赋值 包括另一个会员列表的会员信息 chatMembers、msgItemEmit
                        // After the status is changed, it needs to be re-assigned, including the member information of another member list chatMembers, msgItemEmit
                        
                    }else{
                        //this.$set(memberInfo,"muteTimes",this.muteTimesPro)
                        this.$message.error(res.message)
                    }
                })
            }else{
                post = {
                    roomId: memberInfo.roomInId|| this.chatInfo.id, 
                    userId: memberInfo.id,
                    muteMin: 99999999999999999999
                }
                muteUser(post).then(res => {
                    if(res.success){
                        this.$message.success(this.$t('doSucc'))
                        this.$store.dispatch('SetRoomInfo', {roomId: this.chatInfo.id , status:false})
                        // 状态改变了之后需要重新赋值 包括另一个会员列表的会员信息 chatMembers、msgItemEmit
                        // After the status is changed, it needs to be re-assigned, including the member information of another member list chatMembers, msgItemEmit
                        
                    }else{
                        //this.$set(memberInfo,"muteTimes",this.muteTimesPro)
                        this.$message.error(res.message)
                    }
                })
            }

        },
        
        editManger(memberInfo){
            let func;
            if(this.setUpAdmin){
                func = addRoomAdmin
            }else{
                func = delRoomAdmin
            }
            let post = {
                roomId: this.chatInfo.id,
                userId: memberInfo.id
            }
            func(post).then(res => {
                if(res.success){
                    this.$message.success(this.$t('doSucc'))
                    this.$store.dispatch('SetRoomInfo', {roomId: this.chatInfo.id , status:false})
                    //this.hideCreateGroup()

                }else{
                    this.$message.error(res.message)
                }
            })

        },
        cancelFriend(){
            this.isShowRemark = false
            this.addFRemark = ''
        },
        addFriend(){
            let member = this.infoPro
            let post = {
                friendId: member.id,
                remark: this.addFRemark
            }
            addUserRelation(post).then(res => {
                if(res.success){
                    this.cancelFriend()
                    this.hideCreateGroup()
                    // this.$message.success('申请已发出');
                    this.$message.success(this.$t('doSucc'));
                }else{
                    this.$message.error(res.message)
                }
            })
        },
        openAddFriend(data){
            this.infoPro = {...data};
            this.addFRemark = '';
            this.isShowRemark = true;
        },
        async addInBlackList(id) {
            let post = {
                friendId : id,
            }
            if(this.chatInfoF.inBlackList === 1){
                await delBlackList(post).then(res => {
                    this.chatInfoF.inBlackList = 2
                })
            }else{
                await addBlackList(post).then(res => {
                    this.chatInfoF.inBlackList = 1
                })
            }
            this.$store.commit("SET_CHATINFO", this.chatInfoF);
            this.$store.dispatch('GetFriends')
        },
        openSerieManage(friendId){
             this.$bus.$emit("updateTeamFriend",friendId,this.teams[this.seriesId].id)
             this.$store.dispatch('SetSerieManage',true)
        },
        editFriend(info){
            let str;
            str = this.$t('deleteContact');
            
            let sure = () => {
                let post = {
                    friendId: info.id
                }
                delteUserRealation(post).then(res => {
                    if(res.success){
                        this.$message.success(this.$t('doSucc'))
                        
                        this.$store.dispatch('DelFriends',info.id)
                        // 都要重新进入列表一个房间 删除之后-私聊进私聊-群聊进群聊
                        // You must re-enter a room in the list and delete it-private chat into private chat-group chat into group chat
                        if(this.chatInfoF === this.chatInfo){
                            this.$store.commit("SET_CHATINFO", this.friends[0]||this.rooms[0]);
                        }
                        this.$store.dispatch('DelChatInRooms',{...info,roomType:1})
                        //this.$store.dispatch('setDetailGroup',false)
                        this.editGroup = false
                        this.$store.dispatch('setDetailFriend',false)
                    }else{
                        this.$message.error(res.message)
                    }
                })
            } 
            this.$confirm(this.$t('isConfirmAction'), this.$t('deleteContact'), {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
            }).then(() => {
                sure()
            }).catch(()=>{})

        },
        toChat(item) {
            //if(this.chatActiveIdx==idx)return
            item.isFromGroup = false;
            
            this.$store.commit("SET_CHATINFO", item);
            this.$store.dispatch('SetChatBox',true)
            let that = this
            setTimeout(function(){
                that.$bus.$emit('usersupd:sess')
            },350)
            this.$bus.$emit('changeChat', true);
            this.$store.commit('SET_EVAL', '')
            this.hideCreateGroup()
            this.$store.dispatch('setDetailGroup',false)
            this.$bus.$emit('changeChat', true);
            

        },
        clearDataByRoom(id){
            this.$confirm(this.$t('confirmClearStorage'), this.$t('Clear Conversation'), {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
            }).then(() => {
                this.clearChatRoom(id)
                this.$message.success(this.$t('doSucc'))
                this.$store.dispatch('setDetailFriend',false)
            })
        },
        complains(status,data){
            this.isComplain = true;
            this.pInfo = data;
            this.pStatus = status;
        },
        complainFunc(){
            let post
            let data = this.pInfo
            let status = this.pStatus

            if(status===1){
                post = {
                    complained: data.id,
                    complain_type: status, // (1用户（user） 2群（group）)
                    complain_content: this.$t("Report_msg_"+this.content),
                }
            }else if(status===2){
                post = {
                    complained: data.id || data.roomId,
                    complain_type: status, // (1用户（user） 2群（group）)
                    complain_content: this.$t("Report_msg_"+this.content),
                }
            }
            complain(post).then(res => {
                if(res.success){
                    this.$message.success(this.$t('doSucc'))
                    this.isComplain = false
                    this.content = ""
                }else{
                    this.$message.error(res.message)
                }
            })

        },
         outRoom(status){
            let func;
            let str;
            let post;
            if(status==1){
                func = outRoomRealation
                str = "离开群组"
                // str = "Leave group"
                post = {
                    roomId: this.chatInfoF.id || this.getRoomIdsId(this.chatInfoF.roomIdAndId)
                }
            }else if(status==2){
                func = deleteRoom
                str = "解散群组"
                // str = "Dissolve group"
                post = {
                    id: this.chatInfoF.id || this.getRoomIdsId(this.chatInfoF.roomIdAndId)
                }
            }
            let sure = () => {
                func(post).then(res => {
                    if(res.success){
                        // this.$message.success(`${str}成功`)
                        this.$message.success(this.$t('doSucc'))

                        this.$store.dispatch('DelRooms',this.chatInfoF.id || this.getRoomIdsId(this.chatInfoF.roomIdAndId))
                        // 都要重新进入列表一个房间
                        // have to re-enter a room in the list
                        this.$store.dispatch('DelChatInRooms',{...this.chatInfoF,roomType:2})
                        this.$store.commit("SET_CHATINFO", this.rooms[0] || this.friends[0]);
                        this.hideCreateGroup()
                    }else{
                        this.$message.error(res.message)
                    }
                })
                
            }

            // this.$confirm(`是否要${str}!`, '提示', {
            this.$confirm(this.$t('isConfirmAction'), this.$t('disbandGroup'), {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
            }).then(() => {
                this.hideCreateGroup()
                sure()
            }).catch(()=>{})

        },
        updateSettings(data){
            
            this.dataSetting = {...data}
        },
        
        // Mute group
        updateRoomStatusFunc(status){
            if(status){
                this.chatInfoF.status = this.chatInfoF.status === 1 ? 2 : 1
                this.handleEventGroup()
            }else{
                this.chatInfoF.status = this.groupMute===true ? 2 : 1
                
            }
            let statf = this.chatInfoF.status
            let post = {
                id: this.chatInfoF.id || this.chatInfoF.roomId,
                status: statf
            }
            updateRoomStatus(post).then(res => {
                if(res.success){
                    this.$message.success(this.$t('doSucc'))
                    this.$set(this.chatInfoF,'status',statf)
                }
            })
        },
        pinGroupFunc(status){
            if(status){
                this.chatInfoF.topStatus = this.chatInfoF.topStatus === 1 ? 2 : 1
                this.handleEventGroup()
            }else{
                this.chatInfoF.topStatus = this.pinGroup===true ? 1 : 2
            }
            this.$store.dispatch('pinChatRoom', this.chatInfoF)
        },
        handleEventGroup(){
            this.groupMute = this.chatInfoF.status===2 ? true : false
            this.pinGroup = this.chatInfoF.topStatus===1 ? true : false
            this.msgDoNotDisturb = this.chatInfoF.msgDoNotDisturb===1 ? true : false
        },
        //disturb
        dealDisturb(status){
            if(status){
                this.chatInfoF.msgDoNotDisturb = this.chatInfoF.msgDoNotDisturb === 1 ? 2 : 1
                this.handleEventGroup()
            }else{
                this.chatInfoF.msgDoNotDisturb = this.msgDoNotDisturb===true ? 1 : 2

            }
            this.$store.dispatch('disturbChatRoom', this.chatInfoF)
            
        },
        // get last data when click on tabs
        handleClickTabs(tab, event) {
            if(tab.name ==='images'){
                this.$bus.$emit("getImages",0,[],[])
                 this.images = []
                 this.bigImages = []
                 let roomIdAndId = this.chatInfoF.roomIdAndId
                chatLocalMsgDAO.getInstance().findByRoomIdAndId(roomIdAndId).toArray()
                    .then((listData)=> {
                        let imagesList = listData.filter(qry=>qry.msgType === MSG_TYPE.IM_MSG_TYPE_PICTURE)
                        imagesList.forEach(qry =>{
                            this.images.push(JSON.parse(qry.msg).thumbUrl)
                            this.bigImages.push(JSON.parse(qry.msg))
                        })
                        this.$bus.$emit("getImages",this.images.length > 16 ? 16 : this.images.length,this.images,this.bigImages)
                })
            }
            if(tab.name ==='videos'){
                this.$bus.$emit("getVideo",0,[],[])
                 this.images = []
                 this.bigImages = []
                 let roomIdAndId = this.chatInfoF.roomIdAndId
                chatLocalMsgDAO.getInstance().findByRoomIdAndId(roomIdAndId).toArray()
                    .then((listData)=> {
                        let imagesList = listData.filter(qry=>qry.msgType === MSG_TYPE.IM_MSG_TYPE_VIDEO)
                        imagesList.forEach(qry =>{
                            this.images.push(JSON.parse(qry.msg).thumbUrl)
                            this.bigImages.push(JSON.parse(qry.msg).url)
                        })
                        this.$bus.$emit("getVideo",this.images.length > 16 ? 16 : this.images.length,this.images,this.bigImages)
                })
            }
            if(tab.name ==='documents'){
                this.$bus.$emit("getFiles",0,[])
                 this.files = []
                 
                 let roomIdAndId = this.chatInfoF.roomIdAndId
                chatLocalMsgDAO.getInstance().findByRoomIdAndId(roomIdAndId).toArray()
                    .then((listData)=> {
                        let imagesList = listData.filter(qry=>qry.msgType === MSG_TYPE.IM_MSG_TYPE_FILE)
                        imagesList.forEach(qry =>{
                            this.files.push(JSON.parse(qry.msg))
                        })
                        this.$bus.$emit("getFiles",this.files.length > 16 ? 16 : this.files.length,this.files)
                })
            }
            
        },
        async showSettingsFunc(data){
            
            this.showSettings = true
            
        },
        hideCreateGroup() {

            
            if(this.editGroup){
                this.$bus.$emit("getImages",0,[],[])
                 this.images = []
                 this.bigImages = []
                 let roomIdAndId = this.chatInfoF.roomIdAndId
                chatLocalMsgDAO.getInstance().findByRoomIdAndId(roomIdAndId).toArray()
                    .then((listData)=> {
                        let imagesList = listData.filter(qry=>qry.msgType === MSG_TYPE.IM_MSG_TYPE_PICTURE)
                        imagesList.forEach(qry =>{
                            this.images.push(JSON.parse(qry.msg).thumbUrl)
                            this.bigImages.push(JSON.parse(qry.msg))
                        })
                        this.$bus.$emit("getImages",this.images.length > 16 ? 16 : this.images.length,this.images,this.bigImages)
                })
                this.editGroup = false
            }else{
                this.$store.dispatch('setDetailFriend',false)
            }
        },
        editGroupFun() {
            console.log(1231)
            this.seriesId = this.teams.findIndex((value, index, arr) => {
                    return (value.id == this.chatInfoF.teamId)
            })
            this.inBlackList = this.chatInfoF.inBlackList===1 ? true : false
            this.editGroup = true
        }
    },
}
</script>

<style lang="scss" scoped>
    .update-info-cent{

        padding: 1px;
        .update-cent-item {
            margin: 10px 15px;
            padding: 10px 0;
            box-sizing: border-box;
            border-bottom: 1px solid #ddd;
            display: flex;
            align-items: center;
            cursor: pointer;
            &:last-child{
                border: none;
            }
            .update-item-title {
                font-size: 14px;
                color: #333;

                i {
                    vertical-align: middle;
                    margin-right: 10px;
                    font-size: 24px;
                }

                span {
                    vertical-align: middle;
                }

                .leave-group{
                    color: red;
                }
                &:hover .leave-group{
                    color: #8d8d91;
                }
            }

            .update-item-cent {
                padding-left: 40px;
                box-sizing: border-box;
                flex: 1;
                text-align: right;
                color: #666;
                font-size: 16px;
                cursor: pointer;
                overflow: hidden;
                word-break: keep-all;
                text-overflow: ellipsis;

                &:hover {
                    color: #333;

                    img {
                        opacity: .9;
                    }
                }

                img {
                    width: 20px;
                    opacity: .6;
                }
            }
        }
    }
    .chat-box {
        position: relative;
        width: 100%;
        height: 100%;
        background: #F0F3F4;
        overflow: hidden;
        font-size: 16px;
        &.add-groups{
            background: #fff;
        }
        .chat-title {
                width: 100%;
                padding: 5px 0;
                box-sizing: border-box;
                border-bottom: 1px solid #ddd;
                display: block;
                align-items: center;
                background: #fff;
            .add-chat-title {
                position: relative;
                padding: 15px;
                box-sizing: border-box;
                background: #fff;
                border-top-right-radius: 5px;
                border-top-left-radius: 5px;

                h2 {
                    font-size: 18px;
                    text-align: center;
                }

                .settting-close {
                    position: absolute;
                    cursor: pointer;
                    font-size: 15px;
                    color: var(--primary-color);

                    /* &:hover {
                        color: #999;
                    } */
                }

                .add-member-btn {
                    position: absolute;
                    right: 15px;
                    top: 12px;
                    button{
                        background: transparent;
                        border: transparent;
                        font-size: 16px;
                        color: var(--primary-color);
                        font-weight: 100;
                        font-family: "rubik" !important;
                        &.is-disabled{
                            color: #D3D5D6;
                        }
                    }
                }
            }
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
        .details-info{
            width: 460px;
            margin: 30px auto;
            margin-top: 15px;
            margin-bottom: 0;
            border-radius: 10px;
            overflow: hidden;
            height: 100%;
            padding-bottom: 10px;
            .general-info {
                text-align: center;
                .el-avatar {
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
                    width: 72px;
                    height: 72px;
                    line-height: 70px;
                    font-size: 26px;
                    text-transform: uppercase;
                }
                h6 {
                    font-size: 16px;
                    font-weight: 700;
                    color: #000000;
                    margin-top: 5px;
                }
                p {
                    font-size: 14px;
                    font-weight: 100;
                    color: #999DA0;
                    line-height: 1.5;
                }
            }
            .action-info {
                height: 65px;
                text-align: center;
                padding: 10px;
                position: relative;
                cursor: pointer;
                border-radius: 15px;
                p {
                    font-size: 13px;
                    position: absolute;
                    bottom: 10px;
                    width: 100%;
                    text-align: center;
                    color: #000000;
                    left: 0;
                }
            }
            .all-info-tabs {
                
                overflow: auto;
                padding: 10px;
                border-radius: 15px;
            }
        }
        .details-update{
            height: calc(100vh - 200px);
            overflow: auto;
            margin-left: -10px;
            margin-right: -10px;
            padding: 0 10px;
            &.no-Friend{
                 height: calc(100vh - 300px);
            }
        }
    }
    .el-radio-group.visible-account {
        label {
            width: 100%;
            margin: 16px 10px;
            .title{
                font-weight: bold;
                color: black;
            }
            .desc{
                padding-left: 23px;
            }
        }
    }
    /deep/ .el-dialog {
    width: 400px;
    
}


.devices-detail{
    .item-devices {
    width: 550px !important;;
    margin: 0 auto;
}
.logout-user {
            margin-top: 30px;
            width: 100%;
            border-radius: 20px;
            background: #fff !important;
            border: none;
            color: #FF3939;
            font-size: 16px;
            text-transform: capitalize;
        }

.info-box {
        background: #fff;
        position: relative;
        padding: 0px 0px;
        box-sizing: border-box;
        border-radius: 20px;
        overflow-y: scroll;
        width: 500px;
        margin: 0 auto;

        h6 {
            margin-bottom: 20px;
            font-size: 12px;
            color: #999;
        }

        .info-item {
            padding: 16px 15px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            position: relative;
            &::before{
                content: '';
                width: calc(100% - 25px);
                position: absolute;
                bottom: 0;
                left: 25px;
                border-bottom: 1px solid #E0E3E5;
            }
            .info-item-icon {
                img {
                    width: 14px;
                }

                i {
                    font-size: 25px;
                }
            }

            .info-item-title {
                margin-left: 10px;
                font-size: 14px;
                color: #333;
            }

            .info-item-cent {
                flex: 1;
                text-align: right;
                font-size: 14px;
                color: #999;
                cursor: pointer;

            }
        }

        .sub-btn {
            margin-top: 20px;
            text-align: center;
            button {
                width: 120px;
            }
        }

    }
    .profile-info{
        font-size: 14px;
        .el-header{
            background: #fff;
            color: #000;
            text-align: center;
            line-height: 60px;
            text-transform: capitalize;
            font-size: 18px;
            cursor: pointer;
            
        }
        .el-main{
            background: #F0F3F4 !important;
            height: calc(100vh - 60px);
            padding-top: 80px;
        }
        .add-member-btn {
            position: absolute;
            right: 0;
            top: 0;
            button{
                        background: transparent;
                        border: transparent;
                        font-size: 16px;
                        color: var(--primary-color);
                        font-weight: 100;
                        font-family: "rubik" !important;
                        &.is-disabled{
                            color: #D3D5D6;
                        }
            }
        }
    }
    .item-devices>p {
        width: 500px;
        margin: 15px auto;
        color: #999DA0;
        font-size: 16px;
    }
    .tp-header {
        text-align: center;
        img {
            margin: 10px;
        }
    }
    .confirm-dialog{
        background: #FFB100 !important;
        font-size: 14px;
        color: #fff !important;
        border: none;
    }
}
.el-dialog__wrapper.devices-detail {
    z-index: 20000 !important;
}
</style>