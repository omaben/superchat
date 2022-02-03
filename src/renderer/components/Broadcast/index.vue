<template>
    <div class="chat-box" >
        <div class="chat-item">
            <div class="chat-title">
                <div class="chat-top-title">
                    <div class="settting-close" v-if="newBatch" @click="hideCreateGroup">
                        <i class="el-icon-arrow-left"></i> {{$t('back')}}
                    </div>
                    <h2 v-if="!newBatch">
                        <img  :src="require('@/assets/svg/broadcast.svg')" alt="">
                        <span>{{$t('broadcast')}}</span>
                    </h2>
                    <h2 v-if="newBatch" class="add-batch">
                        {{$t('new_broadcast')}}
                    </h2>
                    <div class="add-member-btn" :class="{'add-batch':newBatch}">
                        <el-button v-if="!newBatch && !sendMessage && !deleteAndSelect" type="primary" size="small" @click="newBatchFunc()" round >{{$t('new_broadcast')}}</el-button>
                        <el-button v-if="!newBatch && !sendMessage && !deleteAndSelect" type="primary" size="small" @click="deleteAndSelectFunc()" round >{{$t('Edit')}}</el-button>
                        <el-button v-if="deleteAndSelect" type="primary" size="small" @click="deleteBatchMessage()" round >{{$t('delete')}}</el-button>
                        <el-button v-if="deleteAndSelect" type="primary" size="small" @click="deleteAllBatchMessage()" round >{{$t('clear')}}</el-button>
                        <el-button v-if="deleteAndSelect" type="primary" size="small" @click="deleteAndSelectFunc()" round >{{$t('cancel')}}</el-button>
                        <el-button v-if="newBatch && !sendMessage"  @click="sendNewBatch()" :disabled="selectMemberList.length <= 1" type="primary" size="small"  round >{{$t('next')}}</el-button>
                        <el-button v-if="sendMessage"  @click="sendMsgComplete()" :disabled="!msgObj" type="primary" size="small"  round >{{$t('send')}}</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="chat-section" :class="{'white-back':newBatch && !sendMessage}">
             <div class="all-batchs" v-if="!newBatch && !sendMessage">
                <div style="position:relative" v-for="(item,index) in batchMessages" :key="index">
                    <div class="batch-checkbox" v-if="deleteAndSelect">
                        
                        <img  :src="require('@/assets/svg/uncheck.svg')" @click="checkBatch(item)" v-if="!item.select" alt="">
                        <img  :src="require('@/assets/svg/check.svg')" @click="unCheckBatch(item)" v-if="item.select" alt="">
                    </div>
                    <list :item="item" :receivers="receiverIds[index].receiver" @resendToMembersFun="resendToMembersFun" @resendBatchFun='resendBatchFun' ></list>
                </div>
            </div>
            <div class="select-members" v-if="newBatch && !sendMessage">
                <select-friends :oldSelectMemberList='selectMemberList' @selectItem='selectItem' :groupObj='groupObj' ></select-friends>
            </div>
            <div class="send-batch" v-if="sendMessage">
                <div class="member-selected">
                    <div class="select-member">
                        <div class="select-item"  v-for="(item,index) in selectMemberList" :key="index">
                                <div class="avatar">
                                    <el-avatar :class="{'with-status':item.onlineStatus=== 1}" v-if="item.photo" :src="item.photo"></el-avatar>
                                    <el-avatar :class="{'with-status':item.onlineStatus=== 1}" v-else >{{item.nikeName&&item.nikeName.slice(0,2)}}</el-avatar>
                                </div>
                                <div class="member-name">
                                    <span>{{item.nikeName}}</span>
                                </div>
                            </div>
                    </div>
                    <div class="edit-recipient" @click="hideCreateGroup">
                        <img  :src="require('@/assets/svg/edit-member.svg')" alt="">
                        {{$t('edit_recipient')}} <span>({{selectMemberList.length}}/100)</span>
                    </div>
                </div>
                
                <send @msgObjUpdate='msgObjUpdate'></send>
            </div>
        </div>
       
    </div>
</template>
<script>
    import {  mapGetters } from 'vuex'
    import List from './List';
    import Send from './Send';
    import SelectFriends from '@/components/AddChat/SelectFriends';

    import {  userListDAO } from "@/services/db";
    import { batchSendMessage, delBatchMessage , goimfilesUpload, clearBatchMessage} from "@/services";
    export default {
        components: {
            List,
            SelectFriends,
            Send
        },
        data() {
            return {
                deleteAndSelect: false,
                newBatch: false,
                selectBatchs: [],
                selectMemberList: [],
                batchMessages : [],
                receiverIds : [],
                msgObj:null,
                groupObj:{
                    title: '',
                    okText: '',
                    placeholder: '',
                    holdtxt: '',
                },
                sendMessage:false
            }
        },
        mounted() {
            this.$bus.$off('updateBatch')
            this.$bus.$on('updateBatch', (data) => {
                this.getbatchMessage()
                
            })
            this.getbatchMessage()
        },
         computed: {
            ...mapGetters([
                'batchs',
            ]),
            
        },
        methods: {
            deleteAndSelectFunc(){
                this.deleteAndSelect = !this.deleteAndSelect
            },
            async deleteBatchMessage(){
                let id = null
                
                this.$confirm(this.$t('isConfirmAction'), 'Delete Batch Message', {
                    confirmButtonText: this.$t('confirm'),
                    cancelButtonText: this.$t('cancel'),
                    type: 'warning'
                }).then(async() => {
                    this.selectBatchs.forEach(async(qry)=>{
                        let post = {
                            ids : [qry.id]
                        }
                        await delBatchMessage(post).then((res) => {
                                if(res.success){
                                    this.$store.dispatch('GetBatchs').then(()=>{
                                        this.getbatchMessage()
                                        this.selectBatchs = []
                                    })
                                }else{
                                    this.$message.error(res.message)
                                }
                        })
                    })
                    
                }).catch(()=>{})
            },
            async deleteAllBatchMessage(){
            
                this.$confirm(this.$t('Are you sure to delete all broadcast?'), 'Delete All Broadcasts', {
                    confirmButtonText: this.$t('delete'),
                    cancelButtonText: this.$t('cancel'),
                    type: 'warning'
                }).then(async() => {
                    await clearBatchMessage().then((res) => {
                        if(res.success){
                            this.batchMessages = []
                            this.$message.success(res.message)
                            this.$store.dispatch('GetBatchs').then(()=>{
                                this.getbatchMessage()
                                this.selectBatchs = []
                            })
                        }else{
                            this.$message.error(res.message)
                        }
                })
                }).catch(()=>{})
            },
            unCheckBatch(item){
                this.batchMessages.map((qry) => {
                    if(qry.id === item.id){
                        qry.select = false
                        let index = this.selectBatchs.findIndex(t => t.id === item.id)
                        this.selectBatchs.splice(index,1)
                    }
                })
                this.$forceUpdate()
                console.log(this.selectBatchs)
            },

            checkBatch(item){
                this.batchMessages.map(qry => {
                    if(qry.id === item.id){
                        qry.select = true
                        this.selectBatchs.push(qry)
                    }
                })
                this.$forceUpdate()
                console.log(this.selectBatchs)
            },
            msgObjUpdate(msgObj){
                this.msgObj = msgObj
            },
            resendBatchFun(item){
                let post = {
                        ids : item.receiverIds,
                        msgType : item.msgType,
                        msg : item.message
                }
                this.$store.dispatch('AddBatch',post).then(()=>{
                    this.$store.dispatch('GetBatchs').then(()=>{
                        this.$message.success(this.$t('doSucc'))
                        this.getbatchMessage()
                    })
                })

            },
            async sendMsgComplete(){
                let ids
                    this.selectMemberList.forEach((element,index) => {
                    if(index>0){
                        ids = ids + ',' + element.id
                    }else{
                        ids = element.id
                    }
                    });
                    let post = {
                        ids : ids,
                        msgType : this.msgObj.msgType,
                        msg : this.msgObj.message
                    }
                    this.$store.dispatch('AddBatch',post).then(()=>{
                        this.$store.dispatch('GetBatchs').then(()=>{
                            this.$message.success(this.$t('doSucc'))
                            
                            this.sendMessage = false
                            this.getbatchMessage()
                            this.$bus.$emit('updateBatchTest')
                            this.hideAddBatch()
                        })
                    })
                                   
            },
            hideAddBatch() {
                this.newBatch = false
                this.hideCreateGroup()
                this.msgObj = null
            },
            sendNewBatch(){
                this.sendMessage = true
            },
            hideCreateGroup() {
                if(!this.sendMessage){
                    this.newBatch = false
                }
                this.selectMemberList = []
                this.$bus.$emit("hideCreateGroup")
                this.sendMessage = false
            },
            resendToMembersFun(item){
                this.newBatchFunc()
                this.getReceiverById(item.receiverIds)
                
            },
            newBatchFunc(){
    
                this.newBatch = true
            },
            selectItem(item) {
                this.selectMemberList = item
            },
            async getbatchMessage() {
                this.batchMessages = this.batchs
                this.getReceiver()
            },
            getReceiver(){
                this.receiverIds = []
                this.batchMessages.forEach((item,index) => {
                    let result = {
                        id : index,
                        receiver:this.getPictureMember(item.receiverIds)
                    }
                    this.receiverIds.push(result)
                    
                })
            },
            getReceiverById(ids){
                let receiverIds = ids.split(",").map(Number)
                if(receiverIds){
                    receiverIds.forEach((element) => {
                            let getInstance = userListDAO.getInstance();
                            getInstance.find(element).then((uInfo)=>{
                                this.selectMemberList.push(uInfo)
                            })
                    });
                    this.$bus.$emit("CreateWithMembers",this.selectMemberList)

                }
                
            },
            getPictureMember(ids){
                let receiverIds = ids.split(",").map(Number)
                let users = []
                receiverIds.forEach((element) => {
                        let getInstance = userListDAO.getInstance();
                        getInstance.find(element).then((uInfo)=>{
                            let user = {
                                photo : uInfo.photo,
                                nikeName : uInfo.nikeName
                            }
                            users.push(user)
                        })
                });
                return users
            }
        }
    }
</script>
<style lang="scss" scoped>
    .member-selected {
        background: #fff;
        border-radius: 10px;
        width: 550px;
        margin: 0 auto;
        .edit-recipient{
            padding: 20px;
            border-top: 1px solid #E5E8EA;
            text-align: center;
            font-size: 15px;
            cursor: pointer;
            span{
                color: #9DA2A5;
            }
            img{
                position: relative;
                top: 3px;
            }
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
                
                .settting-close {
                    position: absolute;
                    cursor: pointer;
                    font-size: 15px;
                    color: var(--primary-color);

                    /* &:hover {
                        color: #999;
                    } */
                }
                
                h2 {
                    flex: 1;
                    display: inline-flex;
                    line-height: 57px;
                    &.add-batch {
                        
                        font-size: 18px;
                        display: initial;
                        line-height: initial;
                        text-align: center;
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
                .add-member-btn {
                    position: absolute;
                    right: 15px;
                    top: 28px;
                    &.add-batch{
                        top: 12px;
                    }
                    button{
                        background: transparent;
                        border: transparent;
                        font-size: 16px;
                        color: var(--primary-color);
                        font-weight: 100;
                        font-family: "rubik" !important;
                        text-transform: capitalize;
                        &.is-disabled{
                            color: #D3D5D6;
                        }
                    }
                }
            
            }
        }
    }
    .chat-section {
        background: #F0F3F4;
        height: calc(100vh - 54px);
        padding: 15px;
        overflow: auto;
        padding-bottom: 44px;
        &.white-back {
            background: #fff;
        }
        .all-batchs{
            max-width: 500px;
            margin: 0px auto;
        }
        .box-card {
            width: 94%;
            margin-left: 3%;
            margin-top: 15px;
            video{
                margin: 0;
            }
            .el-card__header{
            i{
                margin-left: 10px;
            }
                .member-name{
                    overflow: hidden;
                    word-break: keep-all;
                    text-overflow: ellipsis;
                    max-width: 340px;
                    white-space: nowrap;
                    display: inline-block;
                }
            }
            .member-name{
                    overflow: hidden;
                    word-break: keep-all;
                    text-overflow: ellipsis;
                    max-width: 340px;
                    white-space: nowrap;
                    display: inline-block;
                }
        } 
    }
    .select-member {
            margin:  0;
            width: 100%;
            cursor: pointer;
            padding: 15px;

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
                    .el-avatar{
                        width: 35px;
                        height: 35px;
                        line-height: 35px;
                    }
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
        .batch-checkbox {
            position: absolute;
            top: 14px;
            margin-left: -20px;
            cursor: pointer;
        }
</style>
