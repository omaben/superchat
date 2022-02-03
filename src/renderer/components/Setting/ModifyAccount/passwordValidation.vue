<template>
    <el-container class="profile-info">
        <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" v-if="!showChange">
                <el-header>
                    <div style="position:relative">
                        <div class="backInfo" @click="back">
                            <img  :src="require('@/assets/svg/back-user.svg')" alt="">
                            <span>{{$t('back')}}</span>
                            
                        </div>
                        <p>{{$t('passwordValidation')}}</p>
                        <div class="add-member-btn">
                            <el-button type="primary" @click="submitForm('ruleForm')">{{$t('Update')}}</el-button>
                        </div>
                        
                    </div>
                </el-header>
                <el-main>
                    <div class="update-box">
                            <p>
                                {{$t('enterPassword')}}
                            </p>
                            <div class="update-input">
                                <el-form-item prop="password">
                                    <el-input name="password" :type="pwdType"  v-model="ruleForm.password" autoComplete="on" :placeholder="$t('password')"></el-input>
                                    <img class="show-pwd" v-show="!pwdType" @click="showPwd" src="@/assets/icon_eye_xs.png" alt="">
                                    <img class="show-pwd" v-show="pwdType" @click="showPwd" src="@/assets/icon_eye_yc.png" alt="">

                                </el-form-item>
                            </div>
                        </div>
                </el-main>
        </el-form>
        <new-account v-if="showChange == 1" @childBack="nameBack"></new-account>
    </el-container>
</template>
<script>
import {mapGetters} from 'vuex';
import newAccount from "./newAccount";

import {machineId, machineIdSync} from 'node-machine-id';
import CryptoJS from 'crypto-js'
import DeviceDetector from "device-detector-js";

import {
    login
} from '@/services'

export default {
    data() {
        return {
            pwdType: 'password',
            sex: 1,
            showChange: false,
            content:'',
            feedbackContent:false,
            qusData: {},
            qusList: [],
            oldQusPro: '',
            ruleForm: {
                password: ''
            },
                

        }
    },
    components: {
        newAccount
    },
    mounted() {

    },
    computed: {
            ...mapGetters([
                'userInfo'
            ])
    },
    methods: {
        showPwd() {
            if (this.pwdType === 'password') {
                this.pwdType = ''
            } else {
                this.pwdType = 'password'
            }
        },
        nameBack(boolean,val) {
                this.showChange = false;
            },
        back() {
                this.$emit('childBack', false)
            },
        submitForm(){
            /* let phone =this.userInfo.account.replace("+971",""); */
            const deviceDetector = new DeviceDetector();
            const userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36";
            const device = deviceDetector.parse(userAgent);                 
            let computerName = require('computer-name')
            let NameDevice=computerName()
            let deviceVersion = device.os.version
            let machineId = machineIdSync({original: true})
            var md5Hash = CryptoJS.MD5(machineId,true);
            let md5MachineId = md5Hash.toString().substring(8).slice(0, -8);
                let post = {
                    /* areaCode: "+971", */
                    account: this.userInfo.phone,
                    password: this.ruleForm.password,
                    deviceVersion : deviceVersion,
                    deviceNo : md5MachineId,
                    deviceName : NameDevice
                }
                login(post).then(res=>{
                    if(res.success){
                        this.showChange=1
                    }
                })
        },
       
        
    },
}
</script>

<style lang='scss' scoped>
.safe-pass{
    display: block;
    align-items: center;
    font-size: 16px;
    background: #fff;
    position: relative;
    height: 100%;
    box-sizing: border-box;
    border-radius: 5px;
    h5 {
            font-size: 16px;
            color: #333;
            cursor: pointer;
            margin-bottom: 30px;
            width: 100%;
            i {
                vertical-align: middle;
                margin-right: 10px;
                font-size: 20px;
            }
        }
    .el-form{
        width: 100%;
    }
    .input-style {
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .sub-btn {
        margin-top: 50px;

        button {
            width: 120px;
            float: right;
        }
    }

}
.forget-securite {
            flex: 1;
            text-align: right;
            font-size: 14px;
            color: #1ab2ff;
            margin-bottom: 19px;

            span {
                position: relative;
                cursor: pointer;

                &::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 90%;
                    height: 1px;
                    background: #1ab2ff;
                }

            }

        }
.v-modal{
    display: none!important;
}
.show-pwd {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translate(0, -50%);
        cursor: pointer;
        user-select: none;
        width: 14px;
    }

    .pwd-style {
        display: flex;
        margin-bottom: 30px;
        justify-content: center;

        .remember-pwd {

            cursor: pointer;

            img {
                width: 12px;
                vertical-align: middle;
            }

            span {
                margin-left: 5px;
                font-size: 14px;
                color: #333333;
                vertical-align: middle;
            }
        }

        .forget-pwd {
            flex: 1;
            margin-top: 3px;
            text-align: right;
            font-size: 14px;
            color: #1ab2ff;

            span {
                position: relative;
                cursor: pointer;

                &::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 90%;
                    height: 1px;
                    background: #1ab2ff;
                }

            }

        }
    }
    .update-box {
    position: relative;
    width: 500px;
    margin: 0 auto;

    h5 {
        font-size: 16px;
        color: #333;
        cursor: pointer;

        i {
            vertical-align: middle;
            margin-right: 10px;
            font-size: 20px;
        }
    }

    p {
        font-size: 14px;
        color: #999DA0;
        margin-bottom: 15px;
    }

    .update-input {
        border: 1px solid #ddd;
        border-radius: 5px;
        .el-form-item{
            margin: 0 !important;
        }
       
    }

    .sub-btn {
        margin-top: 20px;

        button {
            width: 120px;
        }
    }
}
    .el-main{
        background: #F0F3F4 !important;
        height: calc(100vh - 60px);
        padding-top: 25px;
        .el-input__inner{
            border: none;
        }
    }
    form.el-form.demo-ruleForm{
        width: 100%;
    }
</style>