<template>
    <div>
         <el-container class="profile-info" v-show="!showChange">
            <el-header>
                <div>
                    <p>{{$t('setUp')}}</p>
                </div>
            </el-header>
            <el-main>
                <div class="info-box">
                    <div>
                        <div class="info-item" @click="showChange = 1">
                            <div class="info-item-icon">
                                <img  :src="require('@/assets/svg/passowrd-user.svg')" alt="">
                            </div>
                            <div class="info-item-title">
                                {{$t('loginPwd')}}
                            </div>
                            <div class="info-item-cent">
                                 <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                        <div class="info-item" @click="showChange = 2">
                            <div class="info-item-icon">
                                <img  :src="require('@/assets/svg/security-question.svg')" alt="">
                            </div>
                            <div class="info-item-title">
                                {{$t('secQues')}}
                            </div>
                            <div class="info-item-cent">
                                 <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                        <div class="info-item" @click="showChange = 3">
                            <div class="info-item-icon">
                                <img  :src="require('@/assets/svg/security-user.svg')" alt="">
                            </div>
                            <div class="info-item-title">
                                {{$t('accountSecurity')}}
                            </div>
                            <div class="info-item-cent">
                                 <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                        <div class="info-item" @click="showChange = 4">
                            <div class="info-item-icon">
                                <img  :src="require('@/assets/svg/devices-user.svg')" alt="">
                            </div>
                            <div class="info-item-title">
                                {{$t('login_devices')}}
                            </div>
                            <div class="info-item-cent">
                                 <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                        <div class="info-item" @click="showChange = 5">
                            <div class="info-item-icon">
                                <img  :src="require('@/assets/svg/blackList-user.svg')" alt="">
                            </div>
                            <div class="info-item-title">
                                {{$t('blackList')}}
                            </div>
                            <div class="info-item-cent">
                                 <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                        <div class="info-item" @click="showChange = 6">
                            <div class="info-item-icon">
                                <img  :src="require('@/assets/svg/feedback-user.svg')" alt="">
                            </div>
                            <div class="info-item-title">
                                {{$t('feedback')}}
                            </div>
                            <div class="info-item-cent">
                                 <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                        <div class="info-item" @click="showChange = 7">
                            <div class="info-item-icon">
                                <img  :src="require('@/assets/svg/language-user.svg')" alt="">
                            </div>
                            <div class="info-item-title">
                                {{$t('language')}}
                            </div>
                            <div class="info-item-cent">
                                 <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </el-main>
        </el-container>
        <div v-if="showChange">
            <update-pass v-if="showChange === 1" @childBack='closeUpdate'></update-pass>
            <safe-pass v-if="showChange === 2" @childBack='closeUpdate'></safe-pass>
            <account-security v-if="showChange === 3" @childBack='closeUpdate'></account-security>
            <device-list v-show="showChange === 4" @childBack='closeUpdate'></device-list>
            <black-list v-if="showChange === 5" @childBack='closeUpdate'></black-list>
            <feed-back v-if="showChange === 6" @childBack='closeUpdate'></feed-back>
            <language v-if="showChange === 7" @childBack='closeUpdate'></language>
        </div>
    </div>
</template>
<script>
import FeedBack from "@/components/Setting/feedback";
import UpdatePass from "@/components/Setting/updatePass";
import safePass from "@/components/Setting/safePass";
import language from "@/components/Setting/language";
import blackList from "@/components/Setting/blackList";
import deviceList from "@/components/Setting/deviceList";
import accountSecurity from "@/components/Setting/accountSecurity";
export default {
    components: {
        FeedBack,
        UpdatePass,
        safePass,
        language,
        blackList,
        accountSecurity,
        deviceList
    },
    data() {
        return {
            showChange: false,
        }
    },
    methods: {
        closeUpdate(){
            this.showChange = false
        }
    },
    
}
</script>
<style lang="scss" scoped>
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
</style>