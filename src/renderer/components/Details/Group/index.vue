<template>
    <div class="chat-box"  >
        <div class="chat-item">
            <div class="chat-title">
                <div class="add-chat-title chat-top-title">
                    <div class="settting-close" @click="hideCreateGroup">
                        <i class="el-icon-arrow-left" ></i> {{$t('back')}}
                    </div>
                    <h2>{{$t('group_info')}}</h2>
                     <img  :src="require('@/assets/svg/search.svg')" class='search-top' alt="" @click='searchMember = true'>
                    <div class="tool-icon">
                        <el-popover class="quick-access-popover" placement="bottom-end" width="120" v-model="visibleIcon">
                            <p class="add-chat-item" v-if="!editGroup && !FriendToGroup"  @click="editGroupFun">
                                {{$t('Edit')}}
                            </p>
                             <p class="add-chat-item"  v-if="showSettings"  @click="editGroupSettingFun()">
                                {{$t('Update')}}
                            </p>
                            <p class="add-chat-item"  v-if="FriendToGroup"  @click="addFriendToGroup()">
                                {{$t('Update')}}
                            </p>
                            <div class="add-chat-btn" slot="reference">
                                <img class="quick-access" :src="require('@/assets/svg/menu.svg')" alt="">
                            </div>
                        </el-popover> 
                    </div>
                </div>
            </div>
        </div>
        <select-friends v-if="FriendToGroup" :groupsFriendData='normalMembers' oldSelectMemberList='[]' @selectItem='selectItem' :groupObj='groupObj' ></select-friends>
        <el-row class="details-info" v-if="!FriendToGroup">
             <el-row :gutter="20">
                <el-col :span="12" :offset="6">
                    <div class="grid-content general-info" @click="upgAvatar()">
                        <el-avatar v-if="chatInfo.logo" :src="chatInfo.logo"></el-avatar>
                        <el-avatar v-else >{{chatInfo.avatar && chatInfo.avatar.slice(0,2)}}</el-avatar>
                        <h6>{{chatInfo.avatar}}</h6>
                        <!-- <p>Always go to your crib 👫</p> -->
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="10" v-if="!editGroup">
                <el-col :span="6" v-if="chatInfo.groupRole === 3 || chatInfo.groupRole === 2 || chatInfo.allowInvite === 1">
                    <div class="grid-content bg-white action-info" @click="FriendToGroupFunc()">
                        <img  :src="require('@/assets/svg/add-friend-group.svg')" alt="">
                        <p>{{$t('addMember')}}</p>
                    </div>
                </el-col>
                <el-col :span="chatInfo.groupRole === 3 || chatInfo.groupRole === 2 || chatInfo.allowInvite === 1 ? 6 : 8" >
                    <div class="grid-content bg-white action-info" @click="pinGroupFunc(true)">
                        <img  :src="require('@/assets/svg/pin-chat-group.svg')" alt="">
                        <p v-if="!pinGroup">{{$t('pin')}}</p>
                        <p v-else>{{$t('Unpin')}}</p>
                    </div>
                </el-col>
                <el-col :span="chatInfo.groupRole === 3 || chatInfo.groupRole === 2 || chatInfo.allowInvite === 1 ? 6 : 8">
                    <div class="grid-content bg-white action-info" @click="dealDisturb(true)">
                        <img  :src="require('@/assets/svg/mute-group.svg')" alt="">
                        <p v-if="!msgDoNotDisturb">{{$t('groupMute')}}</p>
                        <p v-else>{{$t('groupUnmute')}}</p>
                    </div>
                </el-col>
                <el-col :span="chatInfo.groupRole === 3 || chatInfo.groupRole === 2 || chatInfo.allowInvite === 1 ? 6 : 8">
                    <div class="grid-content bg-white action-info">
                        <div class="tool-icon">
                            <el-popover class="quick-access-popover" placement="bottom-end" width="120" v-model="visible">
                                
                                <p class="add-chat-item" @click="clearDataByRoom(chatInfo.roomIdAndId)" >
                                    <span class="blue">{{$t('clearConversation')}}</span>
                                </p>
                                <p class="add-chat-item" v-if="chatInfo.groupReview ===1" @click="complains(2,chatInfo)">
                                    <span class="yellow">{{$t('report')}}</span>
                                </p>
                                <p class="add-chat-item" v-if="chatInfo.groupRole === 3 || chatInfo.groupRole === 2" @click="outRoom(2)">
                                    <span class="red">{{$t('disbandGroup')}}</span>
                                </p>
                                <p class="add-chat-item" v-if="chatInfo.groupRole === 1 && chatInfo.forbidLeave!=1" @click="outRoom(1)">
                                    <span class="red">{{$t('leaveGroup')}}</span>
                                </p>
                                <div class="add-chat-btn" slot="reference">
                                    <img  :src="require('@/assets/svg/more-info.svg')" alt="">
                                    <p>{{$t('more')}}</p>
                                </div>
                            </el-popover> 
                        </div>
                        
                    </div>
                </el-col>
            </el-row>
            <el-tabs v-model="activeTabs" class="bg-white all-info-tabs" @tab-click="handleClickTabs" v-if="!editGroup">
                <el-tab-pane :label="$t('member')"  name="user">
                    <members :members="chatInfo.members" :info="chatInfo"></members>
                </el-tab-pane>
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
            <el-row class="details-update" v-if="editGroup">
                <div v-if="!showSettings">
                    <el-row class="bg-white grid-content " >
                        <update-group @showSettingsFunc="showSettingsFunc" :info="chatInfo" />
                    </el-row>
                    <el-row class="bg-white grid-content ">
                        <div class="update-info-cent">
                            <div class="update-cent-item" v-if="chatInfo.groupRole === 3 || chatInfo.groupRole === 2">
                                <div class="update-item-title">
                                    <span>{{$t('groupMute')}}</span>
                                </div>
                                <div class="update-item-cent">
                                    <el-switch
                                        v-model="groupMute"
                                        active-color="#13ce66"
                                        inactive-color="#F2F2F2"
                                        @change="updateRoomStatusFunc()"
                                        >
                                    </el-switch>
                                </div>
                            </div>
                            <div class="update-cent-item">
                                <div class="update-item-title">
                                    <span>{{$t('pin')}}</span>
                                </div>
                                <div class="update-item-cent">
                                    <el-switch
                                        v-model="pinGroup"
                                        active-color="#13ce66"
                                        inactive-color="#F2F2F2"
                                        @change="pinGroupFunc()"
                                        >
                                    </el-switch>
                                </div>
                            </div>
                            <div class="update-cent-item">
                                <div class="update-item-title">
                                    <span>{{$t('DoNotDisturb')}}</span>
                                </div>
                                <div class="update-item-cent">
                                    <el-switch
                                        v-model="msgDoNotDisturb"
                                        active-color="#13ce66"
                                        inactive-color="#F2F2F2"
                                        @change="dealDisturb()"
                                        >
                                    </el-switch>
                                </div>
                            </div>
                        </div>
                    </el-row>
                    <el-row class="bg-white grid-content ">
                        <div class="update-info-cent">
                            <div class="update-cent-item" @click="clearDataByRoom(chatInfo.roomIdAndId)">
                                <div class="update-item-title">
                                    <span class="blue">{{$t('clearConversation')}}</span>
                                </div>
                            </div>
                            <div class="update-cent-item" v-if="chatInfo.groupReview ===1" @click="complains(2,chatInfo)">
                                <div class="update-item-title">
                                    <span class="yellow">{{$t('report')}}</span>
                                </div>
                            </div>
                            
                            <div class="update-cent-item" v-if="chatInfo.groupRole === 3 || chatInfo.groupRole === 2" @click="outRoom(2)">
                                <div class="update-item-title">
                                    <span class="red">{{$t('disbandGroup')}}</span>
                                </div>
                            </div>
                            <div class="update-cent-item" v-if="chatInfo.groupRole === 1 && chatInfo.forbidLeave!=1" @click="outRoom(1)">
                                <div class="update-item-title">
                                    <span class="red">{{$t('leaveGroup')}}</span>
                                </div>
                            </div>
                        </div>
                    </el-row>
                </div>
                <el-row v-if="showSettings" class="bg-white grid-content ">
                    <group-settings @updateSettings ="updateSettings" :info="chatInfo" @ownerTransfer="ownerTransfer"/>
                </el-row>
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
         <el-dialog :title="$t('search')" :visible.sync="searchMember" :modal="false">
             <div class="feedback">
                <search-members :members="chatInfo.members" :info="chatInfo"></search-members>
             </div>
        </el-dialog>
        <choose-file
                        ref="chooseFile"
                        v-show="chooseFile"
                        
                    />
    </div>
</template>
<script>

import ChooseFile from "@/components/Chat/components/ChooseFile";

import {  mapGetters } from 'vuex'
import SelectFriends from '@/components/AddChat/SelectFriends';
import Members from './Members';
import SearchMembers from './SearchMembers';
import Images from '../Images';
import Videos from '../Videos';
import Files from '../Files';
import GroupSettings from './GroupSettings';
import UpdateGroup from './UpdateGroup';
import { chatLocalMsgDAO,chatInRoomsDAO } from "@/services/db";
import MSG_TYPE,{translateHTML} from "../../../services/im/constant" //调试用
import {
    outRoomRealation,
    deleteRoom,
    updateRoomStatus,
    complain,
    updateRoomSetting,
    changeOwner,
    inviteRoom,
    goimfilesUpload,
    updateRoom
} from '@/services'
export default {
    data() {
        return {
            searchMember:false,
            visible: false,
            visibleIcon: false,
            chooseFile: false,
            MSG_TYPE,
            addFriendData: [],
            value:false,
            editGroup: false,
            activeTabs: 'user',
            showSettings: false,
            images: [],
            bigImages: [],
            membersInGroup: [],
            files:[],
            selectMemberList: [],
            groupMute:false,
            pinGroup: false,
            msgDoNotDisturb: false,
            dataSetting : {

            },
            FriendToGroup: false,
            ownerTransferVal : false,
            newOwner : [],
            isComplain : false,
            pInfo: {},
            pStatus: -1,
            content: '1',
            groupObj:{
                title: '',
                okText: '',
                placeholder: '',
                holdtxt: '',
            },
            normalMembers : [],
        }
    },
    components: {
        ChooseFile,
        Members,
        Images,
        Videos,
        Files,
        GroupSettings,
        UpdateGroup,
        SelectFriends,
        SearchMembers
    },
    computed: {
        ...mapGetters([
            'chatInfo',
            'friends',
            'rooms',
        ]),
         
    },
    mounted() {
        this.handleEventGroup()
        this.$bus.$off('openDetails')
        this.$bus.$on('openDetails', (roomIdAndId) => {
            this.activeTabs = 'user'
            this.handleEventGroup()
        })
        this.$bus.$off('upgsAvatar')
        this.$bus.$on('upgsAvatar',(file, localPath) => {
                this.dealAvatar(file, localPath)
        })

    },
    updated() {
        //this.handleEventGroup()
    },
    methods: {
        upgAvatar(){
            if(this.chatInfo.groupRole === 3 || this.chatInfo.groupRole === 2 ){
                this.$bus.$emit('upgAvatar')
            }
        },
        async dealAvatar(file, localPath){
            let form = new FormData();
            form.append("file", file);
            form.append("fileType", 1); // 1头像<不鉴权>  2消息内容
            form.append("isOneToOne", false); //false=群聊 true=私聊
            form.append("from", "");
            form.append("to", "");
            
            let res = await goimfilesUpload(form)
            
            if(res.success){
                let data = res.data;
                let photo = data.url;
                let post = {
                    id: this.chatInfo.id,
                    logo: photo,
                }
                updateRoom(post).then(res => {
                    if(res.success){
                        
                        this.$message.success(this.$t('doSucc'))
                        this.$store.dispatch('SetRoomInfo', {roomId: post.id , status:false})                        

                    }else{
                        this.$message.error(res.message)
                    }
                })
            }else{
                this.$message.error(res.message)
            }
        },
        async FriendToGroupFunc(){
                let roomInfo = await this.fixInfo(2, {
                roomIds: [this.chatInfo.roomId | this.chatInfo.id],
                }).catch((err) => {
                    this.$bus.$emit("show_dialog_err", err);
                });
                if (roomInfo) {
                    let info = { ...this.chatInfo, ...roomInfo};
                    await this.roomListInstance().editInstance(info)
                    let chatMembers = info.chatMember
                    this.$store.commit("SET_CHATMEMS", chatMembers); 
                    if(chatMembers&&chatMembers.length>0){
                        chatMembers.map(async(vt) => {
                            this.$store.commit('UPDATE_USERS_OBJ', vt)
                            await this.userListInstance().editInstance(vt)
                        })
                    }
                    
                    this.normalMembers = chatMembers
                    this.FriendToGroup = true
                }
        },
        selectItem(data){
            this.addFriendData = []
            data.forEach(item=>{
                let element = this.normalMembers.find(qry => qry.id ===  item.id)
                if(!element){
                    this.addFriendData.push(item)
                }
            })
        },
        async addFriendToGroup(){
           
                let userIds = this.addFriendData.map(v => {
                    return v.id
                })
                console.log(userIds,this.chatInfo.id)
                let post = {
                    userIds,
                    roomId: this.chatInfo.id
                }
                // 邀请好友进群
                // invite friends into the group
                let res = await inviteRoom(post)
                if(res.success){
                    // this.$message.success('邀请好友进群成功');

                    console.log(this.chatInfo)

                    this.$message.success(this.$t('doSucc'))
                    // // 改变chatInfo 自动切换至对应房间
                    // // 更新会员信息
                    // this.$store.dispatch('SetChatMembers', this.info.id).then(()=>{
                    //     this.hideBox()
                    // }).catch(err => {
                    //     this.$message.error(err)
                    // })
                    // // 更新房间信息
                    // this.$store.dispatch('SetRoomInfo', post.roomId)
                    //     .then(()=>{}).catch(err => {
                    //         this.$message.error(err)
                    //     });
                    // // Change chatInfo to automatically switch to the corresponding room
                    // // Update member information
                    // // Update room information
                    const [errInfo, dataInfo] = await this.awaitWrap(this.$store.dispatch('SetChatMembers', this.chatInfo.id))
                    if(errInfo){
                        this.$message.error(errInfo)
                        return
                    }

                    const [errInfos, dataInfos] = await this.awaitWrap(this.$store.dispatch('SetRoomInfo', {roomId: post.roomId , status:false}))
                    if(errInfos){
                        this.$message.error(errInfos)
                        return
                    }
                    this.hideCreateGroup()

                }else{
                    this.$message.error(res.message)
                }
            
            


        },
        clearDataByRoom(id){
            this.$confirm(this.$t('confirmClearStorage'), this.$t('Clear Conversation'), {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
            }).then(() => {
                this.clearChatRoom(id)
                this.$message.success(this.$t('doSucc'))
                this.$store.dispatch('setDetailGroup',false)
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
                    roomId: this.chatInfo.id || this.getRoomIdsId(this.chatInfo.roomIdAndId)
                }
            }else if(status==2){
                func = deleteRoom
                str = "解散群组"
                // str = "Dissolve group"
                post = {
                    id: this.chatInfo.id || this.getRoomIdsId(this.chatInfo.roomIdAndId)
                }
            }
            let sure = () => {
                func(post).then(res => {
                    if(res.success){
                        // this.$message.success(`${str}成功`)
                        this.$message.success(this.$t('doSucc'))

                        this.$store.dispatch('DelRooms',this.chatInfo.id || this.getRoomIdsId(this.chatInfo.roomIdAndId))
                        // 都要重新进入列表一个房间
                        // have to re-enter a room in the list
                        this.$store.dispatch('DelChatInRooms',{...this.chatInfo,roomType:2})
                        this.$store.dispatch('SetChatInfo', this.rooms[0] || this.friends[0]);
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
        ownerTransfer(data){
            this.ownerTransferVal = true
            this.newOwner  = data
             
            console.log(data,'data4')
        },
        async editGroupSettingFun(){
              
            if(this.ownerTransferVal){
                let post = {
                    roomId : this.chatInfo.id,
                    changeId : this.newOwner[0].id
                }
                changeOwner(post).then(async(res) => {
                    console.log(res,'res',post)
                        if(res.success){
                            
                            
                            this.newOwner  = []
                            this.ownerTransferVal = false
                            this.hideCreateGroup()
                            this.$message.success(res.message)
                        }else{
                            this.$message.error(res.message)
                        }
                    })
            }
            this.chatInfo.forbidAddFriends = this.dataSetting.forbidAddFriends === true ? 1 : 2
            this.chatInfo.hideMemberList = this.dataSetting.hideMemberList === true ? 1 : 2
            this.chatInfo.allowInvite = this.dataSetting.allowInvite === true ? 1 : 2
            this.chatInfo.allowShowQrCode = this.dataSetting.allowShowQrCode === true ? 1 : 2
            this.chatInfo.groupReview = this.dataSetting.groupReview === true ? 1 : 2
            this.chatInfo.forbidLeave = this.dataSetting.forbidLeave === true ? 1 : 2
            this.chatInfo.showRoomNotice = this.dataSetting.showRoomNotice === true ? 1 : 2
            this.chatInfo.showMuteNotice = this.dataSetting.showMuteNotice === true ? 1 : 2
            let response 
            await updateRoomSetting(this.chatInfo).then(res => {
                response = res
                this.hideCreateGroup()
            })
            return response
        },
        
        // Mute group
        updateRoomStatusFunc(status){
            if(status){
                this.chatInfo.status = this.chatInfo.status === 1 ? 2 : 1
                this.handleEventGroup()
            }else{
                this.chatInfo.status = this.groupMute===true ? 2 : 1
                
            }
            let statf = this.chatInfo.status
            let post = {
                id: this.chatInfo.id || this.chatInfo.roomId,
                status: statf
            }
            updateRoomStatus(post).then(res => {
                if(res.success){
                    this.$message.success(this.$t('doSucc'))
                    this.$set(this.chatInfo,'status',statf)
                }
            })
        },
        
        pinGroupFunc(status){
            if(status){
                this.chatInfo.topStatus = this.chatInfo.topStatus === 1 ? 2 : 1
                this.handleEventGroup()
            }else{
                this.chatInfo.topStatus = this.pinGroup===true ? 1 : 2
            }
            this.$store.dispatch('pinChatRoom', this.chatInfo)
        },
        handleEventGroup(){
            this.groupMute = this.chatInfo.status===2 ? true : false
            this.pinGroup = this.chatInfo.topStatus===1 ? true : false
            this.msgDoNotDisturb = this.chatInfo.msgDoNotDisturb===1 ? true : false
        },
        //disturb
        dealDisturb(status){
            if(status){
                this.chatInfo.msgDoNotDisturb = this.chatInfo.msgDoNotDisturb === 1 ? 2 : 1
                this.handleEventGroup()
            }else{
                this.chatInfo.msgDoNotDisturb = this.msgDoNotDisturb===true ? 1 : 2

            }
            this.$store.dispatch('disturbChatRoom', this.chatInfo)
            
        },
        // get last data when click on tabs
        handleClickTabs(tab, event) {
            if(tab.name ==='images'){
                this.$bus.$emit("getImages",0,[],[])
                 this.images = []
                 this.bigImages = []
                 let roomIdAndId = this.chatInfo.roomIdAndId
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
                 let roomIdAndId = this.chatInfo.roomIdAndId
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
                 
                 let roomIdAndId = this.chatInfo.roomIdAndId
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

            
            if(this.showSettings){
                this.showSettings = false
                this.$bus.$emit('hideOwnerTransfer')
            }else if(this.editGroup){
                this.editGroup = false
            }else if(this.FriendToGroup){
                this.FriendToGroup = false
            }
            else{
                this.$store.dispatch('setDetailGroup',false)
            }
        },
        editGroupFun() {
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
                padding-bottom: 0;
                 padding-top: 21px;
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
                img.search-top {
                    cursor: pointer;
                    position: relative;
                    top: -15px;
                }
                .tool-icon {
                    width: 48px;
                    height: 48px;
                    background: transparent;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 45px;
                    cursor: pointer;
                    margin-left: 5px;
                    position: relative;
                    top: -7px;
                    i {
                        font-size: 16pt;
                    }
                    img {
                        width: 25px;
                        height: 25px;
                    }

                    &:hover {
                        //background: #e0e0e0;
                        //color: var(--primary-color);
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
            height: calc(100vh - 280px);
            overflow: auto;
            margin-left: -10px;
            margin-right: -10px;
            padding: 0 10px;
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
</style>