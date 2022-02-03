<template>
    <el-container class="profile-info">
        <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" v-if="!showChange">
                <el-header>
                    <div style="position:relative">
                        <div class="backInfo" @click="back">
                            <img  :src="require('@/assets/svg/back-user.svg')" alt="">
                            <span>{{$t('back')}}</span>
                            
                        </div>
                        <p>{{$t('enterNewPhone')}}</p>
                        <div class="add-member-btn">
                            <el-button type="primary" @click="submitForm('ruleForm')">{{$t('submit')}}</el-button>
                        </div>
                        
                    </div>
                </el-header>
                <el-main>
                    <div class="update-box">
                            <p>
                                {{$t('enterPassword')}}
                            </p>
                            <div class="update-input">
                                <el-form-item prop="phone" class="login-container">
                                    <el-input name="phone" type="text" 
                                        v-model="ruleForm.phone"
                                        autoComplete="on" :placeholder="$t('account')">
                                        <template slot="prepend">
                                            <IntlTelInput @excountry="getMobileNumbCode" :countryCode="'vn'" class="mobileSelect"></IntlTelInput>
                                        </template>
                                    </el-input>
                                    <img class="show-pwd" v-show="ruleForm.phone" @click="ruleForm.phone = ''" src="@/assets/icon_del.png" alt="">
                                </el-form-item>
                                
                            </div>
                            <div class="update-input">
                                <el-form-item prop="oldAns" class="codeSms">
                                    <el-input v-model="ruleForm.sms" placeholder="Enter SMS Code"></el-input>
                                    <el-button type="primary" @click="resendSms()" :disabled="crono>0">{{$t('sendSms')}}</el-button>
                                </el-form-item>
                            </div>
                            <div class="chrono" v-show="crono>0">Receiving another code in 00.{{cronoText}}</div> 

                        </div>
                </el-main>
        </el-form>
    </el-container>
</template>
<script>
import {mapGetters} from 'vuex';

import {
    phoneCode,phoneCodeVer,modifyUser
} from '@/services'
import IntlTelInput from "@/components/IntlTelInput/IntlTelInput1";

export default {
    components: {
        IntlTelInput
    },
    data() {
        return {
            showChange: false,
            sex: 1,
            content:'',
            mobileNumbCode:'',
            feedbackContent:false,
            qusData: {},
            qusList: [],
            infoPro: {},
            oldQusPro: '',
            cronoText:'',
            ruleForm: {
                sms: '',
                phone:''
            },
            crono:0   

        }
    },
    
    mounted() {
        let that = this
         setInterval(function (){
             if(that.crono>0){
                that.chrono()
             }
         }, 1000);
         this.infoPro = {
                ...this.userInfo
            }
    },
    computed: {
            ...mapGetters([
                'userInfo'
            ])
    },
    methods: {
        
        resendSms(){
                let post = {
                    phone:  "+" + this.mobileNumbCode.dialCode + this.ruleForm.phone,
                    isLogin: 2,
                }
                phoneCode(post).then(res=>{
                    if(res.success){
                        this.crono=59
                        this.cronoText='59'
                    }
                    else{
                        this.$message.error(res.message)
                    }
                })
        },
        submitForm(){
                let post = {
                    phone:  "+" + this.mobileNumbCode.dialCode + this.ruleForm.phone,
                    code: this.ruleForm.sms
                }
                let areaCode= "+" + this.mobileNumbCode.dialCode
                let valAccount=areaCode+this.ruleForm.phone
                phoneCodeVer(post).then(res=>{
                    
                    if(res.success){
                        this.$set(this.infoPro,"account",valAccount)
                        modifyUser(this.infoPro).then(res => {
                            if (res.success) {
                                this.$store.commit('SET_USERINFO', this.infoPro)
                                this.$message.success(this.$t('doSucc'))
                            } else {
                                this.infoPro = {...this.userInfo}
                                this.$message.error(res.message)
                            }
                        })
                    }else{
                        this.$message.error(res.message)
                    }
                })
        },
        getMobileNumbCode(code){
            this.mobileNumbCode = code
        },
        chrono(){
           
                this.crono=this.crono-1
                if(this.crono>9){
                    this.cronoText=this.crono
                }else{
                    this.cronoText='0'+this.crono
                }
        },
        ressendSms(){

        },
        
        back() {
                this.$emit('childBack', false)
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
.el-form-item.codeSms button.el-button.el-button--primary {
    z-index: 1;
    position: absolute;
    right: 0;
    color: var(--primary-color);
    height: 39px;
    color: #fff;
    border: none!important;
    &.is-disabled {
        background: E0E3E5;
    }
}

.chrono {
    position: absolute;
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: #999DA0;
}
.login-container .el-input-group--prepend {
    display: flex;
}
img.show-pwd {
    position: absolute;
    top: 10px !important;
    width: 17px;
    right: 5px;
}
/deep/.el-input {
    .el-input-group__prepend{
        padding: 0;
        border: none;
        width: 65px;
        .flag-container{
            border: none !important;
        }
    }
    .el-input__inner{
        height: 38px;
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
        margin-bottom: 20px;
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