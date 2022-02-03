<template>
    <div>
         <el-container class="profile-info">
            <el-header>
                <div>
                    <p>{{$t('wallet')}}</p>
                </div>
            </el-header>
            <el-main>
                <p class="title">{{$t('my_balance')}}</p>
                <div class="info-box">
                    <div>
                        <div class="info-item">
                            
                            <div class="info-item-title">
                                <h2>{{currencyRed}} {{userInfo.balance}}</h2>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div class="info-history">
                     <p class="title">{{$t('transaction_history')}}</p>
                    <el-date-picker
                        v-model="value"
                        class="history-date"
                        type="date"
                        @change='getDateUp()'
                        >
                        </el-date-picker>
                </div>
               
                <div class="info-box">
                    <div>
                        <div class="info-item" v-for="(item,index) in walletInfo" :key="index">
                            <div class="info-item-icon">
                                <img  :src="item.doType === 1?require('@/assets/svg/coins.svg'):require('@/assets/svg/envelope-normal.svg')" alt="">
                            </div>
                            <div class="info-item-title">
                                <h6><span>{{item.remark}}</span></h6>
                                <p>{{item.createTime*1000 | filterDate('YYYY/MM/DD HH:mm')}}</p>
                            </div>
                            <div class="info-item-cent">
                                <h6 :class="{'orange':item.doType === 2,'green':item.doType === 1,'red':item.doType === 3}">
                                    <span v-if="item.doType != 3">{{item.doType === 1 ? '+' : '-'}}</span>
                                    <span v-else>{{$t('refund')}}</span>
                                    {{item.doMoney}}
                                </h6>
                                <p>{{($t('avl_balance'))}} {{item.balance}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import {  mapGetters } from 'vuex'
import { cashRecord} from '@/services'

export default {
    components: {
        
    },
    computed: {
        ...mapGetters([
            'userInfo',
        ]),
    },
    mounted() {
        this.getWallet()
        this.currencyRed = JSON.parse(sessionStorage.getItem("appConfig")).currencySymbol

    },
    data() {
        return {
            walletInfo: [],
            currencyRed: '',
            value: new Date()
        }
    },
    methods: {
        getDateUp(){
            let endTime = new Date(this.value).getTime()

            let post = {
                        //startTime: startTime,
                        endTime: endTime,
                        page: 1,
                        pageSize: 50,
                    }
                cashRecord(post).then(res => {     
                    console.log(res)               
                    if(res.success){
                        let data = [...res.data.data]
                        this.walletInfo = data
                    }
                })
            console.log(endTime,'value',new Date().getTime())
        },
       async  getWallet(){
             const [errInfo, dataInfo] = await this.awaitWrap(this.$store.dispatch('GetInfo'))
            let post = {
                        endTime: new Date().getTime(),
                        page: 1,
                        pageSize: 50,
                    }
                cashRecord(post).then(res => {                    
                    if(res.success){
                        let data = [...res.data.data]
                        this.walletInfo = data
                    }
                })
        }
    },
    
}
</script>
<style lang="scss" scoped>
.red{
    color: #FF6E6E !important;
    font-weight: 100 !important;
    font-size: 14px !important;
}
.orange{
    color: #FFB100 !important;
}
.green{
    color: #00D94B !important;
}
    .placear{
        width: auto!important;
    }
    .info-box {
        background: #fff;
        position: relative;
        padding: 0px 0px;
        box-sizing: border-box;
        border-radius: 5px;
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
                width: calc(100% - 45px);
                position: absolute;
                bottom: 0;
                left: 45px;
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
            img{
                position: absolute;
                left: 10px;
                top: 23px;
            }
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
    .qr-code {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10000;
        width: 100%;
        height: 100%;
        &:before {
            content: '';
            background: rgba(255,255,255,.8);
            width: 100%;
            height: 100vh;
            position: fixed;
        }
        .qr-code-mark {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: transparent;

        }

        .qr-code-cent {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);

            .qr-code-close {
                position: absolute;
                right: 25px;
                top: 15px;
                font-size: 24px;
                color: #666;
                cursor: pointer;

                &:hover {
                    color: #000;
                }
            }

            #capture {
                width: 300px;
                height: 400px;
                background: #fff;
                box-shadow: 0 0 10px rgba($color: #000000, $alpha: .5);
                border-radius: 10px;
                padding: 20px 30px;
                box-sizing: border-box;

                .qr-code-avatar {
                    position: absolute;
                    left: calc(50% - 20px);
                    top: calc(50% - 20px);
                    background: #fff;
                    border-radius: 50%;
                    height: 50px;
                    width: 50px;
                    display: flex;
                    .el-avatar{
                        margin: auto;
                    }
                    img {
                        vertical-align: middle;
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                    }

                    p {
                        margin: 10px;
                        vertical-align: middle;
                        font-size: 14px;
                        color: #333;
                    }
                    .no-avatar,img {
                        vertical-align: middle;
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;

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

                .qr-code-img {
                    height: 200px;
                    width: 200px;
                    text-align: center;
                    margin: auto;
                    position: relative;
                    margin-top: 40px;
                }

                p {
                    margin-top: 10px;
                    text-align: center;
                    font-size: 14px;
                    color: rgb(37, 27, 27);
                }
            }

        }

        .qr-code-btn {
            position: absolute;
            bottom: 30px;
            width: 100%;
            height: 40px;
            text-align: center;
        }

    }
    p.title {
        width: 500px;
        margin: 10px auto;
        color: #999DA0;
        font-size: 16px;
    }

    .info-box .info-item .info-item-title h2 {
        font-size: 24px;
        color: #000;
    }

    .info-box .info-item .info-item-title h6,.info-box .info-item .info-item-cent h6 {
        margin-bottom: 10px;
        color: #000;
        font-size: 17px;
    }

    .info-box .info-item .info-item-title h6 span {
        font-weight: 100;
    }

    .info-box .info-item .info-item-title p, .info-box .info-item .info-item-cent p {
        font-size: 14px;
        color: #9DA2A5;
    }
    .info-box .info-item .info-item-icon img {
    width: 33px;
    }
    .blue{
        color: var(--primary-color) !important;
    }
</style>