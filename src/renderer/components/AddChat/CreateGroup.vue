<template>
    <div class="chat-box" :class="{'add-groups':!createGroup}" >
        <div class="chat-item ">
            <div class="chat-title">
                <div class="add-chat-title">
                    <div class="settting-close" @click="hideCreateGroup">
                        <i class="el-icon-arrow-left"></i> {{$t('back')}}
                    </div>
                    <h2>{{$t('createGroup')}}</h2>
                   <div class="add-member-btn">
                            <el-button v-show="!createGroup" @click="selectMembers" type="primary" size="small" round :disabled='selectMemberList.length <= 0'>{{$t('next')}}</el-button>
                            <el-button v-show="createGroup"  @click="addGroup" type="primary" size="small" round :disabled='roomName===""'>{{$t('Update')}}</el-button>
                    </div>
                </div>
            </div>
            <div class="add-group-members" v-if="!createGroup">
                <select-friends :oldSelectMemberList='selectMemberList' @selectItem='selectItem' :groupObj='groupObj' ></select-friends>
            </div>
            <div class="create-group" v-if="createGroup">
                <div class="manage-series">
                    <el-form ref="form" class="name-groups">
                        <el-form-item label="">
                            <img  :src="require('@/assets/svg/createGroup.svg')" alt="">
                            <input type="text" v-model="roomName" @keyup="calculatLength" maxlength="30" ref="inputNames" :placeholder="$t('groupName')">
                            <span>{{roomNameLength}}</span>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="manage-series">
                    <div class="member-list">
                        <div class="member-item"  v-for="(item,index) in selectMemberList" :key="index">
                            <div class="avatar">
                                <img v-if="item.photo" :src="item.photo" alt="">
                                <div class="vname" v-else>
                                    {{item.nikeName&&item.nikeName.slice(0,2)}}
                                </div>
                            </div>
                            <div class="member-name">
                                <span>{{item.nikeName||item.nickName}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { editUserTeam, delUserTeam} from "@/services";
import { addRoom,goimfilesUpload } from '@/services'
import SelectFriends from './SelectFriends';

import {
    mapGetters
} from 'vuex'
export default {
    components: {
            SelectFriends
        },
    data() {
        return {
            createGroup: false,
            dragging: -1,
            nameTeam: '',
            checkDisabled: -1,
            oldNameSelected: '',
            updateManage:false,
            openAddSeries:false,
            roomName: "",
            checked: false,
            selectMemberList: [],
            selList: [],
            selectListPro: [],
            groupObj:{
                title: '',
                okText: '',
                placeholder: '',
                holdtxt: '',
            },
            roomNameLength:30
        }
    },
    computed: {
        ...mapGetters([
            'userInfo',
            'friends',
            'teams',
            'chatMembers'
        ]),
        isDragging() {
            return this.dragging > -1
        },
        
    },
    methods: {
        calculatLength(){
            this.roomNameLength = 30 - this.roomName.length
        },
        hideCreateGroup() {
            if(!this.createGroup){
                this.selectMemberList = []
                this.$bus.$emit("hideCreateGroup")
                this.$store.dispatch('setCreateGroup',false)
            }
            this.createGroup = false
        },
        selectItem(item) {
            this.selectMemberList = item

        },
        selectMembers(){
            this.createGroup = true
        },
        addGroup(){
            let userIds = this.selectMemberList.map(v => {
                return v.id
            })
            let post = {
                userIds,
                logo:require('@/assets/logos.png'),
                roomName: this.roomName
            }
            // 拉好友创建群
            addRoom(post).then(res => {
                if(res.success){
                    // this.$message.success('拉好友创建群成功');
                    this.$message.success(this.$t('doSucc'))
                    // 改变chatInfo 自动切换至对应房间
                    
                    res.data.logo=''
                    //this.$store.dispatch('AddChatInRooms',res.data)
                            
                            
                            // 将消息推入缓存
                            // Push the message into the cache
                   
                    this.$store.dispatch('AddChatInRooms', {...res.data, roomType:2})
                    this.$store.dispatch('AddRooms', res.data)
                     this.$store.dispatch('SetChatInfo', res.data)
                    this.$store.dispatch('FindRoomRelation').then().catch(err=>{
                            this.$message.error(err)
                    })
                        this.createGroup = false
                        this.selectMemberList = []
                        this.selList.map(element => {
                            element.select = false;
                        });
                        this.$store.dispatch('setCreateGroup',false)
                }else{
                    this.$message.error(res.message)
                }
            })
        },
        
    },
}
</script>

<style lang="scss" scoped>
    .add-chat-box {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        height: 100%;

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
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 480px;
            height: 600px;
            background: #fff;
            border-radius: 5px;

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

                input.seachbox {
                    padding: 0 75px 0 25px;
                    box-sizing: border-box;
                    font-size: 16px;
                    color: #fff;
                    width: 100%;
                    height: 60px;
                    background: transparent;
                    border: 0;
                    outline: none;
                    box-shadow: none;
                    &:focus {
                        border: 0;
                        outline: none;
                        box-shadow: none
                    }
                }

                .clear {
                    display: none;
                    position: absolute;
                    right: 20px;
                    top: 17px;
                    font-size: 24px;
                    cursor: pointer;
                }

                &.inSearchFouc {
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

                }
            }
            
            .member-list,.add-friend {
                height: calc(100% - 59px);
                overflow: auto;
                
                border-top: 1px solid #ddd;
                h6 {
                    margin: 10px;
                    font-size: 12px;
                    color: #999;
                }

                .member-item {
                    padding: 3px 10px;
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
                        padding-right: 10px;
                        flex: 1;
                        height: 50px;
                        line-height: 50px;
                        border-bottom: 1px solid #ddd;
                        display: flex;
                        justify-content: space-between;
                        span {
                            display: inline-block;
                            width: 300px;
                            overflow: hidden;
                            word-break: keep-all;
                            text-overflow: ellipsis;
                            font-size: 18px;
                            font-weight: bold;
                        }
                        .add-btn{
                            background: #2b2c33;
                            color: #fff;
                            outline: none;
                            border: 0;
                        }
                    }
                }

            }
            .add-friend{
                height: auto;
            }

        }

    }

    .update-cent-item {
                margin: 10px 15px;
                padding: 15px 0;
                box-sizing: border-box;
                border-bottom: 1px solid #ddd;
                display: flex;
                align-items: center;
                

                .update-item-title {
                    font-size: 16px;
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
        .manage-series {
            width: 400px;
            background: #fff;
            margin: 30px auto;
            margin-top: 15px;
            margin-bottom: 0;
            border-radius: 10px;
            .name-groups {
                padding: 16px;
                .el-form-item{
                    margin: 0;
                    .el-form-item__content {
                        display: flex;
                        img {
                            margin-right: 10px;
                        }
                        input {
                            height: 43px;
                            width: 100%;
                            border: none;
                            border-bottom: 1px solid #E0E3E5;
                            outline: none !important;
                        }
                        span{
                            position: absolute;
                            right: 0;
                            color: #999DA0;
                            font-size: 14px;
                        }
                    }
                }
            }
            #teams{
                padding: 0 21px;
                .update-cent-item {
                        width: 100%;
                        cursor: move;
                        margin: 0;
                        display: block;
                        
                        .update-item-title {
                        display: block;
                            &.chat-name{
                            p{
                                font-weight: 400;
                                    text-transform: capitalize;
                                    color: #4C4F50;
                                    font-size: 15px;
                                    img{
                                        margin-right: 7px;
                                    }
                                    span{
                                        color: #999DA0;
                                        font-weight: 400;
                                    }
                            }
                            input{
                                    border: none;
                                    outline: none;

                            }
                            img{
                                &.deleteIcon{
                                    float: right;
                                    cursor: pointer;
                                }
                            }
                            }
                            .deleteIcon{
                                right: initial;
                                left: 0;
                                color: red;
                            }
                            input.disabled{
                                color: gray;
                            }
                        }
                        &:last-child{
                            border-bottom: 0;
                        }
                }
            }
            .action-item {
                text-align: center;
                border-top: 1px solid #ddd;
                padding: 16px;
                color: #000000;
                cursor: pointer;
                span{
                    position: relative;
                    top: -5px;
                }
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
                margin:  0;
                width: 100%;
                display: inline-flex;
                cursor: pointer;

                .select-item {
                    display: inline-flex;
                    text-align: center;
                    margin-right: 10px;
                    margin-left: -24px;
                    margin-bottom: 10px;
                    /* &:first-child {
                        margin-left: 10px;
                    } */

                    .avatar {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        margin-bottom: 0;
                        position: relative;
                        right: -26px;
                        z-index: 1;
                        border: 2px solid #fff;
                        .vname{
                            width: 100%;
                            height: 100%;
                            font-size: 14px;
                            color: var(--primary-color);
                            border-radius: 50%;
                            background: #e5e4e8;
                            text-align: center;
                            line-height: 38px;
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
                        max-width: 176px;
                        font-size: 12px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        word-break: keep-all;
                        display: inline-block;
                        background: #F0F3F4;
                        text-align: left;
                        padding: 12px;
                        padding-right: 30px;
                        border-radius: 17px;
                        min-width: 130px;
                        position: relative;
                        padding-left: 31px;
                        img{
                            position: absolute;
                            right: 8px;
                            top: 11px;
                            cursor: pointer;
                        }

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
                    padding: 3px 10px;
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
                            width: 20px;
                            height: 20px;
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
    .add-series{
                            .update-item-title{
                                &.chat-name {
                                    input {
                                        height: 32px;
                                        padding: 0 10px;
                                        width: 250px;
                                        border: 1px solid #E0E3E5;
                                        font-size: 12px;
                                        outline: none;
                                    }
                                    button{
                                        float: right;
                                        height: 34px;
                                        padding-top: 8px;
                                        text-transform: capitalize;
                                    }
                                }
                            }
                        }
        

</style>
