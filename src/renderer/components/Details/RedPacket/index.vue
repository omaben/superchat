<template>
    <div class="chat-box share-contact">
                <div class="chat-item">
                    <div class="chat-title">
                        <div class="add-chat-title">
                            <div class="settting-close" @click="hideRedPacket">
                                <i class="el-icon-arrow-left" ></i> {{$t('back')}}
                            </div>
                            <h2>{{$t('red_packet')}}</h2>
                            <div class="tool-icon">
                                <el-popover class="quick-access-popover" placement="bottom-end" width="120" v-model="visible">
                                    <p class="add-chat-item" @click="receiveRedOpen()">
                                        {{$t('received_envelops')}}
                                    </p>
                                    <p class="add-chat-item" @click="sentRedOpen()">
                                        {{$t('sent_envelops')}}
                                    </p>
                                    <div class="add-chat-btn" slot="reference">
                                        <img class="quick-access" :src="require('@/assets/svg/menu.svg')" alt="">
                                    </div>
                                </el-popover> 
                            </div>
                        </div>
                    </div>
                </div>
                <el-row class="details-info" v-if="sendRed">
                    <el-row :gutter="20">
                        <el-col :span="12" :offset="6">
                            <div class="grid-content general-info">
                                <el-avatar shape="square" size="small" class="avatar-red-packet" :src="require('@/assets/svg/envelope.svg')"></el-avatar>
                                <h6>{{currencyRed}} {{money}}<!--  /balance{{userInfo.balance}} --></h6>
                                <p>{{$t('sending_amount')}}</p>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row class="details-update" style="margin-bottom:0" v-if="chatInfo.roomType==MSG_TYPE.RECEIVE_TYPE_PUBLIC">
                        <el-row class="bg-white grid-content ">
                            <div class="update-info-cent">
                                <div class="update-cent-item">
                                    <div class="update-item-title select-item">
                                        <el-select v-model="groupType" :placeholder="$t('random')">
                                            <el-option
                                                v-for="item in options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                                </el-option>
                                        </el-select>
                                    </div>
                                </div>   
                                <div class="update-cent-item">
                                    <div class="update-item-title select-item">
                                        <el-input type="number" :min="0" :placeholder="$t('quantity')" v-model="quantity" @change="updateAmount" ></el-input>
                                    </div>
                                </div>
                            </div>
                        </el-row>
                    </el-row>
                    <!-- <p class="number-members" v-if="chatInfo.roomType==MSG_TYPE.RECEIVE_TYPE_PUBLIC">{{quantity}} {{$t('members')}}</p> -->
                    <el-row class="details-update">
                        <el-row class="bg-white grid-content ">
                            <div class="update-info-cent">
                                <div class="update-cent-item" v-if="groupType === '2'">
                                    <div class="update-item-title">
                                        <el-input-number :precision="2" :step="0.01" :min='0.01' :placeholder="$t('amount_for_each_Member')" v-model="moneyEachMember" @change="updateAmount" />
                                    </div>
                                    <div class="update-item-cent">
                                        CNY
                                    </div>
                                </div>  
                                <div class="update-cent-item">
                                    <div class="update-item-title">
                                        <el-input-number :precision="2" :step="0.01" :min='0.01' :placeholder="$t('total_amount')" :disabled="groupType === '2'" v-model="money" />
                                    </div>
                                    <div class="update-item-cent">
                                        CNY
                                    </div>
                                </div>   
                                <div class="update-cent-item">
                                    <div class="update-item-title">
                                        <el-input :placeholder="$t('type_wishes')" v-model="desc" />
                                    </div>
                                </div>
                            </div>
                        </el-row>
                    </el-row>
                    <el-button type="success" @click="sentRedMsg()"  class="send-money">{{$t('send_money')}}</el-button>                    
                </el-row>  
                <el-row class="details-info" v-if="receiveRed">
                    <el-row :gutter="20">
                        <el-col :span="12" :offset="6">
                            <div class="grid-content general-info">
                                <el-avatar shape="square" class="avatar-red-packet" size="small" :src="require('@/assets/svg/envelope.svg')"></el-avatar>
                                <h6>{{currencyRed}} {{totalAmountReceived.toFixed(2)}}</h6>
                                <p>{{$t('total_received')}}  :  <span>{{receiveRedItems.length}}</span></p>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row class="details-update">
                        <el-row class="bg-white grid-content ">
                            <div class="update-info-cent reveice-item">
                                <div class="update-cent-item" v-for="(item,index) in receiveRedItems" :key="index">
                                    <div class="update-item-title">
                                        <p>{{item.remark}}</p>
                                        <p class="gray">{{item.createTime*1000 | filterDate('YYYY/MM/DD HH:mm')}}</p>
                                    </div>
                                    <div class="update-item-cent">
                                        <span class="green">+{{item.doMoney}}</span>
                                    </div>
                                </div>
                            </div>
                        </el-row>
                    </el-row>
                </el-row>
                <el-row class="details-info" v-if="sentRed">
                    <el-row :gutter="20">
                        <el-col :span="12" :offset="6">
                            <div class="grid-content general-info">
                                <el-avatar shape="square" class="avatar-red-packet"  size="small" :src="require('@/assets/svg/envelope.svg')"></el-avatar>
                                <h6>{{currencyRed}} {{totalAmountSend.toFixed(2)}}</h6>
                                <p>{{$t('total_sent')}} : <span>{{sendRedItems.length}}</span></p>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row class="details-update">
                        <el-row class="bg-white grid-content ">
                            <div class="update-info-cent reveice-item">
                                <div class="update-cent-item" v-for="(item,index) in sendRedItems" :key="index">
                                    <div class="update-item-title">
                                        <p>{{item.remark}}</p>
                                        <p class="gray">{{item.createTime*1000 | filterDate('YYYY/MM/DD HH:mm')}}</p>
                                    </div>
                                    <div class="update-item-cent">
                                        <span class="red">-{{item.doMoney}}</span>
                                    </div>
                                </div>
                            </div>
                            
                        </el-row>
                    </el-row>
                </el-row>
            <p class="info-red-packet">{{$t('red_packets_sent_info')}}</p>             
    </div>
</template>
<script>
    import {  mapGetters } from 'vuex'
import { redMsg, cashRecord} from '@/services'

import MSG_TYPE,{translateHTML} from "../../../services/im/constant" //调试用

    export default {
        props: {
            
            
        },
        computed: {
            ...mapGetters([
                'chatInfo',
                'userInfo'
            ]),
            
        },
    
        components: {
            
        },
        data() {
            return {
                MSG_TYPE,
                money : '',
                desc : '',
                quantity : 1,
                groupType: '1',
                options: [{
                    value: '1',
                    label: this.$t('random_amount')
                    }, {
                    value: '2',
                    label: this.$t('identical_amount')
                    }
                ],
                moneyEachMember: '',
                visible: false,
                sendRed : true,
                receiveRed : false,
                receiveRedItems: [],
                totalAmountReceived : 0,
                sendRedItems: [],
                totalAmountSend : 0,
                sentRed : false,
                currencyRed: ''

            }
        },
        mounted() {
            this.currencyRed = JSON.parse(sessionStorage.getItem("appConfig")).currencySymbol
        },
        updated() {
            
        },
        methods: {
            sentRedMsg(){
                if(this.money>0){
                    let randomType = 2
                    if(this.chatInfo.roomType === MSG_TYPE.RECEIVE_TYPE_PUBLIC){
                        randomType = this.groupType === '1'? 1 : 2
                    }
                     let post = {
                        money: this.money,
                        amount: parseInt(this.quantity),
                        remark: this.desc,
                        redType: this.chatInfo.roomType,
                        randomType: randomType,
                        roomId : this.chatInfo.roomType === MSG_TYPE.RECEIVE_TYPE_PUBLIC ? this.chatInfo.roomId : 0,
                        mid:   this.chatInfo.roomId || this.chatInfo.id

                    }
                    
                    redMsg(post).then(res => {
                        if(res.success){
                            this.$bus.$emit('sendRedPacket',res.data)
                            this.hideRedPacket()
                            this.$message.success(res.message)
                        }
                    })
                }
            },
            updateAmount(){
                if(this.quantity>0 && this.moneyEachMember>0){
                    this.money = this.quantity * this.moneyEachMember
                }else{
                    this.money = 0
                }
            },
            receiveRedOpen(){
                this.totalAmountReceived = 0
                let post = {
                        endTime: new Date().getTime(),
                        page: 1,
                        pageSize: 50,
                    }
                cashRecord(post).then(res => {                    
                    if(res.success){
                        let data = [...res.data.data]
                        console.log(data)
                        this.receiveRedItems = data.filter(qry=> qry.doType === 1)
                        this.receiveRedItems.forEach(item=>{
                            this.totalAmountReceived += item.doMoney
                        })
                        this.receiveRed = true
                        this.sendRed = false
                        this.sentRed = false
                    }
                })
            },
            sentRedOpen() {
                this.totalAmountSend = 0
                let post = {
                        endTime: new Date().getTime(),
                        page: 1,
                        pageSize: 50,
                    }
                cashRecord(post).then(res => {                    
                    if(res.success){
                        let data = [...res.data.data]
                        console.log(data)
                        this.sendRedItems = data.filter(qry=> qry.doType === 2)
                        this.sendRedItems.forEach(item=>{
                            this.totalAmountSend += item.doMoney
                        })
                        this.receiveRed = false
                        this.sendRed = false
                        this.sentRed = true
                    }
                })
            },
            hideRedPacket(){
                if(this.sendRed){
                    this.$emit('hideRedPacket', false)
                }else{
                    this.sentRed = false
                    this.receiveRed = false
                    this.sendRed = true
                }
            },
        }
    }
</script>
<style lang="scss" scoped>
.tool-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 45px;
                    cursor: pointer;
                    margin-left: 5px;
                    position: relative;
                    top: 0;
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
    .share-contact{
        position: fixed;
        z-index: 100;
        top: 0;
        background: #F0F3F4;
        left: 9.5cm;
        width: calc(100% - 9.5cm);
        height: 100vh;
        p.info-red-packet {
            position: absolute;
            bottom: 15px;
            width: 100%;
            text-align: center;
            font-size: 12px;
            color: #9DA2A5;
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
            text-align: center;
            button.el-button.send-money {
                margin: 0 auto;
                background: #00D94B;
                border-color: #00D94B;
            }
            .general-info {
                text-align: center;
                .el-avatar {
                    width: 55px;
                    height: 66px;
                    line-height: 70px;
                    font-size: 26px;
                    text-transform: uppercase;
                    img{
                        border-radius: 0 !important;
                    }
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
                    span{
                        color: var(--primary-color);
                    }
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
    .chat-box {
        
        .chat-title {
                width: 100%;
                padding: 5px 0;
                box-sizing: border-box;
                border-bottom: 1px solid #ddd;
                display: block;
                align-items: center;
                background: #fff;
            .add-chat-title {
                 width: 100%;
                display: flex;
                position: relative;
                padding: 15px;
                box-sizing: border-box;
                background: #fff;
                border-top-right-radius: 5px;
                border-top-left-radius: 5px;

                h2 {
                    flex: 1;
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

        }
    }
    .details-update{
        
        .update-info-cent{

        padding: 1px;
        .update-cent-item {
            margin: 0;
            padding: 0 5px;
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
    .is-disabled{
        .el-input-number{
           .el-input__inner{
                background-color: transparent;
            }   
        }
    }
    .el-input.is-disabled .el-input__inner{
            background-color: transparent !important;
    }
        .el-input-number{
            width: 100%;
            
            .el-input-number__decrease{
                display: none;
            }
            .el-input-number__increase{
                display: none;
            }
        }
    }
    .update-item-title.select-item{
        width: 100%;
        .el-select{
            width: 100%;
        }
    }
    .number-members{
        text-align: left;
        font-size: 12px;
        color: #9DA2A5;
        margin: 10px;
    }
    .el-popover {
    z-index: 10000 !important;
}
.details-update .update-info-cent.reveice-item {
    padding: 0 15px;
}

.details-update .update-info-cent.reveice-item .update-cent-item {
    padding: 10px 0;
}
p.gray {
    font-size: 13px;
    color: #9DA2A5;
    text-align: left;
    font-weight: 100;
    margin-top: 3px;
}
.green{
    color: #00D94B !important;
}
.details-update.el-row>div {overflow: auto;max-height: calc(100vh - 280px);}

.details-update.el-row {
    padding-bottom: 10px;
}
</style>