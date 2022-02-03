<template>
    <div class="add-chat-search">
        <div class="add-chat-cent">
            
            <div class="search-member" :class="{'inSearchFouc':inSearchFouc || name}">
                <input  type="text" v-model="name" @input="filterName" @focus="inSearchFouc=true" @blur="inSearchFouc=false" ref="inputName" :placeholder="$t('find')">
                <i class="el-icon-close clear" @click="clearSearch"></i>
            </div>
            <div class="search-bloc">
                <div class="title-chat-search" v-if="selListData && selListData.length>0">
                    <p>
                        {{$t('theContact')}}
                        <span @click="viewAllPoeple()">{{viewAllPoepleValue==true?$t('viewLess'):$t('viewMore')}}</span>
                    </p>
                </div>
                <div class="session-chat-list" v-if="selListData && selListData.length>0">
                    <ul id="list">
                        <li v-for="(item,idx) in selListData" 
                            :class="{'active':chatActiveIdx == idx}"
                            :key="idx" 
                            @click="toChat(item,idx)"
                            v-show="selListData.length>0">

                            <div class="chat-avatar">
                                <img v-if="makeUserMsg(item,1)" :src="makeUserMsg(item,1)" alt="">
                                <p v-else>{{(makeUserMsg(item,2)&&makeUserMsg(item,2).slice(0,3))|| item.account&&item.account.slice(0,3)}}</p>
                            </div>
                            <div class="chat-desc">
                                <h6>{{makeUserMsg(item,2)||item.account}}</h6>
                                <p>{{item.remark}}</p>
                            </div>
                        
                        </li>
                    </ul>
                </div>
                <div class="title-chat-search" v-if="selListGroupData && selListGroupData.length>0">
                    <p>
                        {{$t('groupChat')}}
                        <span @click="viewAllGroup()">{{viewAllGroupValue==true?$t('viewLess'):$t('viewMore')}}</span>
                    </p>
                </div>
                <div class="session-chat-list" v-if="selListGroupData && selListGroupData.length>0">
                    <ul id="list">
                        <li :class="{'active':chatActiveIdx == index}" v-for="(item, index) in selListGroupData"  :key="index" @click="toChat(item,index)">
                            <div class="chat-avatar">
                                <img v-if="item.logo" :src="item.logo" alt="">
                                <p v-else>{{item.name&&item.name.slice(0,2) || item.nikeName&&item.nikeName.slice(0,2)|| item.receiver&&item.receiver.slice(0,2)}}</p>
                            </div>
                            <div class="chat-desc">
                                <h6>{{item.name || item.nikeName || item.receiver}}</h6>
                                <p>{{item.roomNotice}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="title-chat-search" v-if="selListMSGData.length>0">
                    <p>
                        {{$t('messages')}}
                    </p>
                </div>
                <div class="session-chat-list" v-if="selListMSGData.length>0">
                    <ul id="list">
                        <li :class="{'active':chatActiveIdx == item.roomIdAndId }"  v-for="(item, index) in selListMSGData" :key="index" @click="toChatMsg(item,item.roomIdAndId)" >
                            <div class="chat-avatar" v-if="item.isMine" >
                                <img v-if="userInfo.photo" :src="userInfo.photo" alt="">
                                <div class="no-avatar" v-else>
                                    <div class="vname" v-if="userInfo.nikeName">
                                        {{userInfo.nikeName.slice(0,2)}}
                                    </div>
                                </div>
                            </div>
                            <div class="chat-avatar" v-else>
                                <img v-if="item.logo || item.senderHead" :src="item.logo || item.senderHead" alt="">
                                <div class="no-avatar" v-else>
                                    <div class="vname" v-if="item.senderName">
                                        {{item.senderName.slice(0,2)}}
                                    </div>
                                </div>
                            </div>
                            <div class="chat-desc" v-if="item && item.msgType != MSG_TYPE.IM_MSG_TYPE_NOTIFICSTION">
                                <h6 v-if="item.isMine">{{userInfo&&userInfo.nikeName}}</h6>
                                <h6 v-else>{{item.senderName}}</h6>
                                <p :index="index">{{handleMessage(item.msg, item.msgType,item)}}</p>
                            </div>
                            
                        </li>
                    </ul>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
import {  mapGetters } from 'vuex'
import { chatLocalMsgDAO, chatInRoomsDAO, userListDAO, roomListDao } from "@/services/db";
import MSG_TYPE,{ handleMessage,handleNotice } from '@/services/im/constant';

export default {
    
    data() {
        return {
            viewAllGroupValue: false,
            viewAllPoepleValue: false,
            MSG_TYPE,
            selListData: this.friends,
            selListGroupData:this.rooms,
            selListMSGData:[],
            name: "",
            fixDataMsg: [],
            inSearchFouc: false,
            chatActiveIdx: -1,
        }
    },
    computed: {
        ...mapGetters([
            'friends',
            'chatInfo',
            'usersObj',
            'userInfo',
            'rooms',
        ])
    },
    mounted() {
        let that = this
        setTimeout(function(){
            that.getchatLocalMsgDAO()

        },500)
    },
    methods: {
        handleNotice,
        handleMessage,
        async viewAllPoeple(){
            this.viewAllPoepleValue = !this.viewAllPoepleValue
            let selListData = this.friends
            if(selListData){
                if(this.viewAllPoepleValue){
                    this.selListData=selListData
                }else{
                    this.selListData=selListData.slice(0, 3)
                }
            }
            
        },
        async viewAllGroup(){
            this.viewAllGroupValue = !this.viewAllGroupValue
            let selListGroupData = this.rooms.filter(qry => qry.groupRole === 3 || qry.groupRole === 2 || qry.groupRole === 1 )
            if(selListGroupData){
                if(this.viewAllGroupValue){
                    this.selListGroupData=selListGroupData
                }else{
                    this.selListGroupData=selListGroupData.slice(0, 3)
                }
            }
            

        },
        async getchatLocalMsgDAO(){
            
            this.viewAllGroupValue = false
            this.viewAllPoepleValue = false
            this.fixDataMsg =await chatLocalMsgDAO.getInstance().get()
            this.selListData = this.friends
            
            this.selListGroupData = this.rooms.filter(qry => qry.groupRole === 3 || qry.groupRole === 2 || qry.groupRole === 1 )
            let selListMSGDataM = await chatLocalMsgDAO.getInstance().get()
            selListMSGDataM = selListMSGDataM.filter(qry => qry.msgType!=MSG_TYPE.IM_MSG_TYPE_NOTIFICSTION)
            if(this.selListData.length>3){
                this.selListData=this.friends.slice(0, 3)
                console.log(selListData)
            }
            if(this.selListGroupData.length>3){
                this.selListGroupData=this.rooms.filter(qry => qry.groupRole === 3 || qry.groupRole === 2 || qry.groupRole === 1 ).slice(0, 3)
            }
            if(selListMSGDataM.length>3){
                this.selListMSGData=selListMSGDataM.slice(0, 3)
            }
        },
        makeUserMsg(item,status){
            //let idf = this.getRoomIdsId(item.roomIdAndId)
            //let pickObj = this.usersObj[idf];
            let val
            //if(pickObj){
                if(status==1){
                    val = item.photo
                }else if(status==2){
                    val = item.nikeName
                }
            //}
            return val || ''
        },
       toChat(item, idx) {
           
            //if(this.chatActiveIdx==idx)return
            this.chatActiveIdx = idx;
            this.$store.dispatch('SetChatInfo', item);
            this.$bus.$emit('changeChat', true);
        },
        async toChatMsg(msgItem,idx) {
           
            //if(this.chatActiveIdx==idx)return
            this.chatActiveIdx = idx;
            let item= await chatInRoomsDAO.getInstance().find(idx)
            this.$store.dispatch('SetChatInfo', item);
            this.$bus.$emit('changeChat', true);
            this.$bus.$emit('globalSearch', this.handleMessage(msgItem.msg, msgItem.msgType,msgItem),idx);
        },
        filterName(){
            if(this.name){
                this.selListData = this.friends.filter(v => v.nikeName.toLowerCase().indexOf(this.name.toLowerCase())>-1) || []
                if(this.selListData.length==0){
                    this.selListData =  []
                }
                this.selListGroupData = this.rooms.filter(v => (v.groupRole === 3 || v.groupRole === 2 || v.groupRole === 1) &&  v.name.toLowerCase().indexOf(this.name.toLowerCase())>-1) || []
                if(this.selListGroupData.length==0){
                    this.selListGroupData =  []
                }
                this.selListMSGData = this.fixDataMsg.filter(v => this.handleMessage(v.msg, v.msgType,v).toLowerCase().indexOf(this.name.toLowerCase())>-1) || []
                if(this.selListMSGData.length==0){
                    this.selListMSGData =  []
                }
                
                // this.selectList = arr;
                // console.log("arr: ",arr)
            }else{
                
                this.getchatLocalMsgDAO()
            }
        },
        
        clearSearch() {
            this.name = "";
            this.inSearchFouc = false;
            this.filterName()
            this.$emit('closeSearch')
        },
        
    },
}
</script>

<style lang="scss" scoped>
.search-bloc {
    height: calc(100vh - 142px);
    overflow-y: auto;
}
.session-chat-list {
            margin-bottom: 12px;
        box-sizing: border-box;

        ul {
            height: calc(100% - 153px);
            overflow-y: auto;

            li {
                // height: 1000px;
                display: flex;
                align-items: center;
                padding: 15px 10px;
                box-sizing: border-box;

                &.active {
                    background: #ceecfa !important;
                }

                &:hover {
                    cursor: pointer;
                    background: #dff1fa;
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
                        font-size: 14px;
                        color: #2b2c33;
                        font-weight: 500;

                    }

                    p {
                        margin-top: 5px;
                        font-size: 14px;
                        color: #999;
                        overflow: hidden;
                        width: 240px;
                        word-break: keep-all;
                        overflow: hidden;
                        word-break: keep-all;
                        text-overflow: ellipsis;
                        max-width: 160px;
                        white-space: nowrap;
                    }
                }

            }
        }
    }
.add-chat-search {
.avatar,.chat-avatar {
                    position: relative;
                    display: inline-block;
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    margin-bottom: 10px;
                    .vname{
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

                    .no-avatar,img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        background: #f0f0f0;
                    }

                    .select-close {
                        position: absolute;
                        right: 0;
                        top: 0;
                        z-index: 1;
                        font-size: 22px;
                        color: #317ace;
                        border-radius: 50%;

                        &::before {
                            content: '';
                            position: absolute;
                            left: 0;
                            top: 0;
                            z-index: 0;
                            width: 24px;
                            height: 24px;
                            background: #fff;
                            border-radius: 50%;

                        }

                        i {
                            position: relative;
                        }

                    }
                }
    z-index: 100;
    background: #fff;

    .add-chat-mark {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba($color: #fff, $alpha: .9);

    }

    .add-chat-cent {
        position: absolute;
        top: 70px;
        left: 0;
        width: 9.5cm;
        height: calc(100vh - 53px);
        z-index: 999;
        background: #fff;
        border-radius: 5px;
        .title-chat-search {
            background: #f1f1f4;
            height: 38px;
            color: #000;
            position: relative;
            p {
                color: #000;
                font-size: 12pt;
                text-align: left;
                padding: 10px 16PX;
                span {
                    float: right;
                    color: var(--primary-color);
                    text-transform: capitalize;
                    font-size: 10pt;
                    cursor: pointer;
                }
            }
        }
        .add-chat-title {
            position: relative;
            padding: 15px;
            box-sizing: border-box;
            background: #fff;
            border-top-right-radius: 5px;
            border-top-left-radius: 5px;

            h2 {
                font-size: 24px;
                text-align: center;
                font-weight: normal;
            }

            .settting-close {
                font-size: 20px;
                position: absolute;
                cursor: pointer;

                &:hover {
                    color: #999;
                }
            }

            .add-member-btn {
                position: absolute;
                right: 15px;
                top: 12px;

            }
        }

        .search-member {
            position: relative;
            width: 100%;
            background: #f0f0f0;

            input {
                padding: 0 75px 0 25px;
                box-sizing: border-box;
                font-size: 16px;
                color: #fff;
                width: 100%;
                height: 60px;
                background: transparent;
                border: none;
                outline: none;
            }

            .clear {
                display: none;
                position: absolute;
                right: 20px;
                top: 17px;
                font-size: 24px;
                cursor: pointer;
            }

            /* &.inSearchFouc { */
                background: linear-gradient(45deg, #317ace, #52baed);

                ::-webkit-input-placeholder {
                    /* WebKit browsers */
                    color: #ddd;
                    font-size: 16px;
                }

                ::-moz-placeholder {
                    /* Mozilla Firefox 19+ */
                    color: #ddd;
                    font-size: 16px;
                }

                :-ms-input-placeholder {
                    /* Internet Explorer 10+ */
                    color: #ddd;
                    font-size: 16px;
                }

                .clear {
                    display: block;
                    color: #fff;
                }

            /* } */
        }

        .select-member {
            margin: 10px 0;
            width: 100%;
            overflow: auto;
            word-break: keep-all;
            white-space: nowrap;
            cursor: pointer;

            .select-item {
                display: inline-block;
                text-align: center;
                margin-right: 10px;

                &:first-child {
                    margin-left: 10px;
                }

                .avatar {
                    position: relative;
                    display: inline-block;
                    width: 65px;
                    height: 65px;
                    border-radius: 50%;
                    margin-bottom: 10px;
                    .vname{
                        width: 65px;
                        height: 65px;
                        font-size: 35px;
                        color: var(--primary-color);
                        border-radius: 50%;
                        background: #e5e4e8;
                        text-align: center;
                        line-height: 65px;
                    }

                    .no-avatar,img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        background: #f0f0f0;
                    }

                    .select-close {
                        position: absolute;
                        right: 0;
                        top: 0;
                        z-index: 1;
                        font-size: 22px;
                        color: #317ace;
                        border-radius: 50%;

                        &::before {
                            content: '';
                            position: absolute;
                            left: 0;
                            top: 0;
                            z-index: 0;
                            width: 24px;
                            height: 24px;
                            background: #fff;
                            border-radius: 50%;

                        }

                        i {
                            position: relative;
                        }

                    }
                }

                .member-name {
                    width: 65px;
                    font-size: 12px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: keep-all;

                }
            }

        }

        .member-list {
            height: calc(100% - 140px);
            overflow: auto;

            &.has-select {
                height: calc(100% - 220px);
            }

            h6 {
                margin: 10px;
                font-size: 12px;
                color: #999;
            }

            .member-item {
                padding: 0 10px;
                display: flex;
                align-items: center;
                font-size: 14px;
                cursor: pointer;

                &:hover {
                    background: #f9f9f9;
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

                .member-name {
                    position: relative;
                    margin-left: 10px;
                    flex: 1;
                    height: 50px;
                    line-height: 50px;
                    border-bottom: 1px solid #ddd;

                    span {
                        display: inline-block;
                        width: 300px;
                        overflow: hidden;
                        word-break: keep-all;
                        text-overflow: ellipsis;
                        font-size: 18px;
                        font-weight: bold;
                    }

                    .member-checkbox {
                        position: absolute;
                        top: 50%;
                        right: 10px;
                        transform: translate(0, -50%);
                        width: 25px;
                        height: 25px;
                        border: 1px solid #ddd;
                        border-radius: 50%;

                        &.select {
                            border: 0;
                            background: linear-gradient(45deg, #317ace, #52baed);
                            text-align: center;
                            line-height: 25px;
                            font-size: 18px;
                            color: #fff;
                        }

                    }
                }
            }

        }

    }

}
</style>