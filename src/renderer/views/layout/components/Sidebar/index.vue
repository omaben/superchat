<template>
    <div>
        <div class="userInfo">
            <div class="user-desc" v-if="tabActive ===1">
               
                <div class="avatar online" :class="userStatus" @click="funShowInfoBoxNew()">
                    <img v-if="userInfo.photo" :src="userInfo.photo" alt="">
                    <div class="no-avatar" v-else>
                        <div class="vname" v-if="userInfo.nikeName">
                            {{userInfo.nikeName.slice(0,2)}}
                        </div>
                    </div>
                </div>
                <p class="user-name" @click="funShowInfoBoxNew()">{{userInfo&&userInfo.nikeName}} </p>                
            </div>
            <div class="search">
                <div class="search-box" @click="showSearch()">
                    <img :src="require('@/assets/svg/search.svg')" alt="">
                    <input type="text" disabled  :placeholder="$t('convertacts')" />
                </div>
                <el-popover class="quick-access-popover" placement="bottom-end" width="120" v-model="visible">
                    <!-- <p class="add-chat-item" >
                        <img :src="require('@/assets/svg/new-chat.svg')" alt="">
                        {{$t('newChat')}}
                    </p>
                    <p class="add-chat-item" @click="ShowAddFrdFunc">
                        <img :src="require('@/assets/svg/add-contact.svg')" alt="">
                        {{$t('addContact')}}
                    </p> -->
                    <p class="add-chat-item" @click="showAddGroupFunc" >
                        <img :src="require('@/assets/svg/create-group.svg')" alt="">
                        {{$t('createGroup')}}
                    </p>
                    <p class="add-chat-item" @click="showBatchFunc" >
                        <img :src="require('@/assets/svg/new-batch.svg')" alt="">
                        {{$t('new_broadcast')}}
                    </p>
                    <div class="add-chat-btn" slot="reference">
                        <img class="quick-access" :src="require('@/assets/svg/quick-access.svg')" alt="">
                    </div>
                </el-popover> 
                
            </div>
            <chat-search v-if="showChatSearch" @closeSearch="showChatSearch=false" />
            
        </div>
        <add-batch v-if="showBatch" @hideSetBox="hideBatchFunc"></add-batch>
        <div class="chat-list" :class="{'all-height':tabActive!=1}">
            <session-list v-show="tabActive == 1"  @closeFiles2='closeFiles' ref="listToggle"></session-list>
            <friends v-show="tabActive == 2" ></friends>
            <groups v-show="tabActive == 3"></groups>
            <!-- <tab-notice v-if="tabActive ==4"></tab-notice> -->
            <tab-discover v-if="tabActive ==5"></tab-discover>
        </div>
        <div class="chat-tab">
                <div class="tab-item">
                    <el-badge :value="unReadNum" :max="99" class="item"  :hidden="unReadNum<=0">
                        <div @click="changeTab(1)" :class="{'tab-active':tabActive == 1}">
                            <img v-show="tabActive === 1"  class="active" :src="require('@/assets/svg/active-chats.svg')" alt="">
                            <img v-show="tabActive != 1"  class="none-active" :src="require('@/assets/svg/non-active-chats.svg')" alt="">
                            <p>{{$t('news')}}</p>
                        </div>
                    </el-badge>
                </div>
                <div class="tab-item">
                    <el-badge :value="100" :min="0" :max="10" class="item" :hidden="true">
                        <div @click="changeTab(3)" :class="{'tab-active':tabActive == 3}">
                            <img v-show="tabActive === 3" class="active" :src="require('@/assets/svg/active-groups.svg')" alt="">
                            <img v-show="tabActive != 3" class="none-active" :src="require('@/assets/svg/non-active-groups.svg')" alt="">
                            <p>{{$t('groupChat')}}</p>
                        </div>
                    </el-badge>
                </div>
                <div class="tab-item">
                    <div @click="changeTab(2)" :class="{'tab-active':tabActive == 2}">
                        
                        <img v-show="tabActive === 2" class="active" :src="require('@/assets/svg/active-friends.svg')" alt="">
                        <img v-show="tabActive != 2" class="none-active" :src="require('@/assets/svg/non-active-friends.svg')" alt="">
                        <p>{{$t('friend')}}</p>
                    </div>
                </div>
                <!-- <div class="tab-item">
                    <el-badge :value="noticeNum" :max="99" class="item" :hidden="noticeNum<=0">
                        <div @click="changeTab(4)" :class="{'tab-active':tabActive == 4}">
                            <i class="el-icon-bell" ></i>
                            <p>{{$t('notice')}}</p>
                        </div>
                    </el-badge>
                </div> -->
                <div class="tab-item">
                    <el-badge class="item" >
                        <div @click="changeTab(5)" :class="{'tab-active':tabActive == 5}">
                            <img v-show="tabActive === 5" class="active" :src="require('@/assets/svg/non-active-dicvoer.svg')" alt="">
                             <img v-show="tabActive != 5" class="none-active" :src="require('@/assets/svg/non-active-dicvoer.svg')" alt="">
                            <p>{{$t('discover_menu_title')}}</p>
                        </div>
                    </el-badge>
                </div>
            </div>
        <el-dialog :title="$t('addFriend')" :visible.sync="isShowRemark" class="request-friend" :modal-append-to-body="false">
            <el-row>
                <el-col v-if="friendItem.nikeName" :span="4" class="img-request">
                    <img v-if="friendItem.photo"  :src="friendItem.photo" alt="">
                    <p v-else>{{friendItem.nikeName && friendItem.nikeName.slice(0,2)}}</p>
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
        <!-- <info-box @hideBox="hideBox" @showBox="showBoxFunc" v-if="showInfoBox"  :datas="userInfo"></info-box> -->
        <!-- <update-info @hideInfoBox="hideInfoBox" v-if="showUpdateInfoBox" :info="infoMsg" :roomType="roomType"></update-info> -->
        <!-- <setting-box v-if="showSettingBox" @hideSetBox="setBack" :menu="setMenu"></setting-box> -->
    </div>
</template>

<script>
import {
    mapGetters
} from "vuex";
import ScrollBar from "@/components/ScrollBar";
import {addUserRelation, delteUserRealation, queryUserByAccount, queryUsersByIds} from '@/services'

import SessionList from "./SessionList";
import ChatSearch from "./ChatSearch";
import Friends from "./Friends";
import Groups from "./Groups"
import TabDiscover from "./TabDiscover";
import { NoticeMsgDAO } from "@/services/db";
import { isObject } from '../../../../services/tool';
import Bus from "@/services/bus";
export default {
    components: {
        ScrollBar,
        SessionList,
        ChatSearch,
        Friends,
        Groups,
        TabDiscover,
    },
    computed: {
        ...mapGetters([
            "sidebar",
            "userInfo",
            "noticeMsg",
            "unReadNum",
            'friends',
            'rooms',
            'chatInRooms'
        ]),
        routes() {
            return this.$router.options.routes;
        },
        
    },
    watch: {
        noticeMsg: {
            handler(newVal, oldVal) {
                if(newVal){
                    this.checkNoticeNum(newVal)
                }
            },
            deep: true
        },
        
    },
    data() {
        return {
            formLabelWidth: '120px',
            showBatch: false,
            visible: false,
            showChatSearch:false,
            tabActive: 1,
            showInfoBox: false,
            showUpdateInfoBox: false,
            showSettingBox: false,
            setMenu: 1,
            noticeNum: 0,
            infoMsg: {},
            roomType: -1, // 1私聊(private chat) 2群聊(group chat)
            strRepeat: null,
            isShowAddFrd: false,
            form: {
                addFRemark: '',
            },
            isShowRemark: false,
            friendItem:{},
            userStatus:""
        };
    },
    beforeDestroy() {
        this.$bus.$off('show_info')
       
    },
    updated(){
 this.$bus.$on("wsStatus", data => {
             console.log(data);
             this.userStatus = data
        })
    },
    mounted() {


        if(!this.getChatLocalMsgStore(4) || typeof this.getChatLocalMsgStore(4)=='object'){
            this.$store.commit("SET_UNREAD_NUM", 0);
        }
        this.$bus.$on('show_info',(data,roomType,status) => {
            if(status==2){
                data.showStatus = true
            }else{
                data.showStatus = false
            }
            this.infoMsg = data;
            this.roomType = roomType;
            this.showUpdateInfoBox = true;
            
        })
        NoticeMsgDAO.getInstance().get().then(result=>{
            //this.$store.dispatch('SetNoticeMsg', [...result])
        })
        this.checkNoticeNum(this.noticeMsg)

        let that = this
       //console.log(that.$ref.listToggle)
        this.$electron.ipcRenderer.on('OpenChat', (event, arg) => {
            // console.log('arg: ',arg)
            console.log(arg,'arg')
            if(that.strRepeat == arg.msgId) return
            that.strRepeat = arg.msgId
            that.tabActive=1
            that.toChat(arg)
        })
    },
    methods: {
        cancelFriend(){
            this.isShowRemark = false
            this.form = {
                addFRemark: ''
            }
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
         hideFrd() {
            this.isShowAddFrd = false;
        },
        getFriend(item){
            this.friendItem = item;
            this.form = {
                addFRemark: ''
            }
            this.isShowRemark=true;
        },
        ShowAddFrdFunc() {
            this.visible = false;
            this.isShowAddFrd = true
        },
        showAddGroupFunc() {
            this.visible = false;
            this.$store.dispatch('setCreateGroup',true)
            this.$store.dispatch('SetNotification',false)
             this.$store.dispatch('SetBroadcastList',false)
            this.$store.dispatch('SetSerieManage',false)
            this.$bus.$emit("filterNameGroup")
        },
        hideBatchFunc() {
            this.visible = false;
            this.showBatch = false
        },
        showBatchFunc() {
            this.visible = false;
            this.$store.dispatch('SetBroadcastList',true)
            this.$store.dispatch('SetSerieManage',false)
             this.$store.dispatch('SetNotification',false)
             this.$store.dispatch('setCreateGroup',false)
            this.$bus.$emit('updateBatch')
        },
        showSearch() {
            this.$bus.$emit('updateSearchGlobal')
            this.showChatSearch=true
            
        },
        funShowInfoBox(){
            this.showInfoBox=true
            this.$bus.$emit('scrollInfoUser', true);
        },
        funShowInfoBoxNew(){
            this.$bus.$emit('show_user_info',true);
        },
        unReadNumVal(){
            if(typeof this.unReadNum=='object'){
                this.$store.commit("SET_UNREAD_NUM", 0)
            }
            return this.unReadNum
        },
        toChat(item) {
            this.$emit('closeFiles2')
            this.$store.dispatch('SetChatInfo', item);
            this.$bus.$emit('changeChat', true);
            this.$store.commit('SET_EVAL', '')
            this.strRepeat=null
        },
        checkNoticeNum(val){
            let count=0
            if(val.length>0){
                val.map(v => {
                    if(!v.isRead){
                        count++
                    }
                })
            }
            this.noticeNum = count;
        },
        changeTab(type) {
            this.tabActive = type;
            switch(type){
                case 1:
                    this.$bus.$emit('usersupd:sess')
                    break;
                case 3:
                    this.$bus.$emit('upd_group')
                    break;
                case 2:
                    this.$bus.$emit('usersupd')
                    break;
            }
        },
        hideBox() {
            this.showInfoBox = false
        },
        closeFiles(){
             this.$emit('closeFiles2')
        },
        showBoxFunc(type) {
            switch (type) {
                case 'info':
                    this.roomType = 1 
                    this.showUpdateInfoBox = true;
                    this.infoMsg = this.userInfo
                    break;
                case 'set':
                    this.setMenu = 1;
                    this.showSettingBox = true;
                    break;
                case 'version':
                    this.setMenu = 4;
                    this.showSettingBox = true;
                    break;

            }
        },
        hideInfoBox() {
            this.showUpdateInfoBox = false;
            this.$bus.$emit('hide_info',true)
        },
        setBack() {
            this.showSettingBox = false;

        }
    },
};
</script>
<style lang="scss" scoped>

    .search-box {
        input{
            border: none;
            outline: none;
        }
    }
    .avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;

                    .no-avatar,img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        background: #f0f0f0;
                    }
                    .vname{
                        width: 40px;
                        height: 40px;
                        font-size: 20px;
                        color: var(--primary-color);
                        border-radius: 50%;
                        background: #e5e4e8;
                        text-align: center;
                        line-height: 40px;
                    }

                }

</style>
